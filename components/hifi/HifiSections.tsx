import Image from "next/image";
import type { ReactNode } from "react";
import { FeatureCard } from "@/components/FeatureCard";
import { SpecTable } from "@/components/SpecTable";
import type { HifiBlock, HifiTable } from "@/lib/hifi";
import type { Img } from "@/lib/types";

const H2_CENTERED = "text-center text-3xl font-bold text-neutral-900 md:text-4xl";
const H2_LEFT = "text-3xl font-bold text-neutral-900 md:text-4xl";

type Entry = { heading: string; range?: { min: string; max: string }; body: string[] };
type Section = { heading?: string; lead: string[]; entries: Entry[] };

/**
 * Splits a page's flat `blocks` into top-level sections (each opening with
 * an H2, or one implicit section when the page has none at all — the
 * drattastroffur product grid) and, within each, groups H3s with whatever
 * text immediately follows them into "entries". `link` blocks never reach
 * here in practice (stroffur's own child cards are rendered separately by
 * the [...slug] page, before this component runs) but are skipped just in
 * case.
 */
function splitSections(blocks: HifiBlock[]): Section[] {
  const sections: Section[] = [{ lead: [], entries: [] }];
  for (const block of blocks) {
    if (block.type === "link") continue;
    if (block.type === "heading" && block.level === 2) {
      sections.push({ heading: block.text, lead: [], entries: [] });
      continue;
    }
    const section = sections[sections.length - 1];
    if (block.type === "heading") {
      section.entries.push({ heading: block.text, range: block.range, body: [] });
      continue;
    }
    const currentEntry = section.entries[section.entries.length - 1];
    if (currentEntry) currentEntry.body.push(block.text);
    else section.lead.push(block.text);
  }
  return sections.filter((s) => s.heading || s.lead.length || s.entries.length);
}

/** Turns a heading's text into a stable, page-local id (no two tables on
 * the same page share a heading) for `SpecTable`'s `aria-labelledby`. */
const slugify = (s: string) =>
  `table-${s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")}`;

function SideImage({ image }: { image: Img }) {
  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl md:mx-0"
      style={{ aspectRatio: `${image.width} / ${image.height}` }}
    >
      <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
    </div>
  );
}

/** A spec table, laid out beside its product photo when the table has one
 * (aukabunadur's five sections, bordastrekkjarar's own table) or full-width
 * otherwise (hifikedjur, bindikedjur-strekkjarar, hringstroffur, flatstroffur).
 * `headingId` is the id of the H2/H3 immediately above it, wired to the
 * table via `aria-labelledby` instead of a visible `<caption>` (which would
 * duplicate the heading's text in the page's innerText and confuse verify). */
function TableBlock({ table, headingId }: { table: HifiTable; headingId: string }) {
  const image = table.images?.[0];
  if (!image) return <SpecTable headers={table.headers} rows={table.rows} ariaLabelledBy={headingId} />;
  return (
    <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
      <SideImage image={image} />
      <SpecTable headers={table.headers} rows={table.rows} ariaLabelledBy={headingId} />
    </div>
  );
}

/** The live site's min/max range-slider widget, reduced to a static bar:
 * a track, a filled segment between two dots, and the two endpoint labels
 * centered under each dot — the same visual arrangement as e.g. hifikedjur's
 * "Lengdir í boði" (docs/reference/hifi-festibunadur__hifikedjur.desktop.jpg).
 * Used both by a bare heading's own pill (PillRow) and by the handful of
 * routes where that same heading also introduces a spec table right below
 * it (bindikedjur-strekkjarar's "Leyfilegt vinnuálag (WLL)",
 * hringstroffur/flatstroffur's "Lengd í boði" — see HifiSections below). */
function RangeBar({ range }: { range: { min: string; max: string } }) {
  return (
    <div className="relative mb-1 h-4 w-full max-w-[220px]">
      <div className="absolute left-0 right-0 top-0 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
      <div className="absolute left-[15%] right-[15%] top-0 h-1 -translate-y-1/2 rounded-full bg-[#0b5c8a]" />
      <div className="absolute left-[15%] top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b5c8a]" />
      <div className="absolute right-[15%] top-0 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b5c8a]" />
      <div className="absolute left-[15%] top-4 -translate-x-1/2 text-sm font-semibold text-neutral-900">
        {range.min}
      </div>
      <div className="absolute right-[15%] top-4 translate-x-1/2 text-sm font-semibold text-neutral-900">
        {range.max}
      </div>
    </div>
  );
}

/** Bare H3s with no body text and no matching table (e.g. "Grade 80",
 * "Lengdir í boði"). The live site pairs some of these (every "… í boði"
 * heading and "Leyfilegt vinnuálag (WLL)") with an interactive min/max range
 * slider; `entry.range` (lib/hifi.ts, sourced from the live SSR HTML — see
 * scripts/gen-hifi.mjs's RANGE_LABELS) renders it via `RangeBar`. Entries
 * with no range (e.g. "Grade 80") render as a plain heading pill, unchanged. */
