import Image from "next/image";
import type { ReactNode } from "react";
import { FeatureCard } from "@/components/FeatureCard";
import { SpecTable } from "@/components/SpecTable";
import type { HifiBlock, HifiTable } from "@/lib/hifi";
import type { Img } from "@/lib/types";

const H2_CENTERED = "text-center text-3xl font-bold text-neutral-900 md:text-4xl";
const H2_LEFT = "text-3xl font-bold text-neutral-900 md:text-4xl";

type Entry = { heading: string; body: string[] };
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
      section.entries.push({ heading: block.text, body: [] });
      continue;
    }
    const currentEntry = section.entries[section.entries.length - 1];
    if (currentEntry) currentEntry.body.push(block.text);
    else section.lead.push(block.text);
  }
  return sections.filter((s) => s.heading || s.lead.length || s.entries.length);
}

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
 * otherwise (hifikedjur, bindikedjur-strekkjarar, hringstroffur, flatstroffur). */
function TableBlock({ table }: { table: HifiTable }) {
  const image = table.images?.[0];
  if (!image) return <SpecTable headers={table.headers} rows={table.rows} />;
  return (
    <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
      <SideImage image={image} />
      <SpecTable headers={table.headers} rows={table.rows} />
    </div>
  );
}

/** Bare H3s with no body text and no matching table (e.g. "Grade 80",
 * "Lengdir í boði"). The live site pairs these with an interactive min/max
 * range slider whose numeric endpoints are drawn by a widget, not text —
 * they never appear anywhere in the scrape, so only the label renders. */
function PillRow({ entries }: { entries: Entry[] }) {
  return (
    <div className="mx-auto flex max-w-md flex-col gap-3">
      {entries.map((entry) => (
        <div
          key={entry.heading}
          className="rounded-2xl bg-white px-6 py-4 text-center font-semibold text-neutral-900 shadow-sm"
        >
          {entry.heading}
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
  const claimedImages = new Set(tables.flatMap((t) => t.images ?? []));
  const availableImages = images.filter((img) => !claimedImages.has(img));
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
            nodes.push(
              <div key={entry.heading} className="space-y-4">
                <h3 className={H2_LEFT}>{entry.heading}</h3>
                {entry.body.map((text, i) => (
                  <p key={i} className="max-w-3xl text-base leading-relaxed text-neutral-700">
                    {text}
                  </p>
                ))}
                <TableBlock table={table} />
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

        return (
          <div key={sectionIndex} className="mt-16 first:mt-0">
            {section.heading ? <h2 className={sectionTable ? H2_LEFT : H2_CENTERED}>{section.heading}</h2> : null}
            {section.lead.length ? (
              <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700">
                {section.lead.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            ) : null}
            {sectionTable ? (
              <div className="mt-6">
                <TableBlock table={sectionTable} />
              </div>
            ) : null}
            {nodes.length ? <div className="mt-10 space-y-10">{nodes}</div> : null}
          </div>
        );
      })}
    </>
  );
}
