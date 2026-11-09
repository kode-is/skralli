# Vefverslun Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the whole skralli.is web store (catalog, cart, checkout, Straumur payment, DK order write-back) behind a feature flag, ready to switch on once Skralli's real DK token and Straumur gateway exist.

**Architecture:** Server components read the web-flagged catalog from dk Plus through one typed client and Next's tagged data cache; DK webhooks revalidate tags. The cart lives in the browser; every price the customer pays is re-quoted live from DK. Checkout state lives in Upstash Redis; Straumur hosted checkout takes the card; a signed webhook triggers `fulfil()`, which writes the customer and sales order to DK and sends Resend emails. Until Straumur keys exist a mock provider implements the same contract.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Tailwind 4, vitest, Resend (existing), `@upstash/redis@1.39.0` (new), Vercel crons.

**Spec:** `docs/plans/2026-10-17-vefverslun-dk-design.md` (read it first; section numbers below refer to it). Clickable reference: `docs/plans/2026-10-17-vefverslun-prototype.html`.

## Global Constraints

- All visitor-facing copy is Icelandic. Copy quoted in this plan is exact.
- Exactly one new dependency: `@upstash/redis` pinned to `1.39.0` (`npm install --save-exact @upstash/redis@1.39.0`). Low risk under the user's install rule: official package, long established, published 2026-09-21. No other packages; DK and Straumur are called with `fetch`. No `--force` or `--legacy-peer-deps`.
- Next 16 APIs: dynamic route `params` and `searchParams` are `Promise`s; `revalidateTag(tag, "max")` always takes the second argument; cached reads use `fetch(url, { next: { revalidate: 3600, tags } })`; live reads use `cache: "no-store"`. Check `node_modules/next/dist/docs/` before using any other caching API.
- Secrets are read only on the server, never logged and never sent to the browser: `DK_API_KEY`, `STRAUMUR_*`, `DK_WEBHOOK_SECRET`, `CRON_SECRET`, `KV_REST_API_*`.
- Never render DK HTML with `dangerouslySetInnerHTML`. Descriptions render as plain-text paragraphs (§6).
- Prices are whole krónur incl. VAT, formatted `12.900 kr.`; Straumur `amount` = krónur × 100.
- Every store route, the nav/footer links, the cart icon, the service-page strips, the store sitemap entries and the store search rows exist only when `STORE_ENABLED === "true"`. Production keeps it unset until launch.
- The mock payment provider can never run when `VERCEL_ENV === "production"`.
- Tests live in `tests/**/*.test.ts` (vitest, node environment, `@/` alias). External calls are injected (`fetchFn`, `send`, `kv`) the way `tests/send-contact.test.ts` injects `send`. No test hits the network.
- Commit after every task with a message ending in the session's attribution line.

## Review Focus

1. **Odd DK item codes** (`öv-080`, codes with spaces, `/` or `--`): slug, product URL, image proxy URL and cart round-trip must all resolve to the same product. Test in Task 2 and Task 5.
2. **Webhook replays and races**: the same Authorization event twice, a decline followed by a success, the status poll and the webhook firing together, a retry after DK timed out mid-create. Exactly one DK sales order per checkout. Tests in Task 10 and Task 11.
3. **Messy DK records**: missing `Description2`/`Group`, `UnitPrice1WithTax` of 0, negative stock, no attachments, a sale price whose date window has passed. Mapping must not throw; a 0-price product is not sellable. Test in Task 2.
4. **Tampered or stale cart** in localStorage: unknown item code, qty 0, -1, 1000 or `"3"`, a product taken off the web, malformed JSON. The quote drops or clamps and says why; the UI never crashes. Tests in Task 8.
5. **Free-typed customer fields**: kennitala `010180-1234`, phone `+354 862 1234`, postal code ` 600 `, capital-area postal code with Flytjandi chosen. Normalise, then validate. Tests in Task 9.

---

## File map

```
lib/dk/types.ts            DK wire types (subset we use)
lib/dk/client.ts           createDkClient({ apiKey, fetchFn }) + DkError
lib/store/types.ts         StoreProduct, StoreCategory, QuotedLine, Checkout, ...
lib/store/map.ts           toStoreProduct, stockState, activePrice
lib/store/format.ts        formatIsk
lib/store/slug.ts          productSlug, itemCodeFromSlug
lib/store/categories.ts    storeCategories + resolveCategory (DK group map)
lib/store/catalog.ts       getCatalog, getProduct, getProductLive, buildTree
lib/store/flags.ts         storeEnabled, baseUrl
lib/store/delivery.ts      isCapitalArea, CAPITAL_AREA
lib/store/validate.ts      normalise + validateCheckout
lib/store/quote.ts         sanitizeCart, quoteCart
lib/store/checkout.ts      startCheckout
lib/store/payment-events.ts handlePaymentEvent, syncFromProvider
lib/store/fulfil.ts        fulfil, retryQueued, reconcilePending
lib/store/terms.ts         terms page copy
lib/kv.ts                  Kv interface, upstashKv, memoryKv, getKv, rateLimit
lib/payments/types.ts      PaymentProvider, AuthorizationEvent
lib/payments/straumur.ts   straumurProvider, straumurSignature, verifyStraumurEvent
lib/payments/mock.ts       mockProvider, mockAuthorizationEvent
lib/payments/index.ts      getPaymentProvider
lib/email/order.ts         buildOrderEmails, sendOrderEmails, sendAlert
lib/store/analytics.ts     trackStoreEvent (client)
components/store/*         UI (listed per task)
app/verslun/**, app/karfa/**, app/pontun/**, app/api/{dk,straumur,cron,vara}/**
scripts/dk-register-webhook.mjs, scripts/store-smoke.mjs
tests/fixtures/dk/*.json   recorded from DK's demo company
vitest.live.config.mts, tests/live/dk-probe.live.ts
vercel.json                crons
```

---

### Task 1: DK client and fixtures

