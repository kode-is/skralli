import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { JsonLd } from "@/components/JsonLd";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { orderedBrands } from "@/lib/brands";
import { categories } from "@/lib/categories";
import { brandIndexJsonLd } from "@/lib/structured-data";

const TITLE = "Vörumerki: Lilleseth, Gigant, Hammerglass o.fl. | Skralli";
const DESCRIPTION =
  "Skralli flytur inn Groeneveld-BEKA smurkerfi, Lilleseth snjókeðjur, Gigant sturtuvagna, Hammerglass öryggisrúður, BMair síubúnað og PeBe sætisáklæði.";

export const metadata = pageMetadata({ title: TITLE, description: DESCRIPTION, path: "/vorumerki" });

const brandList = orderedBrands();

// Each þjónusta page with the brands sold on it, in the /thjonusta order.
const servicesWithBrands = categories
  .map((category) => ({
    category,
    brands: brandList.filter((brand) => brand.services.some((service) => service.href === category.href)),
  }))
  .filter((row) => row.brands.length > 0);

export default function VorumerkiPage() {
  return (
    <main id="main">
      <JsonLd data={brandIndexJsonLd({ title: TITLE, description: DESCRIPTION, brands: brandList })} />
      <PageHero
        image={{
          src: "/images/vorumerki/01-a24654d1.jpg",
          alt: "Ísjakar á lygnu vatni í rökkri",
          width: 2560,
          height: 1707,
        }}
        title="Vörumerki"
        subtitle="Viðurkennd vörumerki frá Noregi, Svíþjóð, Hollandi og Þýskalandi, valin fyrir íslenskar aðstæður"
      />
      <Breadcrumb items={[{ text: "Vörumerki" }]} />

      <section className="bg-white pt-16 pb-6 md:pt-24 md:pb-10">
        <Container>
          <Reveal
            as="h2"
            className="max-w-3xl text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
          >
            Vörumerkin sem Skralli flytur inn og þjónustar
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-5 max-w-3xl text-base leading-[1.7] text-[#444444] md:text-lg">
            Við bjóðum eingöngu upp á vörur frá þekktum og viðurkenndum framleiðendum. Hér sérðu hvað hvert vörumerki
            framleiðir, hvaða vörur Skralli býður frá því og hvar þú finnur þær.
          </Reveal>
        </Container>
      </section>

      <section className="bg-white pb-16 md:pb-24">
        <Container>
          <Stagger as="ul" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {brandList.map((brand) => (
              <StaggerItem
                as="li"
                key={brand.id}
                className="group flex flex-col overflow-hidden rounded-[18px] border border-[#E3E9F2] bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)]"
              >
                <Link
                  href={brand.href}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="flex h-40 items-center justify-center border-b border-[#E3E9F2] bg-white px-8"
                >
                  <Image
                    src={brand.cardImage.src}
                    alt=""
                    width={brand.cardImage.width}
                    height={brand.cardImage.height}
                    sizes="260px"
                    className="h-auto max-h-16 w-auto max-w-[62%] object-contain transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase">
                    {brand.origin.country}
                  </p>
                  <h3 className="mt-2 font-ui text-[22px] font-semibold text-[#171717]">
                    <Link href={brand.href} className="hover:text-brand-dark">
                      {brand.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-[#444444]">{brand.tagline}</p>
                  <div className="mt-5">
                    <p className="font-ui text-xs font-medium text-[#4a5568]">Hjá Skralla:</p>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {brand.services.map((service) => (
                        <li key={service.href}>
                          <Link
                            href={service.href}
                            className="inline-flex rounded-full border border-[#E3E9F2] px-3 py-1.5 font-ui text-[13px] font-medium text-[#171717] transition-colors hover:border-brand-dark hover:text-brand-dark"
                          >
                            {service.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={brand.href}
                    className="mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-semibold text-brand-dark hover:underline"
                  >
                    Nánar um {brand.name}
                    <span
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none"
                    >
                      →
                    </span>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      <section className="bg-[#f0f4fa] py-16 md:py-24">
        <Container>
          <Reveal
            as="h2"
            className="text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
          >
            Vörumerki eftir þjónustu
          </Reveal>
          <Reveal as="p" delay={0.05} className="mt-4 max-w-2xl text-base leading-[1.65] text-[#444444] md:text-lg">
            Veistu hvað þig vantar en ekki frá hverjum? Svona skiptast vörumerkin á þjónustuflokkana okkar.
          </Reveal>
          <dl className="mt-10 divide-y divide-[#dce5f0] overflow-hidden rounded-[18px] bg-white">
            {servicesWithBrands.map(({ category, brands }) => (
              <div
                key={category.id}
                className="grid gap-3 px-6 py-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:items-center md:gap-8"
              >
                <dt>
                  <Link href={category.href} className="font-ui text-lg font-semibold text-[#171717] hover:text-brand-dark">
                    {category.title}
                  </Link>
                  <p className="mt-1 text-sm leading-snug text-[#4a5568]">{category.blurb}</p>
                </dt>
                <dd className="flex flex-wrap gap-2 md:justify-end">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={brand.href}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#f0f4fa] px-4 py-2 font-ui text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-dark hover:text-white"
                    >
                      {brand.name}
                      <span aria-hidden="true">→</span>
                    </Link>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <ContactCta />
    </main>
  );
}
