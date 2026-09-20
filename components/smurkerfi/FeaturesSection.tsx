import { Container } from "@/components/Container";
import { DotDivider } from "@/components/DotDivider";
import Image from "next/image";
import Link from "next/link";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Img } from "@/lib/types";

type Feature = { heading: string; text: string; image: Img };

// docs/scrape/smurkerfi.json blocks 12-33 (image alts kept verbatim, some
// are empty in the scrape).
const FEATURES: Feature[] = [
  {
    heading: "Dælur",
    text: "Beka og Groeneveld smurdælur fyrir öll notkunarsvið.",
    image: { src: "/images/smurkerfi/03-c89d7570.jpeg", alt: "Dælur", width: 383, height: 511 },
  },
  {
    heading: "Koppafeiti",
    text: "MAX-2-LUBE (NLG2) með einstaklega mikla viðloðun og breitt hitasvið.",
    image: { src: "/images/smurkerfi/04-e1cf3aba.jpeg", alt: "Koppafeiti", width: 383, height: 511 },
  },
  {
    heading: "Fleygafeiti",
    text: "Gæða feiti fyrir flestar gerðir fleyga",
    image: { src: "/images/smurkerfi/05-56c71eb7.png", alt: "Fleygafeiti", width: 383, height: 383 },
  },
  {
    heading: "BEKA deiliblokkir",
    text: "Smurblokkir sem einfalt er að sníða að magni og fjölda smurpunkta fyrir hvert tæki.",
    image: { src: "/images/smurkerfi/06-77b497b7.png", alt: "", width: 383, height: 383 },
  },
  {
    heading: "Groeneveld skammtarar",
    text: "Sérsniðnir skammtarar að þörfum hvers tækis.",
    image: {
      src: "/images/smurkerfi/07-771eb8cc.png",
      alt: "Groeneveld skammtarar",
      width: 383,
      height: 255,
    },
  },
  {
    heading: "Fittings",
    text: "Breiðasta lagerúrval landsins af fittings fyrir 4mm, 5mm, 6mm og 8mm lagnir og enda.",
    image: { src: "/images/smurkerfi/08-ea5c5980.png", alt: "Fittings", width: 383, height: 383 },
  },
  {
    heading: "Fylltar slöngur",
    text: "Fylltar slöngur úr nylon eða gúmmí. Stærðir frá 4, 5, 6 eða 8 mm.",
    image: { src: "/images/smurkerfi/09-a521d77e.png", alt: "", width: 383, height: 383 },
  },
];

/**
 * "Vörur í smurkerfum" — the product grid from Einar's layout mockup
 * (2026-09-20): flat tiles in four columns, a uniform 4:3 photo on top with
 * the name and description beneath, and the spare eighth cell used as a
 * contact prompt. Deliberately no hover states: the tiles are not links.
 * Typography and colours are the site's own (Inter for the tile titles,
 * Figtree for body copy, #171717 / #444, 15 px radius, brand dark accent).
 * The seven titles and descriptions are the live page's copy, verbatim; only
 * the heading, the count and the contact prompt come from the mockup.
 */
export function FeaturesSection() {
  return (
    <section className="bg-white pt-4 md:pt-6">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <Reveal as="h2" className="text-[32px] leading-[1.25] font-semibold text-[#171717] md:text-[50px]">
            Vörur í smurkerfum
          </Reveal>
          <p className="shrink-0 pb-2 font-ui text-sm text-[#4a5568] md:pb-3">{FEATURES.length} flokkar</p>
        </div>

        <Stagger className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:mt-12 md:gap-x-7 md:gap-y-12 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <StaggerItem key={feature.heading}>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[15px] bg-[#f0f4fa]">
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  fill
                  sizes="(min-width: 1024px) 290px, 50vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-5 font-ui text-lg leading-[1.3] font-semibold text-[#171717] md:text-xl">
                {feature.heading}
              </h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#444444] md:text-base">{feature.text}</p>
            </StaggerItem>
          ))}

          {/* Eighth cell: contact prompt behind a brand-coloured rule. */}
          <StaggerItem className="flex flex-col justify-center border-l-[3px] border-brand-dark py-6 pl-5 md:pl-6">
            <p className="text-base leading-[1.6] text-[#444444] md:text-lg">Finnurðu ekki það sem þú leitar að?</p>
            <Link
              href="/hafa-samband"
              className="mt-3 w-fit text-base font-semibold text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-mid md:text-lg"
            >
              Hafa samband →
            </Link>
          </StaggerItem>
        </Stagger>
      </Container>

      {/* Decorative dot pattern (docs/scrape/smurkerfi.json block 34, a 0x0
          CSS background rather than a visible <img>); live gap above: 60/50 px. */}
      <DotDivider className="mt-[60px] md:mt-[50px]" />
    </section>
  );
}
