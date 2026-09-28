import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { accessories, spikeTypes } from "@/lib/vetrarbunadur";
import { SPIKE_ICONS } from "./icons";

// The three spike types and four accessories are the live page's lists
// (docs/scrape/vetrarbunadur.json blocks 15-24); the redesign gives each
// spike type an illustration and a line of explanation.
export function SpikesSection() {
  return (
    <section id="broddar" className="scroll-mt-6 bg-white py-16 md:py-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {spikeTypes.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-3 max-w-2xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
          {spikeTypes.text}
        </Reveal>

        <Stagger className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3 md:gap-7">
          {spikeTypes.items.map((spike) => {
            const Icon = SPIKE_ICONS[spike.icon];
            return (
              <StaggerItem key={spike.title} className="rounded-[20px] border border-[#E3E9F2] bg-white p-6 md:p-8">
                <div className="flex h-36 items-center justify-center rounded-[14px] bg-[#f0f4fa] text-brand-dark md:h-40">
                  <Icon className="h-24 w-48 md:h-28 md:w-56" />
                </div>
                <h3 className="mt-6 font-ui text-lg font-semibold text-[#171717] md:text-xl">{spike.title}</h3>
                <p className="mt-2 text-[15px] leading-[1.6] text-[#444444] md:text-base">{spike.text}</p>
              </StaggerItem>
            );
          })}
        </Stagger>

        <div className="mt-16 grid gap-8 rounded-[20px] bg-[#f0f4fa] p-6 md:mt-20 md:grid-cols-[1fr_2fr] md:items-center md:gap-12 md:p-10">
          <div>
            <h3 className="font-ui text-xl font-semibold text-[#171717] md:text-2xl">{accessories.heading}</h3>
            <p className="mt-2 text-[15px] leading-[1.6] text-[#444444] md:text-base">{accessories.text}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:gap-4">
            {accessories.items.map((item, index) => (
              <li key={item} className="flex min-h-[88px] flex-col justify-between rounded-[15px] bg-white p-4 md:p-5">
                <span className="font-ui text-xs font-semibold text-brand-dark">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-ui text-[15px] font-semibold text-[#171717] md:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
