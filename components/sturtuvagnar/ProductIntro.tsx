import { Container } from "@/components/Container";
import { InquiryCard } from "@/components/sturtuvagnar/InquiryCard";
import type { Wagon, WagonGroup } from "@/lib/sturtuvagnar";

const PILL_CLASSES =
  "inline-flex items-center rounded-full bg-[#f0f4fa] px-3.5 py-2 text-sm font-medium text-brand-dark";

// Mockup 1's "Um <product>" two-column section: the product's own blurb
// (from its group's "Tegundir í boði" card) followed by the group's "Um X"
// paragraphs (docs/scrape/sturtuvagnar__<group>.json) and the two pills
// sourced from the /sturtuvagnar category subtitle; the inquiry card sits
// alongside it, sticky on desktop so it stays visible while reading.
export function ProductIntro({ product, group }: { product: Wagon; group: WagonGroup }) {
  const paragraphs = [product.blurb, ...group.about];

  return (
    <section className="bg-white py-14 md:py-16">
      <Container className="grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
        <div className="flex flex-col gap-5">
          <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Um {product.title}</h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-neutral-700">
              {paragraph}
            </p>
          ))}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className={PILL_CLASSES}>Gigant · framleitt í Noregi</span>
            <span className={PILL_CLASSES}>5 ára ábyrgð</span>
          </div>
        </div>
        <div className="md:sticky md:top-8">
          <InquiryCard productTitle={product.title} />
        </div>
      </Container>
    </section>
  );
}
