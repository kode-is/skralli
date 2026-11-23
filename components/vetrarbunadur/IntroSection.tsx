import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { intro, jumpLinks } from "@/lib/vetrarbunadur";
import { JumpNav } from "./JumpNav";

// The heading and paragraph are docs/scrape/vetrarbunadur.json blocks 8-9
// (the live page wraps them in a no-op Framer link to "./", rendered here as
// plain text). The jump links below are new in the redesign: the page is
// long, so they let a visitor go straight to chains, plows or the inquiry.
export function IntroSection() {
  return (
    <section className="bg-white pt-12 pb-4 md:pt-20 md:pb-6">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {intro.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-4 max-w-3xl text-base leading-[1.65] text-[#444444] md:mt-5 md:text-lg">
          {intro.text}
        </Reveal>
        <div className="mt-7 md:mt-9">
          <JumpNav links={jumpLinks} />
        </div>
      </Container>
    </section>
  );
}
