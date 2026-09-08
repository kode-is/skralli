import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROUTES, LIVE } from "./routes.mjs";
import { expandAccordions } from "./lib/accordion.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LOCAL = process.env.LOCAL || "http://localhost:3000";
const only = process.argv.slice(2);
const routes = only.length ? only : ROUTES;

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const exact = (s) => new RegExp(`^${escapeRe(s)}$`);
// Icelandic "ö"/"ú" -> "o"/"u": the mangled duplicate header row on
// /hifi-festibunadur/hifikedjur (see below) drops exactly these diacritics.
const stripDiacritics = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const hifiTables = JSON.parse(readFileSync(join(ROOT, "docs/scrape/tables.json"), "utf8")).routes;
const hifiTable = (route, index) => hifiTables.find((r) => r.route === route)?.tables?.[index];

// docs/scrape/tables.json's /hifi-festibunadur/hifikedjur entry lists a
// second "table" (index 1) with headers Name/Email/Role/Status — Framer's
// Table component's built-in demo dataset (Mason Carter, Olivia Lee, ...),
// left on the live page unconfigured. It's a template placeholder, not real
// content (see lib/hifi.ts / scripts/gen-hifi.mjs, which excludes it from
// the generated page data for the same reason), so it's intentionally not
// rendered locally. Every header and cell string of that table is read
// from tables.json at runtime (nothing hardcoded here) and turned into an
// exact, anchored regex so verify doesn't flag them as missing.
const hifikedjurPlaceholderPatterns = (() => {
  const placeholder = hifiTable("/hifi-festibunadur/hifikedjur", 1);
  if (!placeholder || JSON.stringify(placeholder.headers) !== JSON.stringify(["Name", "Email", "Role", "Status"])) {
    throw new Error("hifikedjur placeholder table (Name/Email/Role/Status) not found in tables.json as expected");
  }
  return [...placeholder.headers, ...placeholder.rows.flat()].map(exact);
})();

// hifikedjur's live page *also* renders its real 28-row "Tveggja arma
// hífikeðjur" table a second time as a Framer "Table" widget (search box,
// column filters, "Export CSV", Previous/Next pagination) with the same
// data but two header labels stripped of their Icelandic diacritics
// ("Vörunúmer" -> "Vorunumer", "Vöruheiti" -> "Voruheiti") — confirmed via
// docs/reference/hifi-festibunadur__hifikedjur.mobile.jpg, where it's the
// second table shown, and reproduced here (scripts/gen-hifi.mjs drops this
// duplicate's row data entirely — see that script's module comment). The
// row *data* never shows up as missing here since it's identical to the
// real table's, already rendered once; only the widget's own header labels
// and fixed chrome do. Every string below is either derived from the real
// table's headers (nothing hardcoded) or is generic UI chrome inherent to
// this Framer widget, not scraped content.
const hifikedjurWidgetPatterns = (() => {
  const real = hifiTable("/hifi-festibunadur/hifikedjur", 0);
  const headerVariants = real.headers.flatMap((h) => [h, stripDiacritics(h)]);
  return [
    ...new Set(headerVariants),
    ...new Set(headerVariants.map((h) => `All ${h}`)),
    "Export CSV",
    "Previous",
    "Next",
  ].map(exact).concat(/^Page \d+ of \d+$/i);
})();

// Framer's scroll-triggered stat counters on these two routes hydrate to
// nondeterministic live values (e.g. 482/132) that drift from the canonical
// server-rendered numbers baked into our static recreation (480/130), so a
// bare short-number line should not be treated as "missing" there.
//
// Several /hifi-festibunadur/* routes pair a bare "X í boði" heading with an
// interactive min/max range slider widget (e.g. "Lengdir í boði" showing
// "2 metrar" — "6 metrar") — see components/hifi/HifiSections.tsx's PillRow
// comment. The slider's own numeric endpoint labels are drawn by that
// widget, not present as text anywhere in the scrape (docs/scrape/
// hifi-festibunadur__*.json), so HifiSections renders the heading only.
// Most endpoints happen to coincide with a real spec-table cell value
// already rendered elsewhere on the same page (e.g. hringstroffur's slider
// shows "1 tonn", which is also a real Lyftigeta value) and so never
// surface here at all; the handful that don't are listed per route below,
// each confirmed against that route's actual scrape data.
const IGNORE_MISSING = {
  "/": [/^\d{1,3}$/],
  "/um-okkur": [/^\d{1,3}$/],
  "/hifi-festibunadur/hifikedjur": [
    ...hifikedjurPlaceholderPatterns,
    ...hifikedjurWidgetPatterns,
    // "Leyfilegt vinnuálag (WLL)" slider — its 10.6 tonn max exceeds every
    // row in this page's own "Tveggja arma hífikeðjur" table (max 9.5t),
    // so it isn't derivable from any data this page has.
    exact("2.8 tonn"),
    exact("10.6 tonn"),
  ],
  "/hifi-festibunadur/bindikedjur-strekkjarar": [
    // The live breadcrumb's current-page crumb reads "Hífikeðjur" — a
    // copy-paste leftover from the hífikeðjur page this one was cloned
    // from (docs/scrape/hifi-festibunadur__bindikedjur-strekkjarar.json
    // block 8 scrapes this exact text). The [...slug] page derives the
    // breadcrumb from the real page title instead of reproducing the bug.
    exact("Hífikeðjur"),
    // "Þyngdarþol í boði", "Stærðir í boði", "Breidd í boði" and "Leyfilegt
    // vinnuálag (WLL)" sliders — none of these five endpoints match a cell
    // in this page's own table (max 7,5t for the G120 rows actually
    // scraped, vs. the WLL slider's 21,6 tonn).
    exact("4 tonn"),
    exact("21 tonn"),
    exact("6 mm"),
    exact("16 mm"),
    exact("13 mm"),
    exact("4.0 tonn"),
    exact("21.6 tonn"),
  ],
  // "Lengd í boði" slider min label — its "0.5 metrar"/"1 metrar" (plural)
  // don't match either page's own table cells, which use "meter" for the
  // shortest lift height (e.g. hringstroffur's "0.5 meter", singular).
  "/hifi-festibunadur/stroffur/hringstroffur": [exact("0.5 metrar")],
  "/hifi-festibunadur/stroffur/flatstroffur": [exact("1 metrar")],
};

