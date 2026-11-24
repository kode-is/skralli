import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { HifiBlock, HifiTable } from "@/lib/hifi";
import type { Img } from "@/lib/types";
import { photoFit } from "./catalog";
import { FilterableSpecTable } from "./FilterableSpecTable";

type Entry = { heading: string; range?: { min: string; max: string }; body: string[] };
type Section = { heading?: string; lead: string[]; entries: Entry[] };

/** Groups the flat `blocks` into H2 sections, each with its H3 entries. */
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

const slugify = (s: string) =>
  `hluti-${s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")}`;

function ProductPhoto({ image, alt }: { image: Img; alt: string }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E3E9F2] bg-white">
      <Image src={image.src} alt={image.alt || alt} fill sizes="(min-width: 1024px) 340px, 100vw" className={photoFit(image)} />
    </div>
  );
}

/** Grades as chips and "í boði" ranges as min to max figures. */
function Facts({ entries }: { entries: Entry[] }) {
  const plain = entries.filter((entry) => !entry.range);
  const ranged = entries.filter((entry) => entry.range);
  return (
    <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {plain.length ? (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#E3E9F2] bg-white p-4 sm:col-span-2 lg:col-span-3">
          {plain.map((entry) => (
            <h3 key={entry.heading} className="rounded-full bg-[#e6f4fb] px-3.5 py-1.5 font-ui text-sm font-semibold text-brand-dark">
              {entry.heading}
            </h3>
          ))}
        </div>
      ) : null}
      {ranged.map((entry) => (
        <div key={entry.heading} className="rounded-2xl border border-[#E3E9F2] bg-white p-5">
          <h3 className="font-ui text-[13px] font-semibold text-[#5b6472]">{entry.heading}</h3>
          <p className="mt-2 font-stat text-xl leading-tight font-bold text-[#171717] md:text-2xl">
            {entry.range!.min} <span className="font-normal text-brand-mid">–</span> {entry.range!.max}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Products listed with a spec line, beside the group's distinct photos. */
function ProductGroup({ entries, images }: { entries: Entry[]; images: Img[] }) {
  const photos = [...new Map(images.map((image) => [image.src, image])).values()];
  return (
    <div className={`mt-7 grid items-start gap-6 ${photos.length ? "lg:grid-cols-[340px_1fr] lg:gap-8" : ""}`}>
      {photos.length ? (
        <div className="grid gap-4">
          {photos.map((image) => (
            <ProductPhoto key={image.src} image={image} alt={entries[0].heading} />
          ))}
        </div>
      ) : null}
      <ul className="divide-y divide-[#E3E9F2] overflow-hidden rounded-2xl border border-[#E3E9F2] bg-white">
        {entries.map((entry) => (
          <li key={entry.heading} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-5">
            <h3 className="font-ui text-[15px] font-semibold text-brand-dark">{entry.heading}</h3>
            <p className="font-ui text-sm font-medium text-[#171717] sm:text-right">{entry.body.join(" ")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TableWithPhoto({
  table,
  tableIndex,
  headingId,
  heroSrc,
}: {
  table: HifiTable;
  tableIndex: number;
  headingId: string;
  heroSrc?: string;
}) {
  const image = table.images?.[0];
  const body = <FilterableSpecTable table={table} tableIndex={tableIndex} ariaLabelledBy={headingId} />;
  if (!image || image.src === heroSrc) return <div className="mt-7">{body}</div>;
  return (
    <div className="mt-7 grid items-start gap-6 lg:grid-cols-[340px_1fr] lg:gap-8">
      <div className="lg:sticky lg:top-6">
        <ProductPhoto image={image} alt={table.heading} />
      </div>
      {body}
    </div>
  );
}

/**
 * Renders a page's generated content. Each H2 is a band. Bare H3s become
 * facts, H3s with a spec line become a product list, and tables render under
 * their heading. A table whose heading is also a range fact ("Lengd í boði")
 * takes its accessible name from the section heading instead.
 */
export function HifiSections({
  blocks,
  images,
  tables = [],
  heroSrc,
}: {
  blocks: HifiBlock[];
  images: Img[];
  tables?: HifiTable[];
  /** A table photo identical to the hero is not repeated beside the table. */
  heroSrc?: string;
}) {
  const sections = splitSections(blocks);
  const claimedImageSrcs = new Set(tables.flatMap((t) => (t.images ?? []).map((img) => img.src)));
  const availableImages = images.filter((img) => !claimedImageSrcs.has(img.src));
  const tablesByHeading = new Map(tables.map((t) => [t.heading, t]));
  const jumpLinks = sections.filter((section) => section.heading);
  const productsIn = (section: Section) =>
    section.entries.filter((entry) => entry.body.length > 0 && !tablesByHeading.has(entry.heading));

  return (
    <div id="vorur" className="scroll-mt-6">
      {jumpLinks.length >= 3 ? (
        <nav aria-label="Vöruflokkar á síðunni" className="border-b border-[#E3E9F2] bg-white py-4">
          <Container>
            <ul className="flex flex-wrap gap-2">
              {jumpLinks.map((section) => (
                <li key={section.heading}>
                  <a
                    href={`#${slugify(section.heading!)}`}
                    className="inline-flex min-h-10 items-center rounded-full border border-[#D5DEEA] px-3.5 py-1.5 font-ui text-[13px] font-semibold text-[#171717] transition-colors hover:border-brand-dark hover:text-brand-dark"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      ) : null}

      {sections.map((section, sectionIndex) => {
        const sectionTable = section.entries.length === 0 && section.heading ? tablesByHeading.get(section.heading) : undefined;
        const sectionId = section.heading ? slugify(section.heading) : undefined;
        const facts = section.entries.filter(
          (entry) => entry.body.length === 0 && (!tablesByHeading.has(entry.heading) || entry.range),
        );
        const products = productsIn(section);
        const tableEntries = section.entries.filter((entry) => tablesByHeading.has(entry.heading));
        const imageStart = sections.slice(0, sectionIndex).reduce((sum, earlier) => sum + productsIn(earlier).length, 0);
        const productImages = availableImages.slice(imageStart, imageStart + products.length);

        return (
          <section
            key={sectionIndex}
            id={sectionId}
            aria-labelledby={sectionId ? `${sectionId}-titill` : undefined}
            className={`scroll-mt-6 py-12 md:py-16 ${sectionIndex % 2 === 0 ? "bg-[#f0f4fa]" : "bg-white"}`}
          >
            <Container>
              {section.heading ? (
                <Reveal as="h2" id={`${sectionId}-titill`} className="text-[28px] leading-[1.15] font-semibold text-[#171717] md:text-[40px] md:leading-[1.1]">
                  {section.heading}
                </Reveal>
              ) : null}
              {section.lead.length ? (
                <div className="mt-3 max-w-3xl space-y-3 text-base leading-[1.65] text-[#444444] md:text-lg">
                  {section.lead.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              ) : null}
              {facts.length ? <Facts entries={facts} /> : null}
              {sectionTable && sectionId ? (
                <TableWithPhoto table={sectionTable} tableIndex={tables.indexOf(sectionTable)} headingId={`${sectionId}-titill`} heroSrc={heroSrc} />
              ) : null}
              {tableEntries.map((entry) => {
                const table = tablesByHeading.get(entry.heading)!;
                const ownHeadingId = slugify(`${section.heading ?? ""}-${entry.heading}`);
                const usesSectionHeading = Boolean(entry.range && sectionId);
                return (
                  <div key={entry.heading} className="mt-9">
                    {usesSectionHeading ? null : (
                      <h3 id={ownHeadingId} className="text-2xl leading-tight font-semibold text-[#171717] md:text-[28px]">
                        {entry.heading}
                      </h3>
                    )}
                    {entry.body.map((text) => (
                      <p key={text} className="mt-3 rounded-lg border-l-4 border-accent-yellow bg-[#fff9e6] px-4 py-3 font-ui text-sm text-[#171717]">
                        {text}
                      </p>
                    ))}
                    <TableWithPhoto
                      table={table}
                      tableIndex={tables.indexOf(table)}
                      headingId={usesSectionHeading ? `${sectionId}-titill` : ownHeadingId}
                      heroSrc={heroSrc}
                    />
                  </div>
                );
              })}
              {products.length ? <ProductGroup entries={products} images={productImages} /> : null}
            </Container>
          </section>
        );
      })}
    </div>
  );
}
