import { describe, it, expect } from "vitest";
import { normalize, compact, stem, tokenize } from "@/lib/search/normalize";

describe("lib/search/normalize", () => {
  it("normalizes Icelandic diacritics and eth/thorn", () => {
    expect(normalize("Öryggisrúður")).toBe("oryggisrudur");
    expect(normalize("Þjónusta")).toBe("thjonusta");
    expect(normalize("Fyrir ökumanninn")).toBe("fyrir okumanninn");
  });

  it("collapses punctuation to single spaces and trims", () => {
    expect(normalize("  Hífi- & festibúnaður  ")).toBe("hifi festibunadur");
    expect(normalize("GW-100")).toBe("gw 100");
  });

  it("compacts to letters and digits only", () => {
    expect(compact("TAJ 0,25")).toBe("taj025");
    expect(compact("GW-100")).toBe("gw100");
  });

  it("stems Icelandic suffixes without over-stripping short words", () => {
    expect(stem("kedjur")).toBe(stem("kedja"));
    expect(stem("kedjur")).toBe("kedj");
    expect(stem("vagn")).toBe("vagn");
  });

  it("never leaves fewer than 4 characters after stemming", () => {
    // "num" is a 3-char ending; stripping it from a 6-char token would
    // leave exactly 3 chars, which is disallowed (never < 4).
    const token = stem("abcnum");
    expect(token.length).toBeGreaterThanOrEqual(4);
  });

  it("tokenizes on normalized whitespace and drops empties", () => {
    expect(tokenize("  Hífikeðjur   og   Strekkjarar  ")).toEqual(["hifikedjur", "og", "strekkjarar"]);
    expect(tokenize("")).toEqual([]);
    expect(tokenize("   ")).toEqual([]);
  });
});
