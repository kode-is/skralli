// Caps the longest side of every raster image under public/images at MAX px.
// Why: the Vercel image optimizer decodes the source for every size it
// serves, and its time scales with source pixels. The site never displays an
// image wider than a full-bleed hero, so 24-megapixel originals only make
// first (uncached) requests slow. Originals remain in git history.
//
//   node scripts/shrink-images.mjs          # dry run, prints what would change
//   node scripts/shrink-images.mjs --write  # rewrites files in place
import { readdir, stat, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/images";
const MAX = 2560;
const WRITE = process.argv.includes("--write");

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function encode(pipeline, ext) {
  if (ext === ".jpg" || ext === ".jpeg") return pipeline.jpeg({ quality: 90, mozjpeg: true });
  if (ext === ".png") return pipeline.png({ compressionLevel: 9 });
  if (ext === ".webp") return pipeline.webp({ quality: 90 });
  return null;
}

let changed = 0, before = 0, after = 0, scanned = 0;
for await (const file of walk(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;
  scanned++;
  const input = await readFile(file);
  const meta = await sharp(input).metadata();
  // EXIF orientations 5-8 swap the displayed width and height.
  const swapped = (meta.orientation ?? 1) >= 5;
  const w = swapped ? meta.height : meta.width;
  const h = swapped ? meta.width : meta.height;
  if (Math.max(w, h) <= MAX) continue;

  const pipeline = sharp(input)
    .rotate() // bake in EXIF orientation before the tag is dropped
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true, kernel: "lanczos3" });
  const output = await encode(pipeline, ext).toBuffer();
  if (output.length >= input.length) continue;

  const out = await sharp(output).metadata();
  console.log(
    `${(input.length / 1048576).toFixed(1).padStart(5)} MB ${String(w).padStart(5)}x${String(h).padEnd(5)} -> ` +
      `${(output.length / 1048576).toFixed(2).padStart(5)} MB ${out.width}x${out.height}  ${file}`,
  );
  changed++; before += input.length; after += output.length;
  if (WRITE) await writeFile(file, output);
}
const total = (await Promise.all((await Array.fromAsync(walk(ROOT))).map((f) => stat(f)))).reduce((a, s) => a + s.size, 0);
console.log(
  `\n${WRITE ? "rewrote" : "would rewrite"} ${changed} of ${scanned} raster images: ` +
    `${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB ` +
    `(folder now ${(total / 1048576).toFixed(1)} MB)`,
);
