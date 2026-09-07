import Image from "next/image";
import type { ReactNode } from "react";
import type { Img } from "@/lib/types";

type PageHeroProps = {
  image: Img;
  title: string;
  subtitle?: string;
  /**
   * Small decorative badge shown above the title (e.g. a category glyph from
   * CategoryIcons.tsx). Not present in the scrape — the live site renders it
   * from a Framer icon set the scraper couldn't capture — so this is purely
   * visual and optional; omit it for hero variants that don't have one.
   */
  icon?: ReactNode;
};

export function PageHero({ image, title, subtitle, icon }: PageHeroProps) {
  return (
    <div className="relative flex h-[420px] items-center justify-center overflow-hidden md:h-[560px]">
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      <div className="relative z-10 px-6 text-center">
        {icon ? (
          <div
            aria-hidden="true"
            className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-dark text-white"
          >
            {icon}
          </div>
        ) : null}
        <h1 className="text-4xl font-bold text-white md:text-6xl">{title}</h1>
        {subtitle ? (
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