// A browser's innerText joins adjacent cells of a real <table> row with a
// tab character (spec behavior for display:table-cell boxes) — components/
// SpecTable.tsx (Task 12) is this site's first actual <table>, and the live
// site's own spec tables are Framer div-grids with one line of text per
// cell, not per row. Treating a tab the same as a newline here (before the
// old space-collapsing logic, which would otherwise flatten "A\tB\tC" into
// "A B C" and turn a whole table row into one incomparable blob) keeps both
// sides comparable cell-by-cell without touching any non-table route, since
// nothing else on the site renders a real table.
const norm = (s) =>
  s.replace(/ /g, " ").replace(/\t/g, "\n").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

async function capture(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
  // Framer's stat counters animate on scroll-into-view; give them time to settle.
  await page.waitForTimeout(3000);
  // expand accordions the same way as scrape.mjs
  await expandAccordions(page);
  await page.waitForTimeout(400);
  return page.evaluate(() => ({
    text: document.body.innerText,
    // Count unique visible image sources, not raw <img> tags: Framer renders
    // some photos twice (e.g. a hover-crossfade layer stacked on the base
    // image, or marquee tracks that duplicate their items for a seamless
    // loop) — those duplicates are never additional content, so counting
    // raw tags makes the live page's count drift from an equivalent,
    // non-duplicating local recreation. A plain `src.split("?")[0]` is not
    // enough to key on, though: Next.js's built-in image optimizer proxies
    // every local raster image through the same "/_next/image" path and
    // encodes the real file in a `url` query param, so a naive query-strip
    // collapsed every local image to that one path (verified: it dropped
    // e.g. "/" from img=22/22 raw tags to img=22/6 unique-by-path-only,
    // while the live/Framer CDN already puts the real filename in the path
    // and only varies size via query params). Unwrap that proxy first.
    images: new Set(
      [...document.images]
        .filter(i => i.getBoundingClientRect().width > 0)
        .map(i => {
          const src = i.currentSrc || i.src;
          try {
            const u = new URL(src, location.href);
            if (u.pathname === "/_next/image" && u.searchParams.has("url")) {
              return decodeURIComponent(u.searchParams.get("url"));
            }
            return u.origin + u.pathname;
          } catch {
            return src.split("?")[0];
          }
        })
    ).size,
  }));
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const rows = []; let failures = 0;
for (const r of routes) {
  const live = await capture(page, LIVE + r);
  const local = await capture(page, LOCAL + r);
  const a = new Set(norm(live.text).split("\n")), b = new Set(norm(local.text).split("\n"));
  const missingAll = [...a].filter(x => !b.has(x)); const extra = [...b].filter(x => !a.has(x));
  const ignorePatterns = IGNORE_MISSING[r] || [];
  const missing = missingAll.filter(x => !ignorePatterns.some(re => re.test(x)));
  const ignored = missingAll.length - missing.length;
  const imgOk = local.images >= live.images;
  const ok = missing.length === 0 && imgOk;
  if (!ok) failures++;
  rows.push(`## ${r} ${ok ? "OK" : "FAIL"}\n- images live/local: ${live.images}/${local.images}${imgOk ? "" : " (missing)"}\n${missing.length ? "- missing text:\n" + missing.map(m => `  - ${m}`).join("\n") : ""}${extra.length ? "\n- extra text:\n" + extra.map(m => `  - ${m}`).join("\n") : ""}\n`);
  console.log(`${ok ? "OK  " : "FAIL"} ${r} missing=${missing.length} extra=${extra.length} img=${live.images}/${local.images} ignored=${ignored}`);
}
await browser.close();
await writeFile("docs/verify-report.md", `# Verify report ${new Date().toISOString()}\n\n${rows.join("\n")}`);
process.exit(failures ? 1 : 0);
