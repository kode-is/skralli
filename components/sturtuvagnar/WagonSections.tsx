import { FeatureCard } from "@/components/FeatureCard";
import type { WagonBlock } from "@/lib/sturtuvagnar";
import type { Img } from "@/lib/types";

type Section = { heading: string; items: WagonBlock[] };

function splitIntoSections(blocks: WagonBlock[]): Section[] {
  const sections: Section[] = [];
  for (const block of blocks) {
    if (block.type === "heading" && block.level === 2) {
      sections.push({ heading: block.text, items: [] });
    } else {
      sections[sections.length - 1]?.items.push(block);
    }
  }
  return sections;
}

const HEADING_CLASSES = "text-center text-3xl font-bold text-neutral-900 md:text-4xl";

/**
 * Renders a WagonGroup/Wagon's `blocks` + `images` (lib/sturtuvagnar.ts).
 * Every H2 starts a new section; what follows it decides how the section
 * renders — data-driven, not group-vs-product special-cased:
 *  - no items (both H2s on every product page) -> heading only
 *  - text items ("Um X" intro paragraphs on group pages) -> heading + copy
 *  - heading3/text pairs ("Tegundir í boði" on group pages) -> heading + an
 *    unlinked FeatureCard grid, pairing each H3+text with the next image
 *    from `images` in order (controller ruling: the live group pages don't
 *    link these cards to the product pages, so neither does this).
 */
export function WagonSections({ blocks, images }: { blocks: WagonBlock[]; images: Img[] }) {
  const sections = splitIntoSections(blocks);
  let imageCursor = 0;

  return (
    <>
      {sections.map((section) => {
        if (section.items.length === 0) {
          return (
            <h2 key={section.heading} className={`mt-16 first:mt-0 ${HEADING_CLASSES}`}>
              {section.heading}
            </h2>
          );
        }

        if (section.items[0].type === "text") {
          return (
            <div key={section.heading} className="mt-16 first:mt-0">
              <h2 className={HEADING_CLASSES}>{section.heading}</h2>
              <div className="mx-auto mt-6 max-w-3xl space-y-4 text-base leading-relaxed text-neutral-700">
                {section.items.map((item, itemIndex) => (
                  <p key={itemIndex}>{item.text}</p>
                ))}
              </div>
            </div>
          );
        }

        const cards: { heading: string; text: string; image: Img }[] = [];
        for (let i = 0; i < section.items.length; i += 2) {
          const headingBlock = section.items[i];
          const textBlock = section.items[i + 1];
          cards.push({
            heading: headingBlock.text,
            text: textBlock?.type === "text" ? textBlock.text : "",
            image: images[imageCursor++],
          });
        }

        return (
          <div key={section.heading} className="mt-16 first:mt-0">
            <h2 className={HEADING_CLASSES}>{section.heading}</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cards.map((card) => (
                <FeatureCard
                  key={card.heading}
                  heading={card.heading}
                  text={card.text}
                  image={card.image}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
