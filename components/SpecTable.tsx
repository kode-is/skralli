type SpecTableProps = {
  headers: string[];
  rows: string[][];
};

/**
 * Product-spec table (Task 12's Hífi- og festibúnaður sub-pages). A plain
 * semantic `<table>` rather than the two responsive DOM trees Framer ships
 * on the live site (a desktop table plus a separate mobile "Table" widget
 * with search/filter/export chrome — see scripts/gen-hifi.mjs's comment on
 * hifikedjur's duplicate content) — wrapped in `overflow-x-auto` so a wide
 * table scrolls within its own box instead of the page. Colors match
 * docs/scrape/formatting.json's table styling (border #e0e0e0, header
 * background #f7f7f8); no zebra striping, matching the reference
 * screenshots' plain white rows.
 */
export function SpecTable({ headers, rows }: SpecTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[#e0e0e0]">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead className="bg-[#f7f7f8]">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="whitespace-nowrap px-4 py-3 font-semibold text-neutral-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-[#e0e0e0]">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 text-neutral-700">
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
