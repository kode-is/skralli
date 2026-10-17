# Vefverslun á skralli.is, backed by dk Plus — design

Status: draft written 2026-10-17 from sensible defaults (Einar skipped the
brainstorm questions). Everything marked **[call]** is Claude's decision and
can be overturned; everything marked **[Hlynur]** needs the client. Nothing
is implemented yet. Next step after approval: an implementation plan
(superpowers:writing-plans) for Phase 0 and 1.

Grounding: the dk Plus REST API was mapped from its Swagger spec and probed
live against DK's public demo company; Straumur's hosted-checkout docs were
read. Raw findings: side-session note `vefverslun-dk-recon.md` and the
appendix below.

## 1. Intent

Let Skralli's customers buy stock-held items (consumables, accessories,
standard lifting and winter gear) directly on skralli.is with a card, while
the quote-driven business (sturtuvagnar, snjóplógar, öryggisrúður,
smurkerfi installations) stays exactly as it is. dk Plus remains the one
place Hlynur maintains products, prices, stock and orders; the website is a
storefront over DK, not a second product database.

Why now: DK web services are already licensed (the API key slot exists on
Vercel), Straumur was already on the roadmap, and the site has every
building block except commerce (server actions, Resend email, search,
product-page patterns).

## 2. Goals, non-goals, anti-goals

Goals
- Browse DK products by category with live price (incl. VAT) and stock state.
- Card checkout in ISK; a paid order appears in DK as a sales order within
  seconds, with the customer attached.
- Customer and Skralli both get a confirmation email.
- Zero manual re-keying: Hlynur manages everything in DK.
- Site keeps working, and never takes money it cannot fulfil, when DK is down.

Non-goals (this design)
- No CMS, no admin UI, no product database of our own.
- No B2B pricing, invoices or customer login (Phase 3 sketch only).
- No shipping-rate integration (flat options), no multi-currency.
- No Shopify/Stripe. Stripe does not onboard Icelandic merchants and
  Shopify would replace DK as the catalog. The Vercel Marketplace lists only
  those two for payments/commerce, so Straumur is integrated directly.

Anti-goals (failure even if it "works")
- Charging a card and losing the order because DK or the webhook failed.
- Showing stale prices at checkout (client-side price trust).
- Cluttering DK with abandoned-cart orders or duplicate customers.
- Card data touching our servers (hosted checkout only).

## 3. Constraints and facts

- Stack: Next.js 16.3 App Router, React 19, Tailwind 4, `motion`, `resend`,
  vitest + Playwright; deployed on Vercel (project `skralli`). No database,
  no auth today.
- **DK_API_KEY on Vercel is a placeholder** (an 11-character `[WORD]`
  string; DK answers "Token is not valid"). A real token (GUID) must be
  created in dk Plus (Vefþjónusta → aðgangslyklar) and set for Production,
  Preview and `.env.local`. Phase 0 blocks on this.
- dk Plus API: `https://api.dkplus.is`, header `Authorization: bearer <token>`,
  JSON, 20–170 ms latency. Product flag `ShowItemInWebShop`, retail price
  `UnitPrice1WithTax`, HTML descriptions `ExtraDesc1/2`, per-warehouse
  stock, image attachments, modified-since paging, webhooks for product /
  stock / order changes, sales-order create, customer create/search.
- Straumur hosted checkout: `POST /api/v1/hostedcheckout` (staging host
  `checkout-api.staging.straumur.is`, live `greidslugatt.straumur.is`),
  header `X-API-Key`, body `{amount (minor units, ISK must end in 00),
  currency, reference (≤200), returnUrl, terminalIdentifier (12 chars)}`
  plus optional items list, shopper email, culture, session lifetime (≤24h),
  abandon URL. Response `{url, checkoutReference}`. Fulfilment signal is
  the Authorization webhook (`success:"true"`, idempotency key
  `payfacReference`, HMAC signed, carries our `merchantReference`). Status
  poll `GET /hostedcheckout/status/{checkoutReference}` → New | Completed |
  Expired. Capture is immediate by default.
- Install rule (CLAUDE.md): rate every new package/integration. Planned
  additions are all **low** risk: Upstash Redis via the official Vercel
  Marketplace integration, and `@upstash/redis` pinned. No DK or Straumur
  SDKs exist; both are called with `fetch`.

## 4. Architecture

