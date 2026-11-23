import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { snowChainsFaq } from "@/lib/snjokedjur";

/**
 * Always-open questions and answers. The site's accordion (components/Faq)
 * only renders an answer once it is opened, which would leave these out of
 * the HTML that search engines read and that the FAQ schema must match.
 */
export function SnowChainFaq() {
  return (
    <section id="spurt-og-svarad" className="scroll-mt-6 bg-white py-16 md:py-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {snowChainsFaq.heading}
        </Reveal>
        <dl className="mt-8 max-w-3xl divide-y divide-[#E3E9F2] border-y border-[#E3E9F2] md:mt-10">
          {snowChainsFaq.items.map((item) => (
            <div key={item.question} className="py-5 md:py-6">
              <dt className="font-ui text-base font-semibold text-[#171717] md:text-lg">{item.question}</dt>
              <dd className="mt-2 text-[15px] leading-[1.65] text-[#444444] md:text-base">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
