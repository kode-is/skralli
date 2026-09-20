import Image from "next/image";
import { brands } from "@/lib/brands";

// Rendered box per logo as measured on the live home page (identical at
// 390–1920 px: the band is a marquee, so the logos keep their size and the
// band scrolls). The live site fits each file into its own fixed box, so the
// wide Groeneveld-BEKA mark is not taller than the compact Pebe one.
const LOGO_BOX: Record<string, { width: number; height: number }> = {
  gigant: { width: 120, height: 41 },
  hammerglass: { width: 133, height: 45 },
  "um-beka": { width: 204, height: 34 },
  "lilleseth-kjetting": { width: 100, height: 34 },
  pebe: { width: 123, height: 42 },
  bmair: { width: 151, height: 51 },
};

// Live band: 15 px radius, padding 50 px from 1280 up and 30 px below,
// logo gap 42 px from 1024 up and 32 px below, inside the 1240 px content
// width from 1024 up and edge to edge below; the inner row is 35 px tall
// with the logo boxes centred over it, which gives the 135 / 95 px band.
//
// The logos do NOT run the band's full width. They scroll through a fixed
// window centred in the band — 781 px from 1280 up, 700 px at 1024, and the
// band minus 20 px margins below that — and dissolve over the outer 10 % of
// that window. The fade mask therefore belongs on the static window. It used
// to sit on the moving track, whose two far ends are a Gigant logo, so the
// "fade" travelled with the logos and looked like one hard-coded faded
// Gigant while the band's real edges cut logos off hard.
//
// Speed: live moves 25 px/s. One logo set is 1083 px wide at the 42 px gap
// and 1023 px at the 32 px gap, hence 43 s and 41 s per loop. The track's
// right padding equals the gap so its width is exactly three sets and the
// -33.333 % loop lands seamlessly (without it the strip jumped gap/3 px).
export function BrandStrip() {
  return (
    <div className="relative z-10 -mt-10 md:-mt-14">
      <div className="mx-auto max-w-site lg:px-[50px]">
        <div className="overflow-hidden rounded-[15px] bg-brand-dark py-[30px] xl:py-[50px]">
          <div className="-my-2 mx-5 overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] lg:mx-auto lg:w-[700px] xl:w-[781px]">
            <div className="flex h-[35px] w-max animate-marquee items-center gap-8 pr-8 [--marquee-duration:41s] lg:gap-[42px] lg:pr-[42px] lg:[--marquee-duration:43s]">
              {[0, 1, 2].map((copy) =>
                brands.map((brand) => {
                  const box = LOGO_BOX[brand.id];
                  return (
                    <div
                      key={`${copy}-${brand.id}`}
                      className="relative flex shrink-0 items-center justify-center"
                      style={{ width: box.width, height: box.height }}
                      aria-hidden={copy > 0 || undefined}
                    >
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        sizes={`${box.width}px`}
                        className="object-contain"
                      />
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
