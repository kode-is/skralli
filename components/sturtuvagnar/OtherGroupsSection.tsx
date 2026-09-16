import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { wagonGroups } from "@/lib/sturtuvagnar";

export function OtherGroupsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <Reveal as="h2" className="text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
          Aðrar vagntegundir
        </Reveal>
        <Stagger className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {wagonGroups.map((group) => (
            <StaggerItem key={group.slug} className="[&>*]:h-full">
              {/* docs/scrape/sturtuvagnar.json "Aðrar vagntegundir" cards use
                  the same photo as each group's own hero (verified against
                  lib/sturtuvagnar.ts: src/alt match group.heroImage exactly
                  for all 5 groups — only heroImage's width/height, 1440x1440,
                  differ from this card's old 587x587 override, and neither
                  is read here since `fill` sizes the image from its parent).
                  aspect-[4/3] is intentional, not derived from heroImage: the
                  live crop is 4:3 even though the source photos are 1:1. */}
              <Link
                href={`/sturtuvagnar/${group.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)] focus-visible:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={group.heroImage.src}
                    alt={group.heroImage.alt || group.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-ui text-lg font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-brand-dark">
                    {group.title}
                  </h3>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
