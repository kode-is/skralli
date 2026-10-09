// Copy and product data for /vetrarbunadur, kept in one place so the
// Icelandic can be reviewed and edited without touching the components.
//
// Sources: the live page (docs/scrape/vetrarbunadur.json) and the brand
// pages (docs/scrape/vorumerki__lilleseth-kjetting.json,
// docs/scrape/vorumerki__gigant.json) for the text that was already live;
// lilleseth.no (the "Kjetting" category: landbruk, anlegg, transport,
// snøfreser) and gigantprodukter.no/produkter/vinter for the product lines,
// sizes and specs added in the redesign.

import type { Img } from "./types";

export type VehicleIconName = "tractor" | "loader" | "truck" | "atv";
export type SpikeIconName = "square" | "ubrodd" | "spike";
export type BenefitIconName = "fit" | "noTools" | "shield" | "steel";
export type GigantIconName = "spreader" | "wagon" | "scraper";

/** In-page jump links shown under the intro. */
export const jumpNavLabel = "Á þessari síðu";
export const jumpLinks = [
  { href: "#snjokedjur", text: "Snjókeðjur" },
  { href: "#kedjulinur", text: "Keðjutýpur" },
  { href: "#broddar", text: "Gerðir brodda" },
  { href: "#fyrirspurn", text: "Finndu réttu keðjuna" },
  { href: "#snjoplogar", text: "Snjóplógar" },
  { href: "#halkuvarnir", text: "Hálkuvarnir" },
];

export const intro = {
  heading: "Allt í íslenska veturinn",
  text: "Skralli býður upp á breiða línu af vetrarbúnaði svo ökumaðurinn komist í gegnum veturinn - Hvort sem þú ferðist um ótroðnar slóðir eða sért ryðja veginn fyrir aðra.",
};

export const lilleseth = {
  eyebrow: "Snjókeðjur · Lilleseth",
  heading: "Snjókeðjur frá Lilleseth",
  paragraphs: [
    "Lilleseth er norskt rótgróið fjölskyldufyrirtæki stofnað 1947 og sérhæfir sig í snjókeðjum fyrir bíla og tæki af öllum gerðum. Allar keðjur eru sérsniðnar og einfaldar í uppsetningu og eru því sérstaklega þægilegar í notkun.",
    "Keðjurnar eru sniðnar að dekkjastærðinni, fara vel með dekkin og eru settar á án verkfæra.",
  ],
  primaryCta: { href: "#fyrirspurn", text: "Fá tilboð í keðjur" },
  secondaryCta: { href: "/vorumerki/lilleseth-kjetting", text: "Nánar um Lilleseth" },
  stats: [
    { value: "1947", label: "Stofnað í Noregi" },
    { value: "75+", label: "Ára reynsla" },
    { value: "3", label: "Gerðir brodda" },
  ],
  statsNote: "Snjókeðjur sem henta þér",
};

export type Vehicle = { icon: VehicleIconName; title: string; text: string };

export const vehiclesHeading = "Keðjur fyrir öll tæki";

export const vehicles: Vehicle[] = [
  {
    icon: "tractor",
    title: "Dráttarvélar",
    text: "Fyrir snjómokstur, landbúnað og akstur á ísilögðum vegum.",
  },
  {
    icon: "loader",
    title: "Vinnuvélar",
    text: "Hjólaskóflur, búkollur, hjólagröfur og jarðýtur.",
  },
  {
    icon: "truck",
    title: "Vörubílar og rútur",
    text: "Vörubílar, rútur og flutningabílar, einnig á tvöföld dekk.",
  },
  {
    icon: "atv",
    title: "Vagnar og minni tæki",
    text: "Vagnar, fjórhjól og annar búnaður.",
  },
];

export type ChainLine = {
  name: string;
  kicker: string;
  badge?: string;
  text: string;
  /** Chain (link) thickness options. */
  sizes: string[];
  fits: string[];
  points: string[];
};

