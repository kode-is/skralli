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
  /**
   * Subtle repeating diagonal-stripe texture (docs/scrape/svg/b9d9b044.svg).
   * Verified against a live fetch of https://skralli.is/smurkerfi: the SVG
   * is set as a `background-image` on a `position:absolute;inset:0` div
   * that is the *first* child of the hero section (Framer calls it
   * "Service Title") — i.e. it's this hero band's own background, painted
   * behind the black tint overlay and the full-bleed photo, not a
   * background on the two info cards further down the page. Because the
   * photo is opaque and covers the hero edge-to-edge, the texture ends up
   * fully hidden behind it in normal rendering on the live site too — this
   * prop reproduces that same (near-invisible) layering. `docs/scrape/
   * inline-svg.json` only lists this pattern for a subset of routes
   * (service/category pages like /smurkerfi), so it's opt-in and unused by
   * the hub pages (/, /um-okkur, /thjonusta, /vorumerki).
   */
  pattern?: boolean;
  /**
   * Renders the hero photo as two stacked, identical `<img>`s instead of
   * one. Verified by fetching the live HTML of
   * https://skralli.is/sturtuvagnar/gw-100 and .../sturtuvagnar/
   * velaflutningavagnar: on the /sturtuvagnar/[slug] wagon-group and
   * product pages, the hero photo comes from a reusable Framer "card"
   * component (the same one behind the "Tegundir í boði" / "Aðrar
   * vagntegundir" cards) that always renders a base image layer plus a
   * second, identically-sourced layer for its hover-crossfade state — both
   * layers have a non-zero `getBoundingClientRect` even though the second
   * is only shown on hover, so `npm run verify`'s live-vs-local image count
   * sees one more `<img>` on these routes than a plain single-photo hero
   * produces. This prop reproduces that count without any visible change
   * (the two copies exactly overlap). Not used by the plain-photo heroes
   * elsewhere (/, /um-okkur, /thjonusta, /vorumerki, /smurkerfi, the
   * /sturtuvagnar category page), which don't have this doubling live.
   */
  duplicateImage?: boolean;
};

export function PageHero({ image, title, subtitle, icon, pattern, duplicateImage }: PageHeroProps) {
  return (
    <div className="relative flex h-[420px] items-center justify-center overflow-hidden md:h-[560px]">
      {pattern ? (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/smurkerfi/pattern-b9d9b044.svg)",
            backgroundRepeat: "repeat",
          }}
        />
      ) : null}
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority
        className="absolute inset-0 h-full w-full object-cover"
      />
      {duplicateImage ? (
        <Image
          src={image.src}
          alt=""
          aria-hidden="true"
          width={image.width}
          height={image.height}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
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
