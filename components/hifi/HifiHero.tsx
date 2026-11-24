import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { HeroReveal } from "@/components/motion/Reveal";
import type { Img } from "@/lib/types";
import { photoFit } from "./catalog";

const MIN_RATIO = 4 / 5;
const MAX_RATIO = 3 / 2;
const MAX_HEIGHT = 520;

function frameStyle(image: Img) {
  const ratio = Math.min(MAX_RATIO, Math.max(MIN_RATIO, image.width / image.height));
  return {
    aspectRatio: ratio.toFixed(3),
    maxWidth: ratio < 1 ? `${Math.round(MAX_HEIGHT * ratio)}px` : undefined,
  };
}

/**
 * Title and inquiry paths on the brand band, with the product photo framed
 * beside it. Same structure as the brand-page hero: the old full-bleed hero
 * enlarged small product photos until they blurred and lost their edges.
 */
export function HifiHero({
  title,
  subtitle,
  image,
  icon,
  eyebrow = "Hífi- & festibúnaður",
  coverPhoto = false,
}: {
  title: string;
  subtitle?: string;
  image: Img;
  /** Decorative category glyph beside the eyebrow. */
  icon?: ReactNode;
  eyebrow?: string;
  /** For a full scene photo, which should fill the frame. */
  coverPhoto?: boolean;
}) {
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(1,168,220,0.35),transparent_55%)]"
      />
      <Container className="relative grid items-center gap-10 pt-32 pb-14 md:grid-cols-[1.05fr_1fr] md:gap-16 md:pt-44 md:pb-20">
        <div>
          <HeroReveal className="flex items-center gap-3">
            {icon ? (
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-white/15 text-white">
                {icon}
              </span>
            ) : null}
            <p className="font-ui text-[11px] font-semibold tracking-[.14em] text-white/70 uppercase md:text-xs">{eyebrow}</p>
          </HeroReveal>
          <HeroReveal as="h1" delay={0.1} className="mt-3 text-[40px] leading-[1.06] font-semibold md:text-[64px] md:leading-[1.03]">
            {title}
          </HeroReveal>
          {subtitle ? (
            <HeroReveal as="p" delay={0.2} className="mt-5 max-w-xl text-lg leading-[1.55] text-white/90 md:text-xl">
              {subtitle}
            </HeroReveal>
          ) : null}
          <HeroReveal delay={0.3} className="mt-8 flex flex-wrap gap-3">
            <a
              href="#fyrirspurn"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-brand-dark transition-colors duration-200 hover:bg-[#e6f4fb]"
            >
              Senda fyrirspurn
            </a>
            <a
              href="#vorur"
              className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/60 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-white hover:bg-white/10"
            >
              Skoða vörur
              <span aria-hidden="true">↓</span>
            </a>
          </HeroReveal>
        </div>
        <HeroReveal
          delay={0.15}
          className="relative w-full justify-self-center overflow-hidden rounded-[20px] bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:justify-self-end"
          style={frameStyle(image)}
        >
          <Image
            src={image.src}
            alt={image.alt || title}
            fill
            priority
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
            className={coverPhoto ? "object-cover" : photoFit(image)}
          />
        </HeroReveal>
      </Container>
    </section>
  );
}
