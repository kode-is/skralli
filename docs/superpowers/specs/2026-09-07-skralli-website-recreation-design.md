# Skralli.is recreation — design spec

Date: 2026-09-07
Status: approved by Einar (Kode Solutions) in chat, 2026-09-07

## Goal

Recreate skralli.is, currently a Framer site, as a self-hosted Next.js site
owned by Kode/Skralli. The new site must look and read the same as the live
site: every page, every piece of text verbatim, every image and logo. The
contact form must send email through Resend. The codebase must leave room for
a later customer login with DK (bókhaldskerfi) and Straumur payments, but that
work is explicitly out of scope here.

## Non-goals

- Redesigning or "improving" copy, layout, or imagery. This is a faithful copy.
- Customer login, DK integration, Straumur payments (later project).
- Netverslun / checkout.
- CMS. Content lives in typed data files in the repo.

## Source of truth

| Item | Source |
|---|---|
| Page list | `https://skralli.is/sitemap.xml` plus nav links not in the sitemap (category pages) |
| Text | Live HTML of each page, extracted verbatim |
| Images | `framerusercontent.com` URLs in the live HTML, downloaded at full resolution (strip Framer resize query params) |
| Skralli logos + favicon | Hlynur's Drive folder "Skralli x Kode myndir fyrir netsíðu" → "Skralli logo" → "SKRALLI Logo png" (Drive folder id `15Bu8sxxg-upXTFdse7V8vx-7NYX10QGm`) and `favicon-skralli-blatt-hvitt.png` (`1omTODdIZUBao2VWpMle86C8g3JQ7md8m`) |
| Higher-res originals | Same Drive root (`15U-jjfzt4Nz-IIA289rVkz26hY178P6i`), per-brand subfolders. Swap in only where a Drive file is clearly the same photo at higher resolution than the live-site copy. |
| Font | NowAlt (Thin, Light, Regular, Medium, Bold, Black) `.woff`, in `assets/fonts/`. Replaces Figtree used on the live site. |
| Brand colors | `#005380` dark blue, `#01A8DC` medium blue, `#83D4F3` light blue; accents `#0A8754`, `#FAC748` (from Hlynur's "Vörukynningar" doc). Exact values used on each element come from the live CSS. |

## Page inventory (57 routes)

- `/` home
- `/um-okkur`, `/thjonusta`, `/hafa-samband`, `/vorumerki`
- Category pages: `/smurkerfi`, `/sturtuvagnar`, `/oryggisrudur`,
  `/vetrarbunadur`, `/fyrirokumannin`, `/hifi-festibunadur`, `/siubunadur`
- Brand pages: `/vorumerki/{um-beka,lilleseth-kjetting,gigant,pebe,hammerglass,bmair}`
- Sturtuvagnar: 5 group pages (`fjorhjola-minigrofuvagnar`, `verktakavagnar`,
  `landbunadarvagnar`, `hjolagrofuvagnar`, `velaflutningavagnar`) and 29
  product pages (`hjolagrofuvagn-gd2-6x` … `landbunadarvagn-gd150`)
- Hífi- og festibúnaður: `hifikedjur`, `bindikedjur-strekkjarar`, `stroffur`,
  `stroffur/{hringstroffur,flatstroffur,drattastroffur}`, `aukabunadur`,
  `bordastrekkjarar`
- `/404` → Next.js `not-found.tsx`

Every current URL keeps working. No redirects needed unless the scrape finds
inconsistencies (e.g. trailing-slash variants), which get `next.config`
redirects.

## Architecture

**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS 3, `next/font/local`
for NowAlt, `next/image` for all imagery. Same shape as the Totus repo so the
team already knows it. Deployed on Vercel from `github.com/kode-is/skralli`.

**Rendering:** Everything is static (`generateStaticParams` for product and
sub-pages). No database. The only server code is the contact-form server
action.

**Layout of the repo:**

```
app/
  layout.tsx            root layout: fonts, Header, Footer, metadata
  page.tsx              home
  not-found.tsx
  sitemap.ts, robots.ts
  actions.ts            submitContact server action
  um-okkur/  thjonusta/  hafa-samband/  vorumerki/  vorumerki/[slug]/
  smurkerfi/  oryggisrudur/  vetrarbunadur/  fyrirokumannin/  siubunadur/
  sturtuvagnar/  sturtuvagnar/[slug]/
  hifi-festibunadur/  hifi-festibunadur/[...slug]/
components/             Header, Footer, Hero, BrandStrip, StatCounter, TeamCard,
                        ProductCard, ContactForm, Section primitives…
lib/
  site.ts               company details, nav, social links
  brands.ts             6 brand pages
  categories.ts         7 category pages
  sturtuvagnar.ts       groups + 29 products (specs, images, text)
  hifi.ts               hífi- og festibúnaður tree
  email/client.ts       lazy Resend client (pattern from bera-wallet)
public/
  images/<page-or-collection>/…   downloaded assets, descriptive filenames
  logos/                Skralli logo variants + brand logos
  favicon.ico, icon.png
assets/fonts/           NowAlt woff (source; copied/used via next/font/local)
docs/superpowers/specs/ this file
docs/superpowers/plans/ implementation plan
```

**Data flow:** Page components import from `lib/*.ts` and render. Product and
brand pages are one template each plus a data record. This keeps the 34
sturtuvagnar pages as data, and gives the later login/DK work a clean place to
attach product identifiers.

## Contact form (Hafa samband)

Fields, verbatim from the live site: `Nafn` (text), `Netfang` (email),
`Símanúmer` (tel), `Skilaboð` (textarea), submit label `Senda!`.

Flow:
1. Client component with basic required-field validation and Icelandic error
   copy.
2. Server action `submitContact` re-validates, then calls Resend once:
   - to: `skralli@skralli.is`
   - from: `EMAIL_FROM` env var (verified sender on skralli.is)
   - reply-to: the submitter's email
   - subject: `Fyrirspurn frá skralli.is – {Nafn}`
   - plain-text and simple HTML body listing the four fields
3. Success state replaces the form with a thank-you message; failure shows an
   inline error and keeps the user's input.

Env vars (set in Vercel, never committed): `RESEND_API_KEY`, `EMAIL_FROM`,
optional `CONTACT_TO` (defaults to `skralli@skralli.is`).

Error handling: missing env vars throw at send time with a clear message; the
action catches and returns `{ ok: false, error }` so the page never 500s.
Honeypot field to drop obvious bots; no third-party captcha.

## Assets

- Scraper collects every `framerusercontent.com/images/...` URL per page,
  strips `?scale-down-to=` / `?width=` params, downloads once, and records a
  manifest `docs/asset-manifest.json` mapping `{page, originalUrl, localPath,
  width, height}` so nothing is lost and reviewers can diff.
- Each image's `alt` text is copied from the live site where present.
- Logos: four Skralli PNGs + PDF source + favicon from Drive. Brand logos
  (Gigant, Hammerglass, Groeneveld-BEKA, Lilleseth, Pebe, BMair) from the live
  site's brand strip.
- Drive swap rule: only when the same photo exists in Drive at larger pixel
  dimensions. Record each swap in the manifest.

## Fonts

`next/font/local` with the six NowAlt weights mapped to CSS weights
100/300/400/500/700/900, `display: swap`, exposed as `--font-now`. Tailwind
`fontFamily.sans` points at it. No Google Fonts request.

## SEO / metadata

Per-page `<title>` and `description` copied from the live `<head>`.
`sitemap.ts` emits the same URL set as today. `robots.ts` allows all.
Open Graph image: the live site's OG image if present, else the hero.

## Testing and verification

- `npm run build` must pass with zero type errors and all 57 routes emitted.
- Playwright script (dev dependency, run locally) visits each route on the new
  site and the live site, extracts visible text, and diffs. Zero text diffs is
  the acceptance bar (whitespace normalized).
- Same script confirms every `<img>` on the live page has a counterpart on the
  new page (by count per page and by manifest).
- Manual visual pass on home, one brand page, one product page, hafa-samband,
  at desktop and mobile widths, compared side by side with the live site.
- Contact form: unit test of `submitContact` with a mocked Resend client
  (success, validation failure, missing env). One real send to
  skralli@skralli.is after the key is in Vercel.

## Work split

- Fable 5.1 (this session): planning, task decomposition, review of subagent
  output, final verification.
- Sonnet subagents: scrape + extract per page, build components and pages,
  run visual comparisons.
- Haiku subagents: bulk asset download, manifest generation, text extraction.

## Later (out of scope, noted so the structure supports it)

- `Innskráning` for Skralli customers, backed by DK as the accounting system,
  payments via Straumur. Will need auth, a DB, and an `/minar-sidur` area.
  Product records in `lib/*.ts` should carry a stable `id` now so they can be
  linked to DK item numbers later.
