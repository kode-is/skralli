import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Brand } from "@/lib/brands";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BrandHighlights({ brand }: { brand: Brand }) {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <Reveal
          as="h2"
          className="text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
        >
          Af hverju {brand.name}?
        </Reveal>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {brand.highlights.map((item) => (
            <StaggerItem key={item.title} className="rounded-[15px] border border-[#E3E9F2] bg-white p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                <CheckIcon />
              </span>
              <h3 className="mt-5 font-ui text-lg font-semibold text-[#171717]">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-[1.6] text-[#444444]">{item.text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