```
Browser ──(RSC pages, ISR)──► Next.js on Vercel ──fetch──► dk Plus API
   │  cart in localStorage          │  ▲                        ▲
   │  server actions                │  │ revalidateTag           │ webhook: product/stock
   ▼                                │  └────────────────────────┘ changes
Straumur hosted checkout ──webhook──► /api/straumur/webhook ──► fulfil():
   (card page, off-site)             │      lookup/create customer, POST sales order,
                                     │      send Resend emails, revalidate stock
                                     ▼
                       Upstash Redis: pending checkouts, idempotency
                       locks, DK retry queue (no product data here)
```

Three trust boundaries: DK is the source of truth for catalog and orders;
Straumur is the source of truth for "was this paid"; Redis only remembers
what we were in the middle of doing.

## 5. Data model

All product data is read from DK and reshaped once in `lib/store/` into a
small, stable type the UI depends on, so a DK field rename touches one file.

```ts
// lib/store/types.ts
type StoreProduct = {
  itemCode: string;            // DK ItemCode — the only id we persist
  slug: string;                // `${slugify(name)}-${itemCode}`, see §6
  name: string;                // Description
  subtitle?: string;           // Description2
  descriptionHtml?: string;    // ExtraDesc1 (+2), sanitised, see §6
  categoryId: StoreCategoryId; // mapped from DK Group, see below
  dkGroup: string;
  priceIsk: number;            // UnitPrice1WithTax rounded to whole kr
  salePriceIsk?: number;       // PropositionPrice when inside its date range
  vatPercent: number;          // TaxPercent (24 or 11)
  stock: { qty: number; state: "in_stock" | "low" | "backorder" | "sold_out"; deliveryDays?: number };
  images: { id: number; alt: string; hash: string }[]; // DK attachments with ShowOnWeb
  unit?: string;               // UnitCode
  weightKg?: number;           // NetWeight, for later shipping tiers
  modified: string;            // RecordModified
};

type StoreCategory = {
  id: string;                  // route segment, e.g. "fyrir-okumanninn"
  title: string; blurb: string;
  dkGroups: string[];          // DK product groups that land here
  servicePage?: string;        // existing þjónusta route to cross-link, e.g. "/fyrirokumannin"
  image: Img;
};

type CartLine = { itemCode: string; qty: number };          // client only
type Checkout = {                                             // Redis: checkout:<id>
  id: string;                  // ULID; also Straumur `reference`
  status: "pending" | "paid" | "fulfilled" | "failed" | "expired";
  lines: { itemCode: string; name: string; qty: number; unitPriceIsk: number; vatPercent: number }[];
  delivery: { method: "pickup" | "post"; priceIsk: number; address?: Address };
  customer: { name: string; email: string; phone: string; kennitala?: string; note?: string };
  totalIsk: number;
  straumur?: { checkoutReference: string; payfacReference?: string };
  dk?: { customerNumber: string; orderNumber: number };
  createdAt: string; paidAt?: string; fulfilledAt?: string; error?: string;
};
```

Category mapping lives in code (`lib/store/categories.ts`) and is the one
thing Hlynur and Einar agree on by hand: which DK `Group` codes show in
which store category, and which existing þjónusta page each category
cross-links to. Products whose group is unmapped are hidden and listed in a
build-time warning so nothing silently disappears. **[Hlynur]** supplies
the group list; **[call]** initial categories mirror the site's existing
ones where products are plausible: Fyrir ökumanninn, Hífi- & festibúnaður,
Vetrarbúnaður (chain accessories, spikes), Síubúnaður (filters), Smurkerfi
(consumables). Sturtuvagnar, Öryggisrúður and plógar stay quote-only.

Stock state **[call]**: default warehouse from `GET /company`
(`Product.Warehouse.Default`, overridable by `DK_WAREHOUSE`); qty > 5 →
"Á lager"; 1–5 → "Fá eintök eftir"; ≤ 0 and (`AllowNegativeInventiry` or
`DeliveryTime` > 0) → "Sérpöntun, afgreiðslutími ~N dagar"; otherwise
"Uppselt" with the buy button disabled and a "Láta mig vita" link to the
contact form. Exact numbers are never shown.

Prices **[call]**: B2C, shown incl. VAT, whole krónur, formatted "12.900 kr.".
A `PropositionPrice` inside its date window is the sale price, with the
normal price struck through. Straumur amount = krónur × 100.

## 6. Pages and routes

New routes (all Icelandic, same PageHero/Breadcrumb/Container chrome):

