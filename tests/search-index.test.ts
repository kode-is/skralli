import { describe, it, expect } from "vitest";
import { buildIndex } from "@/lib/search/build-index";
import { rowId } from "@/lib/search/row-id";
import { hifiPages } from "@/lib/hifi";
import { wagons } from "@/lib/sturtuvagnar";
import { brands } from "@/lib/brands";
import sitemap from "@/app/sitemap";

const SITE_URL = "https://skralli.is";

describe("lib/search/build-index", () => {
  const entries = buildIndex();

  it("gives every entry a non-empty title and url", () => {
    for (const entry of entries) {
      expect(entry.title, entry.id).toBeTruthy();
      expect(entry.url, entry.id).toBeTruthy();
    }
  });

  it("gives every entry a unique id", () => {
    const ids = entries.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every sitemap pathname exactly once as a page, product, or brand url", () => {
    // Deviation from the brief's literal "page or product" wording: the 6
    // /vorumerki/<slug> brand routes are represented by dedicated `brand`
    // entries (title/text curated from lib/brands.ts), the same way the 25
    // product routes are represented by `product` entries rather than
    // generic `page` entries — see build-index.ts's module comment.
    const pathnames = sitemap().map((entry) => entry.url.replace(SITE_URL, ""));
    const coverableKinds = new Set(["page", "product", "brand"]);
    const urlCounts = new Map<string, number>();
    for (const entry of entries) {
      if (!coverableKinds.has(entry.kind)) continue;
      urlCounts.set(entry.url, (urlCounts.get(entry.url) ?? 0) + 1);
    }
    for (const pathname of pathnames) {
      expect(urlCounts.get(pathname), pathname).toBe(1);
    }
  });

  it("every product wagon and brand appears exactly once", () => {
    const productUrls = new Set(entries.filter((e) => e.kind === "product").map((e) => e.url));
    for (const wagon of wagons) {
      expect(productUrls.has(`/sturtuvagnar/${wagon.slug}`)).toBe(true);
    }
    const brandUrls = new Set(entries.filter((e) => e.kind === "brand").map((e) => e.url));
    for (const brand of brands) {
      expect(brandUrls.has(brand.href)).toBe(true);
    }
  });

  it("every row url's fragment matches an id SpecTable would render", () => {
    const rowEntries = entries.filter((e) => e.kind === "row");
    expect(rowEntries.length).toBeGreaterThan(0);

    const expectedIds = new Set<string>();
    for (const page of hifiPages) {
      (page.tables ?? []).forEach((table, tableIndex) => {
        table.rows.forEach((row, rowIndex) => {
          expectedIds.add(rowId(tableIndex, rowIndex, row[0]));
        });
      });
    }

    for (const entry of rowEntries) {
      const fragment = entry.url.split("#")[1];
      expect(fragment, entry.id).toBeTruthy();
      expect(expectedIds.has(fragment!), fragment).toBe(true);
    }
  });
});
