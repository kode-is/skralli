import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { whyLilleseth } from "@/lib/vetrarbunadur";
import { BENEFIT_ICONS, CHAIN_PATTERN_STYLE } from "./icons";

export function WhyLillesethSection() {
  return (
    <section className="bg-brand-dark py-16 text-white md:py-20" style={CHAIN_PATTERN_STYLE}>
      <Container>
        <Reveal as="h2" className="text-[28px] leading-[1.15] font-semibold md:text-[40px]">
          {whyLilleseth.heading}
        </Reveal>
        <Stagger className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
          {whyLilleseth.items.map((item, index) => {
            const Icon = BENEFIT_ICONS[item.icon];
            return (
              <StaggerItem key={item.title} className={index > 0 ? "lg:pl-8" : undefined}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-brand-light">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-ui text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-white/80">{item.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
