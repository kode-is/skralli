"use client";

import { useEffect, useMemo, useState } from "react";
import { SpecTable } from "@/components/SpecTable";
import type { HifiTable } from "@/lib/hifi";

const CAPACITY_HEADER = /LVÁ|Burðar|Lyftigeta/;
const MIN_ROWS_FOR_FILTER = 12;

const capacityValue = (cell: string) => Number.parseFloat(cell.replace(",", "."));

/**
 * A spec table with capacity buttons on the long tables (up to 48 rows).
 * Every row stays in the server-rendered HTML. A search result that links to
 * a row clears the filter first so that the row can be scrolled to.
 */
export function FilterableSpecTable({
  table,
  tableIndex,
  ariaLabelledBy,
}: {
  table: HifiTable;
  tableIndex: number;
  ariaLabelledBy?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const column = table.headers.findIndex((header) => CAPACITY_HEADER.test(header));
  const options = useMemo(
    () =>
      column < 0 || table.rows.length < MIN_ROWS_FOR_FILTER
        ? []
        : [...new Set(table.rows.map((row) => row[column]))].sort((a, b) => capacityValue(a) - capacityValue(b)),
    [column, table.rows],
  );

  useEffect(() => {
    if (!options.length) return;
    const clearForRowLink = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href*='#row-']");
      if (link) setActive(null);
    };
    const clearForHash = () => {
      if (window.location.hash.startsWith("#row-")) setActive(null);
    };
    document.addEventListener("click", clearForRowLink, true);
    window.addEventListener("hashchange", clearForHash);
    return () => {
      document.removeEventListener("click", clearForRowLink, true);
      window.removeEventListener("hashchange", clearForHash);
    };
  }, [options.length]);

  const shown = active === null ? table.rows.length : table.rows.filter((row) => row[column] === active).length;
  const chip = (selected: boolean) =>
    `min-h-10 rounded-full border px-3.5 py-1.5 font-ui text-[13px] font-semibold transition-colors ${
      selected
        ? "border-brand-dark bg-brand-dark text-white"
        : "border-[#D5DEEA] bg-white text-[#171717] hover:border-brand-dark hover:text-brand-dark"
    }`;

  return (
    <div>
      {options.length ? (
        <div role="group" aria-label="Sía eftir burðargetu" className="mb-4">
          <div className="mb-2.5 flex items-baseline justify-between gap-4 font-ui text-[13px]">
            <span className="font-semibold text-[#171717]">Burðargeta</span>
            <span aria-live="polite" className="text-[#5b6472]">
              {shown} af {table.rows.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" aria-pressed={active === null} onClick={() => setActive(null)} className={chip(active === null)}>
              Allt
            </button>
            {options.map((option) => (
              <button key={option} type="button" aria-pressed={active === option} onClick={() => setActive(option)} className={chip(active === option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <SpecTable
        headers={table.headers}
        rows={table.rows}
        tableIndex={tableIndex}
        ariaLabelledBy={ariaLabelledBy}
        isRowVisible={active === null ? undefined : (row) => row[column] === active}
      />
    </div>
  );
}
