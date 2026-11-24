/**
 * Other names customers use for the lifting products, taken from Icelandic
 * suppliers' category and product names. `shown` terms appear on the page
 * and in site search. `searchOnly` terms are close alternatives that should
 * find the page but are not the same product name.
 */
type Terms = { shown: string[]; searchOnly?: string[] };

const PAGE_TERMS: Record<string, Terms> = {
  hifikedjur: { shown: ["Lyftikeðjur", "Keðjuslingir"] },
  "bindikedjur-strekkjarar": { shown: ["Festibúnaður"] },
  stroffur: { shown: ["Borðastroffur", "Stroffulykkjur"] },
  "stroffur/hringstroffur": { shown: ["Stroffulykkjur"] },
  "stroffur/drattastroffur": { shown: [], searchOnly: ["Dráttartóg"] },
  bordastrekkjarar: { shown: ["Strekkibönd", "Spennubönd"], searchOnly: ["Strekkiband", "skrallspenna"] },
};

const SECTION_TERMS: Record<string, string[]> = {
  Keðjutalíur: ["Talíur", "Púllarar"],
  "D-lás": ["Lásar"],
  Öryggiskrókur: ["Öryggiskrókar", "Sjálflæsandi öryggiskrókar"],
  "Kranakrókur lokaður": ["Kranakrókur með loku"],
  Ásuðukrókur: ["Gröfukrókar til ásuðu"],
};

export const pageTerms = (path: string[]): string[] => PAGE_TERMS[path.join("/")]?.shown ?? [];

export const sectionTerms = (heading: string): string[] => SECTION_TERMS[heading] ?? [];

/** Every term for a page, including those of the given section headings. */
export function searchTerms(path: string[], headings: string[]): string {
  const page = PAGE_TERMS[path.join("/")];
  return [...(page?.shown ?? []), ...(page?.searchOnly ?? []), ...headings.flatMap(sectionTerms)].join(" ");
}