**Files:**
- Create: `lib/dk/types.ts`, `lib/dk/client.ts`, `tests/fixtures/dk/products-page.json`, `tests/fixtures/dk/product.json`, `tests/fixtures/dk/company.json`, `tests/fixtures/dk/productgroups.json`, `tests/dk-client.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces:
  - `type DkProduct` with exactly the fields in design Appendix A plus `Warehouses: { Warehouse: string; QuantityInStock: number }[]`, `Attachments: { ID: number; Name: string; MD5Hash: string; ShowOnWeb: boolean }[]`, `Description2?`, `Group?`, `ExtraDesc1?`, `ExtraDesc2?` optional.
  - `type DkCustomer` (`Number, Name, SSNumber?, Email?, Phone?, Address1?, ZipCode?, City?`), `type DkOrderHead`, `type DkOrderLine` (`ItemCode, Text, Quantity, UnitPriceWithTax, Warehouse?`), `type DkWebhookPayload = { Type: string; Action: string; Objects: { ItemCode?: string }[] }`.
  - `class DkError extends Error { status: number; path: string; body: string }`
  - `type DkFetchOptions = { cache: "live" } | { cache: "catalog"; tags: string[] }`
  - `createDkClient(opts: { apiKey: string; fetchFn?: typeof fetch; baseUrl?: string }): DkClient` with:
    - `listWebProducts(o: DkFetchOptions): Promise<DkProduct[]>` (pages of 200 via `/api/v1/Product/page/{n}/200?onweb=true&inactive=false&include=<Appendix A fields>` until a short page)
    - `getProduct(itemCode: string, o: DkFetchOptions): Promise<DkProduct | null>` (404 → null)
    - `getCompany(o: DkFetchOptions): Promise<{ defaultWarehouse: string }>`
    - `listProductGroups(o: DkFetchOptions): Promise<{ Number: string; Description?: string }[]>`
    - `getAttachment(itemCode: string, id: number): Promise<Response>` (raw response; DK returns the image bytes with their content type)
    - `searchCustomers(value: string, max: number): Promise<DkCustomer[]>`
    - `createCustomer(c: Partial<DkCustomer> & { Number: string; Name: string }): Promise<"created" | "exists">` (409 → `"exists"`)
    - `createSalesOrder(o: DkOrderHead): Promise<{ orderNumber: number }>` (response `StatusValueModel { Key, Value }`, `orderNumber = Value`)
    - `getSalesOrderByReference(reference: string): Promise<{ Number: number } | null>`
  - `getDkClient(): DkClient` reads `DK_API_KEY`; throws `Error("Missing DK_API_KEY")` when unset.

- [ ] **Step 1: Record fixtures from DK's demo company.** Use the public demo key printed in the Swagger description at `https://api.dkplus.is/swagger/docs/v1` (never the Vercel value). Save trimmed responses: 3 products from `/Product/page/1/200?onweb=true&inactive=false&include=…` into `products-page.json` (include `öv-080`, which has attachments, and one with negative stock), `/Product/öv-080` into `product.json`, `/company`, `/productgroup`.
- [ ] **Step 2: Write failing tests** in `tests/dk-client.test.ts` with a stub `fetchFn` that records calls and serves fixtures:
  - `sends bearer auth`: first call's `Authorization` header equals `bearer test-key`.
  - `listWebProducts pages until a short page`: stub returns 200 items then 3 → result length 203, two calls, second URL contains `/page/2/200`.
  - `catalog reads carry next.tags and revalidate 3600`: init equals `{ next: { revalidate: 3600, tags: ["dk-products"] } }` (plus headers).
  - `live reads use no-store`: init has `cache: "no-store"` and no `next`.
  - `getProduct encodes the item code`: `getProduct("öv-080", live)` requests `/api/v1/Product/%C3%B6v-080`.
  - `getProduct returns null on 404`.
  - `non-2xx throws DkError with status, path and body`: 400 body `{"Message":"Token is not valid."}` → `DkError` with `status 400`.
  - `createCustomer maps 409 to "exists"`.
  - `createSalesOrder returns Value as orderNumber`: body `{"Key":"x","Value":10432}` → `{ orderNumber: 10432 }`.
  - `aborts after 8 s`: stub never resolves; with fake timers advanced 8000 ms the promise rejects with `DkError` status 0.
- [ ] **Step 3: Run** `npx vitest run tests/dk-client.test.ts` — expect FAIL (module missing).
- [ ] **Step 4: Implement** `lib/dk/types.ts` and `lib/dk/client.ts` per the Interfaces block. Timeout via `AbortSignal.timeout(8000)`. Add to `.env.example`: `DK_API_KEY=`, `DK_WAREHOUSE=`, `DK_GROUP_MAP=`, `DK_WEBHOOK_SECRET=`, `DK_WEB_CUSTOMER_GROUP=vefur`, `STORE_ENABLED=`, `STORE_BASE_URL=`, `STRAUMUR_ENV=staging`, `STRAUMUR_API_KEY=`, `STRAUMUR_TERMINAL_ID=`, `STRAUMUR_HMAC_KEY=`, `STRAUMUR_WEBHOOK_KEY=`, `STRAUMUR_MOCK=`, `KV_REST_API_URL=`, `KV_REST_API_TOKEN=`, `CRON_SECRET=`, `ALERT_TO=`.
- [ ] **Step 5: Run** the test file — expect PASS. Run `npm test` — all green.
- [ ] **Step 6: Commit** `feat(store): typed dk Plus client with recorded fixtures`.

### Task 2: Product mapping, prices, slugs

**Files:**
- Create: `lib/store/types.ts`, `lib/store/map.ts`, `lib/store/format.ts`, `lib/store/slug.ts`, `tests/store-map.test.ts`

**Interfaces:**
- Consumes: `DkProduct` (Task 1).
- Produces:
  - `type StockState = "in_stock" | "low" | "backorder" | "sold_out"`
  - `type StoreProduct` exactly as design §5, with `categoryId: string | null` and `images: { id: number; hash: string; alt: string }[]`.
  - `stockState(qty: number, allowNegative: boolean, deliveryDays: number): StockState` — `>5` in_stock, `1..5` low, `<=0` and (`allowNegative` or `deliveryDays>0`) backorder, else sold_out.
  - `activePrice(p: DkProduct, now: Date): { priceIsk: number; salePriceIsk?: number }` — `Math.round(UnitPrice1WithTax)`; sale when `PropositionPrice > 0` and `now` within `PropositionDateFrom..PropositionDateTo` (inclusive, both present).
  - `toStoreProduct(p: DkProduct, ctx: { warehouse: string; categoryId: string | null; now: Date }): StoreProduct` — qty from the warehouse entry matching `ctx.warehouse` case-insensitively, else `TotalQuantityInWarehouse`; images = attachments with `ShowOnWeb`, alt = product name.
  - `isSellable(p: StoreProduct): boolean` — `priceIsk > 0 && stock.state !== "sold_out" && categoryId !== null`.
  - `formatIsk(n: number): string` — `"12.900 kr."`.
  - `productSlug(name: string, itemCode: string): string` — `slugify(name) + "--" + encodeURIComponent(itemCode)`; slugify lowercases, maps `á→a ð→d é→e í→i ó→o ú→u ý→y þ→th æ→ae ö→o`, replaces other non-`[a-z0-9]` runs with `-`, trims `-`.
  - `itemCodeFromSlug(slug: string): string | null` — text after the first `--`, `decodeURIComponent`; null when absent or empty.

- [ ] **Step 1: Write failing tests** in `tests/store-map.test.ts`:
  - `stockState` table: `(6,false,0)→in_stock`, `(5,false,0)→low`, `(1,false,0)→low`, `(0,true,0)→backorder`, `(-3,false,10)→backorder`, `(0,false,0)→sold_out`.
  - `activePrice`: 16990 → `{ priceIsk: 16990 }`; 8463.6 → 8464; sale 14900 from 2026-10-01 to 2026-10-31 at 2026-10-21 → `salePriceIsk: 14900`; same at 2026-11-01 → no sale.
  - `formatIsk(12900) === "12.900 kr."`, `formatIsk(1490000) === "1.490.000 kr."`, `formatIsk(0) === "0 kr."`.
  - Slug round-trip for `["Pebe gólfmottur í dráttarvél","PB-GM-200"]`, `["Hringstroffa 2 t / 2 m","öv-080"]`, `["X","A B/C"]`, `["Y","AB--CD"]`: `itemCodeFromSlug(productSlug(n,c)) === c`; first slug equals `"pebe-golfmottur-i-drattarvel--PB-GM-200"`.
  - `itemCodeFromSlug("no-separator") === null`.
  - Messy record (Review Focus 3): fixture product with `Description2`, `Group`, `Attachments` removed, price 0, qty -2 → `toStoreProduct` does not throw, `images` is `[]`, `isSellable` false.
  - Warehouse pick: warehouses `[{bg1:4},{ak:50}]`, ctx warehouse `"BG1"` → `stock.qty === 4`, state `low`.
- [ ] **Step 2: Run** `npx vitest run tests/store-map.test.ts` — FAIL.
- [ ] **Step 3: Implement** the four modules per the Interfaces block.
- [ ] **Step 4: Run** — PASS; `npm test` green.
- [ ] **Step 5: Commit** `feat(store): map DK products to store products`.

### Task 3: Categories, catalog cache, live probe

