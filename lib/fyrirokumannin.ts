// Copy and image data for /fyrirokumannin, kept in one place so the
// Icelandic can be reviewed and edited without touching the components.
//
// Every heading, paragraph, list item and price that is live on skralli.is
// is kept verbatim (docs/scrape/fyrirokumannin.json, block numbers below):
// npm run verify compares the page line by line, so each live string must
// still render as one unbroken line, and never in CSS `uppercase` (innerText
// returns the transformed text).
//
// New in the redesign: the eyebrows, button labels and alt texts, the
// "Sniðið að tækinu" band (drawn from the live seat-cover and mat copy), and
// the whole light-bar half below the shoe trays. Its machine photos are
// Skralli's own (cropped copies of smurkerfi/15 and home/21). The light-bar details come
// from the two makers' own product pages (mittx.se/produkter, entrax.se) and
// are a first draft pending Skralli's review.

import type { Img } from "./types";

export type VehicleIconName = "van" | "truck" | "loader" | "tractor";

/** In-page jump links shown under the breadcrumb. */
export const jumpNavLabel = "Á þessari síðu";
export const jumpLinks = [
  { href: "#saetisaklaedi", text: "Sætisáklæði" },
  { href: "#golfmottur", text: "Gólfmottur" },
  { href: "#skobakkar", text: "Skóbakkar" },
  { href: "#ljosabunadur", text: "Ljósabogar" },
  { href: "#fyrirspurn", text: "Fyrirspurn um ljósaboga" },
];

export const contactHref = "/hafa-samband";

// ---------------------------------------------------------------- seat covers

export type PriceRow = { icon: VehicleIconName; vehicle: string; price: string };

/** Blocks 7-44: copy, the per-vehicle price list, and 7 photos. */
export const seatCovers = {
  eyebrow: "Í húsinu · PeBe",
  heading: "Sætisáklæði",
  text: "Vönduð sætisáklæði, sérsniðin fyrir hvern framleiðanda. Stílhrein og nákvæm hönnun sem sér til þess að efnið færist ekki til þegar er verið að fara oft inn í og úr ökutækinu. Áklæðin gera ráð fyrir því hvort sætin séu með loftpúða, höfuðpúða eða innbyggð borð.",
  materials: "Veldu tau eða leðurlíki.",
  primaryCta: { href: "/hafa-samband", text: "Fá tilboð í áklæði" },
  secondaryCta: { href: "/vorumerki/pebe", text: "Nánar um PeBe" },
  pricesLabel: "Fyrir",
  // Each tile renders "{vehicle} - {price}" as one line of text, the live
  // string, with the price wrapped onto its own visual line.
  prices: [
    { icon: "van", vehicle: "Vinnubíla", price: "frá 70.629kr m/vsk." },
    { icon: "truck", vehicle: "Vörubíla", price: "46.872kr m/vsk." },
    { icon: "loader", vehicle: "Vinnuvélar", price: "43.400kr m/vsk." },
    { icon: "tractor", vehicle: "Dráttarvélar", price: "43.400kr m/vsk." },
  ] satisfies PriceRow[],
  images: [
    { src: "/images/fyrirokumannin/02-a5d3e9bb.jpeg", alt: "Sætisáklæði í vinnubíl", width: 3024, height: 4032 },
    { src: "/images/fyrirokumannin/03-9926b7eb.jpg", alt: "Sætisáklæði á ökumannssæti", width: 3543, height: 5315 },
    { src: "/images/fyrirokumannin/04-826b8643.jpeg", alt: "Sætisáklæði á sæti með höfuðpúða", width: 2736, height: 3648 },
    { src: "/images/fyrirokumannin/05-aed3f052.jpeg", alt: "Sætisáklæði á bekk í vinnubíl", width: 2653, height: 3441 },
    { src: "/images/fyrirokumannin/06-33611083.jpeg", alt: "Nærmynd af saumum á sætisáklæði", width: 3024, height: 4032 },
    { src: "/images/fyrirokumannin/07-cb83398b.jpeg", alt: "Merki PeBe á sætisáklæði", width: 3024, height: 4032 },
    { src: "/images/fyrirokumannin/08-1d1531ef.jpeg", alt: "Sætisáklæði í leðurlíki", width: 3024, height: 4032 },
  ] satisfies Img[],
};

// ---------------------------------------------------------------- fit band

export type FitIconName = "stays" | "seat" | "fabric" | "mat";
export type FitPoint = { icon: FitIconName; title: string; text: string };

