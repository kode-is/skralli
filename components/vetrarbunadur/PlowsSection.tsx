import Image from "next/image";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { gigantBanner, plowModels, plows } from "@/lib/vetrarbunadur";
import { CheckIcon, PlusIcon } from "./icons";

/**
 * Gigant half of the page: a full-bleed photo band that marks the switch
 * from chains to snow clearing, then the two plow models (docs/scrape/
 * vetrarbunadur.json blocks 25-53) as side-by-side cards with their specs
 * pulled out of the running text into a grid.
 */
export function PlowsSection() {
  return (
    <>
      <section id="snjoplogar" className="relative scroll-mt-6 overflow-hidden">
        <div className="relative h-[440px] md:h-[560px]">
          <Image
            src={gigantBanner.image.src}
            alt={gigantBanner.image.alt}
            fill
            sizes="100vw"
            className="object-cover object-[60%_center]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/5 md:bg-gradient-to-r md:from-black/70 md:via-black/30 md:to-transparent"
          />
          <Container className="relative flex h-full flex-col justify-end pb-10 md:justify-center md:pb-0">
            <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-light uppercase md:text-xs">
              {gigantBanner.eyebrow}
            </Reveal>
            <Reveal
              as="h2"
              delay={0.05}
              className="mt-3 max-w-xl text-[34px] leading-[1.08] font-semibold text-white md:text-[56px] md:leading-[1.04]"
            >
              {gigantBanner.heading}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 max-w-lg text-base leading-[1.6] text-white/90 md:text-lg">
              {gigantBanner.text}
            </Reveal>
          </Container>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-[1fr_1.2fr] md:gap-16">
            <Reveal as="h3" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
              {plows.heading}
            </Reveal>
            <div>
              {plows.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mb-4 text-base leading-[1.65] text-[#444444] md:text-[17px]">
                  {paragraph}
                </p>
              ))}
              <p className="font-ui text-[15px] font-semibold text-[#171717] md:text-base">{plows.shapes}</p>
            </div>
          </div>

          <Stagger className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
            {plowModels.map((plow) => (
              <StaggerItem
                key={plow.name}
                className="flex flex-col overflow-hidden rounded-[20px] border border-[#E3E9F2] bg-white"
              >
                <div className="relative aspect-[4/3] w-full bg-[#f0f4fa]">
                  <Image
                    src={plow.image.src}
                    alt={plow.image.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase md:text-xs">
                    {plow.tag}
                  </p>
                  <h4 className="mt-2 text-[26px] leading-tight font-semibold text-[#171717] md:text-[32px]">{plow.name}</h4>
                  <p className="mt-3 text-[15px] leading-[1.6] text-[#444444] md:text-base">{plow.text}</p>

                  <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-[#E3E9F2] bg-[#E3E9F2]">
                    {plow.specs.map((spec) => (
                      <div key={spec.label} className="bg-white px-4 py-3.5 md:px-5 md:py-4">
                        <dt className="font-ui text-[10px] font-semibold tracking-[.1em] text-brand-dark uppercase md:text-[11px]">
                          {spec.label}
                        </dt>
                        <dd className="mt-1 font-ui text-[15px] font-semibold text-[#171717] md:text-[17px]">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>

                  <p className="mt-7 font-ui text-sm font-semibold text-[#171717]">{plows.standardLabel}</p>
                  <ul className="mt-3 space-y-2">
                    {plow.standard.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] leading-[1.5] text-[#444444]">
                        <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-6 font-ui text-sm font-semibold text-[#171717]">{plows.accessoriesLabel}</p>
                  <ul className="mt-3 space-y-2">
                    {plow.accessories.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] leading-[1.5] text-[#444444]">
                        <PlusIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-mid" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
