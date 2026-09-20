import { describe, it, expect, beforeAll } from "vitest";
import { buildIndex } from "@/lib/search/build-index";
import { search } from "@/lib/search/search";
import type { SearchEntry, SearchResultGroup } from "@/lib/search/search";

let entries: SearchEntry[];

beforeAll(() => {
  entries = buildIndex();
});

function firstUrlOfKind(groups: SearchResultGroup[], kind: string): string | undefined {
  return groups.find((g) => g.kind === kind)?.items[0]?.url;
}

function hasKind(groups: SearchResultGroup[], kind: string): boolean {
  return groups.some((g) => g.kind === kind && g.items.length > 0);
}

describe("lib/search/search (against the real index)", () => {
  it("finds the öryggisrúður page", () => {
    const groups = search(entries, "oryggisrudur");
    expect(firstUrlOfKind(groups, "page")).toBe("/oryggisrudur");
  });

  it("finds the þjónusta page", () => {
    const groups = search(entries, "thjonusta");
    expect(firstUrlOfKind(groups, "page")).toBe("/thjonusta");
  });

  it("finds the GW-100 product with or without the hyphen", () => {
    const withHyphen = search(entries, "gw-100");
    const withSpace = search(entries, "gw 100");
    expect(firstUrlOfKind(withHyphen, "product")).toBe("/sturtuvagnar/gw-100");
    expect(firstUrlOfKind(withSpace, "product")).toBe("/sturtuvagnar/gw-100");
  });

  it("finds a part-number row via the compact/part-number path", () => {
    const groups = search(entries, "taj 025");
    const rowGroup = groups.find((g) => g.kind === "row");
    expect(rowGroup).toBeTruthy();
    const first = rowGroup!.items[0];
    expect(first.title).toBe("TAJ 0,25");
    expect(first.url).toContain("#row-taj025");
  });

  it("matches both keðjur and keðja to the hífikeðjur page or a row", () => {
    const plural = search(entries, "keðjur");
    const singular = search(entries, "keðja");
    expect(hasKind(plural, "page") || hasKind(plural, "row")).toBe(true);
    expect(hasKind(singular, "page") || hasKind(singular, "row")).toBe(true);
  });

  it("finds a brand", () => {
    const groups = search(entries, "hammerglass");
    expect(hasKind(groups, "brand")).toBe(true);
  });

  it("finds a faq entry for a word taken from lib/faq.ts (koppafeiti)", () => {
    const groups = search(entries, "koppafeiti");
    expect(hasKind(groups, "faq")).toBe(true);
  });

  it("returns nothing for a nonsense query", () => {
    expect(search(entries, "zzzzqq")).toEqual([]);
  });

  it("requires every token to match (gw-100 zzzz matches nothing)", () => {
    expect(search(entries, "gw-100 zzzz")).toEqual([]);
  });

  it("returns [] for an empty query", () => {
    expect(search(entries, "")).toEqual([]);
    expect(search(entries, "   ")).toEqual([]);
  });
});

describe("contact details", () => {
  it("finds the contact page for phone, opening hours and address words", async () => {
    const { buildIndex } = await import("@/lib/search/build-index");
    const { search } = await import("@/lib/search/search");
    const entries = buildIndex();
    for (const q of ["sími", "simanumer", "opnunartími", "862 4046", "Móhella"]) {
      const pages = search(entries, q).find((g) => g.kind === "page");
      expect(pages?.items[0]?.url, q).toBe("/hafa-samband");
    }
  });
});

describe("privacy policy", () => {
  it("is in the sitemap and findable by search", async () => {
    const { default: sitemap } = await import("@/app/sitemap");
    expect(sitemap().map((e) => e.url)).toContain("https://skralli.is/personuvernd");
    const { buildIndex } = await import("@/lib/search/build-index");
    const { search } = await import("@/lib/search/search");
    const entries = buildIndex();
    for (const q of ["persónuvernd", "personuverndarstefna", "vafrakökur"]) {
      const pages = search(entries, q).find((g) => g.kind === "page");
      expect(pages?.items.map((i) => i.url), q).toContain("/personuvernd");
    }
  });
});