| Route | Renders | Cache |
|---|---|---|
| `/verslun` | category cards with product counts, "Nýtt í verslun" strip | ISR 1 h + tag `dk-products` |
| `/verslun/[flokkur]` | product grid for a StoreCategory, filters by DK group, sort | same |
| `/verslun/vara/[slug]` | product page: gallery, price, stock, description, qty + "Setja í körfu", sibling products, link to related þjónusta page | ISR 1 h + tag `dk-product:<itemCode>` |
| `/karfa` | cart (client state) with server-quoted prices and stock | dynamic |
| `/karfa/greida` | checkout form → server action → redirect to Straumur | dynamic |
| `/pontun/[id]` | return page: confirming / confirmed / failed | dynamic, no-store |
| `/verslun/skilmalar` | terms, returns (14-day right of withdrawal), delivery | static **[Hlynur]** text |
| `/api/straumur/webhook` | payment events | — |
| `/api/dk/webhook` | DK product/stock change → revalidateTag | — |
| `/api/cron/dk-retry` | retries queued DK order writes (Vercel cron, 10 min) | — |
| `/api/vara/[itemCode]/mynd/[id]` | proxies a DK attachment, `Cache-Control: immutable`, URL carries the MD5 hash | CDN |
| `/verslun/search-index.json` | store rows merged client-side into the existing search dialog | ISR 1 h |

Slug **[call]**: `slugify(Description)-ItemCode`; lookup is by the trailing
ItemCode so a renamed product's old links still resolve and 301 to the new
slug. Sitemap gains the store routes from the cached catalog; product pages
emit `Product`/`Offer` JSON-LD with price and availability.

