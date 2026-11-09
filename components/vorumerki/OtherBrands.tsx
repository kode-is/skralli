import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/Container";
import { Reveal } from "@/components/motion/Reveal";
import { orderedBrands, type Brand } from "@/lib/brands";

export function OtherBrands({ current }: { current: Brand }) {
  const others = orderedBrands().filter((brand) => brand.id !== current.id);
  return (
    <section className="bg-white py-16 md:py-20">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal as="h2" className="text-2xl font-semibold text-[#171717] md:text-[32px]">
            Önnur vörumerki
          </Reveal>
          <Link href="/vorumerki" className="text-sm font-semibold text-brand-dark hover:underline">
            Öll vörumerki →
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {others.map((brand) => (
            <li key={brand.id}>
              <Link
                href={brand.href}
                className="flex h-full flex-col rounded-[15px] border border-[#E3E9F2] p-5 transition-colors hover:border-brand-dark"
              >
                <span className="flex h-12 items-center">
                  <Image
                    src={brand.cardImage.src}
                    alt=""
                    width={brand.cardImage.width}
                    height={brand.cardImage.height}
                    sizes="140px"
                    className="h-auto max-h-10 w-auto max-w-[140px] object-contain object-left"
                  />
                </span>
                <span className="mt-4 font-ui font-semibold text-[#171717]">{brand.name}</span>
                <span className="mt-1 text-[13px] leading-snug text-[#4a5568]">{brand.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
