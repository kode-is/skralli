import { compact } from "./normalize";

/**
 * Stable, unique id for a spec-table row, shared by `buildIndex()` (which
 * builds the `row` search entries) and `SpecTable` (which renders the
 * matching `<tr id>` so a row result's `#row-...` link lands on it and
 * `tr:target` can highlight it — see app/globals.css).
 */
export function rowId(tableIndex: number, rowIndex: number, firstCell: string): string {
  return `row-${compact(firstCell)}-${tableIndex}-${rowIndex}`;
}