**Files:**
- Create: `lib/store/categories.ts`, `lib/store/catalog.ts`, `lib/store/flags.ts`, `tests/store-catalog.test.ts`, `vitest.live.config.mts`, `tests/live/dk-probe.live.ts`
- Modify: `package.json` (script `"dk:probe": "vitest run --config vitest.live.config.mts"`)

**Interfaces:**
- Consumes: `createDkClient`, `toStoreProduct`, `isSellable`.
- Produces:
  - `storeCategories: StoreCategory[]` — ids and titles in this order: `fyrir-okumanninn` "Fyrir ökumanninn" (servicePage `/fyrirokumannin`), `hifi-festibunadur` "Hífi- & festibúnaður" (`/hifi-festibunadur`), `vetrarbunadur` "Vetrarbúnaður" (`/vetrarbunadur`), `siubunadur` "Síubúnaður" (`/siubunadur`), `smurkerfi` "Smurkerfi – rekstrarvörur" (`/smurkerfi`). Blurbs and images from the prototype's category cards; images reuse `lib/categories.ts` images. `dkGroups: []` until Hlynur supplies them.
  - `resolveCategory(dkGroup: string | undefined, env?: string): string | null` — first `DK_GROUP_MAP` (JSON `{ "<group>": "<categoryId>" }`, parsed once, invalid JSON ignored with a console warning), then `storeCategories[].dkGroups` (case-insensitive).
  - `storeEnabled(): boolean` — `process.env.STORE_ENABLED === "true"`.
  - `baseUrl(): string` — `STORE_BASE_URL` ?? (`VERCEL_ENV === "preview" && VERCEL_BRANCH_URL` → `https://${VERCEL_BRANCH_URL}`) ?? (`NODE_ENV !== "production"` → `http://localhost:3000`) ?? `https://skralli.is`.
  - `type Catalog = { products: StoreProduct[]; unmappedGroups: string[]; withoutImages: string[] }`
  - `getCatalog(dk?: DkClient): Promise<Catalog>` — catalog read tagged `dk-products`; warehouse = `DK_WAREHOUSE` ?? `getCompany().defaultWarehouse`; keeps products with a category and price > 0 (sold-out ones stay listed).
  - `getProduct(itemCode: string): Promise<StoreProduct | null>` — tagged `dk-product:<itemCode>` and `dk-products`.
  - `getProductLive(itemCode: string, dk?: DkClient): Promise<StoreProduct | null>` — no-store.
  - `type TreeNode = { id: string; title: string; href: string; count: number; children: { group: string; title: string; href: string; count: number }[] }`
  - `buildTree(catalog: Catalog, groupTitles: Record<string, string>): TreeNode[]` — one node per category in `storeCategories` order, children = DK groups present in that category sorted by title, href `/verslun/<id>?undirflokkur=<group>`; categories with 0 products omitted.

- [ ] **Step 1: Write failing tests** in `tests/store-catalog.test.ts` (stub DK client over the fixtures; `DK_GROUP_MAP='{"007":"fyrir-okumanninn","alm":"hifi-festibunadur"}'`):
  - `resolveCategory("007") === "fyrir-okumanninn"`, `resolveCategory("ALM") === "hifi-festibunadur"`, `resolveCategory("zzz") === null`, `resolveCategory(undefined) === null`; invalid `DK_GROUP_MAP` → null, no throw.
  - `getCatalog` lists only mapped, priced products; `unmappedGroups` contains the fixture's unmapped group once; `withoutImages` lists item codes with no `ShowOnWeb` image.
  - `buildTree` orders nodes like `storeCategories`, omits empty categories, child counts sum to the node count.
  - `baseUrl()` cases: `STORE_BASE_URL` wins; preview branch URL; fallback `https://skralli.is` when `NODE_ENV=production`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: Live probe.** `vitest.live.config.mts` = repo config with `include: ["tests/live/**/*.live.ts"]`. `tests/live/dk-probe.live.ts` skips unless `DK_API_KEY` is set, calls `getCatalog` with the real client (no Next cache in vitest; `next` init is ignored) and prints: total web products, sellable count per category, `unmappedGroups` with titles, `withoutImages`, one sample product. Run with the demo key and `DK_GROUP_MAP` above: `DK_API_KEY=<demo> DK_GROUP_MAP='…' npm run dk:probe` → prints non-zero counts.
- [ ] **Step 6: Commit** `feat(store): categories, cached catalog and dk:probe`.

### Task 4: Store shell, category tree, /verslun and category pages

**Files:**
- Create: `app/verslun/layout.tsx`, `app/verslun/page.tsx`, `app/verslun/[flokkur]/page.tsx`, `components/store/StoreTree.tsx`, `components/store/ProductCard.tsx`, `components/store/ProductGrid.tsx`, `components/store/StockBadge.tsx`, `components/store/Price.tsx`, `components/store/StoreUnavailable.tsx`, `lib/store/listing.ts`, `tests/store-listing.test.ts`

**Interfaces:**
- Consumes: `getCatalog`, `buildTree`, `storeCategories`, `storeEnabled`, `formatIsk`, `productSlug`, `CATEGORY_ICONS`, `PageHero`, `Breadcrumb`, `Container`.
- Produces:
  - `type SortKey = "nyjast" | "verd-lagst" | "verd-haest" | "heiti"`
  - `listCategory(catalog: Catalog, categoryId: string, opts: { group?: string; sort?: string }): StoreProduct[]` — unknown sort → `nyjast` (by `modified` desc); `heiti` uses `localeCompare(…, "is")`; price sorts use sale price when present.
  - `<ProductCard product={StoreProduct} />` — server component; image via `/api/vara/<encoded itemCode>/mynd/<id>?h=<hash>` (Task 5), falls back to the category image; the add-to-cart button slot is filled in Task 8.
  - `<StoreTree nodes={TreeNode[]} activeCategory?: string activeGroup?: string />` — prototype look (`docs/plans/2026-10-17-vefverslun-prototype.html`, `.tree`): dark "Vöruflokkar" header, icon rows, active branch expanded, "Vörumerki" row linking `/vorumerki`; sticky from `md`; under `md` a `<details>` collapsible (no client JS).
  - `<StockBadge state={StockState} deliveryDays?: number />` copy: "Á lager", "Fá eintök eftir", "Sérpöntun · ~N dagar" (or "Sérpöntun" without days), "Uppselt".
  - `<StoreUnavailable />` copy: heading "Vefverslunin er í viðhaldi", text "Ekki næst í lagerkerfið í augnablikinu. Vörulistinn birtist aftur sjálfkrafa um leið og tengingin kemst á. Þú getur alltaf hringt í 546 3500 eða sent fyrirspurn.", button "Hafa samband" → `/hafa-samband`.

- [ ] **Step 1: Write failing tests** for `listCategory` in `tests/store-listing.test.ts`: group filter; each sort key on a 3-product fixture; `"bogus"` sort equals `nyjast`; Icelandic order puts "Ás" after "Ar" and "Öxull" last.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement** `lib/store/listing.ts`. **Step 4: Run** — PASS.
- [ ] **Step 5: Build the pages.** `app/verslun/layout.tsx` calls `notFound()` when `!storeEnabled()`. Both pages `export const revalidate = 3600`, wrap `getCatalog()` in try/catch and render `<StoreUnavailable />` on `DkError`. `/verslun`: PageHero "Vefverslun" / "Vörur á lager frá Skralla – pantaðu og sæktu í Móhellu eða fáðu sent út á land", breadcrumb `Vefverslun`, two-column `StoreTree` + category cards with product counts + "Nýtt í verslun" (6 most recently modified sellable). `/verslun/[flokkur]`: unknown id → `notFound()`; `generateStaticParams` returns `storeCategories` ids; header shows title and count; sort `<select>` in a GET form (`?rada=`); link to the category's `servicePage`; `generateMetadata` via `pageMetadata`.
- [ ] **Step 6: Verify.** `STORE_ENABLED=true DK_API_KEY=<demo> DK_GROUP_MAP='…' npm run dev`; `curl -s localhost:3000/verslun | grep -c "Vöruflokkar"` ≥ 1; `/verslun/fyrir-okumanninn` lists products; with `STORE_ENABLED` unset `/verslun` returns 404; with `DK_API_KEY=bad` the maintenance copy shows. `npm run build` passes.
- [ ] **Step 7: Commit** `feat(store): store index, category pages and category tree`.

