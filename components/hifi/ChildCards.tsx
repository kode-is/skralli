import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Img } from "@/lib/types";
import { photoFit, productCount } from "./catalog";

export type ChildCard = { href: string; title: string; image: Img };

/**
 * Category cards for /hifi-festibunadur and its stroffur sub-category. When
 * the cards leave a gap in the three-column grid, an inquiry tile fills it.
 */
export function ChildCards({ items }: { items: ChildCard[] }) {
  return (
    <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {items.map((item) => (
        <StaggerItem key={item.href} className="[&>*]:h-full">
          <Link
            href={item.href}
            className="group flex flex-col overflow-hidden rounded-[18px] border border-[#E3E9F2] bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)] focus-visible:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)]"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-white">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className={`transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none ${photoFit(item.image)}`}
              />
            </div>
            <div className="flex flex-1 items-end justify-between gap-4 border-t border-[#E3E9F2] p-5 md:p-6">
              <div>
                <h3 className="font-ui text-lg font-semibold text-[#171717] transition-colors group-hover:text-brand-dark md:text-xl">
                  {item.title}
                </h3>
                <p className="mt-1 font-ui text-sm text-[#5b6472]">{productCount(item.href)} vörunúmer</p>
              </div>
              <span aria-hidden="true" className="text-lg font-semibold text-brand-dark transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </div>
          </Link>
        </StaggerItem>
      ))}
      {items.length % 3 !== 0 ? (
        <StaggerItem className="[&>*]:h-full">
          <a
            href="#fyrirspurn"
            className="group flex min-h-[220px] flex-col justify-between rounded-[18px] bg-brand-dark p-6 text-white transition-colors hover:bg-brand-mid"
          >
            <span className="text-2xl leading-tight font-semibold">Finnurðu ekki réttu vöruna?</span>
            <span className="inline-flex items-center gap-1.5 font-ui text-sm font-semibold">
              Senda fyrirspurn <span aria-hidden="true">→</span>
            </span>
          </a>
        </StaggerItem>
      ) : null}
    </Stagger>
  );
}
