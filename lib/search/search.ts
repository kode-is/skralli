// Pure, dependency-free query matcher over a prepared `SearchEntry[]`. See
// docs/superpowers/specs/2026-09-20-site-search-design.md for the matching
// rules this implements (Icelandic-aware normalisation/stemming, prefix
// matching, per-field weights, the part-number "compact" path).
import { compact, stem, tokenize } from "./normalize";
import type { SearchEntry, SearchKind } from "./types";

export type { SearchEntry, SearchKind } from "./types";

export type SearchResultGroup = {
  kind: SearchKind;
  items: SearchEntry[];
  total: number;
};

type FieldName = "title" | "keywords" | "headings" | "subtitle" | "text";

const FIELD_WEIGHTS: Record<FieldName, number> = {
  title: 10,
  keywords: 6,
  headings: 4,
  subtitle: 3,
  text: 1,
};

const FIELD_NAMES = Object.keys(FIELD_WEIGHTS) as FieldName[];

// The order search()'s returned groups are in — see search.ts's own
// module comment below for why this follows the algorithm section's
// explicit "page, product, brand, faq, row" rather than the UI section's
// prose listing ("Síður / Vörur / Vörunúmer / Vörumerki / Spurt & svarað",
// i.e. row before brand/faq).
const KIND_ORDER: SearchKind[] = ["page", "product", "brand", "faq", "row"];

const DEFAULT_LIMITS: Record<SearchKind, number> = {
  page: 5,
  product: 6,
  brand: 4,
  faq: 3,
  row: 8,
};

const PART_NUMBER_MIN_LENGTH = 3;
const PART_NUMBER_LEVEL = 2.5;

type PreparedField = { tokens: string[] };

type PreparedEntry = {
  fields: Partial<Record<FieldName, PreparedField>>;
  titleCompact: string;
  keywordsCompact: string;
};

// Memoized per entry object so re-running search() on every keystroke
// doesn't re-normalize the whole index each time (per the brief: "memoize
// in a WeakMap or return a prepared index from prepare(entries)").
const cache = new WeakMap<SearchEntry, PreparedEntry>();

function prepareField(value: string | undefined): PreparedField | undefined {
  if (!value) return undefined;
  return { tokens: tokenize(value) };
}

function prepareEntry(entry: SearchEntry): PreparedEntry {
  const cached = cache.get(entry);
  if (cached) return cached;
  const prepared: PreparedEntry = {
    fields: {
      title: prepareField(entry.title),
      keywords: prepareField(entry.keywords),
      headings: prepareField(entry.headings),
      subtitle: prepareField(entry.subtitle),
      text: prepareField(entry.text),
    },
    titleCompact: compact(entry.title),
    keywordsCompact: entry.keywords ? compact(entry.keywords) : "",
  };
  cache.set(entry, prepared);
  return prepared;
}

/** Pre-warms the normalization cache for a whole index ahead of the first
 * keystroke (e.g. right after the index finishes fetching). */
export function prepare(entries: SearchEntry[]): SearchEntry[] {
  for (const entry of entries) prepareEntry(entry);
  return entries;
}

/**
 * Match level between one query token and one word from a field:
 *  - exact (3), word-prefix — the word starts with the token (2),
 *  - stem-equal or the word contains the token's stem (1.5) — comparing
 *    the token's stem against the field word ITSELF (not the word's own
 *    stem) is what lets "keðja"/"keðjur" both match the single compound
 *    word "hífikeðjur" ("hifi"+"kedjur"): stemming the compound would only
 *    trim its own trailing "ur", leaving "hifikedj", which "kedj" is a
 *    substring of but never a prefix of. Gated on the stem actually
 *    differing from the raw token (i.e. token.length >= 5) so this can't
 *    degrade into an ungated substring check for short tokens.
 *  - substring, for tokens of 3+ chars (1).
 */
