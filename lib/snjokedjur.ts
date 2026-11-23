// Page structure for /snjokedjur. The chain copy itself stays in
// lib/vetrarbunadur.ts, where Skralli's snow chain specialist approved it, and
// is reused from there. Only the headings, labels and FAQ questions below are
// new; every FAQ answer is assembled from the approved sentences.
//
// The vehicle grouping follows how lilleseth.no organises its chains by use
// (landbruk, anlegg, transport, skog). Skralli sells the common types for each
// vehicle, so each group lists the approved lines rather than a full catalogue.

import {
  accessories,
  chainLines,
  inquiry,
  spikeTypes,
  vehicles,
  vehiclesHeading,
  whyLilleseth,
  lilleseth,
  type ChainLine,
  type Vehicle,
} from "./vetrarbunadur";

export const SNOW_CHAINS_PATH = "/snjokedjur";

export const snowChainsMeta = {
  title: "Snjókeðjur frá Lilleseth fyrir öll tæki | Skralli",
  description:
    "Snjókeðjur frá Lilleseth fyrir dráttarvélar, vinnuvélar, vörubíla, rútur, vagna og fjórhjól. Sendu okkur dekkjastærðina og við finnum réttu keðjuna.",
};

export const snowChainsHero = {
  title: "Snjókeðjur",
  subtitle: "Fjórar línur sem ná yfir flest tæki.",
};

/** The link other pages use to send a visitor to the snow chains. */
export const snowChainsCta = { href: SNOW_CHAINS_PATH, text: "Skoða snjókeðjur" };

export const snowChainsBanner = {
  heading: lilleseth.heading,
  text: snowChainsHero.subtitle,
  cta: snowChainsCta,
};

const VEHICLE_GROUPS: Record<Vehicle["id"], { heading: string; fits: string[] }> = {
  drattarvelar: { heading: "Snjókeðjur fyrir dráttarvélar", fits: ["Dráttarvélar"] },
  vinnuvelar: { heading: "Snjókeðjur fyrir vinnuvélar", fits: ["Vinnuvélar", "Skógarvélar"] },
  vorubilar: {
    heading: "Snjókeðjur fyrir vörubíla og rútur",
    fits: ["Vörubílar", "Rútur", "Flutningabílar"],
  },
  "minni-taeki": {
    heading: "Snjókeðjur fyrir vagna og minni tæki",
    fits: ["Vagnar", "Fjórhjól", "Liðléttingar", "Lyftarar"],
  },
};

export type VehicleChainLine = Pick<ChainLine, "id" | "name" | "kicker" | "sizes"> & {
  /** Only the vehicles in this group that the line is approved for. */
  fits: string[];
};

export type VehicleSection = Vehicle & { heading: string; lines: VehicleChainLine[] };

export const vehicleSections: VehicleSection[] = vehicles.map((vehicle) => {
  const group = VEHICLE_GROUPS[vehicle.id];
  return {
    ...vehicle,
    heading: group.heading,
    lines: chainLines.items.flatMap((line) => {
      const fits = line.fits.filter((fit) => group.fits.includes(fit));
      return fits.length ? [{ id: line.id, name: line.name, kicker: line.kicker, sizes: line.sizes, fits }] : [];
    }),
  };
});

export const vehicleSectionsLabel = chainLines.heading;

export const snowChainsJumpLinks = [
  ...vehicles.map((vehicle) => ({ href: `#${vehicle.id}`, text: vehicle.title })),
  { href: "#kedjulinur", text: chainLines.heading },
  { href: "#broddar", text: spikeTypes.heading },
  { href: "#fyrirspurn", text: inquiry.heading },
  { href: "#spurt-og-svarad", text: "Spurt og svarað" },
];

export const snowChainsFaq = {
  heading: "Spurt og svarað um snjókeðjur",
  items: [
    {
      question: "Hvaða upplýsingar þarf ég að senda til að fá tilboð?",
      answer: "Tegund tækis og dekkjastærð nægja. Við finnum réttu keðjuna og sendum þér tilboð.",
    },
    {
      question: "Hvar finn ég dekkjastærðina?",
      answer: `${inquiry.tireCaption}. ${inquiry.tireNote}`,
    },
    {
      question: "Þarf verkfæri til að setja keðjurnar á?",
      answer: "Nei. Keðjurnar eru settar á án verkfæra. Einföld og fljótleg uppsetning, engin sérverkfæri nauðsynleg.",
    },
    {
      question: "Hvaða gerðir brodda eru í boði?",
      answer: `Flatkantur / fírkant, U-broddar og gaddar. ${spikeTypes.text}`,
    },
    {
      question: "Bjóðið þið varahluti fyrir snjókeðjur?",
      answer: `${accessories.text} Keðjuefni, viðgerðahlekkir, strekkjarar og verkfæri / keðjutangir.`,
    },
  ],
};

/** Page text for the site search index (this page has no scrape file). */
export const snowChainsSearch = {
  title: snowChainsHero.title,
  headingTexts: [
    lilleseth.heading,
    vehiclesHeading,
    ...vehicleSections.map((section) => section.heading),
    chainLines.heading,
    ...chainLines.items.map((line) => line.name),
    whyLilleseth.heading,
    spikeTypes.heading,
    ...spikeTypes.items.map((spike) => spike.title),
    inquiry.heading,
  ],
  bodyTexts: [...lilleseth.paragraphs, chainLines.text, ...chainLines.items.map((line) => line.text)],
};
