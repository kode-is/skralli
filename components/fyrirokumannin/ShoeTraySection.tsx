import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { contactHref, shoeTray } from "@/lib/fyrirokumannin";

/**
 * The shoe tray as one dark feature card: photo, the live headline, price
 * and a contact button. The source photo is only 305 px wide, so it is
 * never drawn much larger than that.
 */
export function ShoeTraySection() {
  return (
    <section id="skobakkar" className="scroll-mt-6 bg-white py-16 md:py-24">
      <Container>
        <div className="grid items-center gap-8 overflow-hidden rounded-[24px] bg-brand-dark p-5 text-white md:p-8 lg:grid-cols-[340px_1fr] lg:gap-14">
          <div
            className="relative w-full max-w-[420px] overflow-hidden rounded-[16px] bg-black/20"
            style={{ aspectRatio: `${shoeTray.image.width} / ${shoeTray.image.height}` }}
          >
            <Image src={shoeTray.image.src} alt={shoeTray.image.alt} fill sizes="(min-width: 1024px) 340px, 420px" className="object-cover" />
          </div>
          <div className="px-1 pb-3 md:px-0 md:pb-0">
            <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-light uppercase md:text-xs">
              {shoeTray.eyebrow}
            </Reveal>
            <Reveal as="h2" delay={0.05} className="mt-3 text-[28px] leading-[1.12] font-semibold md:text-[40px]">
              {shoeTray.heading}
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 max-w-[520px] text-base leading-[1.65] text-white/80 md:text-[17px]">
              {shoeTray.text}
            </Reveal>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-5">
              <p className="font-stat text-[30px] leading-none font-bold md:text-[36px]">{shoeTray.price}</p>
              <Link
                href={contactHref}
                className="inline-flex w-fit items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition-colors duration-200 hover:bg-[#f0f4fa]"
              >
                {shoeTray.cta}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