Existing pages: each mapped þjónusta page gets a server component
`StoreProductsStrip` (up to 8 products from its category, "Sjá allt í
vefverslun" link) placed above `ContactCta`. The header gains a cart icon
with a count badge next to the search button; nav and footer gain
"Vefverslun". The home grid is untouched.

Descriptions **[call]**: Phase 1 renders `ExtraDesc1/2` as plain-text
paragraphs (tags stripped, no new dependency). If Hlynur wants bold/lists,
adopt a pinned, well-established sanitiser (e.g. `sanitize-html`, low risk)
with a small allowlist. Never `dangerouslySetInnerHTML` raw DK HTML.

Images **[call]**: DK attachments flagged `ShowOnWeb` are the gallery, in
DK order, proxied through our route so the DK token never reaches the
browser and the CDN caches them. No images → the category image is shown
and the product is listed in the build-time warning.

## 7. Catalog sync and caching

- One DK client, `lib/dk/client.ts`: typed `fetch` wrappers, bearer header,
  `include=` field lists so responses stay small, paging helper, 8 s
  timeout, structured error type `DkError { status, path, body }`. Token is
  read on the server only.
- Reads go through Next's data cache: `fetch(..., { next: { revalidate:
  3600, tags: [...] } })` (confirm the Next 16 API in
  `node_modules/next/dist/docs` before coding). The whole web-flagged
  catalog (`/Product/page/{n}/200?onweb=true&inactive=false&include=…`)
  is cached under `dk-products`; category pages and the strip derive from
  it in memory. A product page fetches its own item under `dk-product:<code>`.
- Push: Phase 1 registers a DK webhook (`POST /admin/webhook`, options
  `Product` + `ProductTransactions` + `SalesOrder`, `AuthorizationScheme:
  Bearer`, `AuthorizationValue: DK_WEBHOOK_SECRET`, `FailureEmail`). Our
  handler checks the bearer, reads the ItemCodes in `Objects[]`, calls
  `revalidateTag` for each and for `dk-products`, and returns 200. Hourly
  ISR is the floor if webhooks are silent.
- Live reads (no cache) happen in exactly two places: the cart quote (price
  + stock for the lines in the cart) and `startCheckout` (§8). Everything a
  shopper browses may be up to an hour stale; nothing they pay for is.
- Stock after a sale: `fulfil()` revalidates the sold items' tags.

## 8. Cart and checkout

Cart **[call]**: React context + `useReducer`, persisted to
`localStorage["skralli-cart-v1"]` as `{itemCode, qty}[]` only; hydrated
after mount to avoid SSR mismatch. Prices and stock are never stored
client-side; the cart page calls a server action `quoteCart(lines)` that
returns current prices/stock and flags lines that changed or sold out. Max
99 per line. No account needed.

Checkout form at `/karfa/greida`: name, email, phone, kennitala (optional,
used to match an existing DK customer), delivery choice (**[call]** "Sækja
í Móhellu 3F, Hafnarfirði — 0 kr." or "Senda með Póstinum — fast gjald
`SHIPPING_FLAT_ISK`" with address fields), note, checkbox accepting
`/verslun/skilmalar`. Honeypot and the same validation style as the contact
form (`lib/email/contact.ts`).

Server action `startCheckout(form, lines)`:
1. Live-quote lines from DK (uncached). If DK is unreachable → return
   `{ ok: false, error: "Ekki næst í lagerkerfið…" }`; no money is taken.
2. Drop/flag sold-out lines, recompute total, create `Checkout` (status
   `pending`) in Redis, TTL 30 days.
3. `POST hostedcheckout` with `reference = checkout.id`, `amount =
   total×100`, `currency: "ISK"`, `returnUrl = /pontun/<id>`, abandon URL
   `/karfa?hætt=1`, items list, shopper email, `culture: "is-IS"`, session
   lifetime 1 h. Store `checkoutReference`, redirect to `url`.

Payment webhook `/api/straumur/webhook`:
1. Verify the `Authorization` header matches `STRAUMUR_WEBHOOK_KEY` and
   the `hmacSignature` per Straumur's HMAC page (builder reads
   `docs.straumur.is/webhooks/payment/hmac-validation`). Reject otherwise.
2. `SETNX straumur:event:<payfacReference>` → duplicate → 200.
3. `success:"false"` → record the decline on the Checkout, 200.
4. `success:"true"` → load Checkout by `merchantReference`, verify
   `amount`/`currency` match, mark `paid`, enqueue `fulfil(id)` (run
   inline; it is a few 100 ms DK calls), 200.

Return page `/pontun/[id]`: shows "Greiðsla staðfest" when the Checkout is
`paid`/`fulfilled` with the DK order number; otherwise "Við staðfestum
greiðsluna…" and polls a server action every 2 s for 60 s which checks
Redis and, as a fallback, Straumur's status endpoint (Completed → run
`fulfil` under the same lock). After 60 s: "Þú færð tölvupóst innan
skamms" plus contact details. The return URL is never treated as proof of
payment.

## 9. Writing the order to DK

`fulfil(checkoutId)` (idempotent: `SETNX fulfil:<id>` lock, re-entrant on
failure):
1. Customer: `GET /Customer/search/<kennitala>` if given, else
   `/Customer/search/<email>`; exact match on SSNumber/Email wins. No match →
   `POST /Customer` with Name, SSNumber, Email, Phone, Address1, ZipCode,
   City, `Group: DK_WEB_CUSTOMER_GROUP` ("vefur"), `SalesPerson: "vefur"`,
   `PaymentTerm: "stgr"`, `CountryCode: "IS"`. **[Hlynur]** creates the
   group and salesperson in DK; the builder confirms whether DK assigns
   `Number` or we must (fallback: kennitala, else `V` + timestamp).
2. Order: `POST /sales/order` with `Customer.Number`, `Reference:
   checkout.id`, `CustomerOrderNumber: payfacReference`, `Text1: "Vefverslun
   — greitt með korti (Straumur <payfacReference>)"`, `Text2: delivery +
   note`, `Warehouse`, `Lines[{ItemCode, Quantity, UnitPriceWithTax, Text}]`
   from the Checkout snapshot plus one delivery line `DK_SHIPPING_ITEMCODE`
   when posted. Payment settlement fields (`SettledType`, `SettledAmount`)
   are set if the live DK accepts them; otherwise the paid status lives in
   `Text1` and Hlynur settles in DK. **[Hlynur/DK support]** confirm how a
   card-paid web order should be booked in their DK setup.
3. Store `dk.orderNumber`, status `fulfilled`.
4. Emails via the existing Resend client: customer confirmation (lines,
   total, delivery, order number, terms link) and an internal notification
   to `CONTACT_TO` with the DK order number. DK's own `POST
   /sales/order/{n}/email` is not used (brand consistency) **[call]**.
5. `revalidateTag` for the sold items.

Failure at step 1–2 (DK down or rejects): Checkout status `paid` with
`error`, pushed to Redis list `dk-retry`; `/api/cron/dk-retry` (Vercel
cron every 10 min, `CRON_SECRET`) re-runs `fulfil`. After the first
failure an alert email goes to Skralli and Einar with the full order so it
can be keyed by hand if DK stays down; after 48 h of failures it alerts
again and stops retrying. The customer's confirmation email is still sent
at step 4 even if DK failed (we have their money; they get their receipt).

## 10. Failure modes

| Situation | Behaviour |
|---|---|
| DK down, pages cached | Serve cached catalog (stale-while-revalidate). Nothing visible changes. |
| DK down, nothing cached (cold deploy) | `/verslun*` render a "Vefverslunin er í viðhaldi" state with ContactCta; þjónustur pages render without the strip; build does not fail. |
| DK down at `startCheckout` | Friendly error, no payment started. |
| DK down after payment | Retry queue + alert emails (§9). Customer still gets a receipt. |
| Straumur webhook never arrives | Return page polls status; `Completed` triggers `fulfil`. A daily cron also sweeps `pending` Checkouts older than 2 h and reconciles via the status endpoint. |
| Duplicate webhook | `payfacReference` SETNX. |
| Amount mismatch (tampered return, partial) | Logged, Checkout marked `failed`, alert email; not fulfilled. |
| Price changed between cart and checkout | Checkout always re-quotes from DK and shows the diff before redirecting. |
| Sold out between checkout and payment | Order is still created (DK allows negative stock or back-order); confirmation says "sérpöntun" for that line. Over-selling is accepted and handled by Hlynur, matching how DK's own webshop module behaves **[call]**. |
| Redis unavailable | `startCheckout` fails closed; webhook returns 500 so Straumur retries. |

## 11. Security and privacy

- Tokens only on the server: `DK_API_KEY`, `STRAUMUR_API_KEY`,
  `STRAUMUR_TERMINAL_ID`, `STRAUMUR_HMAC_KEY`, `STRAUMUR_WEBHOOK_KEY`,
  `DK_WEBHOOK_SECRET`, `CRON_SECRET`, `KV_*` (from the integration).
  Mark them Sensitive on Vercel; use staging Straumur values on Preview.
- No card data ever reaches us (hosted checkout).
- Webhooks verified (bearer + HMAC), idempotent, and bodies size-limited.
- Server actions rate-limited per IP (Vercel Firewall rule or a Redis
  counter), honeypot on checkout, quantities and totals recomputed
  server-side.
- Personal data: name, contact and address go to DK (Skralli's processor)
  and the email to Resend; `/personuvernd` gets a paragraph naming Straumur
  and dk hugbúnaður. Redis Checkouts expire after 30 days.
- Image proxy allowlists ItemCodes present in the catalog.

## 12. Operations

- Structured logs with `checkoutId` on every step; Vercel log drain not
  required initially.
- Alert emails (above) are the only alerting.
- `npm run dk:probe` (Phase 0 script) prints catalog counts, unmapped
  groups, products without images, and a sample product, so data problems
  are visible before they reach the site.
- `vercel.json`/`vercel.ts` crons: `dk-retry` every 10 min, `reconcile`
  daily.

## 13. Testing

- vitest, following `tests/send-contact.test.ts`'s injectable pattern:
  DK and Straumur clients take a `fetch`-like function so mapping,
  stock-state rules, price formatting, slug round-trips, HMAC verification,
  idempotency and `fulfil` sequencing are unit-tested with recorded JSON
  fixtures from the demo company.
- Playwright: cart → checkout → (mock Straumur redirect) → return page, and
  the webhook endpoint with a signed fixture.
- Manual acceptance per phase (below) against Straumur staging, then one
  real low-value purchase on live before announcing.

## 14. Phases

Phase 0 — Grunnur (no visible change)
- Real DK token on Vercel (Production + Preview) and in `.env.local`.
- `lib/dk/client.ts`, types, `scripts/dk-probe.mjs`.
- **[Hlynur]**: flag products `ShowItemInWebShop`, check prices/stock,
  upload product photos as attachments with ShowOnWeb, confirm the DK
  group → category map, create "vefur" customer group/salesperson and a
  delivery item, open a Straumur test agreement and share staging keys.
- Done: the probe lists Skralli's real web products with price, stock and
  images, and the mapping covers every flagged product.

Phase 1 — Vörulisti
- `/verslun`, category and product pages, `StoreProductsStrip` on mapped
  þjónustur, nav/footer links, search rows, sitemap, JSON-LD, image proxy,
  ISR + DK webhook revalidation, maintenance state.
- Product CTA is "Senda fyrirspurn" (prefills the existing contact form
  with the product) until Phase 2 ships, so the catalog is useful on day
  one and Hlynur can review data quality on the live site.
- Done: live on skralli.is; a price/stock change in DK is visible within a
  minute via webhook and within an hour without.

Phase 2 — Karfa og greiðsla
- Upstash Redis integration (official Marketplace, low risk), cart, cart
  page, checkout form, `startCheckout`, Straumur hosted checkout, webhook,
  return page, `fulfil`, emails, retry cron, reconcile cron, terms page,
  personuvernd paragraph, analytics events (`add_to_cart`,
  `begin_checkout`, `purchase`) through the existing consent gate.
- Done: a real card purchase on live produces a DK sales order with the
  right customer, both emails arrive, and killing DK mid-test produces the
  alert email and a successful retry.

Phase 3 — Mínar síður (sketch, separate design)
- Magic-link login by email (Resend), matched to a DK customer by
  email/kennitala; order and invoice history from
  `/Customer/{n}/order|invoice`; saved address; B2B customers see their
  DK price group / discounts and may choose "greiða með reikningi" when
  their DK payment term allows. The DK `prices/discount` endpoint is BETA
  and is not relied on before then.

## 15. Decisions made here (review these)

1. DK is the only product/order database; Redis holds only in-flight state.
2. Straumur hosted checkout (redirect), immediate capture, ISK only.
3. Catalog freshness: 1 h ISR floor + DK webhooks; live reads only at cart
   quote and checkout.
4. Stock shown as four states, never as numbers; over-selling accepted.
5. Flat delivery: pickup free or Pósturinn flat fee; fee amount and item
   code from env.
6. Descriptions as plain text in Phase 1.
7. Customer matched by kennitala, then email; else created in group "vefur".
8. Our own Resend emails, not DK's order email.
9. Phase 1 ships without a cart, with an inquiry CTA.
10. Design doc location `docs/plans/` as requested (repo convention so far
    is `docs/superpowers/specs/`; move if preferred).

## 16. Open items for Einar / Hlynur

- Real DK token (blocks Phase 0).
- Which DK groups map to which store categories; delivery fee and item code.
- How a card-paid web order should be booked in DK (settlement fields vs.
  text), and whether DK assigns customer numbers on create.
- Straumur agreement: terminal identifier, whether Apple Pay / Icelandic
  wallets are enabled on the contract.
- Terms/returns text for `/verslun/skilmalar`.

## Appendix A — DK endpoints used

| Purpose | Endpoint |
|---|---|
| Company/default warehouse | `GET /api/v1/company` |
| Catalog page | `GET /api/v1/Product/page/{page}/{count}?onweb=true&inactive=false&include=…` |
| Catalog count | `GET /api/v1/Product/info/count?onweb=true&inactive=false` |
| One product | `GET /api/v1/Product/{itemCode}` |
| Deltas (fallback sync) | `GET /api/v1/Product/modified/{iso}/{page}/{count}` |
| Groups | `GET /api/v1/productgroup` |
| Image | `GET /api/v1/Product/{itemcode}/attachment/{id}` |
| Customer lookup | `GET /api/v1/Customer/search/{value}/{max}` |
| Customer create | `POST /api/v1/Customer` (CustomerModel) |
| Order create | `POST /api/v1/sales/order` (Order.Head with Lines) |
| Order read | `GET /api/v1/sales/order/{id}`, `/reference/{reference}` |
| Webhook register | `POST /api/v1/admin/webhook` (Options: Product, ProductTransactions, SalesOrder) |
| Payment metadata | `GET /api/v1/general/payment/term`, `/sales/payment/type` |

Product fields requested: ItemCode, Description, Description2, ExtraDesc1,
ExtraDesc2, Group, UnitPrice1WithTax, PropositionPrice,
PropositionDateFrom/To, TaxPercent, UnitCode, NetWeight, DeliveryTime,
AllowNegativeInventiry, Inactive, ShowItemInWebShop,
TotalQuantityInWarehouse, Warehouses, Attachments, RecordModified.

## Appendix B — Straumur endpoints used

| Purpose | Endpoint |
|---|---|
| Start | `POST {host}/api/v1/hostedcheckout` (`X-API-Key`) |
| Status | `GET {host}/api/v1/hostedcheckout/status/{checkoutReference}` → New/Completed/Expired |
| Events in | Authorization webhook → `/api/straumur/webhook` (bearer + `hmacSignature`, idempotent on `payfacReference`) |
| Later | `/refund`, `/reverse` for returns (Phase 2 ops, done from Straumur's portal initially) |

Hosts: staging `https://checkout-api.staging.straumur.is`, live
`https://greidslugatt.straumur.is`. Docs: https://docs.straumur.is
(hosted-checkout/basic-checkout-request, optional-parameters,
hosted-checkout-status, webhooks/payment/authorization-event,
webhooks/payment/hmac-validation, get-started/api-keys).