export const chainLines = {
  heading: "Keðjutýpur",
  text: "Fjórar línur sem ná yfir flest tæki. Við sérpöntum keðjur eftir dekkjastærð og aðstæðum.",
  sizesLabel: "Þykkt",
  fitsLabel: "Hentar fyrir",
  cta: "Fá tilboð",
  items: [
    {
      name: "Easy On",
      kicker: "Léttkeðja",
      badge: "Mest selda keðjan",
      text: "Létt keðja sem gefur mikil akstursþægindi, jafnvel á meiri hraða. Ferkantaðir hlekkir með U-broddum gefa gott grip í snjómokstri og á ísilögðum vegum.",
      sizes: ["5,7", "7"],
      fits: ["Dráttarvélar", "Vörubílar", "Vinnuvélar", "Vagnar", "Fjórhjól"],
      points: ["Létt og fer vel með dekkin", "Sniðin að dekkjastærð", "Sett á án verkfæra"],
    },
    {
      name: "Combi-Grip",
      kicker: "Fljótandi gaddakeðja",
      text: "Snúin og sterkbyggð gaddakeðja sem flýtur jafnt yfir dekkið og gefur jafnan og mjúkan akstur. Öflugt og slitsterkt grip fyrir landbúnað, vinnuvélar, skógarvinnu og snjómokstur.",
      sizes: ["8", "9"],
      fits: ["Dráttarvélar", "Vinnuvélar", "Skógarvélar"],
      points: ["Fer vel með dekkin", "Einföld uppsetning án verkfæra", "Einnig fyrir hjólagröfur"],
    },
    {
      name: "Arctic Grip",
      kicker: "Gaddakeðja fyrir flutninga",
      text: "Fyrir vörubíla, rútur og flutningabíla. Snúin keðja úr gegnhertu stálblendi með öflugum göddum og sterkum, seighertum krók sem gefur gott grip á hálum vetrarvegum.",
      sizes: ["7", "8", "9"],
      fits: ["Vörubílar", "Rútur", "Flutningabílar"],
      points: ["Hálfþétt, ofurþétt eða stýriskeðja", "Nákvæm passa og fljótleg uppsetning", "Einnig fyrir tvöföld dekk"],
    },
    {
      name: "Fjórhjólakeðjur",
      kicker: "Fyrir minni tæki",
      text: "Ferkantaðar keðjur með U-broddum sem grípa vel, jafnvel á dekkjum með háu munstri. Sniðnar að dekkjastærð og settar á án verkfæra.",
      sizes: ["5,7"],
      fits: ["Liðléttingar", "Fjórhjól", "Lyftarar"],
      points: ["Grípa vel á háu munstri", "Sett á án verkfæra"],
    },
  ] satisfies ChainLine[],
};

export type Benefit = { icon: BenefitIconName; title: string; text: string };

export const whyLilleseth = {
  heading: "Af hverju Lilleseth?",
  items: [
    {
      icon: "fit",
      title: "Sniðnar að dekkinu",
      text: "Hver keðja er sniðin að dekkjastærðinni svo hún situr rétt frá fyrsta degi.",
    },
    {
      icon: "noTools",
      title: "Án verkfæra",
      text: "Einföld og fljótleg uppsetning, engin sérverkfæri nauðsynleg.",
    },
    {
      icon: "shield",
      title: "Fer vel með dekkin",
      text: "Fljótandi keðjur liggja jafnt á dekkinu og fara vel með það.",
    },
    {
      icon: "steel",
      title: "Hert stál",
      text: "Gegnhert stál og sterkir tengihlekkir sem endast vetur eftir vetur.",
    },
  ] satisfies Benefit[],
};

export type SpikeType = { icon: SpikeIconName; title: string; text: string };

export const spikeTypes = {
  heading: "Gerðir brodda",
  text: "Broddarnir ráða gripinu. Við hjálpum þér að velja rétta gerð fyrir þínar aðstæður.",
  items: [
    {
      icon: "square",
      title: "Flatkantur / fírkant",
      text: "Ferkantaðir hlekkir með skörpum köntum sem bíta í ís og þjappaðan snjó.",
    },
    {
      icon: "ubrodd",
      title: "U-broddar",
      text: "U-laga gripbroddar á ferkantaðri keðju gefa besta gripið og mesta slitþolið, líka á dekkjum með háu munstri.",
    },
    {
      icon: "spike",
      title: "Gaddar",
      text: "Sterkir gaddar á snúinni keðju fyrir erfiðustu aðstæður. 9 mm keðja er með 10 mm göddum og 11 mm keðja með 13 mm göddum.",
    },
  ] satisfies SpikeType[],
};

