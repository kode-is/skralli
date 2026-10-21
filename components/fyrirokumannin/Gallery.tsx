"use client";

import Image from "next/image";
import { useState } from "react";
import type { Img } from "@/lib/types";

type GalleryProps = {
  images: Img[];
  /** Accessible name for the gallery, e.g. the section heading. */
  label: string;
  /**
   * "cover" fills the frame (photos); "contain" shows the whole image on a
   * light ground (the floor-mat cut-outs, whose outline is the point).
   */
  fit?: "cover" | "contain";
};

/**
 * One large photo with a row of thumbnails beneath it. Replaces the live
 * page's 16:9 carousels, which cropped the portrait seat photos and the
 * mat outlines; every photo is still on the page as a thumbnail.
 */
export function Gallery({ images, label, fit = "cover" }: GalleryProps) {
  const [active, setActive] = useState(0);
  const current = images[active];
  const contain = fit === "contain";

  return (
    <div role="group" aria-label={label}>
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden rounded-[20px] md:aspect-square ${
          contain ? "bg-white" : "bg-[#f0f4fa]"
        }`}
      >
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          sizes="(min-width: 768px) 45vw, 100vw"
          className={contain ? "object-contain p-6 md:p-10" : "object-cover"}
        />
        <p className="absolute right-4 bottom-4 rounded-full bg-black/55 px-2.5 py-1 font-ui text-xs font-medium text-white">
          {active + 1} / {images.length}
        </p>
      </div>
      <ul className="mt-3 grid grid-cols-5 gap-2 md:grid-cols-7">
        {images.map((image, index) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Mynd ${index + 1} af ${images.length}`}
              aria-pressed={index === active}
              className={`relative block aspect-square w-full overflow-hidden rounded-[10px] border-2 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid ${
                index === active ? "border-brand-dark" : "border-transparent hover:border-[#cfd8e6]"
              } ${contain ? "bg-white" : "bg-[#f0f4fa]"}`}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="96px"
                className={contain ? "object-contain p-1.5" : "object-cover"}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
