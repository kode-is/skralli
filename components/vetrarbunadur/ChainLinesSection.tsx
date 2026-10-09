import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { chainLines } from "@/lib/vetrarbunadur";
import { CHAIN_PATTERN_STYLE, CheckIcon } from "./icons";

const CHIP = "inline-flex items-center rounded-full bg-[#f0f4fa] px-3 py-1.5 font-ui text-xs font-medium text-brand-dark";

/**
 * The Lilleseth chain lines as product cards: a dark header carrying the
 * name and the chain thicknesses (the one spec every line has), then the
 * description, what it fits and its selling points. There are no product
 * photos for the individual lines, so the header does the visual work.
 */
export function ChainLinesSection() {
  return (
    <section id="kedjulinur" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {chainLines.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-3 max-w-2xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
          {chainLines.text}
        </Reveal>

        <Stagger className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-7">
          {chainLines.items.map((line) => (
            <StaggerItem
              key={line.name}
              className="flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
            >
              <div className="relative bg-brand-dark px-6 pt-6 pb-7 text-white md:px-8 md:pt-8 md:pb-9" style={CHAIN_PATTERN_STYLE}>
                <div className="flex min-h-[26px] items-center justify-between gap-4">
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-light uppercase md:text-xs">
                    {line.kicker}
                  </p>
                  {line.badge ? (
                    <span className="shrink-0 rounded-full bg-accent-yellow px-3 py-1 font-ui text-[11px] font-semibold text-[#171717] md:text-xs">
                      {line.badge}
                    </span>
                  ) : null}
                </div>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
                  <h3 className="text-[28px] leading-none font-semibold md:text-[36px]">{line.name}</h3>
                  <div className="ml-auto text-right">
                    <p className="font-ui text-[10px] font-semibold tracking-[.12em] text-white/60 uppercase md:text-[11px]">
                      {chainLines.sizesLabel}
                    </p>
                    <p className="mt-1 font-stat text-2xl leading-none font-bold md:text-[28px]">
                      {line.sizes.join(" · ")}
                      <span className="ml-1 text-base font-medium text-brand-light md:text-lg">mm</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-6 pt-6 pb-7 md:px-8 md:pt-7 md:pb-8">
                <p className="text-[15px] leading-[1.65] text-[#444444] md:text-base">{line.text}</p>

                <ul className="mt-5 space-y-2">
                  {line.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 font-ui text-sm text-[#171717] md:text-[15px]">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-[#6b7280] uppercase">
                    {chainLines.fitsLabel}
                  </p>
                  <ul className="mt-2.5 flex flex-wrap gap-1.5">
                    {line.fits.map((fit) => (
                      <li key={fit} className={CHIP}>
                        {fit}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#fyrirspurn"
                    className="mt-6 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-brand-dark transition-colors duration-200 hover:text-brand-mid md:text-[15px]"
                  >
                    {chainLines.cta}
                    <span className="sr-only"> í {line.name}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
