import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { brands } from "@/lib/brands";
import type { Img } from "@/lib/types";

// The three brands featured here use their own card artwork (docs/scrape/
// home.json blocks 92/96/100), distinct from the brand-strip marquee logos
// in lib/brands.ts.
const FEATURED: { id: string; image: Img }[] = [
  { id: "hammerglass", image: { src: "/images/home/30-51b0fe1c.png", alt: "Hammerglass", width: 220, height: 171 } },
  {
    id: "um-beka",
    image: { src: "/images/home/31-8e2b1073.svg", alt: "Groenevald-BEKA logo", width: 264, height: 288 },
  },
  {
    id: "lilleseth-kjetting",
    image: { src: "/images/home/32-4354a44e.png", alt: "Lilleseth Kjetting", width: 220, height: 150 },
  },
];

/** The live site's hover mark: Phosphor "arrow-up-right" (regular), white. */
function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M200,64V168a8,8,0,0,1-16,0V83.31L69.66,197.66a8,8,0,0,1-11.32-11.32L172.69,72H88a8,8,0,0,1,0-16H192A8,8,0,0,1,200,64Z" />
    </svg>
  );
}

/**
 * "Kynntu þér vörumerkin okkar" — measured on the live home page.
 *
 * Each brand row is ONE link: 690 × 136 px, 10 px radius, #f0f4fa, with a
 * 220 × 136 px cover image flush left and the name (Inter 22/600) plus
 * "Skoða nánar →" (Figtree 16/600, brand dark) 30 px to its right; rows are
 * 40 px apart. On phones the row stacks: 294 px image on top, 30 px padding.
 *
 * Hover: a 40 % black veil with a 60 px white arrow fades in over the IMAGE
 * only. The row itself never lifts, shadows or recolours. At Einar's request
 * the veil is triggered by hovering the image, not the whole row (the live
 * site triggers it from anywhere on the row); keyboard focus on the row
 * shows it too, so the affordance is not mouse-only.
 */
export function BrandsSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="grid gap-[25px] lg:grid-cols-[minmax(0,450px)_minmax(0,690px)] lg:justify-between lg:gap-0">
          {/* Live centres this intro block on phones and left-aligns it from desktop. */}
          <div className="flex flex-col items-center text-center lg:items-start lg:pt-[25px] lg:text-left">
            <Reveal
              as="h2"
              className="text-[32px] leading-[1.25] font-semibold text-neutral-900 md:text-[50px]"
            >
              Kynntu þér vörumerkin okkar
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 text-[15px] leading-[1.9] text-[#444] md:text-lg">
              Við bjóðum eingöngu upp á vörur frá þekktum og viðurkenndum aðilum
            </Reveal>
            <Link
              href="/vorumerki"
              className="mt-5 inline-flex w-fit items-center justify-center bg-brand-dark px-[30px] py-5 text-[15px] leading-[1.2] font-semibold text-white transition-colors duration-200 hover:bg-brand-mid md:text-base"
            >
              Skoða nánar
            </Link>
          </div>

          <Stagger className="flex flex-col gap-10">
            {FEATURED.map((featured) => {
              const brand = brands.find((b) => b.id === featured.id);
              if (!brand) return null;
              return (
                <StaggerItem key={brand.id}>
                  <Link
                    href={brand.href}
                    className="group/row flex flex-col overflow-hidden rounded-[10px] bg-[#f0f4fa] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-mid md:flex-row"
                  >
                    <div className="group/image relative h-[294px] w-full shrink-0 md:h-[136px] md:w-[220px]">
                      <Image
                        src={featured.image.src}
                        alt={featured.image.alt}
                        fill
                        sizes="(min-width: 768px) 220px, 100vw"
                        className="object-cover"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity duration-300 group-hover/image:opacity-100 group-focus-visible/row:opacity-100 motion-reduce:transition-none"
                      >
                        <ArrowUpRight className="h-[60px] w-[60px]" />
                      </div>
                    </div>
                    <div className="p-[30px]">
                      <h3 className="font-ui text-lg leading-[1.4] font-semibold text-black md:text-[22px]">
                        {brand.name}
                      </h3>
                      {/* One inline span: label and arrow stay a single text
                          run, so innerText has no line break between them. */}
                      <span className="mt-4 block text-[15px] leading-[1.9] font-semibold text-brand-dark md:mt-[15px] md:text-base md:leading-[1.875]">
                        Skoða nánar →
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