function tokenLevel(token: string, word: string): number {
  if (token === word) return 3;
  if (word.startsWith(token)) return 2;
  const stemmed = stem(token);
  if (stemmed !== token && (word === stemmed || word.includes(stemmed))) return 1.5;
  if (token.length >= PART_NUMBER_MIN_LENGTH && word.includes(token)) return 1;
  return 0;
}

function bestFieldLevel(token: string, field: PreparedField | undefined): number {
  if (!field) return 0;
  let best = 0;
  for (const word of field.tokens) {
    const level = tokenLevel(token, word);
    if (level > best) best = level;
  }
  return best;
}

function scoreEntry(prepared: PreparedEntry, tokens: string[], compactQuery: string): number {
  let allTokensMatch = true;
  let tokenScore = 0;
  for (const token of tokens) {
    let bestForToken = 0;
    for (const field of FIELD_NAMES) {
      const level = bestFieldLevel(token, prepared.fields[field]);
      if (level <= 0) continue;
      const weighted = level * FIELD_WEIGHTS[field];
      if (weighted > bestForToken) bestForToken = weighted;
    }
    if (bestForToken === 0) allTokensMatch = false;
    tokenScore += bestForToken;
  }

  // Part-number path: "taj 025" -> "taj025" matching a row's compacted
  // title/keywords ("TAJ 0,25" -> "taj025") counts as a match for the
  // WHOLE query, independent of whether every token matched normally
  // above (it typically won't: "025" doesn't appear as its own word or
  // substring next to "0,25"'s comma-split "0"/"25").
  let compactBonus = 0;
  if (compactQuery.length >= PART_NUMBER_MIN_LENGTH) {
    if (prepared.titleCompact.includes(compactQuery)) {
      compactBonus += PART_NUMBER_LEVEL * FIELD_WEIGHTS.title;
    }
    if (prepared.keywordsCompact && prepared.keywordsCompact.includes(compactQuery)) {
      compactBonus += PART_NUMBER_LEVEL * FIELD_WEIGHTS.keywords;
    }
  }

  if (!allTokensMatch && compactBonus === 0) return 0;
  return (allTokensMatch ? tokenScore : 0) + compactBonus;
}

function compareEntries(a: SearchEntry, b: SearchEntry, scoreOf: (e: SearchEntry) => number): number {
  const scoreDiff = scoreOf(b) - scoreOf(a);
  if (scoreDiff !== 0) return scoreDiff;
  const kindDiff = KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
  if (kindDiff !== 0) return kindDiff;
  const lengthDiff = a.title.length - b.title.length;
  if (lengthDiff !== 0) return lengthDiff;
  return a.title.localeCompare(b.title, "is");
}

/**
 * `search(entries, query, limitPerKind?)`: an entry matches only if every
 * query token matches at least one field (or the part-number "compact"
 * path fires). Returns groups in `page, product, brand, faq, row` order,
 * each capped to `limitPerKind[kind]` (falling back to the design's
 * defaults), omitting kinds with no matches. `total` is the match count
 * before capping, for a "N niðurstöður" live-region announcement.
 */
export function search(
  entries: SearchEntry[],
  query: string,
  limitPerKind?: Partial<Record<SearchKind, number>>,
): SearchResultGroup[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const compactQuery = compact(query);
  const limits: Record<SearchKind, number> = { ...DEFAULT_LIMITS, ...limitPerKind };
  const scores = new Map<SearchEntry, number>();

  for (const entry of entries) {
    const score = scoreEntry(prepareEntry(entry), tokens, compactQuery);
    if (score > 0) scores.set(entry, score);
  }

  const matched = [...scores.keys()].sort((a, b) => compareEntries(a, b, (e) => scores.get(e) ?? 0));

  const byKind = new Map<SearchKind, SearchEntry[]>();
  for (const entry of matched) {
    const list = byKind.get(entry.kind);
    if (list) list.push(entry);
    else byKind.set(entry.kind, [entry]);
  }

  return KIND_ORDER.filter((kind) => byKind.has(kind)).map((kind) => {
    const items = byKind.get(kind)!;
    return { kind, items: items.slice(0, limits[kind]), total: items.length };
  });
}
