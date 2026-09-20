export type SearchKind = "page" | "product" | "row" | "brand" | "faq";

export type SearchEntry = {
  id: string;
  kind: SearchKind;
  title: string;
  url: string;
  subtitle?: string;
  keywords?: string;
  headings?: string;
  text?: string;
};
