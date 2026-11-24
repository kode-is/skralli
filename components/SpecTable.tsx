import { rowId } from "@/lib/search/row-id";

type SpecTableProps = {
  headers: string[];
  rows: string[][];
  /** Index in the page's `tables`, the order lib/search/build-index.ts uses,
   * so each row id matches the `#row-...` fragment of its search result. */
  tableIndex: number;
  /** id of the heading above this table, used as its accessible name. */
  ariaLabelledBy?: string;
  /** Rows to show. All rows are always in the HTML; omitted means show all. */
  isRowVisible?: (row: string[]) => boolean;
};

/**
 * Product-spec table. From `md` up it is a normal table. On phones each row
 * becomes a labeled block, so every column stays visible without sideways
 * scrolling. Explicit ARIA roles keep the table semantics that browsers drop
 * when table elements get a non-table `display`. Column labels come from CSS
 * `attr()` so they are not repeated in the page text.
 */
export function SpecTable({ headers, rows, tableIndex, ariaLabelledBy, isRowVisible }: SpecTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E3E9F2] bg-white">
      <table role="table" aria-labelledby={ariaLabelledBy} className="w-full border-collapse font-ui text-left text-sm max-md:block">
        <thead role="rowgroup" className="bg-[#f0f4fa] max-md:sr-only">
          <tr role="row">
            {headers.map((header) => (
              <th key={header} role="columnheader" scope="col" className="px-5 py-3.5 font-semibold whitespace-nowrap text-[#171717]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup" className="max-md:block">
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              role="row"
              id={rowId(tableIndex, rowIndex, row[0] ?? "")}
              className={`border-t border-[#E3E9F2] transition-colors first:border-t-0 hover:bg-[#f7f9fc] max-md:grid max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-0.5 max-md:px-4 max-md:py-3 md:first:border-t ${
                isRowVisible && !isRowVisible(row) ? "!hidden" : ""
              }`}
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  role="cell"
                  data-label={headers[cellIndex]}
                  className={`md:px-5 md:py-3.5 ${
                    cellIndex === 0
                      ? "font-semibold text-brand-dark max-md:col-span-2 max-md:text-[15px]"
                      : cellIndex === 1
                        ? "text-[#171717] max-md:col-span-2"
                        : "text-[#444444] max-md:mt-1 max-md:font-medium max-md:text-[#171717] max-md:before:mr-1.5 max-md:before:text-xs max-md:before:font-normal max-md:before:text-[#5b6472] max-md:before:content-[attr(data-label)]"
                  }`}
                >
                  {cell.split("\n").map((line, lineIndex) => (
                    <span key={lineIndex}>
                      {lineIndex > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
