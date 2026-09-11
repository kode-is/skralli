# Skralli.is Recreation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild skralli.is (a Framer site) as a static Next.js site with identical text, images, and structure, plus a working Resend-backed contact form.

**Architecture:** A Playwright scraper captures every route of the live site into per-page JSON (ordered content blocks), downloads every image at full resolution, and takes reference screenshots. Page components are then built from that JSON with a small shared component set; brand/product/sub-pages are templates driven by typed data in `lib/`. A verification script diffs visible text and image counts against the live site per route.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3, `next/font/local`, `resend`, Playwright (dev), Vitest (dev). Node 22.

**Spec:** `docs/superpowers/specs/2026-09-07-skralli-website-recreation-design.md`

## Global Constraints

- Text is copied **verbatim** from the live site, including punctuation, capitalization and typos. Never "improve" copy.
- Every image visible on a live page must exist locally under `public/` and be rendered on the equivalent new page. No hotlinking to `framerusercontent.com`.
- Font: NowAlt only (six weights in `assets/fonts/`). No Google Fonts request anywhere.
- Colors: take exact values from the scraped computed styles. Brand reference: `#005380`, `#01A8DC`, `#83D4F3`, accents `#0A8754`, `#FAC748`.
- All 57 routes in the spec's inventory must build as static pages. `npm run build` must exit 0.
- Contact form fields and labels verbatim: `Nafn`, `Netfang`, `Símanúmer`, `Skilaboð`, button `Senda!`.
- Secrets (`RESEND_API_KEY`, `EMAIL_FROM`) live only in `.env.local` (gitignored) and Vercel. Never in code or commits.
- Product records carry a stable `id` (the URL slug) for the later DK integration.
- Commit after every task with the trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Icelandic UI copy; code comments and commit messages in English.

---

## File structure

```
app/
  layout.tsx                       fonts, <Header/>, <Footer/>, default metadata
  globals.css                      Tailwind base + CSS vars
  page.tsx                         /
  not-found.tsx                    /404
  sitemap.ts  robots.ts
  actions.ts                       submitContact server action
  um-okkur/page.tsx  thjonusta/page.tsx  hafa-samband/page.tsx
  vorumerki/page.tsx  vorumerki/[slug]/page.tsx
  smurkerfi/page.tsx  oryggisrudur/page.tsx  vetrarbunadur/page.tsx
  fyrirokumannin/page.tsx  siubunadur/page.tsx
  sturtuvagnar/page.tsx  sturtuvagnar/[slug]/page.tsx
  hifi-festibunadur/page.tsx  hifi-festibunadur/[...slug]/page.tsx
components/
  Header.tsx  Footer.tsx  Container.tsx  Breadcrumb.tsx
  PageHero.tsx                     image hero with H1 + subtitle
  ContactCta.tsx                   "Sendu okkur fyrirspurn" strip used on every inner page
  BrandStrip.tsx  StatCounter.tsx  TeamCard.tsx  FeatureCard.tsx  Faq.tsx
  ContactForm.tsx                  client component
lib/
  site.ts        company details, nav, footer links, socials
  brands.ts      6 brand records
  categories.ts  7 category cards (used on home + þjónusta)
  sturtuvagnar.ts groups + products
  hifi.ts        hífi- og festibúnaður tree
  email/client.ts  getResendClient(), emailFrom(), contactTo()
  email/contact.ts buildContactEmail()
scripts/
  scrape.mjs     Playwright: routes → docs/scrape/*.json + public/images + screenshots
  verify.mjs     Playwright: live vs local text + image-count diff
  routes.mjs     shared route list
tests/
  actions.test.ts  email.test.ts
docs/
  scrape/<route>.json              scraped content per route
  reference/<route>.desktop.png  <route>.mobile.png
  asset-manifest.json
public/
  images/<route>/<n>-<hash>.<ext>  downloaded imagery
  logos/                          Skralli + brand logos
  favicon.ico  icon.png
assets/fonts/NowAlt-*.woff         (already committed)
```

---

### Task 1: Scaffold Next.js project with NowAlt font and Tailwind theme

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env.example`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx` (placeholder), `app/fonts.ts`, `vitest.config.ts`, `README.md`

**Interfaces:**
- Produces: `nowAlt` font export from `app/fonts.ts` with CSS variable `--font-now`; Tailwind classes `font-sans` (NowAlt), colors `brand.dark`, `brand.mid`, `brand.light`, `accent.green`, `accent.yellow`.

- [ ] **Step 1: Scaffold with create-next-app (non-interactive)**

```bash
cd /Users/einarbjarnason/Documents/GitHub/skralli
npx --yes create-next-app@latest . --ts --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack --yes
```

If it refuses because the directory is non-empty, run it in `/tmp/skralli-scaffold` and copy everything except `.git`, `README.md`, and `app/page.tsx` contents into the repo.

Check `package.json` has `next` `^16`, `react` `^19`, `tailwindcss` `^3` or `^4`. If Tailwind 4 was installed, keep it (the theme below uses the `@theme` block variant noted inline).

- [ ] **Step 2: Add dev dependencies**

```bash
npm i -D playwright vitest @vitejs/plugin-react
npm i resend
npx playwright install chromium
```

- [ ] **Step 3: Font loader**

Create `app/fonts.ts`:

```ts
import localFont from "next/font/local";

export const nowAlt = localFont({
  variable: "--font-now",
  display: "swap",
  src: [
    { path: "../assets/fonts/NowAlt-Thin.woff", weight: "100", style: "normal" },
    { path: "../assets/fonts/NowAlt-Light.woff", weight: "300", style: "normal" },
    { path: "../assets/fonts/NowAlt-Regular.woff", weight: "400", style: "normal" },
    { path: "../assets/fonts/NowAlt-Medium.woff", weight: "500", style: "normal" },
    { path: "../assets/fonts/NowAlt-Bold.woff", weight: "700", style: "normal" },
    { path: "../assets/fonts/NowAlt-Black.woff", weight: "900", style: "normal" },
  ],
});
```

- [ ] **Step 4: Tailwind theme**

If Tailwind 3, replace `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["var(--font-now)", "system-ui", "sans-serif"] },
      colors: {
        brand: { dark: "#005380", mid: "#01A8DC", light: "#83D4F3" },
        accent: { green: "#0A8754", yellow: "#FAC748" },
      },
      maxWidth: { site: "1200px" },
    },
  },
  plugins: [],
};
export default config;
```

If Tailwind 4, put the same tokens in `app/globals.css`:

```css
@import "tailwindcss";
@theme {
  --font-sans: var(--font-now), system-ui, sans-serif;
  --color-brand-dark: #005380;
  --color-brand-mid: #01A8DC;
  --color-brand-light: #83D4F3;
  --color-accent-green: #0A8754;
  --color-accent-yellow: #FAC748;
}
```

- [ ] **Step 5: Root layout**

Replace `app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { nowAlt } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  metadataBase: new URL("https://skralli.is"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is" className={nowAlt.variable}>
      <body className="font-sans antialiased text-neutral-900 bg-white">{children}</body>
    </html>
  );
}
```

