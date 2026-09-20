# Site search — design (approved by Einar 2026-09-20)

**Goal.** Let visitors search skralli.is for pages, products, brands, FAQ answers and spec-table part numbers, with no external service.

**Decisions (Einar):** scope = everything including spec-table rows; entry point = header icon opening an overlay (no results page, no always-visible field).

**Architecture.** The index is a static JSON document produced at build time by a route handler (`app/search-index.json/route.ts`, `dynamic = "force-static"`) from the same data the pages render from (`lib/sturtuvagnar.ts`, `lib/hifi.ts`, `lib/brands.ts`, `lib/categories.ts`, the FAQ data, and `docs/scrape/*.json` for page headings and body text). It therefore cannot drift from the site. The browser fetches it once, the first time search is opened, and matches locally with a small dependency-free matcher.

**Matching.** Icelandic-aware normalisation (lower-case, diacritics folded, ð→d, þ→th, æ→ae), light suffix stemming so keðja/keðjur/keðju meet, prefix matching, all query words must match, weighted by field (title > keywords > headings > text). Part numbers are also indexed in a compact form (letters and digits only) so "taj 025" finds "TAJ 0,25".

**UI.** Magnifier button in the header (desktop: between the nav and the "Hafa samband" button; phone: in the bar beside the hamburger). Opens a modal overlay: one input, results grouped Síður / Vörur / Vörunúmer / Vörumerki / Spurt & svarað, keyboard navigation, `/` and ⌘K/Ctrl+K shortcuts, Escape closes and restores focus. A part-number result links to its table row (`#row-…`), which is highlighted via `:target`. All copy in Icelandic.

**Non-goals.** No results page, no analytics, no fuzzy typo correction beyond the normalisation above, no search of image alt text.

**Testing.** Unit tests (written first) for normalisation, stemming, ranking and part-number matching; a test that every sitemap route appears in the index; Playwright checks for the overlay's keyboard and focus behaviour. `npm run verify` must stay green (the button has no visible text).
