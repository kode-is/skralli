// schema.org JSON-LD for the /vorumerki pages. Each builder returns one
// `@graph` document, rendered by components/JsonLd.tsx.
//
// Nodes reference each other by `@id` (the page URL plus a fragment), so the
// brand page's WebPage, Brand, BreadcrumbList, FAQPage and the Skralli
// Organization read as one connected entity graph rather than loose blobs.
// Everything stated here is also visible on the page — search engines
// discount (or penalise) structured data that the reader cannot see.
import type { Brand } from "./brands";
import { site } from "./site";

export const SITE_URL = "https://skralli.is";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;

const absolute = (path: string) => new URL(path, SITE_URL).toString();

export type Crumb = { name: string; path: string };

function organization() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    url: SITE_URL,
    logo: absolute("/icon.png"),
    email: site.email,
    telephone: site.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Móhella 3F",
      postalCode: "221",
      addressLocality: "Hafnarfjörður",
      addressCountry: "IS",
    },
    sameAs: [site.facebook, site.instagram.split("?")[0]],
  };
}

function breadcrumbList(id: string, crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": id,
    itemListElement: [{ name: "Forsíða", path: "/" }, ...crumbs].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absolute(crumb.path),
    })),
  };
}

export function brandPageJsonLd(brand: Brand) {
  const url = absolute(brand.href);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: brand.seoTitle,
        description: brand.seoDescription,
        inLanguage: "is",
        about: { "@id": `${url}#brand` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        publisher: { "@id": ORGANIZATION_ID },
        primaryImageOfPage: absolute(brand.image.src),
        // The þjónusta pages the brand's products are sold on.
        relatedLink: [...new Set(brand.productLines.map((line) => absolute(line.href.split("#")[0])))],
      },
      {
        "@type": "Brand",
        "@id": `${url}#brand`,
        name: brand.name,
        description: brand.tagline,
        logo: absolute(brand.cardImage.src),
        sameAs: [brand.site],
      },
      breadcrumbList(`${url}#breadcrumb`, [
        { name: "Vörumerki", path: "/vorumerki" },
        { name: brand.name, path: brand.href },
      ]),
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: brand.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      organization(),
    ],
  };
}

export function brandIndexJsonLd({
  title,
  description,
  brands,
}: {
  title: string;
  description: string;
  brands: Brand[];
}) {
  const url = absolute("/vorumerki");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        inLanguage: "is",
        breadcrumb: { "@id": `${url}#breadcrumb` },
        publisher: { "@id": ORGANIZATION_ID },
        mainEntity: { "@id": `${url}#brands` },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#brands`,
        name: "Vörumerki hjá Skralla",
        numberOfItems: brands.length,
        itemListElement: brands.map((brand, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: absolute(brand.href),
          name: brand.name,
        })),
      },
      breadcrumbList(`${url}#breadcrumb`, [{ name: "Vörumerki", path: "/vorumerki" }]),
      organization(),
    ],
  };
}