Replace `app/page.tsx` with a one-line placeholder `export default function Home() { return <main className="p-8 font-bold">Skralli</main>; }`.

- [ ] **Step 6: next.config.mjs, env example, gitignore, vitest**

`next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
};
export default nextConfig;
```

`.env.example`:

```
RESEND_API_KEY=
EMAIL_FROM="Skralli <vefur@skralli.is>"
CONTACT_TO=skralli@skralli.is
```

Append to `.gitignore`: `.env*.local`, `/test-results`, `/playwright-report`.

`vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
  resolve: { alias: { "@": new URL(".", import.meta.url).pathname } },
});
```

Add scripts to `package.json`: `"test": "vitest run"`, `"scrape": "node scripts/scrape.mjs"`, `"verify": "node scripts/verify.mjs"`.

- [ ] **Step 7: Build and run**

```bash
npm run build
```
Expected: exit 0, route `/` listed as static. Then `npm run dev` briefly and confirm `http://localhost:3000` shows "Skralli" in NowAlt (inspect: computed font-family starts with `__nowAlt`).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Scaffold Next.js 16 app with NowAlt font and brand Tailwind theme

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 2: Route list and Playwright scraper (content JSON, images, screenshots)

**Files:**
- Create: `scripts/routes.mjs`, `scripts/scrape.mjs`
- Output (committed): `docs/scrape/*.json`, `docs/asset-manifest.json`, `docs/reference/*.png`, `public/images/**`

**Interfaces:**
- Produces: `ROUTES` array (string paths, `/` first). Per-route JSON shape:

```ts
type Block =
  | { type: "heading"; level: 1|2|3|4|5|6; text: string }
  | { type: "text"; text: string }
  | { type: "link"; text: string; href: string }
  | { type: "image"; src: string; local: string; alt: string; width: number; height: number; role: "content"|"background"|"logo" }
  | { type: "faq"; question: string; answer: string };
type PageScrape = {
  route: string; title: string; description: string;
  blocks: Block[];                       // document order, nav/footer excluded
  nav: { text: string; href: string }[];
  footer: Block[];                       // captured once on "/", repeated elsewhere for diffing
  colors: string[];                      // distinct computed background colors on the page (hex)
  screenshots: { desktop: string; mobile: string };
};
```

- [ ] **Step 1: Route list**

Create `scripts/routes.mjs`:

```js
export const ROUTES = [
  "/", "/um-okkur", "/thjonusta", "/hafa-samband", "/vorumerki",
  "/smurkerfi", "/sturtuvagnar", "/oryggisrudur", "/vetrarbunadur",
  "/fyrirokumannin", "/hifi-festibunadur", "/siubunadur",
  "/vorumerki/um-beka", "/vorumerki/lilleseth-kjetting", "/vorumerki/gigant",
  "/vorumerki/pebe", "/vorumerki/hammerglass", "/vorumerki/bmair",
  "/sturtuvagnar/fjorhjola-minigrofuvagnar", "/sturtuvagnar/verktakavagnar",
  "/sturtuvagnar/landbunadarvagnar", "/sturtuvagnar/hjolagrofuvagnar",
  "/sturtuvagnar/velaflutningavagnar",
  "/sturtuvagnar/hjolagrofuvagn-gd2-6x", "/sturtuvagnar/hjolagrofuvagn-gd3-6x",
  "/sturtuvagnar/hjolagrofuvagn-gd3-8x", "/sturtuvagnar/hjolagrofuvagn-gd3-10x",
  "/sturtuvagnar/gw-100", "/sturtuvagnar/gw-120", "/sturtuvagnar/gw-400",
  "/sturtuvagnar/velavagn-ml80", "/sturtuvagnar/velavagn-ml160", "/sturtuvagnar/velavagn-ml210",
  "/sturtuvagnar/velavagn-gll4-18", "/sturtuvagnar/velavagn-gll4-18l",
  "/sturtuvagnar/velavagn-gll4-24", "/sturtuvagnar/velavagn-gll4-27",
  "/sturtuvagnar/verktakavagn-gd3-13", "/sturtuvagnar/verktakavagn-gd4-15",
  "/sturtuvagnar/verktakavagn-gd4-17", "/sturtuvagnar/verktakavagn-gd4-17sb",
  "/sturtuvagnar/verktakavagn-gd4-20", "/sturtuvagnar/verktakavagn-gd4-30hs",
  "/sturtuvagnar/landbunadarvagn-gd85", "/sturtuvagnar/landbunadarvagn-gd100",
  "/sturtuvagnar/landbunadarvagn-gd125", "/sturtuvagnar/landbunadarvagn-gd140-gd140sb",
  "/sturtuvagnar/landbunadarvagn-gd150",
  "/hifi-festibunadur/hifikedjur", "/hifi-festibunadur/bindikedjur-strekkjarar",
  "/hifi-festibunadur/stroffur", "/hifi-festibunadur/stroffur/hringstroffur",
  "/hifi-festibunadur/stroffur/flatstroffur", "/hifi-festibunadur/stroffur/drattastroffur",
  "/hifi-festibunadur/aukabunadur", "/hifi-festibunadur/bordastrekkjarar",
  "/404",
];
export const LIVE = "https://skralli.is";
export const routeToFile = (r) => (r === "/" ? "home" : r.replace(/^\//, "").replace(/\//g, "__"));
```

- [ ] **Step 2: Scraper**

Create `scripts/scrape.mjs`:

```js
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { ROUTES, LIVE, routeToFile } from "./routes.mjs";

const OUT_JSON = "docs/scrape";
const OUT_REF = "docs/reference";
const OUT_IMG = "public/images";
const manifest = [];
const seenImages = new Map(); // originalUrl -> localPath

const stripParams = (u) => u.split("?")[0];
const extOf = (u) => (path.extname(new URL(u).pathname) || ".jpg").toLowerCase();

async function download(url, routeDir, idx) {
  const clean = stripParams(url);
  if (seenImages.has(clean)) return seenImages.get(clean);
  const res = await fetch(clean, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`download ${clean} -> ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const hash = createHash("sha1").update(clean).digest("hex").slice(0, 8);
  const local = `/images/${routeDir}/${String(idx).padStart(2, "0")}-${hash}${extOf(clean)}`;
  await mkdir(path.join("public", path.dirname(local)), { recursive: true });
  await writeFile(path.join("public", local), buf);
  seenImages.set(clean, local);
  return local;
}

async function expandAccordions(page) {
  // Framer accordions: click every element that looks like a question row until nothing new appears.
  for (let i = 0; i < 3; i++) {
    const clicked = await page.evaluate(() => {
      const cands = [...document.querySelectorAll("div[role='button'], button, div[tabindex='0'], [data-framer-name*='ccordion' i], [data-framer-name*='FAQ' i] *")];
      let n = 0;
      for (const el of cands) {
        const t = (el.textContent || "").trim();
        if (t.endsWith("?") && t.length < 140) { el.click(); n++; }
      }
      return n;
    });
    await page.waitForTimeout(500);
    if (!clicked) break;
  }
}

