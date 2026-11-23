import { describe, expect, it } from "vitest";
import { PAGE_META } from "@/lib/page-meta";
import { ROUTES } from "@/lib/routes";

// These routes write their own metadata (home, brand pages, not-found).
const OWN_METADATA = (route: string) =>
  route === "/" || route === "/404" || route === "/vorumerki" || route.startsWith("/vorumerki/");

const entries = Object.entries(PAGE_META);

describe("PAGE_META", () => {
  it("covers every route without its own metadata", () => {
    const missing = ROUTES.filter((route) => !OWN_METADATA(route) && !PAGE_META[route]);
    expect(missing).toEqual([]);
  });

  it("only lists real routes", () => {
    expect(entries.map(([path]) => path).filter((path) => !ROUTES.includes(path))).toEqual([]);
  });

  it("has unique titles and descriptions", () => {
    expect(new Set(entries.map(([, meta]) => meta.title)).size).toBe(entries.length);
    expect(new Set(entries.map(([, meta]) => meta.description)).size).toBe(entries.length);
  });

  it("keeps snippets short enough to show whole in Google", () => {
    expect(entries.filter(([, meta]) => meta.title.length > 60).map(([path]) => path)).toEqual([]);
    expect(entries.filter(([, meta]) => meta.description.length > 160).map(([path]) => path)).toEqual([]);
  });
});
