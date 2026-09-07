import Image from "next/image";
import type { Img } from "@/lib/types";

type PageHeroProps = {
  image: Img;
  title: string;
  subtitle?: string;
};

export function PageHero({ image, title, subtitle }: PageHeroProps) {
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