/** Dark band between seat covers and mats; every point restates live copy. */
export const fitBand = {
  heading: "Sniðið að tækinu",
  items: [
    {
      icon: "stays",
      title: "Situr kyrrt",
      text: "Efnið færist ekki til þótt farið sé oft inn og út úr tækinu.",
    },
    {
      icon: "seat",
      title: "Fyrir hvert sæti",
      text: "Gert ráð fyrir loftpúðum, höfuðpúðum og innbyggðum borðum.",
    },
    {
      icon: "fabric",
      title: "Tau eða leðurlíki",
      text: "Stílhrein og nákvæm hönnun, í því efni sem hentar þér.",
    },
    {
      icon: "mat",
      title: "Rennur ekki til",
      text: "Motturnar eru sniðnar að gólfinu og þola mikla notkun.",
    },
  ] satisfies FitPoint[],
};

// ---------------------------------------------------------------- floor mats

export type FitItem = { icon: VehicleIconName; text: string };

/** Blocks 45-75: copy, the four vehicle types, one price and 5 photos. */
export const floorMats = {
  eyebrow: "Í húsinu · PeBe",
  heading: "Gólfmottur",
  text: "Slitsterkar gólfmottur sem þola mikla notkun. Sérsniðið að gólfinu í hverju tæki og renna þannig ekki til líkt og alhliða gólfmottur eiga til að gera.",
  fitsLabel: "Fyrir",
  // Block 73 "Dráttarvélar" has no `list` annotation in the scrape, but
  // docs/scrape/formatting.json's raw `lists` array confirms it as the 4th
  // item of this same list.
  fits: [
    { icon: "van", text: "Vinnubíla" },
    { icon: "truck", text: "Vörubíla" },
    { icon: "loader", text: "Vinnuvélar" },
    { icon: "tractor", text: "Dráttarvélar" },
  ] satisfies FitItem[],
  priceLabel: "Verð",
  // Einar confirmed on 2026-09-20 that this is the price with VAT; the live
  // phone layout's "16.800+vsk kr." is outdated.
  price: "21.700kr m/vsk.",
  cta: "Fá tilboð í mottur",
  images: [
    { src: "/images/fyrirokumannin/32-b915af96.png", alt: "Sérsniðin gólfmotta", width: 6000, height: 4000 },
    { src: "/images/fyrirokumannin/33-ae952cb3.png", alt: "Sérsniðin gólfmotta", width: 4000, height: 6000 },
    { src: "/images/fyrirokumannin/34-5dae7337.png", alt: "Sérsniðin gólfmotta", width: 4000, height: 6000 },
    { src: "/images/fyrirokumannin/35-b9bddba2.png", alt: "Sérsniðin gólfmotta", width: 4000, height: 6000 },
    { src: "/images/fyrirokumannin/36-c679b572.png", alt: "Sérsniðin gólfmotta", width: 4000, height: 6000 },
  ] satisfies Img[],
};

// ---------------------------------------------------------------- shoe trays

/** Blocks 76-80. */
export const shoeTray = {
  eyebrow: "Í húsinu · Þróað með PeBe",
  heading: "Ekki vaða inn á skítugum skónum",
  text: "Í samstarfi við PeBe höfum við þróað sérútbúna skóbakka úr þykku gúmmíi með kanti.",
  price: "8.060kr m/vsk.",
  cta: "Hafa samband",
  image: { src: "/images/fyrirokumannin/55-d2881ae9.jpg", alt: "Gúmmískóbakki á gólfi í vinnuvél", width: 305, height: 279 } satisfies Img,
};

// ---------------------------------------------------------------- light bars

export type BarId = "tak" | "ballest" | "hlidarror" | "hudd" | "grill";
export type MachineId = "grafa" | "hjolaskofla";
export type LightKind = "position" | "beacon" | "work";

/** Blocks 81-82, as the opening banner of the light-bar half. */
export const lightsBanner = {
  eyebrow: "Utan á tækinu · MittX og Entrax",
  heading: "Ljósabúnaður",
  text: "Sérsniðnir ljósabogar frá Svíþjóð fyrir hús og ballest á vinnuvélar og dráttarvélar.",
  stats: [
    { value: "5", label: "Gerðir boga" },
    { value: "3", label: "Gerðir ljósa" },
    { value: "35+", label: "Tegundir véla" },
  ],
  cta: { href: "#ljosabogar", text: "Skoða bogana" },
  // Same Skralli photo as on /smurkerfi (downloaded file is 2560x1920).
  image: {
    src: "/images/smurkerfi/14-2234de63.jpg",
    alt: "CAT beltagrafa og þjónustubíll Skralla í snjó",
    width: 2560,
    height: 1920,
  } satisfies Img,
};

export type LightBar = {
  id: BarId;
  machine: MachineId;
  name: string;
  where: string;
  text: string;
  lights: LightKind[];
  fits: string[];
  /** Where the bar sits on the machine photo, in % of its width/height. */
  pin: { x: number; y: number };
};

