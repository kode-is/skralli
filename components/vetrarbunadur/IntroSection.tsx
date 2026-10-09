import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { intro, jumpLinks, jumpNavLabel } from "@/lib/vetrarbunadur";

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
        <nav aria-label={jumpNavLabel} className="mt-7 md:mt-9">
          <ul className="flex flex-wrap gap-2 md:gap-2.5">
            {jumpLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E3E9F2] bg-white px-4 py-2 font-ui text-[13px] font-medium text-[#171717] transition-colors duration-200 hover:border-brand-dark hover:text-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid md:text-sm"
                >
                  {link.text}
                  <span aria-hidden="true" className="text-brand-dark">
                    ↓
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </section>
  );
}
