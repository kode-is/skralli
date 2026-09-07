import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { brands } from "@/lib/brands";

type BrandPageParams = { slug: string };

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<BrandPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((item) => item.id === slug);
  if (!brand) return {};
  return { title: brand.title, description: brand.description };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<BrandPageParams>;
}) {
  const { slug } = await params;
  const brand = brands.find((item) => item.id === slug);
  if (!brand) notFound();

  return (
    <main>
      {/* Title band: the page's single content image as a full-bleed
          background, matching the reference screenshots — not PageHero,
          which is 420/560px tall; these bands measure 438/479px. */}
      <div className="relative flex h-[438px] items-center justify-center overflow-hidden md:h-[479px]">
        <Image
          src={brand.image.src}
          alt={brand.image.alt}
          width={brand.image.width}
          height={brand.image.height}
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <h1 className="relative z-10 px-6 text-center text-4xl font-bold text-white md:text-6xl">
          {brand.name}
        </h1>
      </div>
      {/* Every reference screenshot shows a large, near-constant gap of
          ~140px (mobile) / ~210px (desktop) between the last paragraph and
          the ContactCta band, regardless of how much copy a brand has (it's
          just as large on Gigant's 2 paragraphs as on Lilleseth's 5) — so
          this is a fixed section padding-bottom, not content-driven. */}
      <section className="bg-white pt-16 pb-36 md:pb-40">
        <Container>
          <Breadcrumb
            items={[{ text: "Vörumerki", href: "/vorumerki" }, { text: brand.name }]}
          />
          <div className="mt-10 space-y-8 text-base leading-relaxed text-neutral-700">
            {brand.subheading ? (
              <h4 className="text-xl font-bold text-neutral-900 md:text-2xl">
                {brand.subheading}
              </h4>
            ) : null}
            {brand.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
