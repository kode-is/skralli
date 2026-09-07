import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { ROUTES, LIVE } from "./routes.mjs";
import { expandAccordions } from "./lib/accordion.mjs";

const LOCAL = process.env.LOCAL || "http://localhost:3000";
const only = process.argv.slice(2);
const routes = only.length ? only : ROUTES;

// Framer's scroll-triggered stat counters on these two routes hydrate to
// nondeterministic live values (e.g. 482/132) that drift from the canonical
// server-rendered numbers baked into our static recreation (480/130), so a
// bare short-number line should not be treated as "missing" there.
const IGNORE_MISSING = {
  "/": [/^\d{1,3}$/],
  "/um-okkur": [/^\d{1,3}$/],
};

const norm = (s) => s.replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

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
