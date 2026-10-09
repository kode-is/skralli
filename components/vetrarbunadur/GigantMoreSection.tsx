import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { gigantMore } from "@/lib/vetrarbunadur";
import { CheckIcon, GIGANT_ICONS } from "./icons";

// The rest of Gigant's winter range (sand spreaders, spreader wagons, the
// ice and road scraper), which the Gigant brand page already names but the
// live /vetrarbunadur page did not show.
export function GigantMoreSection() {
  return (
    <section id="halkuvarnir" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {gigantMore.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-3 max-w-2xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
          {gigantMore.text}
        </Reveal>

        <Stagger className="mt-10 grid gap-5 md:mt-12 lg:grid-cols-3 lg:gap-7">
          {gigantMore.items.map((product) => {
            const Icon = GIGANT_ICONS[product.icon];
            return (
              <StaggerItem key={product.name} className="flex flex-col rounded-[20px] bg-white p-6 md:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-ui text-xl font-semibold text-[#171717]">{product.name}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#444444] md:text-base">{product.text}</p>

                <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-4 border-y border-[#E3E9F2] py-5">
                  {product.specs.map((spec) => (
                    <div key={spec.value} className="flex flex-col-reverse">
                      <dt className="mt-1 font-ui text-xs text-[#6b7280]">{spec.label}</dt>
                      <dd className="font-stat text-2xl leading-none font-bold text-brand-dark md:text-[28px]">{spec.value}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-5 space-y-2">
                  {product.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 font-ui text-sm text-[#171717] md:text-[15px]">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                      {point}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
