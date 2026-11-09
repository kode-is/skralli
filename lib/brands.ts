// Brand partners and the content of their /vorumerki/[slug] pages.
//
// id, name, href, site and the brand-strip `logo` come from the original
// scrape (docs/scrape/home.json blocks 8-13, docs/scrape/vorumerki.json);
// `cardImage` is the brand's logo for light backgrounds: the /vorumerki
// index artwork with its blank padding trimmed (public/images/vorumerki/
// logos). `body` is the live brand-page copy (docs/scrape/
// vorumerki__<id>.json), carried over with the same edits the service pages
// already got: the "widest range in Norway" claim is gone from Lilleseth
// (VALA #4), and typos in the PeBe, Hammerglass and Groeneveld-BEKA copy
// are fixed.
//
// Everything else is new in the SEO redesign of the brand pages:
//   - `seoTitle` / `seoDescription`: a unique <title> and meta description
//     per brand. The live site gives every route the same pair, so the
//     brand pages could not rank for "<brand> + <product>" searches.
//   - `tagline`, `heading`, `highlights`, `industries`, `faq`: copy drawn
//     from facts already published on the site's own service pages
//     (lib/vetrarbunadur.ts, components/smurkerfi, components/oryggisrudur,
//     components/siubunadur, components/fyrirokumannin, lib/sturtuvagnar.ts).
//   - `origin`: the manufacturer's home town, checked against each brand's
//     own website in November 2026.
//   - `productLines`: what Skralli sells from the brand, each linking to the
//     þjónusta page (and its sub-pages or sections) that sells it. These are
//     the internal links the brand pages exist for.

import type { Img } from "./types";

export type BrandBlock =
  | { type: "p"; text: string; bold?: true }
  | { type: "list"; items: string[] };

export type BrandLink = { text: string; href: string };

export type BrandProductLine = {
  title: string;
  text: string;
  /** The þjónusta page (or a section/sub-page of it) that sells this line. */
  href: string;
  /** Button label, e.g. "Skoða sturtuvagna". */
  cta: string;
  image: Img;
  /** Shown contained on a tinted panel (product cut-outs) instead of cropped to fill. */
  contain?: true;
  /** Deeper links: sub-pages or sections of the þjónusta page. */
  links?: BrandLink[];
};

export type BrandFaq = { question: string; answer: string };

export type Brand = {
  id: string;
  name: string;
  href: `/vorumerki/${string}`;
  /** Manufacturer's own website. */
  site: string;
  /** Brand-strip marquee logo, from public/images/home. */
  logo: string;
  /** Larger logo/wordmark shown on the /vorumerki index and the brand page. */
  cardImage: Img;
  /** <title>, 60 characters or fewer. */
  seoTitle: string;
  /** <meta description>, 160 characters or fewer. */
  seoDescription: string;
  /** Hero subtitle and the one-line summary on the /vorumerki index. */
  tagline: string;
  /** H2 that opens the page body. */
  heading: string;
  origin: { country: string; town?: string };
  /** Parent company, when the brand belongs to a larger group. */
  parent?: string;
  /** Plural noun phrase for the fact list, e.g. "Sturtuvagnar og vetrarbúnaður". */
  category: string;
  /** The þjónusta pages this brand's products are sold on (for the index cards). */
  services: BrandLink[];
  /** Brand-page body copy (originally the live site's). */
  body: BrandBlock[];
  highlights: { title: string; text: string }[];
  industries: string[];
  productLines: BrandProductLine[];
  faq: BrandFaq[];
  /** Hero photo. */
  image: Img;
  /** Fit the hero photo inside its frame instead of cropping it (cut-outs, tall product walls). */
  imageContain?: true;
};

