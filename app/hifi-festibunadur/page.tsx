import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ChildCards, type ChildCard } from "@/components/hifi/ChildCards";
import { HifiHero } from "@/components/hifi/HifiHero";
import { HifiInquiry } from "@/components/hifi/HifiInquiry";
import { Reveal } from "@/components/motion/Reveal";

// docs/scrape/hifi-festibunadur.json — same <title>/<meta description> as
// every other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/hifi-festibunadur",
});

// docs/scrape/hifi-festibunadur.json block 1: same photo as the home page's
// hífi- & festibúnaður category card (lib/categories.ts),
// scraped at a 418x512 thumbnail; the actual downloaded file is 2825x3460
// (same aspect ratio), so that's what's passed to next/image — same
// small-thumbnail-distortion fix as the /oryggisrudur and /smurkerfi heroes
// (see components/smurkerfi's HERO_IMAGE comment).
const HERO_IMAGE = {
  src: "/images/home/25-cf51054e.png",
  alt: "Hífibúnaður og keðjur á sýningarvegg Lilleseth",
  width: 2825,
  height: 3460,
};

const LILLESETH_LOGO = "/images/vorumerki/logos/lilleseth-kjetting.png";

const CHILD_CARDS: ChildCard[] = [
  {
    href: "/hifi-festibunadur/hifikedjur",
    title: "Hífikeðjur",
    image: { src: "/images/hifi-festibunadur/03-9bc801b8.jpg", alt: "", width: 386, height: 135 },
  },
  {
    href: "/hifi-festibunadur/bindikedjur-strekkjarar",
    title: "Bindikeðjur og strekkjarar",
    image: { src: "/images/hifi-festibunadur/04-dd0c6f76.png", alt: "", width: 386, height: 377 },
  },
  {
    href: "/hifi-festibunadur/aukabunadur",
    title: "Aukabúnaður til hífinga",
    image: { src: "/images/hifi-festibunadur/05-865d4540.jpg", alt: "", width: 386, height: 135 },
  },
  {
    href: "/hifi-festibunadur/stroffur",
    title: "Stroffur",
    image: { src: "/images/hifi-festibunadur/06-1c399280.jpg", alt: "", width: 386, height: 135 },
  },
  {
    href: "/hifi-festibunadur/bordastrekkjarar",
    title: "Borðastrekkjarar",
    image: { src: "/images/hifi-festibunadur/07-d5932744.jpg", alt: "", width: 386, height: 135 },
  },
];

export default function HifiFestibunadurPage() {
  return (
    <main id="main">
      <HifiHero
        title="Hífi- & festibúnaður"
        subtitle="Vottaður hífi- og festibúnaður sem uppfyllir öll skilyrði um öryggi og endingu"
        image={HERO_IMAGE}
        eyebrow="Lilleseth Kjetting"
        coverPhoto
      />
      <Breadcrumb items={[{ text: "Hífi- & festibúnaður" }]} />
      <section id="vorur" className="scroll-mt-6 bg-[#f0f4fa] py-14 md:py-20">
        <Container>
          <Reveal as="h2" className="mb-8 text-[30px] leading-[1.12] font-semibold text-[#171717] md:mb-10 md:text-[44px] md:leading-[1.08]">
            Vöruflokkar
          </Reveal>
          <ChildCards items={CHILD_CARDS} />
        </Container>
      </section>
      <section className="bg-white py-14 md:py-20">
        <Container className="grid items-center gap-8 md:grid-cols-[1fr_320px] md:gap-16">
          <div>
            <Reveal as="h2" className="text-[30px] leading-[1.12] font-semibold text-[#171717] md:text-[44px] md:leading-[1.08]">
              Lyftu þungt með Lilleseth.
            </Reveal>
            <Reveal as="p" delay={0.1} className="mt-4 max-w-2xl text-base leading-[1.65] text-[#444444] md:text-lg">
              Skralli er með gott úrval af viðurkenndum hífibúnaði frá Lilleseth Kjetting AS. Keðjur með Grade 80
              og Grade 100 og margt fleira.
            </Reveal>
            <Link
              href="/vorumerki/lilleseth-kjetting"
              className="mt-6 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-brand-dark hover:underline md:text-[15px]"
            >
              Nánar um Lilleseth Kjetting <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="relative h-28 w-full max-w-[320px] md:h-36">
            <Image src={LILLESETH_LOGO} alt="Lilleseth Kjetting" fill sizes="320px" className="object-contain object-left md:object-center" />
          </div>
        </Container>
      </section>
      <HifiInquiry category="Hífi- & festibúnaður" />
    </main>
  );
}
