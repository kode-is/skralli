import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { inquiry } from "@/lib/vetrarbunadur";

/**
 * "Finndu réttu keðjuna": chains are ordered by tyre size, so the section
 * shows where to read it off the tyre, then an inquiry form whose message
 * is prefilled with the two things Skralli needs to quote (vehicle type and
 * tyre size). Same form and server action as /hafa-samband.
 */
export function ChainInquirySection() {
  return (
    <section id="fyrirspurn" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container className="grid gap-10 md:grid-cols-[1fr_440px] md:items-start md:gap-16">
        <div>
          <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
            {inquiry.heading}
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-3 max-w-xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
            {inquiry.text}
          </Reveal>

          <figure className="relative mt-8 overflow-hidden rounded-[20px] bg-[#1c1f24] px-6 pt-6 pb-7 text-white md:mt-10 md:px-9 md:pt-8 md:pb-9">
            {/* Tyre sidewall arc, decorative. */}
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 text-white/10 md:-top-28 md:-right-20 md:h-80 md:w-80"
            >
              <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="14" strokeDasharray="6 5" />
              <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="100" cy="100" r="44" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <figcaption className="relative font-ui text-xs font-semibold tracking-[.12em] text-white/60 uppercase">
              {inquiry.tireCaption}
            </figcaption>
            <div className="relative mt-5 flex items-start">
              {inquiry.tireExample.map((part) => (
                <div key={part.value} className="min-w-0">
                  <div className="font-stat text-[40px] leading-none font-bold whitespace-pre sm:text-[56px] md:text-[64px]">
                    {part.value}
                  </div>
                  <div className="mt-3 mr-2 border-t-2 border-brand-mid pt-2 font-ui text-[11px] leading-snug text-white/80 sm:text-xs md:mr-4 md:text-[13px]">
                    {part.label}
                  </div>
                </div>
              ))}
            </div>
            <p className="relative mt-6 font-ui text-[13px] text-white/60">{inquiry.tireNote}</p>
          </figure>

          <ol className="mt-8 grid gap-5 sm:grid-cols-3 md:mt-10">
            {inquiry.steps.map((step, index) => (
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

        <div className="rounded-[20px] bg-white p-6 shadow-[0_18px_40px_-24px_rgba(0,83,128,0.35)] md:sticky md:top-6 md:p-8">
          <h3 className="mb-6 font-sans text-2xl font-semibold text-[#171717]">{inquiry.formHeading}</h3>
          <ContactForm
            variant="card"
            fieldTone="tinted"
            showPhone
            submitLabel={inquiry.submitLabel}
            defaultMessage={inquiry.defaultMessage}
          />
        </div>
      </Container>
    </section>
  );
}
