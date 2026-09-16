import Image from "next/image";
import Link from "next/link";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Img } from "@/lib/types";

export type ChildCard = { href: string; title: string; image: Img };

/**
 * Link-card grid used by /hifi-festibunadur (its five category cards) and
 * /hifi-festibunadur/stroffur (its three child-page cards) — the scrape's
 * `link` + `image` + heading-3 triples for each. Visually a simpler sibling
 * of CategoryCard.tsx (no icon badge, no blurb line, since neither of these
 * two source pages has one for these cards).
 */
export function ChildCards({ items }: { items: ChildCard[] }) {
  return (
    <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <StaggerItem key={item.href} className="[&>*]:h-full">
          <Link
            href={item.href}
            className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)] focus-visible:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)] motion-reduce:transform-none motion-reduce:transition-none"
          >
            <div className="relative aspect-[5/4] w-full overflow-hidden">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-ui text-lg font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-brand-dark">
                {item.title}
              </h3>
            </div>
          </Link>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
