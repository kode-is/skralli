import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { seatCovers } from "@/lib/fyrirokumannin";
import { Gallery } from "./Gallery";
import { VEHICLE_ICONS } from "./icons";

const PRIMARY_BUTTON =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-mid";
const SECONDARY_BUTTON =
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-md border border-[#cfd8e6] px-6 py-3 text-sm font-semibold text-[#171717] transition-colors duration-200 hover:border-brand-dark hover:text-brand-dark";

/**
 * Seat covers open the page the way Lilleseth opens /vetrarbunadur: copy and
 * two CTAs beside the photos, then the four vehicle groups as tiles, here
 * carrying the prices.
 *
 * Each tile's text is one inline run, "Vinnubíla - frá 70.629kr m/vsk.", so
 * it stays the live line for npm run verify: the vehicle and price are
 * inline-blocks that wrap onto two visual lines, and the " - " between them
 * is kept in the text but drawn at zero size.
 */
export function SeatCoversSection() {
  return (
    <section id="saetisaklaedi" className="scroll-mt-6 bg-white pt-12 pb-16 md:pt-16 md:pb-24">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
          <div>
            <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase md:text-xs">
              {seatCovers.eyebrow}
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="mt-3 text-[32px] leading-[1.1] font-semibold text-[#171717] md:text-[50px] md:leading-[1.06]"
            >
              {seatCovers.heading}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 max-w-[580px] text-[17px] leading-[1.6] text-[#171717] md:text-lg">
              {seatCovers.text}
            </Reveal>
            <p className="mt-4 font-ui text-[15px] font-semibold text-brand-dark md:text-base">{seatCovers.materials}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={seatCovers.primaryCta.href} className={PRIMARY_BUTTON}>
                {seatCovers.primaryCta.text}
              </Link>
              <Link href={seatCovers.secondaryCta.href} className={SECONDARY_BUTTON}>
                {seatCovers.secondaryCta.text}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <Gallery images={seatCovers.images} label={seatCovers.heading} />
        </div>

        <h3 className="mt-16 font-ui text-lg font-semibold text-[#171717] md:mt-20 md:text-xl">{seatCovers.pricesLabel}</h3>
        <Stagger as="ul" className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {seatCovers.prices.map((row) => {
            const Icon = VEHICLE_ICONS[row.icon];
            return (
              <StaggerItem
                as="li"
                key={row.vehicle}
                className="flex gap-4 rounded-[15px] border border-[#E3E9F2] bg-white p-5 lg:flex-col lg:gap-5 lg:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                  <Icon className="h-7 w-7" />
                </span>
                <p>
                  <span className="inline-block w-full font-ui text-base font-semibold text-[#171717]">{row.vehicle}</span>
                  <span className="text-[0px]"> - </span>
                  <span className="mt-1 inline-block w-full font-stat text-xl font-bold text-brand-dark md:text-[22px]">{row.price}</span>
                </p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
