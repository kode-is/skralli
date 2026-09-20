// Pure `buildIndex()`: assembles the site search index from the same data
// the pages themselves render from, so it cannot drift from the site (see
// docs/superpowers/specs/2026-09-20-site-search-design.md). Reads
// docs/scrape/*.json from disk (Node fs), so this must only run server-side
// (the route handler) or in tests/build scripts — never from the browser.
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sitemap from "@/app/sitemap";
import { brands } from "@/lib/brands";
import { faqItems } from "@/lib/faq";
import { hifiPages, type HifiTable } from "@/lib/hifi";
import { wagonGroups, wagons } from "@/lib/sturtuvagnar";
import { rowId } from "./row-id";
import type { SearchEntry } from "./types";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCRAPE_DIR = join(ROOT, "docs", "scrape");
const SITE_URL = "https://skralli.is";

// docs/scrape/<file>.json's raw block shapes (see scripts/scrape.mjs) —
// looser than lib/hifi.ts's HifiBlock: the raw scrape still contains image
// blocks, breadcrumb link blocks, and (for hifi-festibunadur pages) unparsed
// table cell text, none of which `buildIndex` needs.
type ScrapeBlock = { type: string; text?: string; level?: number };
type ScrapePage = { blocks: ScrapeBlock[] };

function scrapeFileFor(pathname: string): string {
  const name = pathname === "/" ? "home" : pathname.slice(1).replace(/\//g, "__");
  return join(SCRAPE_DIR, `${name}.json`);
}

function loadScrape(pathname: string): ScrapePage | undefined {
  const file = scrapeFileFor(pathname);
  if (!existsSync(file)) return undefined;
  return JSON.parse(readFileSync(file, "utf8")) as ScrapePage;
}

const collapseWhitespace = (s: string) => s.replace(/\s+/g, " ").trim();

/** Route name humanized as a last resort when a route has no scrape file
 * (none currently lack one — see the module-comment deviation note below). */
function fallbackTitle(pathname: string): string {
  const last = pathname.split("/").filter(Boolean).pop() ?? pathname;
  return last
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Every sub-page's raw scrape blocks carry the "Forsíða › Crumb › Crumb"
 * breadcrumb trail as a `link` block ("Forsíða") followed by alternating
 * ">" separators and crumb text/links, always running right up to the
 * page's first real content heading. Dropping that whole run keeps the
 * breadcrumb's repeated site-name/parent-page text out of the index.
 */
function stripBreadcrumb(blocks: ScrapeBlock[]): ScrapeBlock[] {
  const start = blocks.findIndex((b) => b.type === "link" && b.text === "Forsíða");
  if (start === -1) return blocks;
  const rest = blocks.slice(start + 1);
  const nextHeading = rest.findIndex((b) => b.type === "heading");
  const end = nextHeading === -1 ? blocks.length : start + 1 + nextHeading;
  return [...blocks.slice(0, start), ...blocks.slice(end)];
}

type ParsedPage = {
  pathname: string;
  title: string;
  headingTexts: string[];
  bodyTexts: string[];
  usedFallback: boolean;
};

function parseScrapePage(pathname: string): ParsedPage {
  const scrape = loadScrape(pathname);
  if (!scrape) {
    return { pathname, title: fallbackTitle(pathname), headingTexts: [], bodyTexts: [], usedFallback: true };
  }
  const blocks = stripBreadcrumb(scrape.blocks);
  const h1 = blocks.find((b) => b.type === "heading" && b.level === 1);
  const title = h1?.text ? collapseWhitespace(h1.text) : fallbackTitle(pathname);
  const headingTexts = blocks
    .filter((b) => b.type === "heading" && (b.level === 2 || b.level === 3) && b.text)
    .map((b) => collapseWhitespace(b.text!));
  const bodyTexts = blocks.filter((b) => b.type === "text" && b.text).map((b) => collapseWhitespace(b.text!));
  return { pathname, title, headingTexts, bodyTexts, usedFallback: !h1?.text };
}

/** Texts (headings or body paragraphs) repeated on more than half of all
 * page routes are nav/footer/CTA boilerplate (e.g. every route's "Sendu
 * okkur fyrirspurn" contact-CTA heading), not page-specific content. */
function computeBoilerplate(pages: ParsedPage[]): Set<string> {
  const counts = new Map<string, number>();
  for (const page of pages) {
    const unique = new Set([...page.headingTexts, ...page.bodyTexts]);
    for (const text of unique) counts.set(text, (counts.get(text) ?? 0) + 1);
  }
  const threshold = pages.length / 2;
  const boilerplate = new Set<string>();
  for (const [text, count] of counts) if (count > threshold) boilerplate.add(text);
  return boilerplate;
}

const VORUMERKI_PREFIX = "/vorumerki";
const CATEGORY_PAGES = new Set([
  "/thjonusta",
  "/smurkerfi",
  "/oryggisrudur",
  "/vetrarbunadur",
  "/fyrirokumannin",
  "/siubunadur",
  "/hifi-festibunadur",
  "/sturtuvagnar",
]);

/** Short kind label shown as a page result's subtitle — purely a UI nicety,
 * not exercised by any test, so a simple route-shape heuristic is enough. */
function kindLabel(pathname: string): string {
  if (pathname === VORUMERKI_PREFIX || pathname.startsWith(`${VORUMERKI_PREFIX}/`)) return "Vörumerki";
  if (pathname.startsWith("/sturtuvagnar/") || pathname.startsWith("/hifi-festibunadur/")) return "Vörur";
  if (CATEGORY_PAGES.has(pathname)) return "Þjónusta";
  return "Síða";
}

function sitemapPathnames(): string[] {
  return sitemap().map((entry) => entry.url.replace(SITE_URL, ""));
}

/**
 * `page` entries: one per sitemap route, EXCLUDING the 25 product URLs
 * (which become `product` entries) and the 6 /vorumerki/<slug> brand URLs
 * (which become `brand` entries) — see this file's bottom module comment
 * for why brand routes are excluded here too, beyond what the brief said
 * literally.
 */
function buildPageEntries(): SearchEntry[] {
  const productUrls = new Set(wagons.map((w) => `/sturtuvagnar/${w.slug}`));
  const brandUrls = new Set(brands.map((b) => b.href as string));
  const pathnames = sitemapPathnames().filter((p) => !productUrls.has(p) && !brandUrls.has(p));

  const parsed = pathnames.map(parseScrapePage);
  const boilerplate = computeBoilerplate(parsed);
  const missing = parsed.filter((p) => p.usedFallback).map((p) => p.pathname);
  if (missing.length > 0) {
    // Reported per the brief ("fall back to title from pageMetadata/route
    // name — and report it"); see module comment for why this uses a route
    // name fallback rather than importing each route's page module.
    console.warn(`[search/build-index] no scrape file for: ${missing.join(", ")} (used route-name fallback title)`);
  }

  return parsed.map((page) => {
    const headings = page.headingTexts.filter((t) => !boilerplate.has(t)).join(" ");
    const text = page.bodyTexts
      .filter((t) => !boilerplate.has(t))
      .join(" ")
      .slice(0, 240);
    return {
      id: `page:${page.pathname}`,
      kind: "page",
      title: page.title,
      url: page.pathname,
      subtitle: kindLabel(page.pathname),
      headings: headings || undefined,
      text: text || undefined,
    };
  });
}

function buildProductEntries(): SearchEntry[] {
  const groupTitleById = new Map(wagonGroups.map((g) => [g.id, g.title]));
  return wagons.map((wagon) => {
    const groupTitle = groupTitleById.get(wagon.groupId) ?? "";
    return {
      id: `product:${wagon.slug}`,
      kind: "product",
      title: wagon.title,
      url: `/sturtuvagnar/${wagon.slug}`,
      subtitle: groupTitle,
      text: wagon.blurb,
      keywords: `${groupTitle} Gigant sturtuvagn`.trim(),
    };
  });
}

/** The Framer "Table" widget's built-in demo dataset (Mason Carter, Olivia
 * Lee, ...), left unconfigured on the live hifikedjur page — lib/hifi.ts's
 * generator already excludes it from `tables`, but this guards buildIndex
 * itself in case that ever changes (see brief + scripts/verify.mjs). */
function isPlaceholderTable(table: HifiTable): boolean {
  return JSON.stringify(table.headers) === JSON.stringify(["Name", "Email", "Role", "Status"]);
}

function buildRowEntries(): SearchEntry[] {
  const entries: SearchEntry[] = [];
  for (const page of hifiPages) {
    const pageUrl = `/hifi-festibunadur/${page.path.join("/")}`;
    (page.tables ?? []).forEach((table, tableIndex) => {
      if (isPlaceholderTable(table)) return;
      table.rows.forEach((row, rowIndex) => {
        const firstCell = row[0] ?? "";
        const fragment = rowId(tableIndex, rowIndex, firstCell);
        entries.push({
          // `fragment` (SpecTable's <tr id>) is only unique *within a
          // page* — several hifi-festibunadur pages share near-identical
          // chain tables, so the same tableIndex/rowIndex/firstCell
          // combination recurs across pages. The search entry's own `id`
          // must be globally unique, so it's namespaced with the page URL;
          // the row's link fragment (and SpecTable's actual DOM id) stays
          // the plain, page-local `fragment`.
          id: `row:${pageUrl}:${fragment}`,
          kind: "row",
          title: firstCell,
          url: `${pageUrl}#${fragment}`,
          subtitle: [row.slice(1).join(" · "), page.title].filter(Boolean).join(" · "),
          keywords: row.join(" "),
        });
      });
    });
  }
  return entries;
}

function buildBrandEntries(): SearchEntry[] {
  return brands.map((brand) => ({
    id: `brand:${brand.id}`,
    kind: "brand",
    title: brand.name,
    url: brand.href,
    text: brand.body.find((block) => block.type === "p")?.text ?? "",
  }));
}

function buildFaqEntries(): SearchEntry[] {
  return faqItems.map((item, index) => ({
    id: `faq:${index}`,
    kind: "faq",
    title: item.question,
    url: "/smurkerfi#spurt-og-svarad",
    text: item.answer,
  }));
}

export function buildIndex(): SearchEntry[] {
  return [
    ...buildPageEntries(),
    ...buildProductEntries(),
    ...buildBrandEntries(),
    ...buildFaqEntries(),
    ...buildRowEntries(),
  ];
}

// --- Deviation from the brief -----------------------------------------
// The brief only says to explicitly exclude the 25 product URLs from
// `page` ("they become product"); it doesn't mention the 6
// /vorumerki/<slug> brand URLs, and its own index test only requires every
// sitemap pathname to appear "as a page or product url". Taken completely
// literally, that would leave every /vorumerki/<slug> page indexed TWICE:
// once as a generic `page` entry (built from the raw scrape, with no
// dedicated brand copy) and once as a curated `brand` entry (name + first
// paragraph from lib/brands.ts) — the same URL showing up in both the
// "Síður" and "Vörumerki" result groups for the same query. That's the
// same situation product pages would be in if they weren't excluded, so
// brand routes are excluded from `page` for the same reason and by the
// same mechanism as products. tests/search-index.test.ts checks sitemap
// coverage as "page, product, or brand" accordingly.