async function scrapeRoute(browser, route) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: "is" });
  const page = await ctx.newPage();
  await page.goto(LIVE + route, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  // trigger lazy content
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await expandAccordions(page);

  const data = await page.evaluate(() => {
    const isVisible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
    const header = document.querySelector("header, [data-framer-name*='Nav' i], [data-framer-name*='Header' i]");
    const footer = document.querySelector("footer, [data-framer-name*='Footer' i]");
    const inChrome = (el) => (header && header.contains(el)) || (footer && footer.contains(el));
    const blocks = []; const footerBlocks = []; const nav = [];
    const push = (b, el) => (footer && footer.contains(el) ? footerBlocks : blocks).push(b);
    const toHex = (rgb) => { const m = rgb.match(/\d+(\.\d+)?/g); if (!m || m.length < 3) return null; if (m[3] !== undefined && Number(m[3]) === 0) return null; return "#" + m.slice(0, 3).map(n => Number(n).toString(16).padStart(2, "0")).join(""); };
    const colors = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let el;
    while ((el = walker.nextNode())) {
      if (!isVisible(el)) continue;
      const bg = toHex(getComputedStyle(el).backgroundColor); if (bg && bg !== "#ffffff") colors.add(bg);
      const tag = el.tagName.toLowerCase();
      if (header && header.contains(el) && tag === "a") { nav.push({ text: el.textContent.trim(), href: el.getAttribute("href") }); continue; }
      if (/^h[1-6]$/.test(tag)) { push({ type: "heading", level: Number(tag[1]), text: el.textContent.trim() }, el); continue; }
      if (tag === "p" || (tag === "span" && el.parentElement && !/^(p|h[1-6]|a|button)$/i.test(el.parentElement.tagName) && el.children.length === 0)) {
        const t = el.textContent.trim(); if (t && !inChrome(el) || (footer && footer.contains(el) && t)) push({ type: "text", text: t }, el); continue;
      }
      if (tag === "a" && !inChrome(el)) { const t = el.textContent.trim(); if (t) push({ type: "link", text: t, href: el.getAttribute("href") }, el); continue; }
      if (tag === "img") { const src = el.currentSrc || el.src; if (src && src.includes("framerusercontent")) push({ type: "image", src: src.split("?")[0], alt: el.alt || "", width: el.naturalWidth, height: el.naturalHeight, role: header && header.contains(el) || footer && footer.contains(el) ? "logo" : "content" }, el); continue; }
      const bgi = getComputedStyle(el).backgroundImage; const m = bgi && bgi.match(/url\("?(https:\/\/framerusercontent[^")]+)/);
      if (m) push({ type: "image", src: m[1].split("?")[0], alt: "", width: 0, height: 0, role: "background" }, el);
    }
    const dedupNav = []; for (const n of nav) if (!dedupNav.some(d => d.text === n.text && d.href === n.href)) dedupNav.push(n);
    return { title: document.title, description: document.querySelector("meta[name=description]")?.content || "", blocks, footer: footerBlocks, nav: dedupNav, colors: [...colors] };
  });

  // download images (blocks + footer), rewrite local paths
  const routeDir = routeToFile(route);
  let idx = 0;
  for (const b of [...data.blocks, ...data.footer]) {
    if (b.type !== "image") continue;
    b.local = await download(b.src, routeDir, idx++);
    manifest.push({ route, originalUrl: b.src, localPath: b.local, width: b.width, height: b.height, alt: b.alt, role: b.role });
  }

  await mkdir(OUT_REF, { recursive: true });
  const desktop = `${OUT_REF}/${routeDir}.desktop.png`;
  await page.screenshot({ path: desktop, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const mobile = `${OUT_REF}/${routeDir}.mobile.png`;
  await page.screenshot({ path: mobile, fullPage: true });
  await ctx.close();

  await mkdir(OUT_JSON, { recursive: true });
  await writeFile(`${OUT_JSON}/${routeDir}.json`, JSON.stringify({ route, ...data, screenshots: { desktop, mobile } }, null, 2));
  console.log(`${route}: ${data.blocks.length} blocks, ${idx} images`);
}

const browser = await chromium.launch();
for (const r of ROUTES) await scrapeRoute(browser, r);
await browser.close();
await writeFile("docs/asset-manifest.json", JSON.stringify(manifest, null, 2));
console.log(`done: ${manifest.length} image refs, ${seenImages.size} unique files`);
```

- [ ] **Step 3: Run and inspect**

```bash
npm run scrape
```

Expected: 57 lines printed, `docs/scrape/home.json` exists with `blocks` including `{"type":"heading","level":1,"text":"Þinn\nsamstarfsaðili"}` or the two-line equivalent, and `public/images/home/` has around 24 files. Open `docs/reference/home.desktop.png` and confirm it's the full homepage.

Spot-check `docs/scrape/smurkerfi.json`: it must contain the three FAQ questions **and** their answers (text blocks following each question). If answers are missing, inspect the accordion DOM in a headed run (`chromium.launch({ headless: false })`) and adjust the `expandAccordions` selector until they appear. Answers are the acceptance bar for this task.

Spot-check `docs/scrape/um-okkur.json`: team members `Vilmundur Theodórsson`, `Örvar S. Haraldsson`, `Þórir Ágúst Þórðarson`, `Adam Orri Guðmundsson`, `Hlynur Ísak Vilmundarson`, `Steinar Ingi`, `Kormákur` all present.

- [ ] **Step 4: Commit scrape output**

```bash
git add scripts docs/scrape docs/reference docs/asset-manifest.json public/images
git commit -m "Scrape live skralli.is: per-route content JSON, images, reference screenshots

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 3: Skralli logos and favicon from Google Drive (main session, Drive MCP)

**Files:**
- Create: `public/logos/skralli-blue-on-white.png`, `public/logos/skralli-blue-on-transparent.png`, `public/logos/skralli-white-on-blue.png`, `public/logos/skralli-white-on-transparent.png`, `public/logos/skralli-logo-blatt.pdf`, `app/icon.png`, `public/favicon.ico`

**Interfaces:**
- Produces: the four logo paths above, consumed by `Header`, `Footer`.

- [ ] **Step 1: Download via Drive MCP** (`download_file_content`, base64 → file). File ids:
  - `1eq6Q0iODKv9rTditdMGedsO3V6z-_Pfp` → skralli-blue-on-white.png
  - `1_ShkOlNs-1PmVRDfjJsnUkL-759tWnv8` → skralli-blue-on-transparent.png
  - `1YFqVKdqntNY9bVyOfz8YjQ7f6hsjtvm9` → skralli-white-on-blue.png
  - `1y3JIfFiGLuOAFQhJFmYA_qex5qnHVWYv` → skralli-white-on-transparent.png
  - `1g-ievbjel20D3OBWfKH0lwJdYVDtKS2y` → skralli-logo-blatt.pdf
  - `1omTODdIZUBao2VWpMle86C8g3JQ7md8m` → `app/icon.png` (Next picks it up as favicon) and also convert to `public/favicon.ico` with `sips -s format ico` or copy as PNG if ico conversion is unavailable.

- [ ] **Step 2: Verify** `file public/logos/*.png` shows PNG image data with sane dimensions (> 100px wide).

- [ ] **Step 3: Commit**

```bash
git add public/logos app/icon.png public/favicon.ico
git commit -m "Add Skralli logo set and favicon from brand Drive folder

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 4: Site data, Header, Footer, ContactCta, not-found

**Files:**
- Create: `lib/site.ts`, `components/Container.tsx`, `components/Header.tsx`, `components/Footer.tsx`, `components/ContactCta.tsx`, `components/Breadcrumb.tsx`, `components/PageHero.tsx`, `app/not-found.tsx`
- Modify: `app/layout.tsx` (render Header/Footer)
- Read: `docs/scrape/home.json` (nav + footer blocks), `docs/reference/home.desktop.png`, `docs/reference/404.desktop.png`

**Interfaces:**
- Produces:

```ts
// lib/site.ts
export const site = {
  name: "Skralli", tagline: "Þinn samstarfsaðili",
  motto: "Samvinna - Þjónusta - Áreiðanleiki",
  address: "Móhella 3F, 221 Hafnarfjörður", kennitala: "Kt. 580821-1460",
  phoneLabel: "Símanúmer: 862 4046", phone: "+354 862 4046", phoneHref: "tel:+3548624046",
  email: "skralli@skralli.is", hours: "Opnunartími: Mán - Fös 08 - 16",
  hoursSplit: ["Opnunartími:", "Mán - Fös", "08 - 16"],
  facebook: "https://www.facebook.com/skralliehf",
  instagram: "https://www.instagram.com/skralliehf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
} as const;
export const nav = [ { text: "Heim", href: "/" }, { text: "Þjónusta", href: "/thjonusta" }, { text: "Um okkur", href: "/um-okkur" } ] as const;
export const navCta = { text: "Hafa samband", href: "/hafa-samband" } as const;
export const footerColumns = [
  { heading: "Fyrirtækið", links: [ {text:"Heim",href:"/"}, {text:"Um okkur",href:"/um-okkur"}, {text:"Þjónusta",href:"/thjonusta"}, {text:"Hafa samband",href:"/hafa-samband"} ] },
  { heading: "Vörumerki", links: [ {text:"Groeneveld-Beka",href:"/vorumerki/um-beka"}, {text:"Lilleseth",href:"/vorumerki/lilleseth-kjetting"}, {text:"Gigant",href:"/vorumerki/gigant"}, {text:"Pebe",href:"/vorumerki/pebe"}, {text:"Hammerglass",href:"/vorumerki/hammerglass"}, {text:"BMair",href:"/vorumerki/bmair"} ] },
  { heading: "Þjónusta", links: [ {text:"Smurkerfi",href:"/smurkerfi"}, {text:"Sturtuvagnar",href:"/sturtuvagnar"}, {text:"Öryggisrúður",href:"/oryggisrudur"}, {text:"Vetrarbúnaður",href:"/vetrarbunadur"}, {text:"Fyrir ökumanninn",href:"/fyrirokumannin"}, {text:"Hífi- & festibúnaður",href:"/hifi-festibunadur"}, {text:"Síubúnaður",href:"/siubunadur"} ] },
] as const;
```

  Components: `<Container>` (max-w-site mx-auto px-6), `<Header />`, `<Footer />`, `<ContactCta />` (heading "Sendu okkur fyrirspurn" + button "Hafa samband" → `/hafa-samband`, layout per home screenshot), `<Breadcrumb items={[{text, href?}]} />` renders `Forsíða > … ` with `>` separators exactly as on site, `<PageHero image={{src,alt,width,height}} title subtitle? />`.

- [ ] **Step 1: Write lib/site.ts** with the object above. Cross-check every string against `docs/scrape/home.json` footer blocks; fix any mismatch in favor of the scrape.

- [ ] **Step 2: Header** — logo (`/logos/skralli-white-on-transparent.png` on hero pages where header overlays imagery; check screenshot for the actual variant), nav links, `Hafa samband` pill button, mobile hamburger with a full-screen menu listing the same links. Header is `position: absolute` over hero on pages with a hero (compare `docs/reference/home.desktop.png` top 100px).

- [ ] **Step 3: Footer** — three link columns from `footerColumns`, company block (motto, address, kt, phone, email, hours), social icons (inline SVG, Facebook + Instagram, hrefs from `site`), logo. Match column order and text from `docs/scrape/home.json` `footer` blocks.

- [ ] **Step 4: not-found.tsx** — copy the text blocks from `docs/scrape/404.json` verbatim; link back to `/`.

- [ ] **Step 5: Wire into layout** — `app/layout.tsx` renders `<Header />{children}<Footer />`.

- [ ] **Step 6: Visual check** — `npm run dev`, open `/` and `/nonexistent`; compare header and footer with `docs/reference/home.desktop.png` bottom and `docs/reference/404.desktop.png` at 1440 and 390 widths.

- [ ] **Step 7: Commit**

```bash
git add lib components app
git commit -m "Site data, header, footer, contact CTA, breadcrumb, page hero, 404

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 5: Verification script (live vs local text and image diff)

**Files:**
- Create: `scripts/verify.mjs`

**Interfaces:**
- Consumes: `ROUTES`, `routeToFile` from `scripts/routes.mjs`; local dev server on `http://localhost:3000`.
- Produces: `docs/verify-report.md` and non-zero exit if any route has a text diff or fewer images than live. Usage: `npm run verify -- /smurkerfi /um-okkur` (subset) or no args (all).

- [ ] **Step 1: Write the script**

```js
import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";
import { ROUTES, LIVE } from "./routes.mjs";

const LOCAL = process.env.LOCAL || "http://localhost:3000";
const only = process.argv.slice(2);
const routes = only.length ? only : ROUTES;
const norm = (s) => s.replace(/ /g, " ").replace(/[ \t]+/g, " ").replace(/\s*\n\s*/g, "\n").trim();

async function capture(page, url) {
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); } });
  // expand accordions the same way as scrape.mjs
  await page.evaluate(() => { for (const el of document.querySelectorAll("div[role='button'], button, div[tabindex='0']")) { const t = (el.textContent || "").trim(); if (t.endsWith("?") && t.length < 140) el.click(); } });
  await page.waitForTimeout(400);
  return page.evaluate(() => ({
    text: document.body.innerText,
    images: [...document.images].filter(i => i.getBoundingClientRect().width > 0).length,
  }));
}

const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
const rows = []; let failures = 0;
for (const r of routes) {
  const live = await capture(page, LIVE + r);
  const local = await capture(page, LOCAL + r);
  const a = new Set(norm(live.text).split("\n")), b = new Set(norm(local.text).split("\n"));
  const missing = [...a].filter(x => !b.has(x)); const extra = [...b].filter(x => !a.has(x));
  const imgOk = local.images >= live.images;
  const ok = missing.length === 0 && imgOk;
  if (!ok) failures++;
  rows.push(`## ${r} ${ok ? "OK" : "FAIL"}\n- images live/local: ${live.images}/${local.images}${imgOk ? "" : " (missing)"}\n${missing.length ? "- missing text:\n" + missing.map(m => `  - ${m}`).join("\n") : ""}${extra.length ? "\n- extra text:\n" + extra.map(m => `  - ${m}`).join("\n") : ""}\n`);
  console.log(`${ok ? "OK  " : "FAIL"} ${r} missing=${missing.length} extra=${extra.length} img=${live.images}/${local.images}`);
}
await browser.close();
await writeFile("docs/verify-report.md", `# Verify report ${new Date().toISOString()}\n\n${rows.join("\n")}`);
process.exit(failures ? 1 : 0);
```

- [ ] **Step 2: Run against the placeholder** (dev server running): `npm run verify -- /` → expected FAIL with many missing lines. This proves the harness detects gaps.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify.mjs package.json
git commit -m "Add live-vs-local text and image verification script

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 6: Home page

**Files:**
- Create: `app/page.tsx`, `components/BrandStrip.tsx`, `components/StepCard.tsx`, `components/CategoryCard.tsx`, `components/StatCounter.tsx`, `components/TeamCard.tsx`, `lib/categories.ts`, `lib/brands.ts` (names, hrefs, logo paths, card blurbs only; long body text comes in Task 8)
- Read: `docs/scrape/home.json`, `docs/reference/home.desktop.png`, `docs/reference/home.mobile.png`

**Interfaces:**
- Produces:

```ts
// lib/categories.ts
export type Category = { id: string; title: string; blurb: string; href: string; image: { src: string; alt: string; width: number; height: number } };
export const categories: Category[]; // order as on home: Síubúnaður, Smurkerfi, Sturtuvagnar, Öryggisrúður, Hífi- & festibúnaður, Fyrir ökumanninn (+ Vetrarbúnaður appears on /thjonusta only)
// lib/brands.ts
export type Brand = { id: string; name: string; href: `/vorumerki/${string}`; site: string; logo: string; heroImage?: Img; paragraphs: string[]; blurb?: string };
export const brands: Brand[]; // um-beka, lilleseth-kjetting, gigant, pebe, hammerglass, bmair
```

  `StatCounter` props `{ value: string; suffix: string; label: string }` renders `480` `+` `Ísett smurkefi` (typo preserved) with a count-up on scroll (client component, `IntersectionObserver`).

- [ ] **Step 1: Fill lib/categories.ts and lib/brands.ts** from `docs/scrape/home.json` and `docs/scrape/vorumerki.json` (blurbs/logos). Image paths come from the `local` field in the scrape blocks.

- [ ] **Step 2: Build sections in order of the scrape blocks**: hero (title "Þinn samstarfsaðili" split over two lines, subtitle, email pill, phone pill), brand logo strip (Gigant, Hammerglass, Groeneveld-BEKA, Lilleseth, Pebe, BMair; marquee if the screenshot shows overflow), "Okkar þjónusta við smurkerfi" three numbered steps with links `Senda fyrirspurn →`, `Fá fast verð →`, `Finna tíma →` (all to `/hafa-samband` unless the scrape shows otherwise), "Okkar vöruframboð / Skoðaðu úrvalið" six category cards, "Fagmannleg ráðgjöf" block with Villi/Örvar/Þórir portraits and `Hafa samband` button, four stat counters, "Vörumerki / Kynntu þér vörumerkin okkar" with `Skoða nánar` button and three brand cards (Hammerglass, Groeneveld-BEKA, Lilleseth), then `<ContactCta />` if present in the scrape.

- [ ] **Step 3: Verify**: `npm run verify -- /` → `OK` (missing=0). If `extra` lists only whitespace variants, accept.

- [ ] **Step 4: Visual pass**: compare with both reference screenshots; fix spacing/colors using values from `docs/scrape/home.json` `colors`.

- [ ] **Step 5: Commit**

```bash
git add app components lib
git commit -m "Home page recreated from scrape with brand strip, steps, categories, team, stats

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 7: Um okkur, Þjónusta, Vörumerki index

