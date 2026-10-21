import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { contactHref, floorMats } from "@/lib/fyrirokumannin";
import { Gallery } from "./Gallery";
import { VEHICLE_ICONS } from "./icons";

/**
 * Floor mats: the mat outlines in a gallery (shown whole, not cropped),
 * then the four vehicle types as tiles and the single price in a dark
 * panel. Gallery left on desktop, below the copy on phones. The tiles stack
 * icon over label so "Dráttarvélar" fits even in the narrow tablet column.
 */
export function FloorMatsSection() {
  return (
    <section id="golfmottur" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container className="grid items-start gap-10 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div>
          <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase md:text-xs">
            {floorMats.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 text-[32px] leading-[1.1] font-semibold text-[#171717] md:text-[50px] md:leading-[1.06]"
          >
            {floorMats.heading}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-5 max-w-[580px] text-base leading-[1.65] text-[#444444] md:text-[17px]">
            {floorMats.text}
          </Reveal>

          <p className="mt-8 font-ui text-sm font-semibold text-[#171717]">{floorMats.fitsLabel}</p>
          <Stagger as="ul" className="mt-3 grid grid-cols-2 gap-3">
            {floorMats.fits.map((fit) => {
              const Icon = VEHICLE_ICONS[fit.icon];
              return (
                <StaggerItem as="li" key={fit.text} className="flex min-w-0 flex-col items-start gap-3 rounded-[15px] bg-white p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-ui text-[15px] font-semibold text-[#171717] md:text-base">{fit.text}</span>
                </StaggerItem>
              );
            })}
          </Stagger>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-[20px] bg-brand-dark px-6 py-5 text-white md:px-7 md:py-6">
            <div>
              <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-white/60 uppercase">{floorMats.priceLabel}</p>
              <p className="mt-1 font-stat text-[26px] leading-none font-bold whitespace-nowrap lg:text-[34px]">{floorMats.price}</p>
            </div>
            <Link
              href={contactHref}
              className="inline-flex w-fit items-center justify-center rounded-md border border-white px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-brand-dark"
            >
              {floorMats.cta}
            </Link>
          </div>
        </div>

        <div className="md:order-first">
          <Gallery images={floorMats.images} label={floorMats.heading} fit="contain" />
        </div>
      </Container>
    </section>
  );
}
