import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { brands } from "@/lib/brands";
import { buildIndex } from "@/lib/search/build-index";
import { servicesMenu, footerColumns } from "@/lib/site";
import {
  SNOW_CHAINS_PATH,
  snowChainsFaq,
  snowChainsJumpLinks,
  snowChainsMeta,
  vehicleSections,
} from "@/lib/snjokedjur";
import { snowChainsJsonLd } from "@/lib/structured-data";
import { chainLines, vehicles } from "@/lib/vetrarbunadur";

describe("/snjokedjur content", () => {
  it("keeps the search title and description short enough to show whole", () => {
    expect(snowChainsMeta.title.length).toBeLessThanOrEqual(60);
    expect(snowChainsMeta.title.startsWith("Snjókeðjur")).toBe(true);
    expect(snowChainsMeta.description.length).toBeLessThanOrEqual(160);
  });

  it("has a section for every approved vehicle group, each with chain lines", () => {
    expect(vehicleSections.map((section) => section.title)).toEqual(vehicles.map((vehicle) => vehicle.title));
    for (const section of vehicleSections) {
      expect(section.heading, section.id).toContain("Snjókeðjur fyrir");
      expect(section.lines.length, section.id).toBeGreaterThan(0);
    }
  });

  it("only lists a chain line for vehicles it is approved for", () => {
    for (const section of vehicleSections) {
      for (const line of section.lines) {
        const approved = chainLines.items.find((item) => item.id === line.id);
        expect(approved, line.id).toBeDefined();
        for (const fit of line.fits) expect(approved!.fits, `${section.id}: ${line.name}`).toContain(fit);
        expect(line.sizes).toEqual(approved!.sizes);
      }
    }
  });

  it("shows every chain line in at least one vehicle group", () => {
    const listed = new Set(vehicleSections.flatMap((section) => section.lines.map((line) => line.id)));
    expect([...listed].sort()).toEqual(chainLines.items.map((line) => line.id).sort());
  });

  it("focuses the smallest group on fjórhjól and lyftarar", () => {
    const section = vehicleSections.find((item) => item.id === "fjorhjol")!;
    expect(section.heading).toBe("Snjókeðjur fyrir fjórhjól og lyftara");
    const fits = new Set(section.lines.flatMap((line) => line.fits));
    expect([...fits].sort()).toEqual(["Fjórhjól", "Lyftarar"]);
  });

  it("gives jump links unique targets", () => {
    const hrefs = snowChainsJumpLinks.map((link) => link.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("/snjokedjur wiring", () => {
  it("is in the sitemap and the site search", () => {
    expect(sitemap().map((entry) => entry.url)).toContain(`https://skralli.is${SNOW_CHAINS_PATH}`);
    const entry = buildIndex().find((item) => item.url === SNOW_CHAINS_PATH);
    expect(entry?.title).toBe("Snjókeðjur");
  });

  it("is linked from the services menu, the footer and the Lilleseth page", () => {
    expect(servicesMenu.columns.flat().map((link) => link.href)).toContain(SNOW_CHAINS_PATH);
    expect(footerColumns.flatMap((column) => column.links.map((link) => link.href))).toContain(SNOW_CHAINS_PATH);
    const lilleseth = brands.find((brand) => brand.id === "lilleseth-kjetting")!;
    expect(lilleseth.services.map((service) => service.href)).toContain(SNOW_CHAINS_PATH);
    expect(lilleseth.productLines[0].href).toBe(SNOW_CHAINS_PATH);
  });

  it("builds a schema graph whose FAQ matches the page", () => {
    const graph = snowChainsJsonLd({ ...snowChainsMeta, path: SNOW_CHAINS_PATH, faq: snowChainsFaq.items })["@graph"];
    const faq = graph.find((node) => node["@type"] === "FAQPage") as {
      mainEntity: { name: string; acceptedAnswer: { text: string } }[];
    };
    expect(faq.mainEntity.map((item) => item.name)).toEqual(snowChainsFaq.items.map((item) => item.question));
    expect(faq.mainEntity.map((item) => item.acceptedAnswer.text)).toEqual(snowChainsFaq.items.map((item) => item.answer));
  });
});