**Files:**
- Create: `app/um-okkur/page.tsx`, `app/thjonusta/page.tsx`, `app/vorumerki/page.tsx`, `lib/team.ts`
- Read: `docs/scrape/um-okkur.json`, `docs/scrape/thjonusta.json`, `docs/scrape/vorumerki.json` + matching screenshots

**Interfaces:**
- Produces `lib/team.ts`:

```ts
export type Member = { role: string; name: string; email?: string; phone?: string; image?: Img };
export const team: Member[]; // Vilmundur Theodórsson (Framkvæmdastjóri, villi@skralli.is, 779 1886), Örvar S. Haraldsson (Sölustjóri, orvar@skralli.is, 862 4046), Þórir Ágúst Þórðarson (Lagerstjóri, thorir@skralli.is, 862 4044), Adam Orri Guðmundsson (Þjónustufulltrúi), Hlynur Ísak Vilmundarson (Markaðssvið, hlynur@skralli.is, 776 4836), Steinar Ingi (Verkstæði), Kormákur (Verkstæði)
```

- [ ] **Step 1: um-okkur** — H1 "Um okkur", breadcrumb, "Við trúum á gæði og fagmennsku." + paragraph, "Markmið okkar." + paragraph, three values (Samvinna / Þjónusta / Áreiðanleiki) with icons from scrape images, stat counters (reuse `StatCounter`, note the um-okkur order/values from the scrape), "Teymið okkar" + intro + `TeamCard` grid from `team`, `<ContactCta />`.
- [ ] **Step 2: thjonusta** — H1 "Þjónustur", breadcrumb "Forsíða > Þjónustur", seven `CategoryCard`s in scrape order (includes Vetrarbúnaður with blurb "Snjókeðjur, snjóplógar og vængjaskóflur í miklu úrvali"), `<ContactCta />`.
- [ ] **Step 3: vorumerki** — H1 "Vörumerki", breadcrumb, six brand cards with `Skoða nánar →` links in scrape order (BMair, Hammerglass, Groeneveld-BEKA, Lilleseth, Gigant, Pebe), `<ContactCta />`.
- [ ] **Step 4: Verify** `npm run verify -- /um-okkur /thjonusta /vorumerki` → all OK.
- [ ] **Step 5: Commit**

