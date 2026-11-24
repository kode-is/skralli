import { describe, expect, it } from "vitest";
import { hifiPages } from "@/lib/hifi";

const number = (value: string) => Number.parseFloat(value.replace(",", "."));
const page = (id: string) => hifiPages.find((p) => p.id === id)!;

describe("lifting page statements match their tables", () => {
  it.each(["hifikedjur", "bindikedjur-strekkjarar"])("%s WLL range equals the table", (id) => {
    const current = page(id);
    const block = current.blocks.find((b) => b.type === "heading" && b.text === "Leyfilegt vinnuálag (WLL)");
    const table = current.tables![0];
    const column = table.headers.findIndex((h) => h.includes("LVÁ"));
    const values = table.rows.map((row) => number(row[column]));
    if (block?.type !== "heading" || !block.range) throw new Error("missing WLL range");
    expect(number(block.range.min)).toBe(Math.min(...values));
    expect(number(block.range.max)).toBe(Math.max(...values));
  });

  it.each(["hifikedjur", "bindikedjur-strekkjarar"])("%s lists only grades in its table", (id) => {
    const current = page(id);
    const stated = current.blocks.flatMap((b) => (b.type === "heading" && /^Grade \d+$/.test(b.text) ? [b.text.slice(6)] : []));
    const inTable = new Set(current.tables![0].rows.map((row) => row[1].match(/^G(\d+)/)![1]));
    expect(new Set(stated)).toEqual(inTable);
  });
});
