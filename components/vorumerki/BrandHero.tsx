import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { HeroReveal } from "@/components/motion/Reveal";
import type { Brand } from "@/lib/brands";

/**
 * Brand page hero: name, tagline and calls to action on the brand-dark band,
 * with the brand's photo framed beside it. The previous design blew each
 * photo up full-bleed behind the title, which turned the smaller ones
 * (Lilleseth is 757 px wide) into a blur and hid the product itself.
 */
// The frame follows the photo's own shape, clamped between 4:5 portrait and
// 16:10 landscape, so a cover crop only trims the edges. A fixed 4:3 frame
// showed barely half of the portrait Groeneveld-BEKA photo (VALA #12).
// Portrait frames are capped at 560 px tall by narrowing them.
const MIN_RATIO = 4 / 5;
const MAX_RATIO = 16 / 10;
const MAX_HEIGHT = 560;

function frameStyle(brand: Brand) {
  const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, brand.image.width / brand.image.height));
  return {
    aspectRatio: ratio.toFixed(3),
    maxWidth: ratio < 1 ? `${Math.round(MAX_HEIGHT * ratio)}px` : undefined,
  };
}

export function BrandHero({ brand }: { brand: Brand }) {
  const primaryService = brand.services[0];
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(1,168,220,0.35),transparent_55%)]"
      />
      <Container className="relative grid items-center gap-10 pt-32 pb-14 md:grid-cols-[1.05fr_1fr] md:gap-16 md:pt-44 md:pb-20">
        <div>
          <HeroReveal
            as="p"
            className="font-ui text-[11px] font-semibold tracking-[.14em] text-white/70 uppercase md:text-xs"
          >
            Vörumerki · {brand.origin.country}
          </HeroReveal>
          <HeroReveal
            as="h1"
            delay={0.1}
            className="mt-3 text-[44px] leading-[1.04] font-semibold md:text-[70px] md:leading-[1.02]"
          >
            {brand.name}
          </HeroReveal>
          <HeroReveal as="p" delay={0.2} className="mt-5 max-w-xl text-lg leading-[1.55] text-white/90 md:text-xl">
            {brand.tagline}
          </HeroReveal>
          <HeroReveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/hafa-samband"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition-colors duration-200 hover:bg-[#e6f4fb]"
            >
              Fá tilboð
            </Link>
            {primaryService ? (
              <Link
                href={primaryService.href}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
              >
                Skoða {primaryService.text.toLowerCase()}
                <span aria-hidden="true">→</span>
              </Link>
            ) : null}
          </HeroReveal>
        </div>
        <HeroReveal
          delay={0.15}
          className={`relative w-full justify-self-center overflow-hidden rounded-[20px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:justify-self-end ${
            brand.imageContain ? "bg-white" : "bg-white/10"
          }`}
          style={frameStyle(brand)}
        >
          <Image
            src={brand.image.src}
            alt={brand.image.alt}
            fill
            priority
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
            className={brand.imageContain ? "object-contain p-4" : "object-cover"}
          />
        </HeroReveal>
      </Container>
    </section>
  );
}
