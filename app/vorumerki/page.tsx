import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { brands } from "@/lib/brands";

// docs/scrape/vorumerki.json — same <title>/<meta description> as every
// other route on the live site (confirmed against the server-rendered HTML).
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/vorumerki",
});

// docs/scrape/vorumerki.json card order: BMair, Hammerglass, Groeneveld-BEKA,
// Lilleseth, Gigant, Pebe — different from lib/brands.ts's own order (which
// follows the home page's brand-strip marquee instead).
const INDEX_ORDER = ["bmair", "hammerglass", "um-beka", "lilleseth-kjetting", "gigant", "pebe"];
const orderedBrands = INDEX_ORDER.map((id) => brands.find((brand) => brand.id === id)).filter(
  (brand): brand is (typeof brands)[number] => Boolean(brand),
);

export default function VorumerkiPage() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/vorumerki/01-a24654d1.jpg",
          alt: "Ísjakar á lygnu vatni í rökkri",
          width: 1440,
          height: 960,
        }}
        title="Vörumerki"
      />
      <section className="bg-white py-16 md:py-20">
        <Container>
          <Breadcrumb items={[{ text: "Vörumerki" }]} />
          <Stagger className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {orderedBrands.map((brand) => {
              const image = brand.cardImage;
              return (
                <StaggerItem key={brand.id} className="flex flex-col">
                  <div className="flex h-44 items-center justify-center">
                    {image ? (
                      <Image
                        src={image.src}
                        alt={image.alt || brand.name}
                        width={image.width}
                        height={image.height}
                        className="h-full w-auto max-w-[80%] object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="group mt-6 rounded-2xl bg-[#f0f4fa] p-6 transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)] motion-reduce:transform-none motion-reduce:transition-none">
                    <h3 className="font-ui text-lg font-semibold text-neutral-900">{brand.name}</h3>
                    <Link
                      href={brand.href}
                      className="mt-2 inline-flex items-center text-sm font-semibold text-brand-dark transition hover:underline"
                    >
                      {/* Single inner span: keeps the label+arrow as one
                          flex item so innerText doesn't insert a line break
                          between them (see StepCard.tsx for the full note). */}
                      <span>
                        Skoða nánar{" "}
                        <span
                          aria-hidden
                          className="inline-block transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:transform-none"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
