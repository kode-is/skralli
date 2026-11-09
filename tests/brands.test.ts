import { describe, expect, it } from "vitest";
import { BRAND_INDEX_ORDER, brands, orderedBrands } from "@/lib/brands";
import { ROUTES } from "@/lib/routes";
import { brandIndexJsonLd, brandPageJsonLd } from "@/lib/structured-data";

const routes = new Set(ROUTES);
const pathOf = (href: string) => href.split("#")[0];

describe("lib/brands SEO content", () => {
  it("gives every brand a unique title of 60 characters or fewer", () => {
    const titles = brands.map((brand) => brand.seoTitle);
    expect(new Set(titles).size).toBe(titles.length);
    for (const brand of brands) {
      expect(brand.seoTitle.length, brand.id).toBeLessThanOrEqual(60);
      expect(brand.seoTitle, brand.id).toContain(brand.name);
    }
  });

  it("gives every brand a unique meta description of 160 characters or fewer", () => {
    const descriptions = brands.map((brand) => brand.seoDescription);
    expect(new Set(descriptions).size).toBe(descriptions.length);
    for (const brand of brands) {
      expect(brand.seoDescription.length, brand.id).toBeGreaterThanOrEqual(70);
      expect(brand.seoDescription.length, brand.id).toBeLessThanOrEqual(160);
    }
  });

  it("links every product line, sub-link and service to a real route", () => {
    for (const brand of brands) {
      const hrefs = [
        ...brand.services.map((service) => service.href),
        ...brand.productLines.flatMap((line) => [line.href, ...(line.links ?? []).map((link) => link.href)]),
      ];
      for (const href of hrefs) {
        expect(routes.has(pathOf(href)), `${brand.id}: ${href}`).toBe(true);
      }
    }
  });

  it("links each brand to every þjónusta page its product lines point at", () => {
    for (const brand of brands) {
      const services = new Set(brand.services.map((service) => service.href));
      for (const line of brand.productLines) {
        const servicePage = `/${pathOf(line.href).split("/")[1]}`;
        expect(services.has(servicePage), `${brand.id}: ${line.href}`).toBe(true);
      }
    }
  });

  it("has product lines and FAQs on every brand page", () => {
    for (const brand of brands) {
      expect(brand.productLines.length, brand.id).toBeGreaterThan(0);
      expect(brand.faq.length, brand.id).toBeGreaterThanOrEqual(2);
      expect(brand.highlights.length, brand.id).toBe(4);
    }
  });

  it("orders every brand exactly once on the index", () => {
    expect([...BRAND_INDEX_ORDER].sort()).toEqual(brands.map((brand) => brand.id).sort());
    expect(orderedBrands()).toHaveLength(brands.length);
  });
});

describe("lib/structured-data", () => {
  it("builds a brand graph whose FAQ matches the page's questions", () => {
    for (const brand of brands) {
      const graph = brandPageJsonLd(brand)["@graph"];
      const faq = graph.find((node) => node["@type"] === "FAQPage") as { mainEntity: { name: string }[] };
      expect(faq.mainEntity.map((question) => question.name)).toEqual(brand.faq.map((item) => item.question));
      const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList") as {
        itemListElement: { item: string }[];
      };
      expect(crumbs.itemListElement.at(-1)?.item).toBe(`https://skralli.is${brand.href}`);
    }
  });

  it("lists every brand on the index graph", () => {
    const graph = brandIndexJsonLd({ title: "t", description: "d", brands: orderedBrands() })["@graph"];
    const list = graph.find((node) => node["@type"] === "ItemList") as { itemListElement: unknown[] };
    expect(list.itemListElement).toHaveLength(brands.length);
  });
});
