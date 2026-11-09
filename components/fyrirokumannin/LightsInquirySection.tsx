import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { lightsInquiry } from "@/lib/fyrirokumannin";
import { MachineTicker } from "./MachineTicker";

/**
 * "Finndu rétta bogann": what Skralli needs to quote a bar (make, model,
 * year) as a rolling example figure, three steps, and an inquiry form
 * prefilled with the same fields. Same form and server action as
 * /hafa-samband, laid out like /vetrarbunadur's ChainInquirySection and its
 * tyre-size figure.
 */
export function LightsInquirySection() {
  return (
    <section id="fyrirspurn" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container className="grid gap-10 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12 xl:grid-cols-[1fr_440px] xl:gap-16">
        <div>
          <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
            {lightsInquiry.heading}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-3 max-w-xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
            {lightsInquiry.text}
          </Reveal>

          <MachineTicker />

          <ol className="mt-8 grid gap-5 sm:grid-cols-3 md:mt-10">
            {lightsInquiry.steps.map((step, index) => (
              <li key={step.title} className="flex gap-3.5 sm:flex-col sm:gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-dark font-ui text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="font-ui text-[15px] font-semibold text-[#171717]">{step.title}</p>
                  <p className="mt-0.5 text-sm leading-[1.55] text-[#444444]">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-[20px] bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,83,128,0.35)] lg:sticky lg:top-6 md:p-8">
          <h3 className="mb-6 font-sans text-2xl font-semibold text-[#171717]">{lightsInquiry.formHeading}</h3>
          <ContactForm
            variant="card"
            fieldTone="tinted"
            showPhone
            submitLabel={lightsInquiry.submitLabel}
            defaultMessage={lightsInquiry.defaultMessage}
          />
        </div>
      </Container>
    </section>
  );
}
