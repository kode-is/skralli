// Pure Icelandic-aware text normalization for the site search index and
// matcher (lib/search/search.ts). No dependencies, safe to import from a
// route handler, a Node script, or a test.

/**
 * Icelandic noun/adjective endings, longest first, stripped by `stem()`.
 * Order matters: the first matching ending (scanning this list top to
 * bottom) is the one removed, so a 4-char ending is preferred over a 2-char
 * ending that would also match the same token's tail.
 */
const STEM_ENDINGS = [
  "anna",
  "unum",
  "inum",
  "inn",
  "ina",
  "inu",
  "ana",
  "num",
  "nar",
  "nir",
  "ur",
  "ar",
  "ir",
  "um",
  "in",
  "id",
  "na",
  "a",
  "i",
  "u",
] as const;

const MIN_STEM_LENGTH = 4;
const MIN_STEMMABLE_LENGTH = 5;

/**
 * NFD-decompose, drop combining marks, lower-case, fold the Icelandic
 * letters that NFD doesn't decompose (ð, þ, æ, ø), then collapse every run
 * of non-alphanumeric characters (spaces, punctuation, hyphens, commas...)
 * to a single space and trim.
 */
export function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/ð/g, "d")
    .replace(/þ/g, "th")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** `normalize()` with every remaining space also stripped — used for the
 * part-number match path ("taj 025" / "TAJ 0,25" both become "taj025"). */
export function compact(s: string): string {
  return normalize(s).replace(/[^a-z0-9]/g, "");
}

/**
 * Strips exactly one trailing Icelandic ending from tokens of 5+ characters
 * (so "keðjur"/"keðja"/"keðju" all reduce to "kedj"), never leaving fewer
 * than 4 characters. Shorter tokens (e.g. "vagn") are returned unchanged —
 * they're already at or below the minimum stem length, so stemming them
 * would only produce false matches.
 */
export function stem(token: string): string {
  if (token.length < MIN_STEMMABLE_LENGTH) return token;
  for (const ending of STEM_ENDINGS) {
    if (token.length - ending.length >= MIN_STEM_LENGTH && token.endsWith(ending)) {
      return token.slice(0, token.length - ending.length);
    }
  }
  return token;
}

/** `normalize()` then split on whitespace, dropping empty tokens. */
export function tokenize(s: string): string[] {
  const normalized = normalize(s);
  return normalized ? normalized.split(/\s+/).filter(Boolean) : [];
}
