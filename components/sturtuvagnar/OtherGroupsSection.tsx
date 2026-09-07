import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { wagonGroups } from "@/lib/sturtuvagnar";
import type { Img } from "@/lib/types";

// docs/scrape/sturtuvagnar.json "Aðrar vagntegundir" cards: 587x587 images,
// verbatim, keyed by slug in the same order as lib/sturtuvagnar.ts's
// wagonGroups (which mirrors the scrape order already). Titles and hrefs
// come from wagonGroups itself rather than being duplicated here.
const CARD_IMAGES: Record<string, Img> = {
  "fjorhjola-minigrofuvagnar": {
    src: "/images/sturtuvagnar/03-fbea7ee5.jpg",
    alt: "",
    width: 587,
    height: 587,
  },
  verktakavagnar: { src: "/images/sturtuvagnar/04-76280b19.jpg", alt: "", width: 587, height: 587 },
  landbunadarvagnar: {
    src: "/images/sturtuvagnar/05-468e8526.jpg",
    alt: "",
    width: 587,
    height: 587,
  },
  hjolagrofuvagnar: { src: "/images/sturtuvagnar/06-dece8e00.jpg", alt: "", width: 587, height: 587 },
  velaflutningavagnar: {
    src: "/images/sturtuvagnar/07-e61a69c9.jpg",
    alt: "",
    width: 587,
    height: 587,
  },
};

export function OtherGroupsSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <h2 className="text-center text-3xl font-bold text-neutral-900 md:text-4xl">
          Aðrar vagntegundir
        </h2>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          {wagonGroups.map((group) => {
            const image = CARD_IMAGES[group.slug];
            return (
              <Link
                key={group.slug}
                href={`/sturtuvagnar/${group.slug}`}
                className="group block overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.alt || group.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-neutral-900">{group.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
