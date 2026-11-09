import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import type { Brand } from "@/lib/brands";

/**
 * What Skralli sells from the brand, one card per product line, each linking
 * to the þjónusta page (and its sub-pages or sections) where it is sold.
 * These are the page's main internal links, so every link is a real <a>
 * with descriptive text rather than a bare "Skoða nánar".
 */
export function BrandProductLines({ brand }: { brand: Brand }) {
  const columns = brand.productLines.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section id="vorur" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container>
        <Reveal
          as="h2"
          className="text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]"
        >
          Vörur frá {brand.name} hjá Skralla
        </Reveal>
        <Reveal as="p" delay={0.05} className="mt-4 max-w-2xl text-base leading-[1.65] text-[#444444] md:text-lg">
          Skoðaðu úrvalið á þjónustusíðunum okkar eða sendu okkur fyrirspurn og við finnum lausnina sem hentar þínu
          tæki.
        </Reveal>
        <Stagger className={`mt-10 grid gap-6 sm:grid-cols-2 ${columns}`}>
          {brand.productLines.map((line) => (
            <StaggerItem
              key={line.title}
              as="article"
              className="group flex flex-col overflow-hidden rounded-[18px] border border-[#E3E9F2] bg-white transition-shadow duration-300 hover:shadow-[0_18px_40px_-20px_rgba(0,83,128,0.35)]"
            >
              <Link href={line.href} tabIndex={-1} aria-hidden="true" className="block">
                <div className={`relative aspect-[3/2] w-full overflow-hidden ${line.contain ? "bg-[#f7f9fc]" : ""}`}>
                  <Image
                    src={line.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                    className={`transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:transform-none ${
                      line.contain ? "object-contain p-6" : "object-cover"
                    }`}
                  />
                </div>
              </Link>
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="font-ui text-xl font-semibold text-[#171717]">
                  <Link href={line.href} className="transition-colors hover:text-brand-dark">
                    {line.title}
                  </Link>
                </h3>
                <p className="mt-2.5 text-[15px] leading-[1.65] text-[#444444]">{line.text}</p>
                {line.links?.length ? (
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {line.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex rounded-full border border-[#E3E9F2] px-3 py-1.5 font-ui text-[13px] font-medium text-[#171717] transition-colors hover:border-brand-dark hover:text-brand-dark"
                        >
                          {link.text}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <Link
                  href={line.href}
                  className="mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-sm font-semibold text-brand-dark hover:underline"
                >
                  {line.cta}
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transform-none">
                    →
                  </span>
                </Link>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