export const lightKinds: Record<LightKind, string> = {
  position: "Stöðuljós",
  beacon: "Blikkljós",
  work: "Vinnuljós",
};

/** Side-on photos the guide pins the bars onto; the pins assume these crops. */
export const machinePhotos: Record<MachineId, Img> = {
  // smurkerfi/15-a810ffe2.jpg cropped to 2560x1000 from y=330, then 1600 wide.
  grafa: { src: "/images/fyrirokumannin/ljos-grafa.webp", alt: "CAT 395 beltagrafa á hlið", width: 1600, height: 625 },
  // home/21-212e4fb5.png, uncropped.
  hjolaskofla: { src: "/images/fyrirokumannin/ljos-hjolaskofla.webp", alt: "CAT hjólaskófla á hlið", width: 1752, height: 815 },
};

export const machineNames: Record<MachineId, string> = {
  grafa: "Beltagrafa",
  hjolaskofla: "Hjólaskófla",
};

/**
 * The clickable bar guide: pick a bar, see where it sits on the machine.
 * Checked against the makers' own pages on 2026-10-21: mittx.se/produkter
 * (motvikts-, huv- och grill-, takbågar) and entrax.se (takbåge,
 * motviktsbåge, huvbåge, sidorör, grillbåge).
 */
export const barGuide = {
  id: "ljosabogar",
  heading: "Hvar fer boginn?",
  text: "Fimm gerðir boga, hver smíðuð fyrir sinn stað á vélinni. Veldu boga til að sjá hvar hann situr.",
  lightsLabel: "Ljós",
  fitsLabel: "Hentar fyrir",
  bars: [
    {
      id: "tak",
      machine: "grafa",
      name: "Þakbogi",
      where: "Á þaki hússins",
      text: "Bogi á þak hússins með festingum fyrir vinnuljós. Lýsir upp vinnusvæðið í skammdeginu.",
      lights: ["work", "beacon"],
      fits: ["Gröfur", "Hjólaskóflur", "Dráttarvélar", "Skógarvélar"],
      pin: { x: 42, y: 27 },
    },
    {
      id: "ballest",
      machine: "grafa",
      name: "Ballestarbogi",
      where: "Aftan á ballest gröfunnar",
      text: "Situr aftast á ballest gröfunnar og sýnir greinilega hvar vélin er. Kemur með raflögn tilbúinni fyrir stöðu-, blikk- og vinnuljós.",
      lights: ["position", "beacon", "work"],
      fits: ["Beltagröfur", "Hjólagröfur"],
      pin: { x: 7, y: 19 },
    },
    {
      id: "hlidarror",
      machine: "grafa",
      name: "Hliðarrör",
      where: "Meðfram undirvagninum",
      text: "Rör meðfram neðri brún vélarinnar með stöðuljósum, svo útlínur gröfunnar sjáist í myrkri.",
      lights: ["position"],
      fits: ["Gröfur"],
      pin: { x: 24, y: 59 },
    },
    {
      id: "hudd",
      machine: "hjolaskofla",
      name: "Húddbogi",
      where: "Aftan á húddinu",
      text: "Bogi aftast á húddi hjólaskóflunnar með stöðu- og blikkljósum sem sjást vel aftan frá.",
      lights: ["position", "beacon"],
      fits: ["Hjólaskóflur"],
      pin: { x: 86, y: 31 },
    },
    {
      id: "grill",
      machine: "hjolaskofla",
      name: "Grillbogi",
      where: "Á grillinu",
      text: "Minni bogi sem festist á grill vélarinnar, með stöðu- og blikkljósum.",
      lights: ["position", "beacon"],
      fits: ["Hjólaskóflur", "Skógarvélar"],
      pin: { x: 95, y: 50 },
    },
  ] satisfies LightBar[],
};

export type BuildIconName = "fit" | "alu" | "wire" | "drill";
export type BuildPoint = { icon: BuildIconName; title: string; text: string };

/** Dark band after the guide: what every bar from either maker has. */
export const buildBand = {
  heading: "Smíðað fyrir þína vél",
  items: [
    { icon: "fit", title: "Sniðið að gerðinni", text: "Hver bogi er smíðaður fyrir tegund og gerð vélarinnar." },
    { icon: "alu", title: "Ál og duftlakk", text: "Álrör með slitsterku duftlakki." },
    { icon: "wire", title: "Raflögn fylgir", text: "Bogarnir koma með raflögn tilbúinni fyrir blikk- og stöðuljós." },
    { icon: "drill", title: "Forborað", text: "Bogarnir koma forboraðir svo uppsetningin er einföld." },
  ] satisfies BuildPoint[],
};

