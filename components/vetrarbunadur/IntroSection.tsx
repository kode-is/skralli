import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";

// docs/scrape/vetrarbunadur.json blocks 7-9. The scrape also captured a
// `link` block (index 7) wrapping this same heading+paragraph text with
// href "./" (home) — a Framer artifact (the whole hero-adjacent block is
// wrapped in a no-op link to the homepage), not a real navigation target
// for this heading. Per controller ruling this renders as a plain
// heading + paragraph, not a link.
export function IntroSection() {
  return (
    <section className="bg-white pt-10 pb-4 md:pt-14">
      <Container>
        <Reveal as="h2" className="font-ui text-3xl font-semibold text-neutral-900 md:text-4xl">
          Allt í íslenska veturinn
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-4 max-w-3xl text-sm leading-relaxed text-neutral-600 md:text-base">
          Skralli býður upp á breiða línu af vetrarbúnaði svo ökumaðurinn komist í gegnum veturinn -
          Hvort sem þú ferðist um ótroðnar slóðir eða sért ryðja veginn fyrir aðra.
        </Reveal>
      </Container>
    </section>
  );
}
