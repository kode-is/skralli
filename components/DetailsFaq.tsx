import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";

type DetailsFaqProps = {
  heading: string;
  items: { question: string; answer: string }[];
  /** Section background. Use "white" when the section above is tinted. */
  surface?: "tinted" | "white";
};

/**
 * FAQ on native <details>: every answer is in the server-rendered HTML even
 * while it is closed, so crawlers read it and it can match FAQPage JSON-LD.
 */
export function DetailsFaq({ heading, items, surface = "tinted" }: DetailsFaqProps) {
  const isWhite = surface === "white";
  return (
    <section id="spurt-og-svarad" className={`scroll-mt-6 py-16 md:py-24 ${isWhite ? "bg-white" : "bg-[#f0f4fa]"}`}>
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-16">
        <div>
          <Reveal
            as="h2"
            className="text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
          >
            {heading}
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-4 text-base leading-[1.65] text-[#444444]">
            Finnurðu ekki svarið? Hringdu eða sendu okkur línu og við aðstoðum þig.
          </Reveal>
        </div>
        <div
          className={`divide-y divide-[#dce5f0] overflow-hidden rounded-[18px] bg-white ${
            isWhite ? "border border-[#dce5f0]" : ""
          }`}
        >
          {items.map((item) => (
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
              <p className="px-6 pb-6 text-[15px] leading-[1.7] whitespace-pre-line text-[#444444]">{item.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