```bash
git add app lib components
git commit -m "Um okkur, Þjónusta and Vörumerki pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 8: Brand pages (template + data)

**Files:**
- Create: `app/vorumerki/[slug]/page.tsx`
- Modify: `lib/brands.ts` (add `paragraphs`, `heroImage`, `gallery`, per-brand extra sections)
- Read: `docs/scrape/vorumerki__*.json` (6 files) + screenshots

**Interfaces:**
- Consumes `brands` from Task 6.
- Produces `generateStaticParams()` for the six slugs; `generateMetadata()` returning the scraped `title` per brand (e.g. `Hammerglass — Skralli`).

- [ ] **Step 1: Extend `Brand`** with `title: string` (scraped `<title>`), `paragraphs: string[]`, `heroImage: Img`, `gallery: Img[]`, `sections?: { heading: string; text?: string; items?: {heading: string; text: string; image?: Img}[] }[]` and fill all six from the scrape JSON. Keep every paragraph verbatim.
- [ ] **Step 2: Template** — `PageHero`, `Breadcrumb` (`Forsíða > Vörumerki > {name}`), paragraphs, optional sections, gallery, external link to `brand.site`, `<ContactCta />`.
- [ ] **Step 3: Verify** `npm run verify -- /vorumerki/um-beka /vorumerki/lilleseth-kjetting /vorumerki/gigant /vorumerki/pebe /vorumerki/hammerglass /vorumerki/bmair` → all OK.
- [ ] **Step 4: Commit**

```bash
git add app lib
git commit -m "Brand pages driven by lib/brands.ts

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 9: Smurkerfi page (with FAQ accordion)

