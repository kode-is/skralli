// Warms the image optimizer cache after a deploy. Optimized images are
// generated on the first request for each size, and a new deployment starts
// with nothing cached, so without this the first real visitor to every page
// waits for every image. This visits every sitemap URL the way real devices
// do (phone, laptop, large desktop), scrolling so lazy images are requested.
//
//   node scripts/warm-images.mjs https://skralli.vercel.app
import { chromium } from "playwright";

const base = (process.argv[2] || "").replace(/\/$/, "");
if (!base) { console.error("usage: node scripts/warm-images.mjs <base-url>"); process.exit(1); }

const PROFILES = [
  { name: "phone", viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true },
  { name: "laptop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
  { name: "desktop", viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 },
];
const CONCURRENCY = 4;

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (paths.length === 0) { console.error("no URLs found in sitemap.xml"); process.exit(1); }

const browser = await chromium.launch();
let images = 0, misses = 0, failed = 0;
const started = Date.now();

for (const profile of PROFILES) {
  const context = await browser.newContext(profile);
  const queue = [...paths];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    const page = await context.newPage();
    page.on("response", (res) => {
      if (!res.url().includes("/_next/image")) return;
      images++;
      if ((res.headers()["x-vercel-cache"] || "") !== "HIT") misses++;
    });
    for (let path = queue.shift(); path !== undefined; path = queue.shift()) {
      try {
        await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
        await page.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += 600) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 120));
          }
        });
        await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
      } catch (error) {
        failed++;
        console.error(`failed ${profile.name} ${path}: ${String(error).split("\n")[0]}`);
      }
    }
    await page.close();
  }));
  await context.close();
  console.log(`${profile.name}: done`);
}
await browser.close();
console.log(`warmed ${paths.length} pages x ${PROFILES.length} profiles in ${Math.round((Date.now() - started) / 1000)}s: ` +
  `${images} image responses, ${misses} were not yet cached, ${failed} page loads failed`);
process.exit(failed > 0 ? 1 : 0);
