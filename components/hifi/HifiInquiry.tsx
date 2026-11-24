import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/motion/Reveal";

/** The page's inquiry form, prefilled with the product category. */
export function HifiInquiry({ category }: { category: string }) {
  return (
    <section id="fyrirspurn" className="scroll-mt-6 bg-brand-dark py-16 text-white md:py-24">
      <Container className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,400px)] lg:grid-cols-[minmax(0,1fr)_440px] md:items-start md:gap-16">
        <div>
          <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold md:text-[50px] md:leading-[1.08]">
            Sendu okkur fyrirspurn
          </Reveal>
          <Reveal as="p" delay={0.1} className="mt-4 max-w-xl text-base leading-[1.65] text-white/85 md:text-lg">
            Tilgreindu vörunúmer og magn, eða lýstu verkefninu og við aðstoðum þig við að velja réttan búnað.
          </Reveal>
        </div>
        <div className="rounded-[20px] bg-white p-6 text-[#171717] shadow-[0_18px_40px_-24px_rgba(0,0,0,0.5)] md:p-8">
          <ContactForm
            variant="card"
            fieldTone="tinted"
            showPhone
            submitLabel="Senda fyrirspurn"
            defaultMessage={`Vöruflokkur: ${category}\nVörunúmer:\nMagn:\n`}
          />
        </div>
      </Container>
    </section>
  );
}
