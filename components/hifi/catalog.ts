import { hifiPages, type HifiPage } from "@/lib/hifi";
import type { Img } from "@/lib/types";

/** Product numbers on one page: table rows plus the H3 + spec-line products. */
function ownProductCount(page: HifiPage): number {
  const tables = page.tables ?? [];
  const tableHeadings = new Set(tables.map((table) => table.heading));
  const listed = page.blocks.filter((block, index) => {
    const next = page.blocks[index + 1];
    return block.type === "heading" && block.level === 3 && next?.type === "text" && !tableHeadings.has(block.text);
  }).length;
  return listed + tables.reduce((sum, table) => sum + table.rows.length, 0);
}

/** Product numbers in a category, including its sub-pages (stroffur). */
export function productCount(href: string): number {
  const path = href.replace(/^\/hifi-festibunadur\//, "");
  return hifiPages
    .filter((page) => {
      const pagePath = page.path.join("/");
      return pagePath === path || pagePath.startsWith(`${path}/`);
    })
    .reduce((sum, page) => sum + ownProductCount(page), 0);
}

/**
 * Most lifting photos are small products on a wide white canvas, so a cover
 * crop brings the product forward without cutting it. Square and portrait
 * photos are shown whole.
 */
export function photoFit(image: Img): string {
  return image.width / image.height > 2 ? "object-cover" : "object-contain p-4";
}
