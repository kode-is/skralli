import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import type { Brand } from "@/lib/brands";

/**
 * "Um <brand>": the brand copy beside a fact card — logo, origin, product
 * category, the þjónusta pages that sell it, who it suits, and the
 * manufacturer's own site.
 */
export function BrandOverview({ brand }: { brand: Brand }) {
  const origin = [brand.origin.town, brand.origin.country].filter(Boolean).join(", ");
  return (
    <section className="bg-white py-16 md:py-24">
      <Container className="grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase md:text-xs">
            Um {brand.name}
          </Reveal>
          <Reveal
            as="h2"
            delay={0.05}
            className="mt-3 text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
          >
            {brand.heading}
          </Reveal>
          <div className="mt-6 max-w-[680px] text-base leading-[1.7] text-[#444444] md:text-[17px]">
            {brand.body.map((block, index) =>
              block.type === "list" ? (
                <ul key={index} className="mt-4 grid gap-2 sm:grid-cols-2">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[#171717]">
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-mid" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={index} className={`mt-5 first:mt-0 ${block.bold ? "font-semibold text-[#171717]" : ""}`}>
                  {block.text}
                </p>
              ),
            )}
          </div>
        </div>

        <Reveal as="aside" delay={0.1} aria-label={`Staðreyndir um ${brand.name}`} className="lg:pt-2">
          <div className="rounded-[20px] border border-[#E3E9F2] bg-[#f0f4fa] p-6 md:p-8">
            <div className="flex h-28 items-center justify-center rounded-[14px] bg-white px-6">
              <Image
                src={brand.cardImage.src}
                alt={brand.cardImage.alt}
                width={brand.cardImage.width}
                height={brand.cardImage.height}
                sizes="260px"
                className="h-auto max-h-16 w-auto max-w-[75%] object-contain"
              />
            </div>
            <dl className="mt-6 divide-y divide-[#dce5f0] font-ui text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-[#4a5568]">Uppruni</dt>
                <dd className="text-right font-medium text-[#171717]">{origin}</dd>
              </div>
              {brand.parent ? (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#4a5568]">Móðurfélag</dt>
                  <dd className="text-right font-medium text-[#171717]">{brand.parent}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-[#4a5568]">Vörur</dt>
                <dd className="text-right font-medium text-[#171717]">{brand.category}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-[#4a5568]">Þjónusta</dt>
                <dd className="flex flex-wrap justify-end gap-x-3 gap-y-1 text-right">
                  {brand.services.map((service) => (
                    <Link key={service.href} href={service.href} className="font-semibold text-brand-dark hover:underline">
                      {service.text}
                    </Link>
                  ))}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-[#4a5568]">Hentar fyrir</dt>
                <dd className="mt-2.5 flex flex-wrap gap-1.5">
                  {brand.industries.map((industry) => (
                    <span key={industry} className="rounded-full bg-white px-3 py-1 text-[13px] font-medium text-[#171717]">
                      {industry}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <a
              href={brand.site}
              target="_blank"
              rel="noopener"
              className="mt-4 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-brand-dark hover:underline"
            >
              Vefsíða {brand.name}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opnast í nýjum flipa)</span>
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