export const accessories = {
  heading: "Aukahlutir",
  text: "Við bjóðum upp á breitt úrval af varahlutum og verkfærum fyrir snjókeðjur.",
  items: ["Keðjuefni", "Viðgerðahlekkir", "Strekkjarar", "Verkfæri / keðjutangir"],
};

export const inquiry = {
  heading: "Finndu réttu keðjuna",
  text: "Sendu okkur dekkjastærðina og tegund tækis og við finnum réttu keðjuna fyrir þig.",
  tireCaption: "Dekkjastærðin stendur á hlið dekksins",
  tireExample: [
    { value: "540", label: "Breidd (mm)" },
    { value: "/65", label: "Hæðarhlutfall (%)" },
    { value: " R30", label: "Felga (tommur)" },
  ],
  tireNote: "Eldri dekk geta verið merkt á annan hátt, t.d. 12.4-36.",
  steps: [
    { title: "Finndu dekkjastærðina", text: "Hún stendur á hlið dekksins." },
    { title: "Sendu okkur fyrirspurn", text: "Tegund tækis og dekkjastærð nægja." },
    { title: "Við finnum réttu keðjuna", text: "Og sendum þér tilboð." },
  ],
  formHeading: "Fyrirspurn um snjókeðjur",
  submitLabel: "Senda fyrirspurn",
  defaultMessage: "Fyrirspurn um snjókeðjur\nTegund tækis: \nDekkjastærð: ",
};

// ---------------------------------------------------------------- Gigant

export const gigantBanner = {
  eyebrow: "Gigant · Noregi",
  heading: "Snjóplógar og hálkuvarnir",
  text: "Fjölplógar, sanddreifarar og ís- og veghefill frá Gigant, norsk hönnun fyrir verktaka, bændur og sveitarfélög.",
  // docs/scrape/vetrarbunadur.json block 26 (downloaded file is 2016x954).
  image: {
    src: "/images/vetrarbunadur/02-c1a583fc.webp",
    alt: "Dráttarvél með gulum Gigant fjölplóg í snjó",
    width: 2016,
    height: 954,
  } satisfies Img,
};

export const plows = {
  heading: "Snjóplógar",
  paragraphs: [
    "Gigant býður upp á tvær týpur af fjölplógum, HSV og LSV. Sammerkt með þeim báðum er útsláttarbúnaður á skerablaði er úr HARDOX ásamt því að allir boltar og öxlar eru úr ryðfríu stáli. LSV er fyrir minni vélar, nettur og þægilegur og hægt að fá með sama búnaði og stærri HSV plógarnir.",
    "HSV kemur með öllu því sem verktakinn óskar sér og hentar til dæmis vel á stóra traktóra og milli og meðalstórar hjólaskóflur.",
  ],
  shapes: "Hægt er að stilla plógana sem V, Y eða skekkt beint blað.",
  standardLabel: "Staðalbúnaður",
  accessoriesLabel: "Fáanlegur aukabúnaður",
};

export type Plow = {
  name: string;
  tag: string;
  text: string;
  image: Img;
  specs: { label: string; value: string }[];
  standard: string[];
  accessories: string[];
};