**Files:**
- Create: `app/smurkerfi/page.tsx`, `components/Faq.tsx`, `components/FeatureCard.tsx`
- Read: `docs/scrape/smurkerfi.json`, screenshots

**Interfaces:**
- Produces `<Faq items={{question, answer}[]} />` client component (one open at a time, button with `aria-expanded`), `<FeatureCard heading text image? />`.

- [ ] **Step 1: Build**: hero (H1 "Smurkerfi", subtitle), breadcrumb, "Sjálfvirk smurkerfi" intro + H5 callout, seven `FeatureCard`s (Dælur, Koppafeiti, Fleygafeiti, BEKA deiliblokkir, Groeneveld skammtarar, Fittings, Fylltar slöngur), "Spurt & Svarað" with the three Q/A pairs from the scrape (answers must be present; if the scrape lacks them, re-run Task 2 Step 3 fix first), "Vel útbúnir þjónustubílar" section with image(s) and the two-line tagline, Viðgerðatöskur + Koppafeiti í áskrift cards, `<ContactCta />`.
- [ ] **Step 2: Verify** `npm run verify -- /smurkerfi` → OK.
- [ ] **Step 3: Commit**

```bash
git add app components
git commit -m "Smurkerfi page with feature cards and FAQ

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 10: Sturtuvagnar category, group pages, and product pages

**Files:**
- Create: `lib/sturtuvagnar.ts`, `app/sturtuvagnar/page.tsx`, `app/sturtuvagnar/[slug]/page.tsx`
- Read: `docs/scrape/sturtuvagnar.json`, `docs/scrape/sturtuvagnar__*.json` (34 files), screenshots

**Interfaces:**
- Produces:

```ts
export type Img = { src: string; alt: string; width: number; height: number };
export type WagonGroup = { id: string; slug: string; title: string; heroImage: Img; blocks: { type: "heading"|"text"; level?: number; text: string }[]; images: Img[] };
export type Wagon = { id: string; slug: string; title: string; groupId: string; heroImage: Img; blocks: WagonGroup["blocks"]; images: Img[] };
export const wagonGroups: WagonGroup[]; // fjorhjola-minigrofuvagnar, verktakavagnar, landbunadarvagnar, hjolagrofuvagnar, velaflutningavagnar
export const wagons: Wagon[];           // 25 products, groupId inferred from title prefix (Hjólagröfuvagn→hjolagrofuvagnar, Verktakavagn→verktakavagnar, Landbúnaðarvagn→landbunadarvagnar, Vélavagn→velaflutningavagnar, GW-*→fjorhjola-minigrofuvagnar)
```

- [ ] **Step 1: Generate data**: write a one-off script `scripts/gen-sturtuvagnar.mjs` that reads the 34 scrape JSONs and emits `lib/sturtuvagnar.ts` (title from H1, hero from first background/content image, remaining blocks verbatim). Commit the generator too.
- [ ] **Step 2: Category page** `/sturtuvagnar`: hero, "Vertu lipur með Gigant." + paragraph + `Sjá hjólagröfuvagna` link, "Af hverju hjólagröfuvagn frá Gigant?" seven feature items (Sérhannað bremsukerfi, Hardox 500 TUF, Sveigður framgafl, Vökvavör, LED-ljós, Verkfærakassi, 10 gata felgur) with images, "Aðrar vagntegundir" five group cards, `<ContactCta />`.
- [ ] **Step 3: `[slug]` template** handles both a group slug and a product slug: hero with H1, breadcrumb `Forsíða > Sturtuvagnar > {title}`, blocks, "Tegundir í boði" grid listing sibling products in the same group (as the live page headings imply; if the live page shows no cards under that heading, render the heading only, exactly as live), `<ContactCta />`. `generateStaticParams` returns all 34 slugs. Unknown slug → `notFound()`.
- [ ] **Step 4: Verify** `npm run verify -- /sturtuvagnar /sturtuvagnar/hjolagrofuvagnar /sturtuvagnar/hjolagrofuvagn-gd3-6x /sturtuvagnar/gw-100 /sturtuvagnar/landbunadarvagn-gd150` → all OK, then the full set of 34.
- [ ] **Step 5: Commit**

```bash
git add lib app scripts
git commit -m "Sturtuvagnar category, group and product pages from generated data

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 11: Öryggisrúður, Síubúnaður, Vetrarbúnaður, Fyrir ökumanninn

**Files:**
- Create: `app/oryggisrudur/page.tsx`, `app/siubunadur/page.tsx`, `app/vetrarbunadur/page.tsx`, `app/fyrirokumannin/page.tsx`
- Read: the four matching `docs/scrape/*.json` and screenshots

- [ ] **Step 1: Build each page** from its scrape blocks in order using `PageHero`, `Breadcrumb`, `FeatureCard`, `Faq` (if Q/A present), image grids, `<ContactCta />`. Any component that appears on only one page stays inline in that page file.
- [ ] **Step 2: Verify** `npm run verify -- /oryggisrudur /siubunadur /vetrarbunadur /fyrirokumannin` → all OK.
- [ ] **Step 3: Commit**

```bash
git add app components
git commit -m "Öryggisrúður, Síubúnaður, Vetrarbúnaður and Fyrir ökumanninn pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 12: Hífi- og festibúnaður tree

**Files:**
- Create: `lib/hifi.ts`, `app/hifi-festibunadur/page.tsx`, `app/hifi-festibunadur/[...slug]/page.tsx`
- Read: `docs/scrape/hifi-festibunadur.json`, `docs/scrape/hifi-festibunadur__*.json` (8), screenshots

**Interfaces:**
- Produces:

```ts
export type HifiPage = { id: string; path: string[]; title: string; heroImage?: Img; blocks: {type:"heading"|"text"|"link"; level?: number; text: string; href?: string}[]; images: Img[]; children?: string[] };
export const hifiPages: HifiPage[]; // hifikedjur, bindikedjur-strekkjarar, stroffur (children: hringstroffur, flatstroffur, drattastroffur), aukabunadur, bordastrekkjarar
```

- [ ] **Step 1: Data** from the scrape JSONs, verbatim.
- [ ] **Step 2: Index page** `/hifi-festibunadur` from its scrape (hero, intro, category cards linking to the sub-pages, `<ContactCta />`).
- [ ] **Step 3: `[...slug]` template** with `generateStaticParams` returning the 8 paths (one- and two-segment). Breadcrumb `Forsíða > Hífi- & festibúnaður > … `. Sub-pages with children render child cards.
- [ ] **Step 4: Verify** all 9 hífi routes → OK.
- [ ] **Step 5: Commit**

```bash
git add lib app
git commit -m "Hífi- og festibúnaður index and sub-pages

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 13: Contact form with Resend (TDD)