export type LightMaker = {
  name: string;
  country: string;
  text: string;
  products: string[];
  link: { href: string; text: string };
};

/**
 * The two makers by name (for search as much as for readers), beside the
 * live page's video, with the machine brands the bars are made for. Every
 * claim is from the makers' own pages, checked 2026-10-21:
 * mittx.se/produkter and entrax.se.
 */
export const lightMakers = {
  eyebrow: "Framleiðendurnir",
  heading: "Ljósabogar frá MittX og Entrax",
  text: "Ljósabogarnir koma frá tveimur sænskum framleiðendum sem sérhæfa sig í álbogum fyrir vinnuvélar og landbúnaðartæki.",
  productsLabel: "Bogar",
  makers: [
    {
      name: "MittX",
      country: "Svíþjóð",
      text: "Hannar álboga sem eru sniðnir að hverri gerð vinnuvéla og landbúnaðartækja. Allir bogar fást með stöðu-, blikk- og vinnuljósum, eru duftlakkaðir og koma forboraðir.",
      products: ["Ballestarbogar", "Húdd- og grillbogar", "Þakbogar"],
      link: { href: "https://mittx.se/", text: "mittx.se" },
    },
    {
      name: "Entrax",
      country: "Färila, Svíþjóð",
      text: "Smíðar boga úr Ø60 mm álrörum, sniðna að hverri vél, og lakkar þá á eigin verkstæði. Bogarnir koma með raflögn tilbúinni fyrir blikk- og stöðuljós.",
      products: ["Þakbogar", "Ballestarbogar", "Húddbogar", "Hliðarrör", "Grillbogar", "Fótstig"],
      link: { href: "https://www.entrax.se/", text: "entrax.se" },
    },
  ] satisfies LightMaker[],
  // From a live fetch of https://skralli.is/fyrirokumannin: `<iframe
  // src="https://www.youtube.com/embed/rbGL9zYsKck?iv_load_policy=3">`.
  // Uploaded upright, so it is shown at 9:16.
  video: { id: "rbGL9zYsKck", params: "iv_load_policy=3", title: "Ljósabúnaður fyrir vinnuvélar og dráttarvélar", aspect: "9 / 16" },
  brandsLabel: "Bogar fáanlegir fyrir",
  // Alphabetical, so no maker comes first.
  brands: ["CAT", "Develon", "Fendt", "Hitachi", "Hyundai", "JCB", "John Deere", "Komatsu", "Kubota", "Liebherr", "Massey Ferguson", "Takeuchi", "Valtra", "Volvo"],
  brandsMore: "og fleiri",
};

export type MachineExample = { make: string; model: string; year: string; type: string };

/** Block 83 leads the inquiry; same form and action as /hafa-samband. */
export const lightsInquiry = {
  heading: "Finndu rétta bogann",
  text: "Hafðu samband til að vita meira um úrvalið fyrir þína vél.",
  steps: [
    { title: "Segðu okkur frá vélinni", text: "Tegund, gerð og árgerð." },
    { title: "Veldu boga og ljós", text: "Eða fáðu ráð frá okkur." },
    { title: "Við sendum tilboð", text: "Í boga sem passar þinni vél." },
  ],
  // The dark figure beside the steps, like the tyre-size figure on
  // /vetrarbunadur: the three things that identify the right bar. It rolls
  // through makers and machine types so no one dealer is the example. Model
  // names are real; the years are only examples.
  exampleCaption: "Þetta þurfum við að vita",
  exampleLabels: { make: "Tegund", model: "Gerð", year: "Árgerð" },
  examples: [
    { make: "Volvo", model: "EC300E", year: "2021", type: "Beltagrafa" },
    { make: "Liebherr", model: "L550", year: "2019", type: "Hjólaskófla" },
    { make: "Valtra", model: "T235", year: "2022", type: "Dráttarvél" },
    { make: "Komatsu", model: "PC210", year: "2018", type: "Beltagrafa" },
    { make: "JCB", model: "3CX", year: "2020", type: "Traktorsgrafa" },
    { make: "Hitachi", model: "ZX135", year: "2023", type: "Beltagrafa" },
    { make: "Fendt", model: "724", year: "2021", type: "Dráttarvél" },
    { make: "CAT", model: "950", year: "2019", type: "Hjólaskófla" },
  ] satisfies MachineExample[],
  exampleNote: "Dæmi. Ef þú ert ekki viss um gerðina, segðu okkur bara hvaða vél þetta er.",
  formHeading: "Fyrirspurn um ljósaboga",
  submitLabel: "Senda fyrirspurn",
  defaultMessage: "Fyrirspurn um ljósaboga\nTegund og gerð vélar: \nÁrgerð: \nBogi: ",
};
