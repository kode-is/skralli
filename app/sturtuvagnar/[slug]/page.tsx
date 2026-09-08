import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactCta } from "@/components/ContactCta";
import { TrailerIcon } from "@/components/sturtuvagnar/TrailerIcon";
import { WagonSections } from "@/components/sturtuvagnar/WagonSections";
import { pageMetadata } from "@/lib/seo";
import { wagonGroups, wagons, type WagonGroup, type Wagon } from "@/lib/sturtuvagnar";

type PageParams = { slug: string };

function findRecord(slug: string): WagonGroup | Wagon | undefined {
  return wagonGroups.find((group) => group.slug === slug) ?? wagons.find((wagon) => wagon.slug === slug);
}

// Wagon is the only one of the two record shapes with a `groupId`, so this
// also distinguishes a wagon-group page from a product page — used only to
// decide whether to show the group hero's TrailerIcon badge
// (docs/reference/sturtuvagnar__hjolagrofuvagnar.desktop.jpg and the other
// four group screenshots all have it; every product screenshot doesn't).
function isGroup(record: WagonGroup | Wagon): record is WagonGroup {
  return !("groupId" in record);
}

export function generateStaticParams() {
  return [...wagonGroups, ...wagons].map((record) => ({ slug: record.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = findRecord(slug);
  if (!record) return {};
  return pageMetadata({
    title: record.pageTitle,
    description: record.description,
    path: `/sturtuvagnar/${record.slug}`,
  });
}

export default async function SturtuvagnarSlugPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = await params;
  const record = findRecord(slug);
  if (!record) notFound();

  return (
    <main>
      <PageHero
        image={record.heroImage}
        title={record.title}
        icon={isGroup(record) ? <TrailerIcon className="h-6 w-6" /> : undefined}
      />
      <div className="bg-white pt-8">
        <Container>
          <Breadcrumb
            items={[{ text: "Sturtuvagnar", href: "/sturtuvagnar" }, { text: record.title }]}
          />
        </Container>
      </div>
      <section className="bg-white py-10 md:py-14">
        <Container>
          <WagonSections blocks={record.blocks} images={record.images} />
        </Container>
      </section>
      <ContactCta />
    </main>
  );
}