**Files:**
- Create: `lib/email/client.ts`, `lib/email/contact.ts`, `app/actions.ts`, `components/ContactForm.tsx`, `app/hafa-samband/page.tsx`, `tests/email.test.ts`, `tests/actions.test.ts`
- Read: `docs/scrape/hafa-samband.json`, screenshots

**Interfaces:**
- Produces:

```ts
// lib/email/client.ts
export function getResendClient(): Resend;   // lazy, cached, throws if RESEND_API_KEY missing
export function emailFrom(): string;          // EMAIL_FROM, throws if missing
export function contactTo(): string;          // CONTACT_TO ?? "skralli@skralli.is"
// lib/email/contact.ts
export type ContactPayload = { nafn: string; netfang: string; simi: string; skilabod: string; website?: string /* honeypot */ };
export function validateContact(p: ContactPayload): string | null;   // Icelandic error or null
export function buildContactEmail(p: ContactPayload): { subject: string; text: string; html: string };
// app/actions.ts
export type ContactResult = { ok: true } | { ok: false; error: string };
export async function submitContact(p: ContactPayload, deps?: { send?: (msg: {from:string;to:string;replyTo:string;subject:string;text:string;html:string}) => Promise<unknown> }): Promise<ContactResult>;
```

- [ ] **Step 1: Failing tests** `tests/email.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { validateContact, buildContactEmail } from "@/lib/email/contact";

const ok = { nafn: "Jón", netfang: "jon@example.is", simi: "8621234", skilabod: "Halló" };

describe("validateContact", () => {
  it("accepts a full payload", () => expect(validateContact(ok)).toBeNull());
  it("requires name", () => expect(validateContact({ ...ok, nafn: " " })).toBe("Vinsamlegast fylltu út nafn."));
  it("requires valid email", () => expect(validateContact({ ...ok, netfang: "x" })).toBe("Vinsamlegast sláðu inn gilt netfang."));
  it("requires message", () => expect(validateContact({ ...ok, skilabod: "" })).toBe("Vinsamlegast skrifaðu skilaboð."));
  it("rejects honeypot", () => expect(validateContact({ ...ok, website: "spam" })).toBe("Sending mistókst."));
});

describe("buildContactEmail", () => {
  it("puts name in subject and all fields in body", () => {
    const m = buildContactEmail(ok);
    expect(m.subject).toBe("Fyrirspurn frá skralli.is – Jón");
    expect(m.text).toContain("Nafn: Jón");
    expect(m.text).toContain("Netfang: jon@example.is");
    expect(m.text).toContain("Símanúmer: 8621234");
    expect(m.text).toContain("Halló");
    expect(m.html).toContain("<strong>Nafn:</strong> Jón");
  });
  it("escapes html in message", () => {
    expect(buildContactEmail({ ...ok, skilabod: "<b>x</b>" }).html).not.toContain("<b>x</b>");
  });
});
```

`tests/actions.test.ts`:

```ts
import { describe, it, expect, vi } from "vitest";
import { submitContact } from "@/app/actions";

const ok = { nafn: "Jón", netfang: "jon@example.is", simi: "8621234", skilabod: "Halló" };

describe("submitContact", () => {
  it("returns validation error without sending", async () => {
    const send = vi.fn();
    const r = await submitContact({ ...ok, nafn: "" }, { send });
    expect(r).toEqual({ ok: false, error: "Vinsamlegast fylltu út nafn." });
    expect(send).not.toHaveBeenCalled();
  });
  it("sends once with reply-to set to the sender", async () => {
    process.env.EMAIL_FROM = "Skralli <vefur@skralli.is>";
    process.env.CONTACT_TO = "skralli@skralli.is";
    const send = vi.fn().mockResolvedValue({ id: "1" });
    const r = await submitContact(ok, { send });
    expect(r).toEqual({ ok: true });
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({ from: "Skralli <vefur@skralli.is>", to: "skralli@skralli.is", replyTo: "jon@example.is" });
  });
  it("returns a friendly error when sending throws", async () => {
    const send = vi.fn().mockRejectedValue(new Error("boom"));
    const r = await submitContact(ok, { send });
    expect(r).toEqual({ ok: false, error: "Ekki tókst að senda skilaboðin. Reyndu aftur eða sendu póst á skralli@skralli.is." });
  });
});
```

- [ ] **Step 2: Run** `npm test` → FAIL (modules not found).

- [ ] **Step 3: Implement** `lib/email/client.ts`:

```ts
import { Resend } from "resend";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable ${name}`);
  return v;
}
export function emailFrom(): string { return requireEnv("EMAIL_FROM"); }
export function contactTo(): string { return process.env.CONTACT_TO || "skralli@skralli.is"; }

