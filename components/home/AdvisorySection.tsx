import Link from "next/link";
import { Container } from "@/components/Container";
import { TeamCard } from "@/components/TeamCard";

const TEAM = [
  { name: "Villi", image: { src: "/images/home/27-d812c419.jpg", alt: "Villi", width: 136, height: 90 } },
  { name: "Örvar", image: { src: "/images/home/28-23d4abab.jpg", alt: "Örvar", width: 136, height: 90 } },
  { name: "Þórir", image: { src: "/images/home/29-ad270c68.jpg", alt: "Þórir", width: 136, height: 90 } },
];

export function AdvisorySection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Fagmannleg ráðgjöf</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base">
              Við erum traustir ráðgjafar og höfum aðstoðað fjölda fyrirtækja og einstaklinga við
              að finna notuð tæki og búnað erlendis. Teymið okkar býr yfir áratuga reynslu og sér
              um ferlið frá upphafi til enda.
            </p>
            <div className="mt-10 flex flex-nowrap gap-3 sm:gap-8">
              {TEAM.map((member) => (
                <TeamCard key={member.name} name={member.name} image={member.image} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center rounded-2xl bg-[#f0f4fa] p-10 text-center md:p-12">
            <Link
              href="/hafa-samband"
              className="inline-flex items-center justify-center rounded-md bg-brand-dark px-8 py-4 text-base font-semibold text-white transition hover:bg-brand-mid"
            >
              Hafa samband
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