function PillRow({ entries }: { entries: Entry[] }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      {entries.map((entry) => (
        <div key={entry.heading} className="rounded-2xl bg-white px-6 py-4 text-center shadow-sm">
          <p className="font-semibold text-neutral-900">{entry.heading}</p>
          {entry.range ? (
            <div className="mx-auto mt-5">
              <RangeBar range={entry.range} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** H3+text entries with no matching table, paired with the next
 * still-unclaimed image in document order (fewer images than entries just
 * means the last card(s) render without one — FeatureCard's image is
 * optional — matching aukabunadur's imageless "FAT1T" product). */
function CardGrid({ entries, images }: { entries: Entry[]; images: Img[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {entries.map((entry, i) => (
        <FeatureCard key={entry.heading} heading={entry.heading} text={entry.body.join(" ")} image={images[i]} />
      ))}
    </div>
  );
}

/**
 * Renders a HifiPage's `blocks` + `images` + `tables` (lib/hifi.ts). Every
 * H2 starts a new top-level section. Within a section, each H3 becomes an
 * "entry" grouped with any text that follows it, and is classified
 * generically — no per-route special-casing:
 *  - the entry's heading text matches a table's `heading` -> the table
 *    (with its side product photo, if any) renders right after it;
 *  - otherwise, an entry with body text becomes a card in a FeatureCard
 *    grid, paired with the next still-unclaimed image;
 *  - a bare entry (no text, no table) becomes a small label ("pill"),
 *    grouped with adjacent bare entries.
 * A section with no H3s at all whose own H2 matches a table heading (the
 * five aukabunadur sections, bordastrekkjarar's own "Borðastrekkjarar")
 * renders that table directly under the H2, left-aligned like the other
 * text+table pairings; every other section heading is centered above its
 * lead paragraph / pill row / card grid.
 */
export function HifiSections({
  blocks,
  images,
  tables = [],
}: {
  blocks: HifiBlock[];
  images: Img[];
  tables?: HifiTable[];
}) {
  const sections = splitSections(blocks);
  // Dedupe by `src` (value equality), not object identity: `page.tables[].images`
  // and `page.images` are separately serialized object literals in lib.ts with
  // the same values but different references, so a `Set` of the objects
  // themselves never matches anything in `images` and every claimed photo
  // leaked back into the "available for cards" pool (Task 12 fix round 1).
  const claimedImageSrcs = new Set(tables.flatMap((t) => (t.images ?? []).map((img) => img.src)));
  const availableImages = images.filter((img) => !claimedImageSrcs.has(img.src));
  const tablesByHeading = new Map(tables.map((t) => [t.heading, t]));
  let imageCursor = 0;

  return (
    <>
      {sections.map((section, sectionIndex) => {
        const sectionTable =
          section.entries.length === 0 && section.heading ? tablesByHeading.get(section.heading) : undefined;

        const nodes: ReactNode[] = [];
        let pillBuffer: Entry[] = [];
        let cardBuffer: Entry[] = [];
        const flushPills = () => {
          if (!pillBuffer.length) return;
          nodes.push(<PillRow key={`pills-${nodes.length}`} entries={pillBuffer} />);
          pillBuffer = [];
        };
        const flushCards = () => {
          if (!cardBuffer.length) return;
          const consumed = availableImages.slice(imageCursor, imageCursor + cardBuffer.length);
          imageCursor += cardBuffer.length;
          nodes.push(<CardGrid key={`cards-${nodes.length}`} entries={cardBuffer} images={consumed} />);
          cardBuffer = [];
        };

        for (const entry of section.entries) {
          const table = tablesByHeading.get(entry.heading);
          if (table) {
            flushPills();
            flushCards();
            const headingId = slugify(entry.heading);
            nodes.push(
              <div key={entry.heading} className="space-y-4">
                <h3 id={headingId} className={H2_LEFT}>
                  {entry.heading}
                </h3>
                {entry.range ? <RangeBar range={entry.range} /> : null}
                {entry.body.map((text, i) => (
                  <p key={i} className="max-w-3xl text-base leading-relaxed text-neutral-700">
                    {text}
                  </p>
                ))}
                <TableBlock table={table} headingId={headingId} />
              </div>,
            );
          } else if (entry.body.length > 0) {
            flushPills();
            cardBuffer.push(entry);
          } else {
            flushCards();
            pillBuffer.push(entry);
          }
        }
        flushPills();
        flushCards();

        const sectionHeadingId = sectionTable && section.heading ? slugify(section.heading) : undefined;

        return (
          <div key={sectionIndex} className="mt-16 first:mt-0">
            {section.heading ? (
              <h2 id={sectionHeadingId} className={sectionTable ? H2_LEFT : H2_CENTERED}>
                {section.heading}
              </h2>
            ) : null}
            {section.lead.length ? (
              <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700">
                {section.lead.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            ) : null}
            {sectionTable && sectionHeadingId ? (
              <div className="mt-6">
                <TableBlock table={sectionTable} headingId={sectionHeadingId} />
              </div>
            ) : null}
            {nodes.length ? <div className="mt-10 space-y-10">{nodes}</div> : null}
          </div>
        );
      })}
    </>
  );
}