export const plowModels: Plow[] = [
  {
    name: "LSV fjölplógur",
    tag: "Lægri plógur · fyrir minni vélar",
    text: "Lágur plógur gefur góða yfirsýn og hentar vel í þéttbýli, á gangstéttum og minni svæðum.",
    // docs/scrape/vetrarbunadur.json block 30 (downloaded file is 2560x2560).
    image: { src: "/images/vetrarbunadur/03-3c6d3d08.jpg", alt: "LSV fjölplógur í snjó", width: 2560, height: 2560 },
    specs: [
      { label: "Hæð", value: "91,5 cm" },
      { label: "Breiddir", value: "200 · 250 · 280 cm" },
      { label: "Vinnuvinkill", value: "30°" },
      { label: "Festing", value: "3ja punkta og SMS" },
    ],
    standard: ["3ja punkta og SMS festing", "Veltibúnaður"],
    accessories: [
      "Volvo BM krókar",
      "L-30 krókar (minni Volvo BM krókar)",
      "2 x blikkljós",
      "2x LED ljós á hornum",
      "2x stoðfætur með hringlaga plöttum til að fylgja eftir landslagi",
      "Superswing - Hægt sé að stilla plóg sem skekkjanlegt beint blað",
      "Stjórnbox fyrir superswing",
      "2x akkúmulatorar sem gefa eftir ef lent er á föstu. (Ekki hægt með superwing)",
    ],
  },
  {
    name: "Snjóplógur HSV",
    tag: "Hærri plógur · fyrir stærri vélar",
    text: "HSV er gerður til þess að standast væntingar jafnvel kröfuhörðustu verktaka, á bílastæðum, iðnaðarsvæðum og vegum.",
    // docs/scrape/vetrarbunadur.json block 42 (downloaded file is 1200x1200).
    image: { src: "/images/vetrarbunadur/04-b60cdacb.webp", alt: "HSV snjóplógur á dráttarvél", width: 1200, height: 1200 },
    specs: [
      { label: "Hæð", value: "122 cm" },
      { label: "Breiddir", value: "280 · 320 cm" },
      { label: "Vinnuvinkill", value: "35°" },
      { label: "Festing", value: "3ja punkta" },
    ],
    standard: [
      "3ja punkta festing",
      "Veltibúnaður",
      "Superswing - Hægt sé að stilla plóg sem skekkjanlegt beint blað",
      "2x LED ljós á hornum",
    ],
    accessories: [
      "Stjórnbox fyrir superswing",
      "Volvo BM krókar",
      "L-30 krókar (minni Volvo BM krókar)",
      "2 x blikkljós",
      "2 x stoðfætur með hringlaga plöttum til að fylgja eftir landslagi",
    ],
  },
];

export type GigantProduct = {
  icon: GigantIconName;
  name: string;
  text: string;
  specs: { value: string; label: string }[];
  points: string[];
};

export const gigantMore = {
  heading: "Hálkuvarnir og veghefill",
  text: "Gigant býður einnig upp á búnað til að halda vegum og plönum öruggum allan veturinn.",
  items: [
    {
      icon: "spreader",
      name: "Sanddreifarar GSS",
      text: "Sjálfhlaðandi sanddreifarar fyrir dráttarvélar og hjólaskóflur. Dreifa sandi, salti eða möl. Sandblásnir og lakkaðir með tveggja þátta lakki sem þolir veturinn.",
      specs: [
        { value: "4", label: "stærðir" },
        { value: "2.500 l", label: "mest" },
        { value: "210 cm", label: "breidd" },
      ],
      points: ["Þrepalaus vökvastýring", "Yfirbreiðsla fylgir", "BM-festing fáanleg"],
    },
    {
      icon: "wagon",
      name: "Dreifivagnar GSS",
      text: "Dreifivagn aftan í dráttarvél fyrir stærri verk. Dreifir sandi, salti og möl allt að 32 mm.",
      specs: [
        { value: "7 m³", label: "GSS-70" },
        { value: "10 m³", label: "GSS-100" },
      ],
      points: ["Hannaður í samstarfi við notendur", "Fyrir sveitarfélög og verktaka"],
    },
    {
      icon: "scraper",
      name: "Ís- og veghefill GB",
      text: "Fjarlægir þjappaðan snjó og klaka og nýtist líka við viðhald malarvega allt árið.",
      specs: [
        { value: "2", label: "stærðir" },
        { value: "6 mm", label: "skerablað úr Hardox" },
      ],
      points: [
        "GB-280 og GB-305",
        "Hardox 500 í öllum slitflötum",
        "Þrískipt skerastál með fjaðrandi útslætti",
        "3ja punkta festing fyrir dráttarvélar og hjólaskóflur",
      ],
    },
  ] satisfies GigantProduct[],
};
