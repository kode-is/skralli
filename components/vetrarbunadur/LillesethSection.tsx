import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { lilleseth, vehicles, vehiclesHeading } from "@/lib/vetrarbunadur";
import { CHAIN_PATTERN_STYLE, VEHICLE_ICONS } from "./icons";

const PRIMARY_BUTTON =
  "inline-flex w-fit items-center justify-center rounded-md bg-brand-dark px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-mid";
const SECONDARY_BUTTON =
  "inline-flex w-fit items-center justify-center gap-1.5 rounded-md border border-[#cfd8e6] px-6 py-3 text-sm font-semibold text-[#171717] transition-colors duration-200 hover:border-brand-dark hover:text-brand-dark";

/**
 * Lilleseth spotlight: the chains are the page's lead product, so they open
 * the page with the brand copy and CTAs beside a dark stat panel, followed
 * by the four vehicle groups the chains cover.
 */
export function LillesethSection() {
  return (
    <section id="snjokedjur" className="scroll-mt-6 bg-white pt-12 pb-16 md:pt-16 md:pb-24">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase md:text-xs">
              {lilleseth.eyebrow}
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="mt-3 text-[32px] leading-[1.1] font-semibold text-[#171717] md:text-[50px] md:leading-[1.06]"
            >
              {lilleseth.heading}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-5 max-w-[620px] text-[17px] leading-[1.6] text-[#171717] md:text-lg">
              {lilleseth.paragraphs[0]}
            </Reveal>
            {lilleseth.paragraphs.slice(1).map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-[620px] text-base leading-[1.65] text-[#444444] md:text-[17px]">
                {paragraph}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={lilleseth.primaryCta.href} className={PRIMARY_BUTTON}>
                {lilleseth.primaryCta.text}
              </a>
              <Link href={lilleseth.secondaryCta.href} className={SECONDARY_BUTTON}>
                {lilleseth.secondaryCta.text}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[20px] bg-brand-dark px-7 py-9 text-white md:px-10 md:py-12"
            style={CHAIN_PATTERN_STYLE}
          >
            <dl className="grid grid-cols-3 gap-4 md:gap-6">
              {lilleseth.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-2 font-stat text-xs font-medium text-white/75 md:text-sm">{stat.label}</dt>
                  <dd className="font-stat text-[34px] leading-none font-bold md:text-[52px]">{stat.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9 flex items-center gap-3 border-t border-white/15 pt-6 md:mt-12 md:pt-8">
              <span className="h-2 w-2 shrink-0 rounded-full bg-accent-yellow" aria-hidden="true" />
              <p className="font-ui text-sm font-semibold text-white md:text-base">{lilleseth.statsNote}</p>
            </div>
          </div>
        </div>

        <h3 className="mt-16 font-ui text-lg font-semibold text-[#171717] md:mt-20 md:text-xl">{vehiclesHeading}</h3>
        <Stagger className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {vehicles.map((vehicle) => {
            const Icon = VEHICLE_ICONS[vehicle.icon];
            return (
              <StaggerItem
                key={vehicle.title}
                className="flex gap-4 rounded-[15px] border border-[#E3E9F2] bg-white p-5 lg:flex-col lg:gap-5 lg:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                  <Icon className="h-7 w-7" />
                </span>
                <div>
                  <p className="font-ui text-base font-semibold text-[#171717]">{vehicle.title}</p>
                  <p className="mt-1 text-[15px] leading-[1.55] text-[#444444]">{vehicle.text}</p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
