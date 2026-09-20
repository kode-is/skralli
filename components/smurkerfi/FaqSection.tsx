import { Container } from "@/components/Container";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/motion/Reveal";
import { faqItems } from "@/lib/faq";

export function FaqSection() {
  return (
    <section id="spurt-og-svarad" className="bg-[#f0f4fa] pt-[60px] pb-16 md:pt-[100px] md:pb-20">
      <Container>
        <Reveal as="h2" className="text-center font-ui text-3xl font-bold text-neutral-900 md:text-4xl">
          Spurt & Svarað
        </Reveal>
        <div className="mx-auto mt-10 max-w-3xl">
          <Faq items={faqItems} />
        </div>
      </Container>
    </section>
  );
}
