// Site-wide constants scraped verbatim from docs/scrape/home.json (footer + nav blocks).
// Cross-checked string-by-string against the scrape; see task-4-report.md for notes.

// Each value is written once and the labelled variants derive from it, so the
// footer, the hero pills, the privacy policy and the search index cannot drift
// apart when a number changes.
const phoneLocal = "546 3500";
const hoursValue = "Mán - Fös 8 - 16";

export const site = {
  name: "Skralli",
  tagline: "Þinn samstarfsaðili",
  motto: "Samvinna - Þjónusta - Áreiðanleiki",
  address: "Móhella 3F, 221 Hafnarfjörður",
  kennitala: "Kt. 580821-1460",
  phoneLocal,
  phoneLabel: `Símanúmer: ${phoneLocal}`,
  phone: `+354 ${phoneLocal}`,
  phoneHref: `tel:+354${phoneLocal.replace(/\s/g, "")}`,
  email: "skralli@skralli.is",
  hoursValue,
  hours: `Opnunartími: ${hoursValue}`,
  hoursSplit: ["Opnunartími:", "Mán - Fös", "8 - 16"],
  facebook: "https://www.facebook.com/skralliehf",
  instagram:
    "https://www.instagram.com/skralliehf?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
} as const;

export const nav = [
  { text: "Heim", href: "/" },
  { text: "Þjónusta", href: "/thjonusta" },
  { text: "Um okkur", href: "/um-okkur" },
] as const;

export const navCta = { text: "Hafa samband", href: "/hafa-samband" } as const;

// Desktop hover panel under the "Þjónusta" nav item (Header.tsx /
// ServicesMenu.tsx). Order and hrefs measured on the live site; note this
// differs from the display order in lib/categories.ts.
export const servicesMenu = {
  heading: "Þjónusta",
  description: "Okkar metnaður felst í vörugæðum og framúrskarandi þjónustu.",
  columns: [
    [
      { text: "Smurkerfi", href: "/smurkerfi" },
      { text: "Sturtuvagnar", href: "/sturtuvagnar" },
      { text: "Öryggisrúður", href: "/oryggisrudur" },
      { text: "Síubúnaður", href: "/siubunadur" },
    ],
    [
      { text: "Fyrir ökumanninn", href: "/fyrirokumannin" },
      { text: "Hífi- & festibúnaður", href: "/hifi-festibunadur" },
      { text: "Vetrarbúnaður", href: "/vetrarbunadur" },
    ],
  ],
} as const;

export const footerColumns = [
  {
    heading: "Fyrirtækið",
    links: [
      { text: "Heim", href: "/" },
      { text: "Um okkur", href: "/um-okkur" },
      { text: "Þjónusta", href: "/thjonusta" },
      { text: "Hafa samband", href: "/hafa-samband" },
    ],
  },
  {
    heading: "Vörumerki",
    links: [
      { text: "Groeneveld-Beka", href: "/vorumerki/um-beka" },
      { text: "Lilleseth", href: "/vorumerki/lilleseth-kjetting" },
      { text: "Gigant", href: "/vorumerki/gigant" },
      { text: "Pebe", href: "/vorumerki/pebe" },
      { text: "Hammerglass", href: "/vorumerki/hammerglass" },
      { text: "BMair", href: "/vorumerki/bmair" },
    ],
  },
  {
    heading: "Þjónusta",
    links: [
      { text: "Smurkerfi", href: "/smurkerfi" },
      { text: "Sturtuvagnar", href: "/sturtuvagnar" },
      { text: "Öryggisrúður", href: "/oryggisrudur" },
      { text: "Vetrarbúnaður", href: "/vetrarbunadur" },
      { text: "Fyrir ökumanninn", href: "/fyrirokumannin" },
      { text: "Hífi- & festibúnaður", href: "/hifi-festibunadur" },
      { text: "Síubúnaður", href: "/siubunadur" },
    ],
  },
] as const;
