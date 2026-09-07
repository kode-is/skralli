// Brand partners. Partial for now — id, name, href, site (external URL) and
// the brand-strip logo path, sourced from docs/scrape/home.json (blocks 8-13,
// the marquee logos) and cross-checked against docs/scrape/vorumerki.json.
// Task 8 extends this with `paragraphs`, `heroImage`, `gallery` and per-brand
// sections for the /vorumerki/[slug] pages.

export type Brand = {
  id: string;
  name: string;
  href: `/vorumerki/${string}`;
  site: string;
  /** Brand-strip marquee logo, from public/images/home. */
  logo: string;
  blurb?: string;
};

export const brands: Brand[] = [
  {
    id: "gigant",
    name: "Gigant",
    href: "/vorumerki/gigant",
    site: "https://gigantprodukter.no/",
    logo: "/images/home/02-3e0cd936.svg",
  },
  {
    id: "hammerglass",
    name: "Hammerglass",
    href: "/vorumerki/hammerglass",
    site: "https://www.hammerglass.com/",
    logo: "/images/home/03-288ddb43.svg",
  },
  {
    id: "um-beka",
    name: "Groeneveld-BEKA",
    href: "/vorumerki/um-beka",
    site: "https://www.groeneveld-beka.com/en/",
    logo: "/images/home/04-6904d068.png",
  },
  {
    id: "lilleseth-kjetting",
    name: "Lilleseth",
    href: "/vorumerki/lilleseth-kjetting",
    site: "https://www.lilleseth.no/",
    logo: "/images/home/05-17eb54cf.png",
  },
  {
    id: "pebe",
    name: "Pebe",
    href: "/vorumerki/pebe",
    site: "https://www.pebe.se/en/home",
    logo: "/images/home/06-79588ec3.svg",
  },
  {
    id: "bmair",
    name: "BMair",
    href: "/vorumerki/bmair",
    site: "https://www.bmair.com/",
    logo: "/images/home/07-882f4f17.svg",
  },
];