### Task 5: Product page and image proxy

**Files:**
- Create: `app/verslun/vara/[slug]/page.tsx`, `app/api/vara/[itemCode]/mynd/[id]/route.ts`, `components/store/ProductGallery.tsx` (client), `lib/store/jsonld.ts`, `lib/store/text.ts`, `tests/store-product.test.ts`

**Interfaces:**
- Consumes: `getProduct`, `getCatalog`, `itemCodeFromSlug`, `productSlug`, `getDkClient().getAttachment`.
- Produces:
  - `descriptionParagraphs(html: string | undefined): string[]` — strips tags, decodes `&amp; &lt; &gt; &quot; &#39; &nbsp;`, splits on `</p>`, `<br>` and blank lines, drops empties.
  - `productJsonLd(p: StoreProduct, url: string): object` — schema.org `Product` with `sku`, `name`, `image`, `offers { price, priceCurrency: "ISK", availability }` (`InStock`, `LimitedAvailability`, `BackOrder`, `OutOfStock`).
  - `imageUrl(itemCode: string, img: { id: number; hash: string }): string` — `/api/vara/${encodeURIComponent(itemCode)}/mynd/${img.id}?h=${img.hash.slice(0, 12)}`.

- [ ] **Step 1: Write failing tests:** `descriptionParagraphs("<p><strong>Sterk</strong> &amp; létt</p><p></p>")` → `["Sterk & létt"]`; `"a<br>b"` → `["a","b"]`; `undefined` → `[]`; `<script>x</script>` text never survives as markup. `productJsonLd` availability per stock state and price uses sale price when present. `imageUrl("öv-080", {id:2656, hash:"EEB1F28BF1E1…"})` → `/api/vara/%C3%B6v-080/mynd/2656?h=EEB1F28BF1E1`.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement** `lib/store/text.ts` and `lib/store/jsonld.ts`. **Step 4: Run** — PASS.
- [ ] **Step 5: Image route.** `GET` decodes `itemCode`, checks the code is in `getCatalog()` and `id` is one of its images (else 404), streams `getAttachment` body with the DK content type and `Cache-Control: public, max-age=31536000, immutable`. 404 when the store is disabled.
- [ ] **Step 6: Product page.** `revalidate = 3600`. Resolve `itemCodeFromSlug`; missing product → `notFound()`; slug differs from `productSlug(name, itemCode)` → `permanentRedirect` to the canonical slug. Layout per prototype "vara" screen: gallery, eyebrow "<category> · <brand if any>", name, `Vörunúmer <itemCode>`, price (sale struck through), `StockBadge`, "Verð með vsk.", quantity + add-to-cart slot (Task 8), fine print "Sækja í Móhellu 3F · Sent með Flytjanda út á land · 14 daga skilaréttur", "Um vöruna" paragraphs, "Fleira í <category>" (4 siblings), a link to the category's service page, JSON-LD `<script type="application/ld+json">`, breadcrumb `Vefverslun › <category> › <name>`.
- [ ] **Step 7: Verify** in dev against the demo: open `öv-080`'s page via its slug; gallery image loads through the proxy (`curl -sI` shows `image/jpeg` and the immutable header); a hand-mangled slug with the right code 308-redirects; an unknown code 404s. `npm run build` passes.
- [ ] **Step 8: Commit** `feat(store): product page, JSON-LD and DK image proxy`.

### Task 6: Site integration and DK revalidation webhook

**Files:**
- Create: `components/store/StoreProductsStrip.tsx`, `app/verslun/search-index.json/route.ts`, `lib/store/search.ts`, `app/api/dk/webhook/route.ts`, `lib/store/dk-webhook.ts`, `scripts/dk-register-webhook.mjs`, `tests/store-integration.test.ts`
- Modify: `lib/site.ts` (add `storeNavItem`, `storeFooterColumn`), `components/Header.tsx`, `components/MobileMenu.tsx` (receives nav incl. store link), `components/Footer.tsx`, `components/search/SearchButton.tsx` + `SearchDialog.tsx` (prop `includeStore: boolean`), `app/sitemap.ts`, `lib/search/build-index.ts`, `app/fyrirokumannin/page.tsx`, `app/hifi-festibunadur/page.tsx`, `app/vetrarbunadur/page.tsx`, `app/siubunadur/page.tsx`, `app/smurkerfi/page.tsx`, `package.json` (script `"dk:webhook": "node scripts/dk-register-webhook.mjs"`)

**Interfaces:**
- Produces:
  - `storeNavItem = { text: "Vefverslun", href: "/verslun" }`; inserted after "Þjónusta" in header and mobile nav only when `storeEnabled()`. `lib/site.ts`'s `nav` constant is unchanged (keeps `tests/nav.test.ts` green).
  - `storeSearchEntries(catalog: Catalog): SearchEntry[]` — `kind: "product"`, id `store-<itemCode>`, title name, subtitle `<category title> · <formatIsk(price)>`, url product path, keywords item code + DK group title.
  - `staticSitemapEntries(): MetadataRoute.Sitemap` — the current body of `sitemap()`; `build-index.ts` switches to it. Default export becomes `async` and appends `/verslun`, each category and each sellable product when the store is enabled (catalog errors → static entries only).
  - `revalidationTags(payload: DkWebhookPayload): string[]` — `dk-products` plus `dk-product:<ItemCode>` per object with an item code, deduplicated.
  - `POST /api/dk/webhook`: `Authorization` must equal `Bearer ${DK_WEBHOOK_SECRET}` (constant-time compare) else 401; calls `revalidateTag(tag, "max")` for each tag; returns 200 `{"ok":true}`.
  - `<StoreProductsStrip categoryId={string} />` — up to 8 sellable products, heading "Kaupa í vefverslun", text "Vörur úr þessum flokki sem eru á lager og hægt að panta beint.", link "Sjá allt í vefverslun →". Renders nothing when disabled, empty or DK fails. Placed directly above `<ContactCta />` on the five mapped service pages.
  - `scripts/dk-register-webhook.mjs <publicUrl>`: reads `DK_API_KEY`, `DK_WEBHOOK_SECRET`, `ALERT_TO`; POSTs `/api/v1/admin/webhook` with `{ Description: "skralli.is vefverslun", Url: "<publicUrl>/api/dk/webhook", AuthorizationScheme: "Bearer", AuthorizationValue: <secret>, FailureEmail: <ALERT_TO>, Options: { Enabled: true, Product: true, ProductTransactions: true, SalesOrder: true } }`; prints the returned ID only.

