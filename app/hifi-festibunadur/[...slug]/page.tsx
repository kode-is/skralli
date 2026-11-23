import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb, type BreadcrumbItem } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { ChildCards, type ChildCard } from "@/components/hifi/ChildCards";
import { HifiSections } from "@/components/hifi/HifiSections";
import { routeMetadata } from "@/lib/page-meta";
import { hifiPages, type HifiPage } from "@/lib/hifi";

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
  return routeMetadata(`/hifi-festibunadur/${page.path.join("/")}`);
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
      <PageHero
        image={page.heroImage!}
        title={page.title}
        subtitle={page.subtitle}
        icon={HifiIcon ? <HifiIcon className="h-6 w-6" /> : undefined}
        pattern
      />
      <Breadcrumb items={breadcrumbItems} />
      <section className="bg-white py-10 md:py-14">
        <Container>
          {page.children ? (
            <ChildCards items={buildChildCards(page)} />
          ) : (
            <HifiSections blocks={page.blocks} images={page.images} tables={page.tables} />
          )}
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
