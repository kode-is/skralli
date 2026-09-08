import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import type { Wagon, WagonGroup } from "@/lib/sturtuvagnar";

// Mockup 1's "Tegundir í boði" section on a product page: the sibling
// products of the same group (current product excluded), as linked cards —
// same card shell as CategoryCard.tsx / OtherGroupsSection.tsx (whole card
// clickable, image scales on hover) — plus a link back to the group page.
export function SiblingProducts({
  group,
  siblings,
}: {
  group: WagonGroup;
  siblings: Wagon[];
}) {
  if (siblings.length === 0) return null;

  return (
    <section className="bg-white py-14 md:py-16">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-semibold text-neutral-900 md:text-4xl">Tegundir í boði</h2>
          <Link
            href={`/sturtuvagnar/${group.slug}`}
            className="text-[15px] font-medium text-brand-dark transition hover:underline"
          >
            Sjá alla {group.title.toLowerCase()} →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {siblings.map((wagon) => (
            <Link
              key={wagon.slug}
              href={`/sturtuvagnar/${wagon.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative aspect-[5/4] w-full overflow-hidden">
                <Image
                  src={wagon.cardImage.src}
                  alt={wagon.cardImage.alt || wagon.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <h3 className="font-ui text-lg font-semibold text-neutral-900">{wagon.title}</h3>
                <p className="text-sm leading-relaxed text-neutral-600">{wagon.blurb}</p>
                <span className="mt-1 text-sm font-semibold text-brand-dark">
                  Skoða nánar →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
