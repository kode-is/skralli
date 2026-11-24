import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { ChildCards, type ChildCard } from "@/components/hifi/ChildCards";
import { HifiHero } from "@/components/hifi/HifiHero";
import { HifiInquiry } from "@/components/hifi/HifiInquiry";
import { HifiSections } from "@/components/hifi/HifiSections";
import { pageMetadata } from "@/lib/seo";
import { hifiPages, type HifiPage } from "@/lib/hifi";
import { pageTerms } from "@/lib/hifi-terms";

// Site-wide <title>/<meta description> pattern: every hífi- og festibúnaður
// route (docs/scrape/hifi-festibunadur*.json) shares the one <title>, with
// each page's own scraped description.
const PAGE_TITLE = "Skralli - Þinn samstarfsaðili";

const HifiIcon = CATEGORY_ICONS["hifi-festibunadur"];

type PageParams = { slug: string[] };

function findPage(slug: string[]): HifiPage | undefined {
  const path = slug.join("/");
  return hifiPages.find((p) => p.path.join("/") === path);
}

/** stroffur's three child cards: its `blocks` alternate [link, heading]
 * pairs (the scrape's own card order), zipped with `images` in the same
 * order — see scripts/gen-hifi.mjs's parsing-rules comment. */
function buildChildCards(page: HifiPage): ChildCard[] {
  const cards: ChildCard[] = [];
  let imageIndex = 0;
  for (let i = 0; i < page.blocks.length; i++) {
    const block = page.blocks[i];
    const next = page.blocks[i + 1];
    if (block.type === "link" && next?.type === "heading") {
      const image = page.images[imageIndex++];
      if (image) cards.push({ href: block.href, title: next.text, image });
    }
  }
  return cards;
}

export function generateStaticParams() {
  return hifiPages.map((page) => ({ slug: page.path }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) return {};
  return pageMetadata({
    title: PAGE_TITLE,
    description: page.description,
    path: `/hifi-festibunadur/${page.path.join("/")}`,
  });
}

export default async function HifiSlugPage({ params }: { params: Promise<PageParams> }) {
  const { slug } = await params;
  const page = findPage(slug);
  if (!page) notFound();

  const breadcrumbItems: BreadcrumbItem[] = [{ text: "Hífi- og festibúnaður", href: "/hifi-festibunadur" }];
  if (page.path.length === 2) {
    breadcrumbItems.push({ text: "Stroffur", href: "/hifi-festibunadur/stroffur" });
  }
  breadcrumbItems.push({ text: page.title });

  return (
    <main id="main">
      <HifiHero
        title={page.title}
        subtitle={page.subtitle}
        image={page.heroImage!}
        alsoKnownAs={pageTerms(page.path)}
        icon={HifiIcon ? <HifiIcon className="h-5 w-5" /> : undefined}
      />
      <Breadcrumb items={breadcrumbItems} />
      {page.children ? (
        <section id="vorur" className="scroll-mt-6 bg-[#f0f4fa] py-14 md:py-20">
          <Container>
            <ChildCards items={buildChildCards(page)} />
          </Container>
        </section>
      ) : (
        <HifiSections blocks={page.blocks} images={page.images} tables={page.tables} heroSrc={page.heroImage?.src} />
      )}
      <HifiInquiry category={page.title} />
    </main>
  );
}
