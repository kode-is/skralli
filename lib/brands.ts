// Brand partners. Partial for now — id, name, href, site (external URL) and
// the brand-strip logo path, sourced from docs/scrape/home.json (blocks 8-13,
// the marquee logos) and cross-checked against docs/scrape/vorumerki.json.
// `cardImage` is the larger wordmark/logo shown on the /vorumerki index
// (docs/scrape/vorumerki.json), which differs from the brand-strip `logo`
// crop for every brand. Task 8 extends this with `paragraphs`, `heroImage`,
// `gallery` and per-brand sections for the /vorumerki/[slug] pages.

import type { Img } from "./types";

export type Brand = {
  id: string;
  name: string;
  href: `/vorumerki/${string}`;
  site: string;
  /** Brand-strip marquee logo, from public/images/home. */
  logo: string;
  /** Larger logo/wordmark shown on the /vorumerki index cards. */
  cardImage?: Img;
  blurb?: string;
};

export const brands: Brand[] = [
  {
    id: "gigant",
    name: "Gigant",
    href: "/vorumerki/gigant",
    site: "https://gigantprodukter.no/",
    logo: "/images/home/02-3e0cd936.svg",
    cardImage: { src: "/images/vorumerki/06-4fb3378a.png", alt: "", width: 386, height: 386 },
  },
  {
    id: "hammerglass",
    name: "Hammerglass",
    href: "/vorumerki/hammerglass",
    site: "https://www.hammerglass.com/",
    logo: "/images/home/03-288ddb43.svg",
    cardImage: {
      src: "/images/home/30-51b0fe1c.png",
      alt: "Hammerglass",
      width: 386,
      height: 300,
    },
  },
  {
    id: "um-beka",
    name: "Groeneveld-BEKA",
    href: "/vorumerki/um-beka",
    site: "https://www.groeneveld-beka.com/en/",
    logo: "/images/home/04-6904d068.png",
    cardImage: {
      src: "/images/home/31-8e2b1073.svg",
      alt: "Groenevald-BEKA logo",
      width: 264,
      height: 288,
    },
  },
  {
    id: "lilleseth-kjetting",
    name: "Lilleseth",
    href: "/vorumerki/lilleseth-kjetting",
    site: "https://www.lilleseth.no/",
    logo: "/images/home/05-17eb54cf.png",
    cardImage: {
      src: "/images/home/32-4354a44e.png",
      alt: "Lilleseth Kjetting",
      width: 386,
      height: 264,
    },
  },
  {
    id: "pebe",
    name: "Pebe",
    href: "/vorumerki/pebe",
    site: "https://www.pebe.se/en/home",
    logo: "/images/home/06-79588ec3.svg",
    cardImage: { src: "/images/vorumerki/07-e213d0ba.png", alt: "", width: 386, height: 272 },
  },
  {
    id: "bmair",
    name: "BMair",
    href: "/vorumerki/bmair",
    site: "https://www.bmair.com/",
    logo: "/images/home/07-882f4f17.svg",
    cardImage: { src: "/images/vorumerki/02-949edfd3.png", alt: "", width: 386, height: 272 },
  },
];