let cached: { key: string; client: Resend } | null = null;
export function getResendClient(): Resend {
  const key = requireEnv("RESEND_API_KEY");
  if (cached?.key === key) return cached.client;
  cached = { key, client: new Resend(key) };
  return cached.client;
}
```

`lib/email/contact.ts`:

```ts
export type ContactPayload = { nafn: string; netfang: string; simi: string; skilabod: string; website?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateContact(p: ContactPayload): string | null {
  if (p.website) return "Sending mistókst.";
  if (!p.nafn?.trim()) return "Vinsamlegast fylltu út nafn.";
  if (!EMAIL_RE.test(p.netfang?.trim() ?? "")) return "Vinsamlegast sláðu inn gilt netfang.";
  if (!p.skilabod?.trim()) return "Vinsamlegast skrifaðu skilaboð.";
  return null;
}
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
export function buildContactEmail(p: ContactPayload) {
  const subject = `Fyrirspurn frá skralli.is – ${p.nafn.trim()}`;
  const text = [`Nafn: ${p.nafn}`, `Netfang: ${p.netfang}`, `Símanúmer: ${p.simi || "-"}`, "", "Skilaboð:", p.skilabod].join("\n");
  const html = `<p><strong>Nafn:</strong> ${esc(p.nafn)}</p><p><strong>Netfang:</strong> ${esc(p.netfang)}</p><p><strong>Símanúmer:</strong> ${esc(p.simi || "-")}</p><p><strong>Skilaboð:</strong></p><p>${esc(p.skilabod).replace(/\n/g, "<br/>")}</p>`;
  return { subject, text, html };
}
```

`app/actions.ts`:

```ts
"use server";
import { validateContact, buildContactEmail, type ContactPayload } from "@/lib/email/contact";
import { getResendClient, emailFrom, contactTo } from "@/lib/email/client";

export type ContactResult = { ok: true } | { ok: false; error: string };
type SendFn = (msg: { from: string; to: string; replyTo: string; subject: string; text: string; html: string }) => Promise<unknown>;

async function defaultSend(msg: Parameters<SendFn>[0]) {
  const { error } = await getResendClient().emails.send(msg);
  if (error) throw new Error(error.message);
}

export async function submitContact(p: ContactPayload, deps: { send?: SendFn } = {}): Promise<ContactResult> {
  const err = validateContact(p);
  if (err) return { ok: false, error: err };
  try {
    const mail = buildContactEmail(p);
    await (deps.send ?? defaultSend)({ from: emailFrom(), to: contactTo(), replyTo: p.netfang.trim(), ...mail });
    return { ok: true };
  } catch (e) {
    console.error("contact send failed", e instanceof Error ? e.message : e);
    return { ok: false, error: "Ekki tókst að senda skilaboðin. Reyndu aftur eða sendu póst á skralli@skralli.is." };
  }
}
```

Note: Next.js server actions must only export async functions; the `ContactResult` type export is fine. If the build complains about the `deps` parameter being non-serializable, keep the signature but document that the client always calls it with one argument.

- [ ] **Step 4: Run** `npm test` → all PASS.

- [ ] **Step 5: ContactForm + page** — `components/ContactForm.tsx` (client): four inputs with placeholders `Nafn`, `Netfang`, `Símanúmer`, `Skilaboð`, hidden `website` honeypot (`autoComplete="off" tabIndex={-1}` visually hidden), button `Senda!`, `useTransition`, success state text `Takk fyrir! Við höfum móttekið fyrirspurnina og svörum innan 1 klst á opnunartíma.` (only if the live site shows no success copy in the scrape; otherwise use the live copy), inline error. `app/hafa-samband/page.tsx`: H1 `Hafa Samband`, breadcrumb `Forsíða > Hafa Samband` (check scrape for exact capitalization), heading `Sendu okkur fyrirspurn!`, company details block, the form, map/image if present in scrape. Metadata from scrape.

- [ ] **Step 6: Manual send** — with `.env.local` filled (Einar pastes the key locally, not in chat), submit once from `npm run dev`; confirm receipt at skralli@skralli.is. Record the result in the task summary.

- [ ] **Step 7: Verify + commit**

```bash
npm run verify -- /hafa-samband
git add lib app components tests
git commit -m "Hafa samband page with Resend-backed contact form and tests

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 14: Metadata, sitemap, robots, per-page titles

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`
- Modify: every `page.tsx` to export `metadata` or `generateMetadata` with the scraped `title` and `description`

- [ ] **Step 1: sitemap.ts** returns `ROUTES` minus `/404`, mapped to `https://skralli.is{route}`. Import the list by moving `ROUTES` to `lib/routes.ts` (TS) and having `scripts/routes.mjs` re-export from a small JSON, or duplicate the array in `lib/routes.ts` with a test in `tests/routes.test.ts` asserting both lists are equal.
- [ ] **Step 2: robots.ts** allow all, sitemap URL.
- [ ] **Step 3: Titles**: grep every `docs/scrape/*.json` for `title` and `description`, set them per page. Home title `Skralli - Þinn samstarfsaðili`.
- [ ] **Step 4: Build** `npm run build` → 57 static routes listed (56 pages + not-found). `curl localhost:3000/sitemap.xml | grep -c '<loc>'` → 56.
- [ ] **Step 5: Commit**

```bash
git add app lib tests
git commit -m "Sitemap, robots and per-page metadata copied from live site

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 15: Drive originals swap

**Files:**
- Create: `scripts/drive-swaps.md` (record of swaps)
- Modify: files under `public/images/**`, `docs/asset-manifest.json`

- [ ] **Step 1:** In the main session (Drive MCP), list image files in the Drive subfolders under `15U-jjfzt4Nz-IIA289rVkz26hY178P6i` (BMair, Lilleseth, Hammerglass, Gigant sturtuvagnar, pebe mottur og aklaedi, ljosabogar, smurkerfi, Starfsmenn, vertical myndir, hifi og festibunadur, innflutningur).
- [ ] **Step 2:** For each live image in the manifest, look for a Drive file that is visually the same photo (compare thumbnails; match by aspect ratio and content). Where the Drive file has larger pixel dimensions, download it and overwrite the local file, keeping the same filename and extension (convert HEIC/TIFF to JPG with `sips -s format jpeg`).
- [ ] **Step 3:** Record each swap in `scripts/drive-swaps.md` as `localPath ← Drive title (id), live WxH → drive WxH` and set `"swappedFromDrive": true` on the manifest entry.
- [ ] **Step 4:** `npm run build` still passes; spot-check swapped images render.
- [ ] **Step 5: Commit**

```bash
git add public/images docs/asset-manifest.json scripts/drive-swaps.md
git commit -m "Swap in higher-resolution Drive originals for live-site images

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 16: Full verification and visual QA

- [ ] **Step 1:** `npm run build && npm start` in one terminal; `npm run verify` (all 57) in another → exit 0, `docs/verify-report.md` all OK.
- [ ] **Step 2:** For `/`, `/smurkerfi`, `/vorumerki/hammerglass`, `/sturtuvagnar/hjolagrofuvagn-gd3-6x`, `/hafa-samband`: take local full-page screenshots at 1440 and 390 (`npx playwright screenshot --full-page --viewport-size=1440,900 http://localhost:3000/ out.png`) and place them side by side with `docs/reference/*.png`. Fix layout mismatches above the noise level (spacing off by more than ~16px, wrong section order, wrong colors, missing images).
- [ ] **Step 3:** Lighthouse (Chrome devtools or `npx lighthouse http://localhost:3000 --only-categories=performance,accessibility,seo --quiet`) — accessibility ≥ 90, SEO ≥ 90. Fix alt text and heading order issues.
- [ ] **Step 4:** Commit fixes and the report.

```bash
git add -A
git commit -m "Visual QA fixes and verification report

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
```

---

### Task 17: Push and deploy to Vercel

- [ ] **Step 1:** `git push -u origin main`.
- [ ] **Step 2:** `vercel link --yes` under the Kode team, then `vercel env add RESEND_API_KEY production` (Einar pastes the value in the terminal prompt, never in chat), `vercel env add EMAIL_FROM production` (`Skralli <vefur@skralli.is>` or whatever sender is verified in Resend), `vercel env add CONTACT_TO production` (`skralli@skralli.is`). Repeat for `preview`.
- [ ] **Step 3:** `vercel --prod` → note the deployment URL. Run `LOCAL=https://<deployment> npm run verify` → exit 0.
- [ ] **Step 4:** Send one real contact-form message from the deployment; confirm it arrives.
- [ ] **Step 5:** Report to Einar: deployment URL, verify report summary, list of Drive swaps, and the DNS step needed to point `skralli.is` at Vercel when he's ready (not done in this plan).

---

## Self-review

- **Spec coverage:** page inventory → Tasks 6–12; verbatim text/images → Task 2 + verify in Task 5/16; logos + favicon → Task 3; Drive swaps → Task 15; NowAlt → Task 1; Resend form → Task 13; metadata/sitemap → Task 14; deploy → Task 17; stable product `id`s → Task 10/12 types. Later login/DK/Straumur explicitly excluded.
- **Placeholders:** none; where content depends on scrape output the plan names the exact file to read and the exact acceptance check.
- **Type consistency:** `Img` defined in Task 10 and referenced in Tasks 6, 7, 8, 12 — Task 6 must define it in `lib/types.ts` first (`export type Img = { src: string; alt: string; width: number; height: number }`) and Tasks 8/10/12 import from there. `ContactPayload` field names (`nafn`, `netfang`, `simi`, `skilabod`) match between `lib/email/contact.ts`, `app/actions.ts`, tests, and the form.
