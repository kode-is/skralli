// Headline stat counters, shared by the home page and /um-okkur.
//
// These no longer track the numbers scraped from the old live site
// (480/130/1/50 in docs/scrape/home.json) — they are current figures
// supplied by Skralli, so a mismatch against the scrape is expected.
// scripts/verify.mjs already ignores drift on these counters.
//
// The old site's "Ísett smurkefi" label was a typo for "smurkerfi" and was
// preserved verbatim while this was a recreation; it is spelled correctly
// here now.

export type Stat = { value: string; suffix: string; label: string };

export const stats: Stat[] = [
  { value: "650", suffix: "+", label: "Ísett smurkerfi" },
  { value: "160", suffix: "+", label: "Innflutt tæki" },
  { value: "24", suffix: "klst", label: "Fyrirspurnum svarað innan" },
  { value: "8", suffix: "+", label: "Vörumerki" },
];