- [ ] **Step 1: Write failing tests:** `revalidationTags` dedupes and ignores objects without `ItemCode`; webhook handler (import the route's `POST`, mock `next/cache`) returns 401 on wrong/missing bearer and 200 with `revalidateTag` called `("dk-products","max")`; `storeSearchEntries` produces the url `"/verslun/vara/pebe-golfmottur-i-drattarvel--PB-GM-200"` for that fixture; `staticSitemapEntries()` length equals today's (57 routes + `/personuvernd` − `/404` = 57); `tests/search-index.test.ts` still passes.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** `npm test` — PASS.
- [ ] **Step 5: Verify** in dev with the store on: nav shows "Vefverslun"; `/fyrirokumannin` shows the strip above the contact block; search for "Pebe" lists a store product; `curl -s localhost:3000/sitemap.xml | grep -c verslun` > 0; with the store off none of these appear and the sitemap matches main.
- [ ] **Step 6: Commit** `feat(store): nav, service-page strips, search, sitemap and DK revalidation webhook`.

### Task 7: KV store

**Files:**
- Create: `lib/kv.ts`, `tests/kv.test.ts`
- Modify: `package.json`, `package-lock.json`

**Interfaces:**
- Produces:
  - `interface Kv { get<T>(key: string): Promise<T | null>; set(key: string, value: unknown, opts?: { ex?: number; nx?: boolean }): Promise<boolean>; del(key: string): Promise<void>; incr(key: string, exSeconds: number): Promise<number>; sadd(key: string, member: string): Promise<void>; srem(key: string, member: string): Promise<void>; smembers(key: string): Promise<string[]> }` — `set` returns false only when `nx` blocked it.
  - `memoryKv(now?: () => number): Kv` — honours `ex` and `nx`.
  - `upstashKv(url: string, token: string): Kv` — wraps `new Redis({ url, token })` from `@upstash/redis`.
  - `getKv(): Kv` — Upstash when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set; otherwise `memoryKv()` singleton when `VERCEL_ENV !== "production"`; otherwise throws `Error("KV is not configured")`.
  - `rateLimit(kv: Kv, key: string, limit: number, windowSeconds: number): Promise<boolean>` — true while `incr` ≤ limit.

- [ ] **Step 1: Install.** `npm install --save-exact @upstash/redis@1.39.0`; confirm `package.json` shows `"@upstash/redis": "1.39.0"`.
- [ ] **Step 2: Write failing tests** against `memoryKv` with a fake clock: `set nx` on existing key → false and value kept; `ex` expiry at 1000 ms; `incr` resets after window; `rateLimit` allows 5 then blocks the 6th within the window; sets add/remove/list; `getKv()` throws when `VERCEL_ENV=production` and no KV env.
- [ ] **Step 3: Run** — FAIL. **Step 4: Implement.** **Step 5: Run** — PASS.
- [ ] **Step 6: Commit** `feat(store): KV abstraction over Upstash with in-memory dev store`.

### Task 8: Cart

**Files:**
- Create: `lib/store/quote.ts`, `app/karfa/actions.ts`, `app/karfa/layout.tsx`, `app/karfa/page.tsx`, `components/store/CartProvider.tsx`, `components/store/CartIcon.tsx`, `components/store/AddToCartButton.tsx`, `components/store/CartView.tsx`, `lib/store/analytics.ts`, `tests/store-quote.test.ts`
- Modify: `app/layout.tsx` (wrap in `CartProvider`), `components/Header.tsx` (`CartIcon` when enabled), `components/store/ProductCard.tsx`, `app/verslun/vara/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getProductLive`, `isSellable`, `getKv`, `rateLimit`.
- Produces:
  - `CART_STORAGE_KEY = "skralli-cart-v1"`, `MAX_LINES = 30`, `MAX_QTY = 99`.
  - `sanitizeCart(raw: unknown): CartLine[]` — accepts an array of `{ itemCode: string; qty: number|string }`, coerces qty with `Math.trunc(Number(qty))`, drops qty < 1 or non-string codes, clamps to 99, merges duplicate codes, keeps the first 30. Non-array → `[]`.
  - `type LineIssue = "removed" | "sold_out" | "qty_clamped" | "price_changed"`
  - `type QuotedLine = { itemCode: string; name: string; slug: string; image?: string; qty: number; unitPriceIsk: number; lineTotalIsk: number; vatPercent: number; stock: StockState; issue?: LineIssue }`
  - `type CartQuote = { lines: QuotedLine[]; totalIsk: number; vatIsk: number; hasBlockingIssue: boolean }` — `vatIsk = Σ round(line − line / (1 + vat/100))`; removed and sold-out lines have `lineTotalIsk 0` and set `hasBlockingIssue`.
  - `quoteCart(lines: CartLine[], deps: { getProduct: (code: string) => Promise<StoreProduct | null>; knownPrices?: Record<string, number> }): Promise<CartQuote>` — `price_changed` when `knownPrices[code]` differs.
  - Server action `quoteCartAction(raw: unknown, knownPrices: Record<string, number>): Promise<CartQuote | { error: string }>` — `sanitizeCart`, rate limit 60/min per IP (`x-forwarded-for` first entry) → `{ error: "Of margar fyrirspurnir. Reyndu aftur eftir smá stund." }`; `DkError` → `{ error: "Ekki næst í lagerkerfið. Reyndu aftur eftir smá stund eða hringdu í 546 3500." }`.
  - `useCart(): { lines: CartLine[]; count: number; add(code: string, qty?: number): void; setQty(code: string, qty: number): void; remove(code: string): void; clear(): void; hydrated: boolean }` — reducer + localStorage, read after mount, every storage access in try/catch.
  - `trackStoreEvent(name: "add_to_cart" | "begin_checkout" | "purchase", params: Record<string, unknown>): void` — `window.gtag?.("event", name, params)`; no-op without consent because gtag only exists after consent.

- [ ] **Step 1: Write failing tests** in `tests/store-quote.test.ts` (Review Focus 4): `sanitizeCart` on `"oops"`, `null`, `[{itemCode:"A",qty:"3"},{itemCode:"A",qty:2},{itemCode:"B",qty:0},{itemCode:"C",qty:-1},{itemCode:"D",qty:1000},{itemCode:5,qty:1}]` → `[{A,5},{D,99}]`; 40 distinct lines → 30. `quoteCart`: unknown code → `removed`, total excludes it, `hasBlockingIssue`; sold-out → `sold_out`; price drift vs `knownPrices` → `price_changed`; VAT on 16800 at 24 % → 3252; sale price is the unit price.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement** `lib/store/quote.ts` and the action. **Step 4: Run** — PASS.
- [ ] **Step 5: UI.** `CartProvider` in the root layout; `CartIcon` (cart glyph + count badge, links `/karfa`, hidden until hydrated) beside `SearchButton`; `AddToCartButton` on cards and the product page (qty stepper on the product page; "Láta mig vita" link to `/hafa-samband` when sold out; toast "Sett í körfu"; `trackStoreEvent("add_to_cart", …)`). `/karfa` (layout gates on `storeEnabled`): heading "Karfan þín", text "Verð og lagerstaða eru sótt í lagerkerfið um leið og karfan opnast – ef eitthvað hefur breyst sést það hér.", lines with steppers, per-line issue notes ("Varan er ekki lengur í boði", "Uppselt", "Verð hefur breyst"), summary (Vörur, Þar af vsk, Samtals), "Ganga frá kaupum" disabled while `hasBlockingIssue` or empty, empty state "Karfan er tóm." with link to `/verslun`.
- [ ] **Step 6: Verify** in dev: add two products, reload, count persists; edit localStorage to junk → `/karfa` shows empty cart, no console error; set a qty of 1000 in storage → shows 99.
- [ ] **Step 7: Commit** `feat(store): cart with live DK quote`.

### Task 9: Checkout form and startCheckout

**Files:**
- Create: `lib/store/delivery.ts`, `lib/store/validate.ts`, `lib/store/checkout.ts`, `lib/payments/types.ts`, `app/karfa/greida/page.tsx`, `components/store/CheckoutForm.tsx`, `tests/store-checkout.test.ts`
- Modify: `app/karfa/actions.ts` (add `startCheckoutAction`), `lib/store/types.ts` (Checkout)

**Interfaces:**
- Consumes: `quoteCart`, `getKv`, `rateLimit`, `baseUrl`.
- Produces:
  - `CAPITAL_AREA: Array<[number, number]> = [[101,162],[170,172],[200,212],[220,225],[270,276]]`; `isCapitalArea(zip: string): boolean`.
  - `type CheckoutForm = { name: string; email: string; phone: string; kennitala?: string; delivery: "pickup" | "flytjandi"; address?: string; zip?: string; town?: string; note?: string; terms: boolean; website?: string }`
  - `normaliseForm(f: CheckoutForm): CheckoutForm` — trims all; kennitala and zip keep digits only; phone drops spaces, dashes and a leading `+354`/`00354`.
  - `validateCheckout(f: CheckoutForm): string | null` messages, checked in this order: honeypot → "Sending mistókst."; "Vinsamlegast fylltu út nafn."; "Vinsamlegast sláðu inn gilt netfang."; phone not 7 digits → "Vinsamlegast sláðu inn gilt símanúmer."; kennitala present and not 10 digits → "Kennitala á að vera 10 tölustafir."; flytjandi without address/zip/town → "Vinsamlegast fylltu út heimilisfang, póstnúmer og stað."; zip not 3 digits → "Póstnúmer á að vera 3 tölustafir."; flytjandi with capital-area zip → "Pantanir á höfuðborgarsvæðinu eru sóttar í Móhellu 3F."; `!terms` → "Vinsamlegast samþykktu skilmálana."
  - `type Checkout` per design §5 with `id = crypto.randomUUID()` (no ULID dependency) and `delivery: { method: "pickup" | "flytjandi"; address?: { street: string; zip: string; town: string } }`, plus `declines: number`, `attempts: number`, `emailsSent: boolean` (all start at 0/false).
  - `interface PaymentProvider { createCheckout(i: { reference: string; amountIsk: number; returnUrl: string; abandonUrl: string; shopperEmail: string; items: { name: string; quantity: number; unitPriceIsk: number; amountIsk: number }[] }): Promise<{ url: string; checkoutReference: string }>; getStatus(checkoutReference: string): Promise<"New" | "Completed" | "Expired"> }`
  - `startCheckout(form: CheckoutForm, rawCart: unknown, deps: { kv: Kv; provider: PaymentProvider; getProduct: (c: string) => Promise<StoreProduct | null>; baseUrl: string; now: () => Date }): Promise<{ ok: true; redirectUrl: string } | { ok: false; error: string; quote?: CartQuote }>` —
    1. normalise + validate; 2. `quoteCart` live; `DkError` → "Ekki næst í lagerkerfið. Engin greiðsla var tekin. Reyndu aftur eftir smá stund."; `hasBlockingIssue` or empty → `{ ok:false, error:"Karfan hefur breyst. Farðu yfir hana áður en þú greiðir.", quote }`; 3. write `checkout:<id>` (status `pending`, ex 30 days) and `sadd("checkouts:pending", id)`; 4. `provider.createCheckout` with `returnUrl = ${baseUrl}/pontun/${id}`, `abandonUrl = ${baseUrl}/karfa?haett=1`; store `checkoutReference`; return its url.
  - Server action `startCheckoutAction(form, rawCart)` — rate limit 10/10 min per IP; on success `redirect(url)`; fires nothing client-side (`begin_checkout` is tracked by the form on submit).

- [ ] **Step 1: Write failing tests** (Review Focus 5): `normaliseForm` turns `010180-1234` → `0101801234`, `+354 862 1234` → `8621234`, `" 600 "` → `600`; `isCapitalArea` for `101,162,170,210,221,225,270,276` true and `163,230,600,900` false; each `validateCheckout` message with a minimal failing form; `startCheckout` with a fake provider and `memoryKv`: happy path stores a pending checkout whose `totalIsk` matches the quote, calls `createCheckout` with `amountIsk` equal to the total and `returnUrl` `http://x/pontun/<id>`, returns the provider URL; DK down → error copy above and provider not called; sold-out line → `ok:false` with quote.
- [ ] **Step 2: Run** — FAIL. **Step 3: Implement.** **Step 4: Run** — PASS.
- [ ] **Step 5: UI** `/karfa/greida` per prototype "greida" screen: buyer block (Nafn, Kennitala (valfrjálst), Netfang, Símanúmer, note "Kennitalan tengir pöntunina við viðskiptamannareikning þinn hjá Skralla ef hann er til."), delivery radios "Sækja í Móhellu 3F, Hafnarfirði" (small "Tilbúið til afhendingar næsta virka dag. Opið mán–fös 8–16.") and "Senda út á land með Flytjanda" (small "Fyrir pantanir utan höfuðborgarsvæðisins. Sendingarkostnaður greiðist af viðtakanda við afhendingu."), address fields shown for Flytjandi with the live capital-area note, Athugasemd, order summary from a fresh quote, terms checkbox linking `/verslun/skilmalar`, button "Greiða með korti →", honeypot. Errors render inline above the button.
- [ ] **Step 6: Commit** `feat(store): checkout form and startCheckout`.

### Task 10: Straumur provider, mock provider and payment-event handling

**Files:**
- Create: `lib/payments/straumur.ts`, `lib/payments/mock.ts`, `lib/payments/index.ts`, `lib/store/payment-events.ts`, `tests/straumur.test.ts`, `tests/payment-events.test.ts`

**Interfaces:**
- Produces:
  - `type AuthorizationEvent = { checkoutReference: string | null; payfacReference: string; merchantReference: string; amount: string; currency: string; reason: string | null; success: "true" | "false"; hmacSignature: string; additionalData?: Record<string, string> }`
  - `straumurSignature(e: AuthorizationEvent, hexKey: string): string` — fields `checkoutReference, payfacReference, merchantReference, amount, currency, reason, success`, `null`/missing → `""`, joined with `:`, UTF-8, HMAC-SHA256 with `Buffer.from(hexKey, "hex")`, base64.
  - `verifyStraumurEvent(e: AuthorizationEvent, authHeader: string | null, cfg: { webhookKey: string; hmacKey: string }): boolean` — raw `Authorization` equals `webhookKey` (no Bearer prefix) and signature matches; both via `timingSafeEqual` on equal-length buffers.
  - `straumurProvider(cfg: { env: "staging" | "live"; apiKey: string; terminalId: string }, fetchFn?: typeof fetch): PaymentProvider` — hosts `https://checkout-api.staging.straumur.is` / `https://greidslugatt.straumur.is`, header `X-API-Key`; create body `{ amount: amountIsk*100, currency: "ISK", returnUrl, abandonUrl, reference, terminalIdentifier, culture: "is", shopperContact: shopperEmail, expiresAt: now+1h ISO with ms and Z, items: [{ name, quantity, unitPrice: unitPriceIsk*100, amount: amountIsk*100 }] }`; status `GET /api/v1/hostedcheckout/status/{ref}` → `status`.
  - `mockProvider(baseUrl: string): PaymentProvider` — `url = ${baseUrl}/karfa/prufugreidsla?c=<reference>`, `checkoutReference = "mock-" + reference`; `getStatus` reads `mock-status:<reference>` from KV (default `"New"`).
  - `getPaymentProvider(): PaymentProvider` — Straumur when `STRAUMUR_API_KEY` and `STRAUMUR_TERMINAL_ID` are set; mock when `STRAUMUR_MOCK === "true"` and `VERCEL_ENV !== "production"`; else throws `Error("Payment provider is not configured")`.
  - `mockAuthorizationEvent(c: Checkout, hmacKey: string): AuthorizationEvent` — success event for the full amount, `payfacReference = "MOCK" + random`, signed with `straumurSignature`.
  - `handlePaymentEvent(e: AuthorizationEvent, deps: { kv: Kv; fulfil: (id: string) => Promise<void>; sendAlert: (subject: string, text: string) => Promise<void>; now: () => Date }): Promise<"duplicate" | "declined" | "paid" | "ignored" | "mismatch">` —
    1. `set("straumur:event:<payfacReference>", 1, { nx: true, ex: 30 days })` false → `duplicate`;
    2. checkout missing → `ignored`; 3. `success === "false"` → `declines += 1`, `ignored` when already paid else `declined`;
    4. already `paid`/`fulfilled` → `ignored` (no second fulfil); 5. `amount !== String(totalIsk*100)` or `currency !== "ISK"` → status `failed`, error recorded, `sendAlert`, `mismatch`;
    6. mark `paid`, `paidAt`, `payfacReference`, then `await deps.fulfil(id)` → `paid`.
  - `syncFromProvider(id: string, deps: { kv: Kv; provider: PaymentProvider; fulfil: (id: string) => Promise<void> }): Promise<Checkout | null>` — pending + `getStatus` `Completed` → mark paid and fulfil under the same rules; `Expired` → status `expired`, `srem` pending.

- [ ] **Step 1: Write failing tests** in `tests/straumur.test.ts`: the documented test vector — payload `{checkoutReference:"9eh9g1loq8ygdmtj1kw47dbogkr2qyijyen53hnglpx2eq4213", payfacReference:"OOJWITWVQV42PSE8", merchantReference:"89807267361535", amount:"100000", currency:"ISK", reason:"383528:1111:03/2030", success:"true"}` with key `42355b343e1a8879b54906abe30e25c0f4f2e1b7d29ad9f1` signs to `V/iaRHNyBnmqVG1mRCZUQo7HTX2sZGgDsJzajV1hOVs=`; `verifyStraumurEvent` false for a flipped amount, a wrong `Authorization`, a `Bearer `-prefixed key and a missing header; `createCheckout` posts to the staging URL with `X-API-Key`, `amount` 1680000 for 16 800 kr., items in minor units, `culture: "is"`; status parses `{"status":"Completed",...}`.
- [ ] **Step 2: Write failing tests** in `tests/payment-events.test.ts` (Review Focus 2) with `memoryKv` and a spy `fulfil`: same event twice → `paid` then `duplicate`, fulfil once; decline then success with different `payfacReference` → `declined`, `paid`; success twice with different `payfacReference` → second `ignored`, fulfil once; amount mismatch → `mismatch`, status `failed`, fulfil never called; `syncFromProvider` Completed while a webhook already marked paid → fulfil still once.
- [ ] **Step 3: Run** both — FAIL. **Step 4: Implement.** **Step 5: Run** — PASS.
- [ ] **Step 6: Commit** `feat(store): Straumur provider, HMAC verification and payment-event handling`.

### Task 11: Fulfilment, payment webhook, order page, emails and crons

**Files:**
- Create: `lib/store/fulfil.ts`, `lib/store/deps.ts`, `lib/email/order.ts`, `app/api/straumur/webhook/route.ts`, `app/karfa/prufugreidsla/page.tsx`, `app/pontun/[id]/page.tsx`, `app/pontun/actions.ts`, `components/store/OrderStatus.tsx` (client), `app/api/cron/dk-retry/route.ts`, `app/api/cron/reconcile/route.ts`, `vercel.json`, `tests/fulfil.test.ts`, `tests/order-email.test.ts`, `tests/straumur-webhook.test.ts`
- Modify: `app/karfa/actions.ts` (add `mockPayAction`)

**Interfaces:**
- Consumes: `DkClient`, `Kv`, `getResendClient`, `emailFrom`, `contactTo`, `syncFromProvider`, `getPaymentProvider`.
- Produces:
  - `fulfil(id: string, deps: { kv: Kv; dk: DkClient; sendOrderEmails: (c: Checkout) => Promise<void>; sendAlert: (subject: string, text: string) => Promise<void>; revalidate: (tags: string[]) => void; now: () => Date; customerGroup: string; warehouse: string }): Promise<void>` —
    1. lock `set("fulfil:<id>", 1, { nx: true, ex: 120 })`, return if taken; load checkout; return unless `paid` (or `fulfilled` without emails sent);
    2. `getSalesOrderByReference(id)` → reuse its number if found (no duplicate after a timeout);
    3. else customer: search kennitala (match `SSNumber` or `Number`), else email (case-insensitive `Email`); none → `createCustomer({ Number: kennitala ?? "V" + last 9 digits of Date.now(), Name, SSNumber, Email, Phone, Address1, ZipCode, City, Group: customerGroup, SalesPerson: "vefur", PaymentTerm: "stgr", CountryCode: "IS" })`, `"exists"` → search again;
    4. `createSalesOrder({ Customer: { Number }, Reference: id, CustomerOrderNumber: payfacReference, Text1: "Vefverslun – greitt með korti (Straumur <payfacReference>)", Text2: pickup → "Sótt í Móhellu 3F" / flytjandi → "Senda með Flytjanda – viðtakandi greiðir: <street>, <zip> <town>", plus " · " + note when present, Warehouse: warehouse, Lines: [{ ItemCode, Text: name, Quantity, UnitPriceWithTax }] })`;
    5. save `dk`, status `fulfilled`, `fulfilledAt`, `srem` pending and `dk-retry`; `revalidate(["dk-products", ...dk-product tags])`; `sendOrderEmails`; set `emailsSent: true`.
    On any DK error: keep `paid`, set `error`, `sadd("dk-retry", id)`, increment `attempts`; first failure → `sendAlert("Vefpöntun náðist ekki í DK", <full order text>)`; when `now − paidAt > 48 h` → second alert "Vefpöntun enn ekki í DK eftir 48 klst" and `srem("dk-retry", id)`. Emails are still sent on the first failure (the customer has paid) and `emailsSent` prevents a second send. Lock released in `finally`.
  - `retryQueued(deps): Promise<number>` and `reconcilePending(deps & { provider }): Promise<number>` (pending older than 2 h → `syncFromProvider`).
  - `buildOrderEmails(c: Checkout): { customer: { subject; text; html }; internal: { subject; text; html } }` — customer subject `Pöntun móttekin – Skralli`, includes order number when known, lines, total, delivery text, "Skilmálar og skilaréttur: <baseUrl>/verslun/skilmalar"; internal subject `Ný vefpöntun <DK nr or id> – <name>` with every field. All user text HTML-escaped (reuse the `esc` approach from `lib/email/contact.ts`).
  - `sendOrderEmails(c)`, `sendAlert(subject, text)` (to `ALERT_TO` ?? `contactTo()`), using the existing Resend client with `replyTo: contactTo()` on the customer email.
  - `storeDeps(): { kv; dk; provider; fulfil: (id: string) => Promise<void>; sendAlert }` in `lib/store/deps.ts` — the one place the real implementations are wired together for routes and actions.
  - `POST /api/straumur/webhook`: parse JSON (400 on bad JSON); `verifyStraumurEvent` with `STRAUMUR_WEBHOOK_KEY`/`STRAUMUR_HMAC_KEY` (401 on failure); respond 200 `{"ok":true}` and run `handlePaymentEvent(event, storeDeps())` inside `after()` from `next/server`, so the 15 s limit is never at risk.
  - `/karfa/prufugreidsla` (404 unless the mock provider is active): order total and two buttons, "Greiða (prófun)" and "Hætta við" (→ `/karfa?haett=1`); `mockPayAction(id)` builds `mockAuthorizationEvent(checkout, STRAUMUR_HMAC_KEY)`, sets `mock-status:<id>` = `Completed`, calls `handlePaymentEvent` with `storeDeps()`, then redirects to `/pontun/<id>`.
  - Server action `getOrderStatus(id: string): Promise<{ status: Checkout["status"]; orderNumber?: number } | null>` — calls `syncFromProvider` when pending and older than 20 s.
  - `/pontun/[id]`: unknown id → `notFound()`; `dynamic = "force-dynamic"`; shows lines, total, delivery, masked email (`j***@example.is`); `OrderStatus` polls `getOrderStatus` every 2 s for 60 s: pending → "Við staðfestum greiðsluna…"; paid/fulfilled → "Takk fyrir pöntunina!" with "Pöntun nr. <n> er skráð hjá Skralla." when a number exists and fires `trackStoreEvent("purchase", …)` once and clears the cart; after 60 s → "Þú færð staðfestingu í tölvupósti innan skamms. Hafðu samband í 546 3500 ef hún berst ekki."; failed/expired → "Greiðslan tókst ekki. Ekkert var skuldfært." with link back to `/karfa`.
  - Crons: both routes require `Authorization: Bearer ${CRON_SECRET}` else 401. `vercel.json`: `{ "crons": [ { "path": "/api/cron/dk-retry", "schedule": "*/10 * * * *" }, { "path": "/api/cron/reconcile", "schedule": "0 5 * * *" } ] }`.

- [ ] **Step 1: Write failing tests** in `tests/fulfil.test.ts` (stub DK client, `memoryKv`, spies): kennitala match reuses the customer; email match is case-insensitive; no match creates with `Number` = kennitala; no kennitala → `Number` starts with `V`; `createCustomer` `"exists"` → searches again; order payload carries `Reference`, `CustomerOrderNumber`, Flytjandi `Text2` exactly as above, line prices from the checkout snapshot; existing order by reference → `createSalesOrder` not called; DK throws → status stays `paid`, id in `dk-retry`, one alert, customer emails sent once; second call after recovery → order created, no second customer email; `paidAt` 49 h ago and DK still failing → second alert and removed from `dk-retry`; concurrent `fulfil` calls → `createSalesOrder` once.
- [ ] **Step 2: Write failing tests** in `tests/straumur-webhook.test.ts` (import the route's `POST`, mock `next/server`'s `after` to run immediately and `storeDeps`): bad JSON → 400; wrong `Authorization` → 401 and `handlePaymentEvent` not called; valid signed event → 200 and handled once. And in `tests/order-email.test.ts`: subjects; a name `<b>Jón</b>` is escaped in HTML; pickup vs Flytjandi delivery lines; totals formatted with `formatIsk`.
- [ ] **Step 3: Run** — FAIL. **Step 4: Implement.** **Step 5: Run** `npm test` — PASS.
- [ ] **Step 6: Cron plan check.** Deploy a preview (`git push`). If Vercel rejects the 10-minute schedule (Hobby plan allows daily only), change it to `"0 * * * *"` or daily and note it in `docs/handover.md`; the webhook path and `/pontun` polling still retry inline.
- [ ] **Step 7: Commit** `feat(store): fulfil to DK, order page, emails and crons`.

### Task 12: Terms, privacy, end-to-end smoke and handover

**Files:**
- Create: `app/verslun/skilmalar/page.tsx`, `lib/store/terms.ts`, `scripts/store-smoke.mjs`
- Modify: `lib/privacy.ts`, `docs/handover.md`, `package.json` (script `"store:smoke": "node scripts/store-smoke.mjs"`)

**Interfaces:**
- Produces:
  - `storeTerms: { heading: string; sections: { heading: string; paragraphs: string[] }[] }` — sections: Seljandi (Skralli ehf., kt. 580821-1460, Móhella 3F, 221 Hafnarfjörður, 546 3500, skralli@skralli.is), Verð og greiðsla (verð með vsk., greitt með korti í gegnum Straum), Afhending (sótt í Móhellu 3F mán–fös 8–16, eða sent út á land með Flytjanda og viðtakandi greiðir sendingarkostnað), Skilaréttur (14 dagar skv. lögum nr. 16/2016 um neytendasamninga, vara ónotuð í upprunalegum umbúðum, endurgreitt innan 14 daga), Ábyrgð og gallar, Persónuupplýsingar (link `/personuvernd`), Lög og varnarþing. Marked for Hlynur's review in the handover.
  - Privacy: the processors sentence in `lib/privacy.ts` gains "greiðslumiðlun (Straumur), bókhalds- og birgðakerfi (dk hugbúnaður)" and a sentence that order data is kept in the order system.
  - `scripts/store-smoke.mjs [baseUrl]` (Playwright `chromium`, like `scripts/verify.mjs`): opens `/verslun`, first category, first sellable product, adds to cart, opens `/karfa`, fills checkout with pickup and test data, accepts terms, submits, on `/karfa/prufugreidsla` clicks "Greiða (prófun)", waits for "Takk fyrir pöntunina!" on `/pontun/<id>`; exits non-zero with the failing step name otherwise.

- [ ] **Step 1: Build** the terms page (static, gated) and the privacy change; `npm test` still green (search index picks up the new privacy text).
- [ ] **Step 2: End-to-end run.** `STORE_ENABLED=true STRAUMUR_MOCK=true STRAUMUR_HMAC_KEY=<any hex> STRAUMUR_WEBHOOK_KEY=x DK_API_KEY=<demo> DK_GROUP_MAP='…' npm run dev`, then `npm run store:smoke http://localhost:3000` → exits 0. This writes one customer and one sales order to DK's shared demo company; that is what the demo company is for.
- [ ] **Step 3: Full checks.** `npm test`, `npm run lint`, `npm run build` all pass. With `STORE_ENABLED` unset: `/verslun`, `/karfa`, `/pontun/x` 404, nav and sitemap match `main`.
- [ ] **Step 4: Handover.** Add to `docs/handover.md` "Still needs you or Hlynur": real `DK_API_KEY`; Hlynur flags products, adds photos with "sýna á vef", creates customer group and salesperson "vefur", confirms the DK group → category map (fill `dkGroups` in `lib/store/categories.ts`) and the recipient-pays freight rule, reviews the terms text; provision Upstash Redis via `vercel integration add upstash` (Einar runs it: it needs his account); set `CRON_SECRET`, `DK_WEBHOOK_SECRET`, `ALERT_TO`; run `npm run dk:webhook https://skralli.is`; ask Straumur to open the payment gateway with Kode as technical contact, then set staging keys on Preview, register the webhook URL `<preview>/api/straumur/webhook` with a Vercel protection bypass, run one staging purchase, set live keys on Production, make one real low-value purchase, then `STORE_ENABLED=true` on Production.
- [ ] **Step 5: Commit** `feat(store): terms, privacy, smoke test and launch checklist`.

---

## Spec coverage check

| Spec | Task |
|---|---|
| §5 data model, stock states, prices | 2, 9 |
| §5 category mapping, unmapped warning | 3 |
| §6 routes, tree, slugs, JSON-LD, images, strip, nav, sitemap, search | 4, 5, 6 |
| §7 client, cache tags, webhook revalidation, live reads | 1, 3, 6, 8, 9 |
| §8 cart, checkout form, delivery, startCheckout, payment webhook, return page | 8, 9, 10, 11 |
| §9 fulfil, customer match, order, emails, retry, alerts | 11 |
| §10 failure modes | 4 (DK down browsing), 9 (DK down at checkout), 10 (duplicate, mismatch), 11 (DK down after payment, missing webhook) |
| §11 security: server-only secrets, signed webhooks, rate limits, honeypot, image allowlist | 5, 6, 7, 8, 9, 10 |
| §12 operations: probe, crons, alerts | 3, 11 |
| §13 testing | every task; smoke in 12 |
| §14 build order and launch checklist | 1–12; checklist in 12 |
