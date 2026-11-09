import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Brand } from "@/lib/brands";

/**
 * Brand FAQ on native <details>: unlike components/Faq.tsx (which mounts an
 * answer only once it is opened), every answer is in the server-rendered
 * HTML, so crawlers read it and it matches the page's FAQPage JSON-LD.
 */
export function BrandFaq({ brand }: { brand: Brand }) {
  return (
    <section id="spurt-og-svarad" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <Reveal
            as="h2"
            className="text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
          >
            Spurt og svarað um {brand.name}
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-4 text-base leading-[1.65] text-[#444444]">
            Finnurðu ekki svarið? Hringdu eða sendu okkur línu og við aðstoðum þig.
          </Reveal>
        </div>
        <div className="divide-y divide-[#dce5f0] overflow-hidden rounded-[18px] bg-white">
          {brand.faq.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-ui font-semibold text-[#171717] marker:hidden [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-[17px]">{item.question}</h3>
                <span
                  aria-hidden="true"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f0f4fa] text-brand-dark transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="px-6 pb-6 text-[15px] leading-[1.7] text-[#444444]">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
