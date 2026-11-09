import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactCta } from "@/components/ContactCta";
import { JsonLd } from "@/components/JsonLd";
import { BrandHero } from "@/components/vorumerki/BrandHero";
import { BrandOverview } from "@/components/vorumerki/BrandOverview";
import { BrandProductLines } from "@/components/vorumerki/BrandProductLines";
import { BrandHighlights } from "@/components/vorumerki/BrandHighlights";
import { BrandFaq } from "@/components/vorumerki/BrandFaq";
import { OtherBrands } from "@/components/vorumerki/OtherBrands";
import { pageMetadata } from "@/lib/seo";
import { brands } from "@/lib/brands";
import { brandPageJsonLd } from "@/lib/structured-data";

type BrandPageParams = { slug: string };

export const dynamicParams = false;

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
  return pageMetadata({
    title: brand.seoTitle,
    description: brand.seoDescription,
    path: brand.href,
    image: { url: brand.image.src, width: brand.image.width, height: brand.image.height, alt: brand.image.alt },
  });
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
    <main id="main">
      <JsonLd data={brandPageJsonLd(brand)} />
      <BrandHero brand={brand} />
      <Breadcrumb items={[{ text: "Vörumerki", href: "/vorumerki" }, { text: brand.name }]} />
      <BrandOverview brand={brand} />
      <BrandProductLines brand={brand} />
      <BrandHighlights brand={brand} />
      <BrandFaq brand={brand} />
      <OtherBrands current={brand} />
      <ContactCta />
    </main>
  );
}
