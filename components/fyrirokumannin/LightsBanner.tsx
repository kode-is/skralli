import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { lightsBanner } from "@/lib/fyrirokumannin";

/**
 * Opens the light-bar half the way the Gigant photo band opens the plows on
 * /vetrarbunadur: a full-bleed photo with the heading, the live sentence
 * and three figures over a dark gradient.
 */
export function LightsBanner() {
  return (
    <section id="ljosabunadur" className="relative scroll-mt-6 overflow-hidden">
      <div className="relative min-h-[560px] md:h-[600px] md:min-h-0">
        <Image
          src={lightsBanner.image.src}
          alt={lightsBanner.image.alt}
          fill
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10 md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent"
        />
        <Container className="relative flex min-h-[560px] flex-col justify-end py-10 text-white md:h-full md:min-h-0 md:justify-center md:py-0">
          <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-light uppercase md:text-xs">
            {lightsBanner.eyebrow}
          </Reveal>
          <Reveal as="h2" delay={0.05} className="mt-3 max-w-xl text-[34px] leading-[1.08] font-semibold md:text-[56px] md:leading-[1.04]">
            {lightsBanner.heading}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-4 max-w-md text-base leading-[1.6] text-white/90 md:text-lg">
            {lightsBanner.text}
          </Reveal>
          <dl className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-white/20 pt-6">
            {lightsBanner.stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse justify-end">
                <dt className="mt-2 font-stat text-xs font-medium text-white/75 md:text-sm">{stat.label}</dt>
                <dd className="font-stat text-[32px] leading-none font-bold md:text-[44px]">{stat.value}</dd>
              </div>
            ))}
          </dl>
          <a
            href={lightsBanner.cta.href}
            className="mt-8 inline-flex w-fit items-center justify-center gap-1.5 rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition-colors duration-200 hover:bg-[#f0f4fa]"
          >
            {lightsBanner.cta.text}
            <span aria-hidden="true">↓</span>
          </a>
        </Container>
      </div>
    </section>
  );
}