export const brands: Brand[] = [
  {
    id: "gigant",
    name: "Gigant",
    href: "/vorumerki/gigant",
    site: "https://gigantprodukter.no/",
    logo: "/images/home/02-3e0cd936.svg",
    cardImage: { src: "/images/vorumerki/logos/gigant.png", alt: "Gigant merki", width: 800, height: 200 },
    seoTitle: "Gigant sturtuvagnar og snjóplógar | Skralli",
    seoDescription:
      "Gigant sturtuvagnar, fjölplógar og hálkuvarnir frá Noregi. Skralli flytur inn Gigant fyrir verktaka, bændur og sveitarfélög á Íslandi.",
    tagline: "Norskir sturtuvagnar og vetrarbúnaður fyrir verktaka og bændur",
    heading: "Gigant sturtuvagnar og vetrarbúnaður á Íslandi",
    origin: { country: "Noregur", town: "Spydeberg" },
    category: "Sturtuvagnar, snjóplógar og hálkuvarnir",
    services: [
      { text: "Sturtuvagnar", href: "/sturtuvagnar" },
      { text: "Vetrarbúnaður", href: "/vetrarbunadur" },
    ],
    image: {
      src: "/images/vorumerki__gigant/01-04305ffd.jpg",
      alt: "Dráttarvél með svartan Gigant GD4-16HS sturtuvagn í snjó",
      width: 2560,
      height: 1708,
    },
    body: [
      {
        type: "p",
        text: "Gigant sérhæfir sig í framleiðslu á hágæða sturtuvögnum og vetrarbúnaði fyrir verktaka og bændur. Þessi norska hönnun hefur í mörg ár verið meðal söluhæstu sturtuvagna í Noregi og ekki af ástæðulausu. Skralli hefur nú þegar afhent 30 vagna á síðastliðnum tveimur árum og hafa þeir reynst afar vel við íslenskar aðstæður.",
      },
      {
        type: "p",
        text: "Gigant býður einnig upp á fjölbreytta vetrarlínu sem mætir öllum kröfum sem íslenski veturinn felur í sér, eins og fjölplóga fyrir snjómokstur, skerastál, sanddreyfara og ís- og veghefla aftan í dráttarvélar.",
      },
    ],
    highlights: [
      { title: "Norsk hönnun", text: "Hannað og framleitt í Noregi fyrir norræna vetur og erfiðar aðstæður." },
      { title: "5 ára ábyrgð", text: "Sturtuvagnarnir frá Gigant koma með 5 ára ábyrgð." },
      {
        title: "HARDOX og ryðfrítt stál",
        text: "Útsláttarbúnaður á skerablaði plóganna er úr HARDOX og allir boltar og öxlar úr ryðfríu stáli.",
      },
      { title: "Reynsla á Íslandi", text: "Gigant vagnar Skralla hafa reynst afar vel við íslenskar aðstæður." },
    ],
    industries: ["Verktakar", "Bændur", "Sveitarfélög", "Vélaflutningar"],
    productLines: [
      {
        title: "Sturtuvagnar",
        text: "Sterkir og liprir sturtuvagnar fyrir dráttarvélar, hjólagröfur, fjórhjól og minigröfur, með 5 ára ábyrgð.",
        href: "/sturtuvagnar",
        cta: "Skoða sturtuvagna",
        image: {
          src: "/images/home/23-16722dae.jpeg",
          alt: "Dráttarvél að losa svartan Gigant sturtuvagn í snjó",
          width: 2560,
          height: 1707,
        },
        links: [
          { text: "Verktakavagnar", href: "/sturtuvagnar/verktakavagnar" },
          { text: "Landbúnaðarvagnar", href: "/sturtuvagnar/landbunadarvagnar" },
          { text: "Hjólagröfuvagnar", href: "/sturtuvagnar/hjolagrofuvagnar" },
          { text: "Vélaflutningavagnar", href: "/sturtuvagnar/velaflutningavagnar" },
          { text: "Fjórhjóla- og minigröfuvagnar", href: "/sturtuvagnar/fjorhjola-minigrofuvagnar" },
        ],
      },
      {
        title: "Snjóplógar",
        text: "LSV og HSV fjölplógar fyrir dráttarvélar og hjólaskóflur. Plógana má stilla sem V, Y eða skekkt beint blað.",
        href: "/vetrarbunadur#snjoplogar",
        cta: "Skoða snjóplóga",
        image: { src: "/images/vetrarbunadur/03-3c6d3d08.jpg", alt: "Gigant LSV fjölplógur í snjó", width: 2560, height: 2560 },
      },
      {
        title: "Hálkuvarnir og veghefill",
        text: "Sanddreifarar, dreifivagnar og ís- og veghefill sem halda vegum og plönum öruggum allan veturinn.",
        href: "/vetrarbunadur#halkuvarnir",
        cta: "Skoða hálkuvarnir",
        image: {
          src: "/images/vetrarbunadur/02-c1a583fc.webp",
          alt: "Dráttarvél með gulum Gigant fjölplóg í snjó",
          width: 2016,
          height: 954,
        },
      },
    ],
    faq: [
      {
        question: "Hvar eru Gigant sturtuvagnar framleiddir?",
        answer:
          "Gigant vagnarnir eru hannaðir og framleiddir í Noregi, þar sem þeir hafa í mörg ár verið meðal söluhæstu sturtuvagna. Skralli flytur þá inn til Íslands.",
      },
      {
        question: "Hvaða ábyrgð fylgir Gigant sturtuvögnum?",
        answer: "Sturtuvagnarnir frá Gigant koma með 5 ára ábyrgð.",
      },
      {
        question: "Henta Gigant vagnar aftan í hjólagröfur?",
        answer:
          "Já. Hjólagröfuvagnarnir frá Gigant eru útbúnir sérstöku bremsukerfi sem bremsar á lægri þrýstingi en venjulegur vagn, eða mest 110 börum, sem lágmarkar álag á drifbúnað gröfunnar.",
      },
      {
        question: "Hvaða snjóplóga býður Gigant upp á?",
        answer:
          "Tvær týpur af fjölplógum, LSV fyrir minni vélar og HSV fyrir stóra traktóra og meðalstórar hjólaskóflur. Báðir eru með útsláttarbúnað á skerablaði úr HARDOX.",
      },
    ],
  },
  {
    id: "hammerglass",
    name: "Hammerglass",
    href: "/vorumerki/hammerglass",
    site: "https://www.hammerglass.com/",
    logo: "/images/home/03-288ddb43.svg",
    cardImage: { src: "/images/vorumerki/logos/hammerglass.png", alt: "Hammerglass merki", width: 800, height: 97 },
    seoTitle: "Hammerglass öryggisrúður og óbrjótanlegt gler | Skralli",
    seoDescription:
      "Óbrjótanlegar og eldhamlandi Hammerglass öryggisrúður frá Svíþjóð, 300 sinnum sterkari en gler. Fyrir vinnuvélar, strætóskýli, hljóðmúra og byggingar.",
    tagline: "Óbrjótanlegar öryggisrúður fyrir vinnuvélar, mannvirki og byggingar",
    heading: "Hammerglass öryggisrúður á Íslandi",
    origin: { country: "Svíþjóð", town: "Förslöv" },
    category: "Öryggisrúður",
    services: [{ text: "Öryggisrúður", href: "/oryggisrudur" }],
    image: {
      src: "/images/home/24-a996c2c4.jpg",
      alt: "Starfsmaður Skralla að setja upp Hammerglass-rúðu",
      width: 2560,
      height: 1920,
    },
    body: [
      {
        type: "p",
        text: "Hammerglass er leiðandi sænskur framleiðandi í öryggislausnum með hugverkaverndaðri tækni og framleiðir óbrjótanlegar og eldhamlandi rúður sem þola erfiðustu aðstæður. Skralli býður upp á sérhannaðar öryggislausnir fyrir sveitarfélög og verktaka, þar sem sérstök áhersla er lögð á sprengjuheldar, grjótheldar og rispuþolnar rúður. Lausnirnar eru fullkomnar fyrir strætóskýli, hljóðmúra og aðra opinbera staði þar sem skemmdarverk geta valdið óþarfa kostnaði og viðhaldi.",
      },
      {
        type: "p",
        text: "Hammerglass rúður eru 300 sinnum sterkari en venjulegt gler og bjóða upp á lengri endingartíma, UV-vörn og lágmarks viðhald. Rúðurnar hafa sannað sig í stóriðnaði og á byggingarsvæðum þar sem mikil hætta er á grjóthruni eða þar sem sprengiefni eru notuð til þess að tryggja bæði mannslíf og búnað.",
      },
      {
        type: "p",
        text: "Skralli býður íslenskum sveitarfélögum, verktökum og fyrirtækjum úrval lausna frá Hammerglass: óbrjótanlegt öryggi í samgöngumannvirkjum, ökutækjum og byggingum. Með Hammerglass færðu öruggar og endingargóðar rúður sem henta við íslenskar aðstæður og veita hámarks vernd gegn utanaðkomandi hættum.",
      },
    ],
    highlights: [
      { title: "300 sinnum sterkara en gler", text: "Þolir grjóthrun, högg og sprengingar þar sem venjulegt gler brotnar." },
      { title: "Brennur ekki", text: "Eldhamlandi og sjálfslökkvandi efni." },
      { title: "UV- og rispuþolið", text: "Helst gegnsætt og viðhaldslítið árum saman." },
      { title: "Alveg gegnsætt", text: "Fullt útsýni fyrir ökumann og vegfarendur." },
    ],
    industries: ["Verktakar", "Sveitarfélög", "Stóriðja", "Verslanir og fasteignir"],
    productLines: [
      {
        title: "Rúður í vinnuvélar",
        text: "Hammerglass ver ökumanninn á vinnusvæðum þar sem hætta er á grjóthruni eða þungum hlutum í lausu lofti.",
        href: "/oryggisrudur",
        cta: "Skoða öryggisrúður",
        image: { src: "/images/oryggisrudur/04-26b92505.jpg", alt: "Hammerglass rúða í vinnuvél", width: 650, height: 420 },
      },
      {
        title: "Verslanir og almenningsstaðir",
        text: "Gluggarúður fyrir verslanir og almenningsstaði þar sem hætta er á innbrotum eða skemmdarverkum.",
        href: "/oryggisrudur",
        cta: "Skoða öryggisrúður",
        image: { src: "/images/oryggisrudur/05-d1d8270c.jpg", alt: "Hammerglass gluggarúður í verslun", width: 650, height: 420 },
      },
      {
        title: "Hljóðmúrar og strætóskýli",
        text: "Rúður í hljóðmúra, skjólveggi og strætóskýli sem lágmarka viðhald og hámarka öryggi.",
        href: "/oryggisrudur",
        cta: "Skoða öryggisrúður",
        image: { src: "/images/oryggisrudur/06-b051e3ca.webp", alt: "Hljóðmúr úr Hammerglass rúðum", width: 1400, height: 900 },
      },
    ],
    faq: [
      {
        question: "Hversu sterkar eru Hammerglass rúður?",
        answer:
          "Hammerglass rúður eru 300 sinnum sterkari en venjulegt gler. Þær hafa sannað sig í stóriðnaði og á byggingarsvæðum þar sem hætta er á grjóthruni eða þar sem sprengiefni eru notuð.",
      },
      {
        question: "Eru Hammerglass rúður eldþolnar?",
        answer: "Já. Efnið brennur ekki og er sjálfslökkvandi, auk þess að vera UV- og rispuþolið.",
      },
      {
        question: "Hvar eru Hammerglass rúður notaðar?",
        answer:
          "Í vinnuvélum, strætóskýlum, hljóðmúrum, skjólveggjum, verslunum og öðrum opinberum stöðum þar sem skemmdarverk eða utanaðkomandi hætta valda kostnaði og viðhaldi.",
      },
    ],
  },
  {
    id: "um-beka",
    name: "Groeneveld-BEKA",
    href: "/vorumerki/um-beka",
    site: "https://www.groeneveld-beka.com/en/",
    logo: "/images/home/04-6904d068.png",
    cardImage: { src: "/images/vorumerki/logos/um-beka.png", alt: "Groeneveld-BEKA merki", width: 744, height: 800 },
    seoTitle: "Groeneveld-BEKA sjálfvirk smurkerfi | Skralli",
    seoDescription:
      "Sjálfvirk smurkerfi frá Groeneveld-BEKA fyrir vinnuvélar, landbúnað og iðnað. Skralli sér um uppsetningu, þjónustu, viðgerðir og varahluti um land allt.",
    tagline: "Sjálfvirk smurkerfi fyrir vinnuvélar, landbúnað og iðnað",
    heading: "Groeneveld-BEKA sjálfvirk smurkerfi",
    origin: { country: "Holland og Þýskaland" },
    parent: "Timken",
    category: "Sjálfvirk smurkerfi",
    services: [{ text: "Smurkerfi", href: "/smurkerfi" }],
    image: {
      src: "/images/vorumerki__um-beka/01-497cd467.jpeg",
      alt: "Groeneveld-BEKA smurdæla á vinnuvél",
      width: 1920,
      height: 2560,
    },
    body: [
      {
        type: "p",
        text: "Skralli býður upp á alhliða lausnir fyrir sjálfvirk smurkerfi frá Groeneveld-BEKA, hönnuð fyrir vélar, iðnað og allt sem þarfnast reglubundinnar smurningar. Sjálfvirkt smurkerfi tryggir rétta smurningu með réttu magni í alla smurpunkta.",
      },
      {
        type: "p",
        text: "Skralli er eina fyrirtækið á Íslandi sem sérhæfir sig í þjónustu og viðgerðum á smurkerfum og býður upp á breitt úrval af varahlutum. Teymið býr yfir yfirgripsmikilli þekkingu og áralangri reynslu í smurkerfum. Við vinnum þétt með okkar framleiðendum sem tryggir hágæða lausnir og skjóta afgreiðslu. Við erum með vel útbúna þjónustubíla og tökum að okkur verkefni um land allt.",
      },
      { type: "p", text: "Við gerum föst tilboð í allar uppsetningar - hvar sem er á landinu." },
      {
        type: "p",
        bold: true,
        text: "Skralli mælir með MAX-2-LUBE koppafeiti í öll smurkerfi. Koppafeitin hefur einstaklega mikla viðloðun og seigju og er sérlega hentug fyrir kröfur íslensks iðnaðar.",
      },
    ],
    highlights: [
      { title: "Rétt magn í hvern punkt", text: "Kerfið smyr alla smurpunkta reglulega á meðan vélin er í gangi." },
      { title: "Minna viðhald", text: "Sjálfvirk smurning minnkar viðhald og lengir líftíma vélarinnar." },
      { title: "Þjónusta um land allt", text: "Vel útbúnir þjónustubílar Skralla taka að sér verkefni hvar sem er á landinu." },
      { title: "Varahlutir á lager", text: "Dælur, skammtarar, fittings og slöngur fyrir flestar gerðir smurkerfa." },
    ],
    industries: ["Vinnuvélar", "Landbúnaður", "Stóriðja", "Matvælaframleiðsla"],
    productLines: [
      {
        title: "Sjálfvirk smurkerfi",
        text: "Heildstæð lausn fyrir vinnuvélar, landbúnað, stóriðju og matvælaframleiðslu, sniðin að hverju tæki.",
        href: "/smurkerfi",
        cta: "Skoða smurkerfi",
        image: { src: "/images/smurkerfi/02-0914980d.png", alt: "Groeneveld-BEKA smurkerfi", width: 3000, height: 2000 },
        contain: true,
      },
      {
        title: "Dælur, skammtarar og íhlutir",
        text: "Beka og Groeneveld smurdælur, sérsniðnir skammtarar, smurblokkir, fittings og fylltar slöngur.",
        href: "/smurkerfi",
        cta: "Skoða íhluti",
        image: { src: "/images/smurkerfi/07-771eb8cc.png", alt: "Groeneveld skammtarar", width: 1536, height: 1024 },
        contain: true,
      },
      {
        title: "MAX-2-LUBE koppafeiti",
        text: "NLG2 koppafeiti með einstaklega mikla viðloðun sem nota má í öll smurkerfi, óháð framleiðanda.",
        href: "/smurkerfi#spurt-og-svarad",
        cta: "Spurt og svarað",
        image: { src: "/images/smurkerfi/04-e1cf3aba.jpeg", alt: "MAX-2-LUBE koppafeiti", width: 1920, height: 2560 },
      },
      {
        title: "Uppsetning, þjónusta og viðgerðir",
        text: "Uppsetning og viðgerðir á smurkerfum frá þjónustubílum Skralla, hvar sem er á landinu.",
        href: "/smurkerfi",
        cta: "Skoða þjónustuna",
        image: {
          src: "/images/smurkerfi/13-ff6a4cca.jpg",
          alt: "Beltagrafa og þjónustubíll Skralla á athafnasvæði",
          width: 2560,
          height: 1920,
        },
      },
    ],
    faq: [
      {
        question: "Hvað gerir sjálfvirkt smurkerfi?",
        answer:
          "Það viðheldur réttu magni af feiti í öllum smurpunktum á meðan vélin er í gangi, svo aldrei gleymist að smyrja. Það minnkar viðhald og lengir líftíma vélarinnar.",
      },
      {
        question: "Þjónustar Skralli smurkerfi frá öðrum framleiðendum?",
        answer:
          "Já. Skralli veitir þjónustu og ráðgjöf óháð framleiðanda og á varahluti fyrir flestar gerðir smurkerfa, en sérhæfir sig í Groeneveld-BEKA.",
      },
      {
        question: "Hvaða feiti á að nota í Groeneveld-BEKA smurkerfi?",
        answer:
          "Skralli mælir með MAX-2-LUBE (NLG2) koppafeiti. Hún hefur mikla viðloðun og seigju og hentar í öll smurkerfi, hvort sem það er Beka, Groeneveld eða Lincoln.",
      },
    ],
  },
  {
    id: "lilleseth-kjetting",
    name: "Lilleseth",
    href: "/vorumerki/lilleseth-kjetting",
    site: "https://www.lilleseth.no/",
    logo: "/images/home/05-17eb54cf.png",
    cardImage: { src: "/images/vorumerki/logos/lilleseth-kjetting.png", alt: "Lilleseth Kjetting merki", width: 800, height: 281 },
    seoTitle: "Lilleseth snjókeðjur og hífibúnaður | Skralli",
    seoDescription:
      "Lilleseth snjókeðjur fyrir dráttarvélar, vinnuvélar og vörubíla ásamt vottuðum hífi- og festibúnaði. Norskt fjölskyldufyrirtæki síðan 1947.",
    tagline: "Snjókeðjur og vottaður hífi- og festibúnaður frá Noregi síðan 1947",
    heading: "Lilleseth snjókeðjur og hífibúnaður á Íslandi",
    origin: { country: "Noregur", town: "Skarnes" },
    category: "Snjókeðjur, hífi- og festibúnaður",
    services: [
      { text: "Vetrarbúnaður", href: "/vetrarbunadur" },
      { text: "Hífi- & festibúnaður", href: "/hifi-festibunadur" },
    ],
    image: {
      src: "/images/vorumerki__lilleseth-kjetting/01-e84535d7.png",
      alt: "Sýningarveggur Lilleseth Kjetting með hífikeðjum, stroffum og festibúnaði",
      width: 757,
      height: 934,
    },
    imageContain: true,
    body: [
      {
        type: "p",
        text: "Lilleseth er traust og rótgróið norskt fjölskyldufyrirtæki með yfir 75 ára reynslu í snjókeðjum ásamt því að bjóða upp á vottaðan hífi- og festibúnað fyrir iðnað og flutninga.",
      },
      {
        type: "p",
        text: "Snjókeðjurnar frá Lilleseth eru fáanlegar fyrir landbúnað, vinnuvélar og bíla (s.s. vörubíla, strætisvagna, rútur og flutningabíla). Með fjölbreyttum valkostum af keðjum með mörgum útfærslum brodda tryggir Lilleseth hámarks grip, endingu og öryggi við krefjandi vetraraðstæður.",
      },
      {
        type: "p",
        text: "Fyrir þá sem þurfa á hífibúnaði og festibúnaði að halda, býður Lilleseth upp á vottaðar lausnir sem henta sérstaklega vel til notkunar á byggingarsvæðum eða í kringum fólk, þar sem öryggi er lykilatriði.",
      },
      {
        type: "p",
        text: "Vörurnar hafa verið prófaðar við ströngustu aðstæður og uppfylla öll skilyrði um öryggi og endingu. Snjókeðjurnar eru einstaklega endingargóðar og mæta öllum þörfum sem íslenskir notendur kunna að hafa, hvort sem er við snjómokstur, landflutninga, landbúnað eða vinnuvélar.",
      },
      {
        type: "p",
        bold: true,
        text: "Með vottaðan hífi- og festibúnað og norska hönnun sem stenst tímans tönn er Lilleseth merki sem þú getur treyst á.",
      },
    ],
    highlights: [
      { title: "Síðan 1947", text: "Norskt fjölskyldufyrirtæki með yfir 75 ára reynslu af snjókeðjum." },
      { title: "Sniðnar að dekkinu", text: "Hver keðja er sniðin að dekkjastærðinni og fer vel með dekkin." },
      { title: "Án verkfæra", text: "Einföld og fljótleg uppsetning, engin sérverkfæri nauðsynleg." },
      { title: "Vottaður hífibúnaður", text: "Hífikeðjur í Grade 80 og Grade 100 sem uppfylla öll skilyrði um öryggi." },
    ],
    industries: ["Verktakar", "Bændur", "Flutningar", "Snjómokstur", "Iðnaður"],
    productLines: [
      {
        title: "Snjókeðjur",
        text: "Easy On, Combi-Grip, Arctic Grip og fjórhjólakeðjur fyrir dráttarvélar, vinnuvélar, vörubíla og rútur.",
        href: "/vetrarbunadur#snjokedjur",
        cta: "Skoða snjókeðjur",
        image: {
          src: "/images/vetrarbunadur/broddar-gaddar.webp",
          alt: "Nærmynd af Lilleseth snjókeðju með göddum",
          width: 600,
          height: 400,
        },
        links: [
          { text: "Keðjutýpur", href: "/vetrarbunadur#kedjulinur" },
          { text: "Gerðir brodda", href: "/vetrarbunadur#broddar" },
          { text: "Finndu réttu keðjuna", href: "/vetrarbunadur#fyrirspurn" },
        ],
      },
      {
        title: "Hífibúnaður",
        text: "Vottaðar hífikeðjur í Grade 80 og Grade 100, stroffur og aukabúnaður til hífinga.",
        href: "/hifi-festibunadur",
        cta: "Skoða hífibúnað",
        image: {
          src: "/images/hifi-festibunadur/02-bf8db647.webp",
          alt: "Lilleseth hífibúnaður",
          width: 895,
          height: 1024,
        },
        links: [
          { text: "Hífikeðjur", href: "/hifi-festibunadur/hifikedjur" },
          { text: "Stroffur", href: "/hifi-festibunadur/stroffur" },
          { text: "Aukabúnaður til hífinga", href: "/hifi-festibunadur/aukabunadur" },
        ],
      },
      {
        title: "Festibúnaður",
        text: "Bindikeðjur, strekkjarar og borðastrekkjarar til að festa farm á öruggan hátt.",
        href: "/hifi-festibunadur/bindikedjur-strekkjarar",
        cta: "Skoða festibúnað",
        image: {
          src: "/images/hifi-festibunadur/04-dd0c6f76.png",
          alt: "Lilleseth bindikeðja og strekkjari",
          width: 800,
          height: 782,
        },
        contain: true,
        links: [
          { text: "Bindikeðjur og strekkjarar", href: "/hifi-festibunadur/bindikedjur-strekkjarar" },
          { text: "Borðastrekkjarar", href: "/hifi-festibunadur/bordastrekkjarar" },
        ],
      },
    ],
    faq: [
      {
        question: "Hvaða snjókeðjur býður Lilleseth upp á?",
        answer:
          "Fjórar línur: Easy On léttkeðjur, Combi-Grip fljótandi gaddakeðjur, Arctic Grip gaddakeðjur fyrir vörubíla og rútur, og keðjur fyrir fjórhjól og minni tæki. Keðjurnar eru sérpantaðar eftir dekkjastærð.",
      },
      {
        question: "Hvernig finn ég rétta snjókeðju fyrir mitt tæki?",
        answer:
          "Sendu okkur tegund tækis og dekkjastærð og við finnum keðju sem passar. Lilleseth keðjur eru sniðnar að dekkjastærðinni og settar á án verkfæra.",
      },
      {
        question: "Er hífibúnaðurinn frá Lilleseth vottaður?",
        answer:
          "Já. Lilleseth býður vottaðan hífi- og festibúnað, meðal annars hífikeðjur í Grade 80 og Grade 100, sem hentar vel á byggingarsvæðum og í kringum fólk.",
      },
    ],
  },
  {
    id: "pebe",
    name: "PeBe",
    href: "/vorumerki/pebe",
    site: "https://www.pebe.se/en/home",
    logo: "/images/home/06-79588ec3.svg",
    cardImage: { src: "/images/vorumerki/logos/pebe.png", alt: "PeBe merki", width: 419, height: 208 },
    seoTitle: "PeBe sætisáklæði og gólfmottur | Skralli",
    seoDescription:
      "Sérsaumuð PeBe sætisáklæði og gólfmottur frá Svíþjóð fyrir vinnuvélar, vörubíla og atvinnubíla. Skralli finnur rétta sniðið fyrir þitt tæki.",
    tagline: "Sérsaumuð sætisáklæði og gólfmottur fyrir vinnuvélar og vörubíla",
    heading: "PeBe sætisáklæði og gólfmottur á Íslandi",
    origin: { country: "Svíþjóð", town: "Veddige" },
    category: "Sætisáklæði, gólfmottur og skóbakkar",
    services: [{ text: "Fyrir ökumanninn", href: "/fyrirokumannin" }],
    image: {
      src: "/images/vorumerki__pebe/01-1afdf64e.jpeg",
      alt: "Sérsaumað PeBe sætisáklæði með sænskum merkimiða",
      width: 2560,
      height: 1355,
    },
    body: [
      {
        type: "p",
        text: "PeBe er sænskur framleiðandi sem sérhæfir sig í hágæða sætisáklæðum og gólfmottum fyrir vinnuvélar, vörubíla og atvinnubíla. Lausnirnar eru sérsaumaðar fyrir hvern framleiðanda, sem tryggir fullkomið snið aðlagað að hverju ökutæki. Vörurnar eru úr slitsterku efni sem þolir mikla notkun og veitir bæði þægindi og stílhreint útlit.",
      },
      {
        type: "p",
        text: "Skralli býður upp á fjölbreytt úrval af sætisáklæðum og gólfmottum fyrir þá sem vilja endingargóðar og stílhreinar lausnir fyrir sínar vinnuvélar, vörubíla eða atvinnubíla. Hafðu samband og við finnum réttu lausnina fyrir þig!",
      },
      {
        type: "p",
        bold: true,
        text: "Skralli hefur einnig þróað skóbakka í samstarfi við PeBe. Bakkarnir eru úr þykku gúmmíi með kanti og eru tilvaldir fyrir ökumenn sem vilja halda skrifstofunni hreinni.",
      },
    ],
    highlights: [
      { title: "Sérsaumað", text: "Sniðið að hverri tegund og gerð ökutækis fyrir fullkomna passa." },
      { title: "Slitsterkt efni", text: "Þolir mikla notkun og verndar sætin árum saman." },
      { title: "Helstu vörubílategundir", text: "Volvo, Scania, Mercedes-Benz, MAN, Renault, DAF og Iveco." },
      { title: "Þróað með Skralla", text: "Skóbakkar úr þykku gúmmíi, hannaðir í samstarfi við PeBe." },
    ],
    industries: ["Vinnuvélar", "Vörubílar", "Atvinnubílar", "Rútur"],
    productLines: [
      {
        title: "Sætisáklæði",
        text: "Sérsaumuð áklæði fyrir sæti í vinnuvélum, vörubílum og atvinnubílum, í mörgum litasamsetningum.",
        href: "/fyrirokumannin#saetisaklaedi",
        cta: "Skoða sætisáklæði",
        image: {
          src: "/images/fyrirokumannin/02-a5d3e9bb.jpeg",
          alt: "PeBe sætisáklæði í vinnuvél",
          width: 1920,
          height: 2560,
        },
      },
      {
        title: "Gólfmottur",
        text: "Slitsterkar gólfmottur sniðnar að gólfinu í hverju tæki, svo þær renna ekki til líkt og alhliða mottur.",
        href: "/fyrirokumannin#golfmottur",
        cta: "Skoða gólfmottur",
        image: {
          src: "/images/fyrirokumannin/32-b915af96.png",
          alt: "PeBe gólfmotta í ökumannshúsi",
          width: 2560,
          height: 1707,
        },
      },
      {
        title: "Skóbakkar",
        text: "Skóbakkar úr þykku gúmmíi með kanti, þróaðir af Skralla í samstarfi við PeBe.",
        href: "/fyrirokumannin#skobakkar",
        cta: "Skoða skóbakka",
        image: {
          src: "/images/fyrirokumannin/55-d2881ae9.jpg",
          alt: "Skóbakki úr gúmmíi frá Skralla og PeBe",
          width: 2560,
          height: 2349,
        },
      },
    ],
    faq: [
      {
        question: "Passa PeBe sætisáklæði í mitt tæki?",
        answer:
          "PeBe saumar áklæðin fyrir hverja tegund og gerð, meðal annars vörubíla frá Volvo, Scania, Mercedes-Benz, MAN, Renault, DAF og Iveco, auk vinnuvéla og atvinnubíla. Sendu okkur tegund og árgerð og við finnum rétta sniðið.",
      },
      {
        question: "Úr hverju eru skóbakkarnir?",
        answer:
          "Skóbakkarnir eru úr þykku gúmmíi með kanti og halda bleytu og óhreinindum á einum stað. Skralli þróaði þá í samstarfi við PeBe.",
      },
    ],
  },
  {
    id: "bmair",
    name: "BMair",
    href: "/vorumerki/bmair",
    site: "https://www.bmair.com/",
    logo: "/images/home/07-882f4f17.svg",
    cardImage: { src: "/images/vorumerki/logos/bmair.png", alt: "BMair merki", width: 469, height: 125 },
    seoTitle: "BMair lofthreinsitæki fyrir vinnuvélar | Skralli",
    seoDescription:
      "BMair lofthreinsi- og síunarkerfi verja stjórnendur vinnuvéla gegn ryki og gasi. Protector, Protector Plus X, MAO-3C, F20 og F33 frá Skralla.",
    tagline: "Lofthreinsitæki sem verja stjórnendur vinnuvéla gegn ryki og gasi",
    heading: "BMair lofthreinsitæki og síubúnaður",
    origin: { country: "Holland", town: "Raamsdonksveer" },
    category: "Lofthreinsi- og síunarkerfi",
    services: [{ text: "Síubúnaður", href: "/siubunadur" }],
    image: {
      src: "/images/vorumerki__bmair/01-13900342.jpg",
      alt: "BMair MAO-3 lofthreinsitæki á vinnuvél ásamt stjórnskjá",
      width: 1024,
      height: 768,
    },
    body: [
      {
        type: "p",
        text: "BMair er markaðsleiðandi framleiðandi af lofthreinsitækjum fyrir stjórnendur vinnuvéla í Evrópu.",
        bold: true,
      },
      {
        type: "p",
        text: "Skralli býður sínum viðskiptavinum nýjustu tækni í þessum geira fyrir bætt vinnuumhverfi af öllu tagi, svo sem:",
      },
      {
        type: "list",
        items: [
          "Endurvinnslu",
          "Jarðgerð",
          "Niðurrif bygginga",
          "Flutning og geymslu efna",
          "Námuvinnslu",
        ],
      },
    ],
    highlights: [
      { title: "HEPA síun", text: "Sérsniðnar HEPA síur með mikla síunargetu, jafnvel í nettum einingum." },
      { title: "Ryk og gas", text: "Protector Plus X síar bæði ryk og gas fyrir hámarks vernd." },
      { title: "Stálhús", text: "F33 línan er í stálhúsi hönnuðu fyrir mest krefjandi aðstæður." },
      { title: "Á þak eða bretti", text: "Einingar til áfestingar á þak, bretti eða hlífar vinnuvéla." },
    ],
    industries: ["Endurvinnsla", "Jarðgerð", "Niðurrif bygginga", "Flutningar og geymsla", "Námuvinnsla"],
    productLines: [
      {
        title: "BMair Protector",
        text: "Grunnpakkinn í kerfi BMair: sjálfstæð eining með framúrskarandi ryksíun fyrir mjög rykug vinnuumhverfi.",
        href: "/siubunadur",
        cta: "Skoða Protector",
        image: { src: "/images/siubunadur/03-d4358019.png", alt: "BMair Protector", width: 940, height: 1009 },
        contain: true,
      },
      {
        title: "BMair Protector Plus X",
        text: "Fullbúið loftsíukerfi fyrir hámarks ryk- og gassíun, til áfestingar á þak vinnuvélar.",
        href: "/siubunadur",
        cta: "Skoða Protector Plus X",
        image: { src: "/images/siubunadur/04-1dfe8cc8.png", alt: "BMair Protector Plus X", width: 940, height: 1009 },
        contain: true,
      },
      {
        title: "MAO-3C, F20 og F33",
        text: "Nettar og öflugar einingar með HEPA síu til áfestingar á bretti, hlífar eða þak vinnuvéla.",
        href: "/siubunadur",
        cta: "Skoða línuna",
        image: { src: "/images/siubunadur/07-7c6d1b13.png", alt: "BMair F33 lofthreinsitæki", width: 940, height: 1009 },
        contain: true,
      },
    ],
    faq: [
      {
        question: "Fyrir hvaða vinnuumhverfi hentar BMair?",
        answer:
          "Fyrir allt vinnuumhverfi þar sem ryk eða gas hefur áhrif á loftgæði í ökumannshúsi, til dæmis endurvinnslu, jarðgerð, niðurrif bygginga, flutning og geymslu efna og námuvinnslu.",
      },
      {
        question: "Hver er munurinn á BMair Protector og Protector Plus X?",
        answer:
          "Protector er grunnpakkinn og veitir ryksíun. Protector Plus X er fullbúið kerfi sem síar bæði ryk og gas og er fest á þak vinnuvélarinnar.",
      },
      {
        question: "Hvar er BMair búnaðurinn festur á vinnuvélina?",
        answer:
          "Það fer eftir einingunni: Protector Plus X og F33-R fara á þak, en MAO-3C, F20 og F33 eru festar á bretti eða hlífar vinnuvélarinnar.",
      },
    ],
  },
];

/** Sitewide order on the /vorumerki index, the footer and the brand pages' "other brands" row. */
export const BRAND_INDEX_ORDER = ["um-beka", "lilleseth-kjetting", "gigant", "hammerglass", "bmair", "pebe"] as const;

export function orderedBrands(): Brand[] {
  return BRAND_INDEX_ORDER.map((id) => brands.find((brand) => brand.id === id)).filter(
    (brand): brand is Brand => Boolean(brand),
  );
}
