// Search titles and descriptions for the service, wagon and hífibúnaður
// pages. Kept apart from the page content so editing a search snippet never
// changes visible text. Every claim here comes from the page it describes.
// Keep titles to 60 characters and descriptions to 160, so Google shows them
// whole; tests/page-meta.test.ts enforces that and that each one is unique.
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

type PageMeta = { title: string; description: string };

export const PAGE_META: Record<string, PageMeta> = {
  "/um-okkur": {
    title: "Um Skralla | Innflutningur og ráðgjöf",
    description: "Skralli í Hafnarfirði er sölu- og þjónustuaðili fyrir vinnuvélar, landbúnað og stóriðju. Kynntu þér teymið okkar, markmið og staðsetningu.",
  },
  "/thjonusta": {
    title: "Þjónusta og vöruframboð | Skralli",
    description: "Smurkerfi, sturtuvagnar, vetrarbúnaður, hífi- og festibúnaður, öryggisrúður, síubúnaður og búnaður fyrir ökumanninn. Skoðaðu þjónustur Skralla.",
  },
  "/hafa-samband": {
    title: "Hafa samband | Skralli í Hafnarfirði",
    description: "Sendu Skralla fyrirspurn, hringdu í 546 3500 eða sendu póst á skralli@skralli.is. Þú finnur okkur að Móhellu 3F, 221 Hafnarfirði.",
  },
  "/smurkerfi": {
    title: "Sjálfvirk smurkerfi: BEKA-MAX og Groeneveld | Skralli",
    description: "BEKA-MAX og Groeneveld sjálfvirk smurkerfi fyrir vinnuvélar, landbúnað, stóriðju og matvælaframleiðslu. Rétt magn af feiti í alla smurpunkta.",
  },
  "/sturtuvagnar": {
    title: "Sturtuvagnar frá Gigant | Skralli",
    description: "Slitsterkir sturtuvagnar frá Gigant, framleiddir í Noregi með 5 ára ábyrgð. Hjólagröfu-, verktaka-, landbúnaðar- og vélaflutningavagnar.",
  },
  "/oryggisrudur": {
    title: "Öryggisrúður frá Hammerglass | Skralli",
    description: "Óbrjótanlegar og eldhamlandi Hammerglass öryggisrúður fyrir ökutæki, samgöngumannvirki og byggingar, sem henta vel við íslenskar aðstæður.",
  },
  "/vetrarbunadur": {
    title: "Vetrarbúnaður: snjókeðjur og snjóplógar | Skralli",
    description: "Snjókeðjur frá Lilleseth, snjóplógar og annar vetrarbúnaður í miklu úrvali fyrir ökumenn sem fara um ótroðnar slóðir eða ryðja veginn.",
  },
  "/fyrirokumannin": {
    title: "Sætisáklæði, gólfmottur og ljósabúnaður | Skralli",
    description: "Sætisáklæði, gólfmottur, ljósabúnaður og fleira fyrir ökumanninn, sérsniðið að þínu tæki. Áklæðin eru sérsniðin fyrir hvern framleiðanda.",
  },
  "/hifi-festibunadur": {
    title: "Hífi- og festibúnaður | Skralli",
    description: "Vottaður hífi- og festibúnaður: keðjur í Grade 80 og Grade 100 frá Lilleseth, stroffur, borðastrekkjarar og aukabúnaður til hífinga.",
  },
  "/siubunadur": {
    title: "Síubúnaður og lofthreinsitæki frá BMair | Skralli",
    description: "Lofthreinsitæki frá BMair fjarlægja ryk, frjókorn, myglugró, bakteríur og önnur mengandi efni úr lofti. Margar tegundir filtera í boði.",
  },

  // Sturtuvagnar: categories
  "/sturtuvagnar/fjorhjola-minigrofuvagnar": {
    title: "Fjórhjóla- og minigröfuvagnar frá Gigant | Skralli",
    description: "Sterkir sturtuvagnar með veltihásingu fyrir fjórhjól og minigröfur. Hardox® kassi, rafmagnssturta og ljósapakki fást sem aukabúnaður.",
  },
  "/sturtuvagnar/verktakavagnar": {
    title: "Verktakavagnar frá Gigant | Skralli",
    description: "Sturtuvagnar frá Gigant fyrir verktaka með burðargetu frá 13 upp í 30 tonn. Stöðugir og fjölhæfir vagnar fyrir krefjandi verkefni.",
  },
  "/sturtuvagnar/landbunadarvagnar": {
    title: "Landbúnaðarvagnar frá Gigant | Skralli",
    description: "Landbúnaðarvagnar frá Gigant eru sturtuvagnar sem byggja á einfaldleika og skilvirkni. Gerðir frá 8 tonnum fyrir helstu verkefni í sveitinni.",
  },
  "/sturtuvagnar/hjolagrofuvagnar": {
    title: "Hjólagröfuvagnar frá Gigant | Skralli",
    description: "Hjólagröfuvagnar frá Gigant með sérhannað bremsukerfi fyrir lægri bremsuþrýsting hjólagrafa. Fer betur með vélina og tryggir örugga notkun.",
  },
  "/sturtuvagnar/velaflutningavagnar": {
    title: "Vélaflutningavagnar frá Gigant | Skralli",
    description: "Vélavagnar frá Gigant með styrktri grind, extra sterkri fjöðrun og fjölda festipunkta. ML- og GLL-línur fyrir flutning á vinnuvélum.",
  },

  // Sturtuvagnar: hjólagröfuvagnar
  "/sturtuvagnar/hjolagrofuvagn-gd2-6x": {
    title: "Hjólagröfuvagn GD2-6X frá Gigant | Skralli",
    description: "Gigant GD2-6X hjólagröfuvagn fyrir 8-12 tonna hjólagröfur. Tilvalinn í minni framkvæmdir þar sem lipurleiki og skilvirkni skipta mestu.",
  },
  "/sturtuvagnar/hjolagrofuvagn-gd3-6x": {
    title: "Hjólagröfuvagn GD3-6X frá Gigant | Skralli",
    description: "Gigant GD3-6X hjólagröfuvagn fyrir gröfur frá 10 tonnum. Kassi úr Hardox 500 TUF, hálfmáni að framan, innfelldar hliðar og vökvavör að aftan.",
  },
  "/sturtuvagnar/hjolagrofuvagn-gd3-8x": {
    title: "Hjólagröfuvagn GD3-8X frá Gigant | Skralli",
    description: "Gigant GD3-8X er vinsælasta útfærsla hjólagröfuvagna hjá Skralla, sérhönnuð fyrir 14-20 tonna hjólagröfur og þekkt fyrir gæði og áreiðanleika.",
  },
  "/sturtuvagnar/hjolagrofuvagn-gd3-10x": {
    title: "Hjólagröfuvagn GD3-10X frá Gigant | Skralli",
    description: "GD3-10X er stærsti hjólagröfuvagninn frá Gigant. Smíðaður fyrir 14-20 tonna hjólagröfur í 2-öxla útgáfu og afkastamikill við krefjandi aðstæður.",
  },

  // Sturtuvagnar: fjórhjóla- og minigröfuvagnar
  "/sturtuvagnar/gw-100": {
    title: "GW-100 fjórhjóla- og minigröfuvagn | Skralli",
    description: "Gigant GW-100 er nettur og sterkbyggður sturtuvagn fyrir fjórhjól og minigröfur. Stærð 150x100x35 sm og auðvelt að draga hvert sem er.",
  },
  "/sturtuvagnar/gw-120": {
    title: "GW-120 fjórhjóla- og minigröfuvagn | Skralli",
    description: "Gigant GW-120 er stóra útgáfan af fjórhjóla- og minigröfuvagninum. Sterkbyggður og lipur sturtuvagn, 180x122x35 sm.",
  },
  "/sturtuvagnar/gw-400": {
    title: "GW-400 timburvagn frá Gigant | Skralli",
    description: "Gigant GW-400 er sterkur og praktískur vagn fyrir flutning á timbri á ógreiðfærum svæðum. Hentar fyrir trjádrumba allt að 3 metra langa.",
  },

  // Sturtuvagnar: vélavagnar
  "/sturtuvagnar/velavagn-ml80": {
    title: "Vélavagn ML80 frá Gigant | Skralli",
    description: "ML80 er minnsti vélavagninn frá Gigant. Lipur, nettur og stöðugur vagn með festipunktum og styrktri grind, fullkominn í minni verkefni.",
  },
  "/sturtuvagnar/velavagn-ml160": {
    title: "Vélavagn ML160 frá Gigant | Skralli",
    description: "Gigant ML160 er einfaldur og skilvirkur vélavagn með 16 tonna burðargetu og nóg af festipunktum. Hentar vel í flest verk.",
  },
  "/sturtuvagnar/velavagn-ml210": {
    title: "Vélavagn ML210 frá Gigant | Skralli",
    description: "Gigant ML210 er stærsti vélavagninn í ML-seríunni. Stór og hagkvæmur vagn sem getur borið allt að 23 tonna þunga vél.",
  },
  "/sturtuvagnar/velavagn-gll4-18": {
    title: "Vélavagn GLL4-18 frá Gigant | Skralli",
    description: "Gigant GLL4-18 er tveggja öxla vélavagn með 20,5 tonna skráða burðargetu, styrkta grind og extra sterka fjöðrun.",
  },
  "/sturtuvagnar/velavagn-gll4-18l": {
    title: "Vélavagn GLL4-18L frá Gigant | Skralli",
    description: "Gigant GLL4-18L er lengri útgáfa af GLL4-18 með 40 mm eikarbotni og 20 tonna burðargetu, fyrir þá sem þurfa aðeins meira pláss.",
  },
  "/sturtuvagnar/velavagn-gll4-24": {
    title: "Vélavagn GLL4-24 frá Gigant | Skralli",
    description: "Gigant GLL4-24 er sterkbyggður og afkastamikill vélavagn. Ramminn er smíðaður fyrir mun meira en það sem vagninn er skráður fyrir.",
  },
  "/sturtuvagnar/velavagn-gll4-27": {
    title: "Vélavagn GLL4-27 frá Gigant | Skralli",
    description: "Gigant GLL4-27 er þriggja öxla, 8 metra langur vélavagn með 40 mm eikarbotni, fjölda festipunkta og yfir 28 tonna burðargetu.",
  },

  // Sturtuvagnar: verktakavagnar
  "/sturtuvagnar/verktakavagn-gd3-13": {
    title: "Verktakavagn GD3-13 frá Gigant | Skralli",
    description: "GD3-13 er minnsti verktakavagninn frá Gigant, með 13 tonna burðargetu, sterkan staðalbúnað og úrval af aukabúnaði.",
  },
  "/sturtuvagnar/verktakavagn-gd4-15": {
    title: "Verktakavagn GD4-15 frá Gigant | Skralli",
    description: "Gigant GD4-15 er mest seldi sturtuvagninn í verktakalínunni, með háu burðarþoli og lágri hæð. Fáðu ráðgjöf hjá Skralla.",
  },
  "/sturtuvagnar/verktakavagn-gd4-17": {
    title: "Verktakavagn GD4-17 frá Gigant | Skralli",
    description: "Gigant GD4-17 er afkastamikill sturtuvagn sem sinnir bæði fjölbreyttum landbúnaðarverkum og þungum flutningum. Fáðu ráðgjöf hjá Skralla.",
  },
  "/sturtuvagnar/verktakavagn-gd4-17sb": {
    title: "Verktakavagn GD4-17SB frá Gigant | Skralli",
    description: "Gigant GD4-17SB sameinar sturtuvagn og vélavagn. Hleðsluplanið færist 1,5 metra aftur svo hægt er að keyra upp á vagninn.",
  },
  "/sturtuvagnar/verktakavagn-gd4-20": {
    title: "Verktakavagn GD4-20 frá Gigant | Skralli",
    description: "Gigant GD4-20 er risastór tveggja öxla vagn, skráður með 19 tonna burðargetu, sem getur sturtað allt að 50 tonnum.",
  },
  "/sturtuvagnar/verktakavagn-gd4-30hs": {
    title: "Verktakavagn GD4-30HS frá Gigant | Skralli",
    description: "GD4-30HS er stærsti sturtuvagninn sem Gigant framleiðir. 30 tonna vagn hannaður til að þola erfiðustu verkefnin.",
  },

  // Sturtuvagnar: landbúnaðarvagnar
  "/sturtuvagnar/landbunadarvagn-gd85": {
    title: "Landbúnaðarvagn GD85 frá Gigant | Skralli",
    description: "Gigant GD85 er 8 tonna sturtuvagn, hannaður til að sinna öllum helstu verkefnum í sveitinni. Fáðu ráðgjöf hjá Skralla.",
  },
  "/sturtuvagnar/landbunadarvagn-gd100": {
    title: "Landbúnaðarvagn GD100 frá Gigant | Skralli",
    description: "Gigant GD100 er 10 tonna landbúnaðarvagn, endingargóður og sterkbyggður sturtuvagn sem getur sinnt mörgum hlutverkum.",
  },
  "/sturtuvagnar/landbunadarvagn-gd125": {
    title: "Landbúnaðarvagn GD125 frá Gigant | Skralli",
    description: "Gigant GD125 er 12 tonna sturtuvagn sem sameinar burðargetu, lengd og hæð til að mæta þörfum kröfuharðra bænda.",
  },
  "/sturtuvagnar/landbunadarvagn-gd140-gd140sb": {
    title: "Landbúnaðarvagn GD140 / GD140SB | Skralli",
    description: "Gigant GD140 og GD140SB eru sterkbyggðir og langir 14 tonna sturtuvagnar fyrir verkefni þar sem aðrir vagnar duga ekki til.",
  },
  "/sturtuvagnar/landbunadarvagn-gd150": {
    title: "Landbúnaðarvagn GD150 frá Gigant | Skralli",
    description: "GD150 er sterkasti landbúnaðarvagninn sem Gigant framleiðir. Hægt að uppfæra með hækkuðum hliðum fyrir öruggan flutning á heyi.",
  },

  // Hífi- og festibúnaður
  "/hifi-festibunadur/hifikedjur": {
    title: "Hífikeðjur með CE-vottun | Skralli",
    description: "Vandaðar hífikeðjur með CE-gæðavottun, meðal annars G80 tveggja arma keðjur í 8 og 10 mm. Eins, þriggja og fjögurra arma fást gegn sérpöntun.",
  },
  "/hifi-festibunadur/bindikedjur-strekkjarar": {
    title: "Bindikeðjur og keðjustrekkjarar | Skralli",
    description: "Vottaðar bindikeðjur og strekkjarar fyrir örugga festingu á farmi. Mikið úrval af keðjustrekkjurum á lager, með og án læsingar í krókum.",
  },
  "/hifi-festibunadur/stroffur": {
    title: "Stroffur til hífinga og dráttar | Skralli",
    description: "Hringstroffur, flatstroffur og dráttastroffur fyrir hífingar og drátt. Skoðaðu úrvalið af stroffum hjá Skralla.",
  },
  "/hifi-festibunadur/stroffur/hringstroffur": {
    title: "Hringstroffur með öryggisstuðul 7:1 | Skralli",
    description: "Tveggja laga hringstroffur með öryggisstuðul 7:1. Fást með lyftigetu frá 1 tonni og lengdin er gefin upp í lyftihæð.",
  },
  "/hifi-festibunadur/stroffur/flatstroffur": {
    title: "Flatstroffur og borðastroffur | Skralli",
    description: "Flatstroffur með öryggisstuðul 7:1. Einfaldar borðastroffur með styrkt augu í hvorum enda, frá 1 tonni í lyftigetu og í mörgum lengdum.",
  },
  "/hifi-festibunadur/stroffur/drattastroffur": {
    title: "Dráttastroffur 12 tonna | Skralli",
    description: "Dráttastroffa BS12T6M, 12 tonn og 6 metrar að lengd. Skoðaðu dráttastroffur og annan hífi- og festibúnað hjá Skralla.",
  },
  "/hifi-festibunadur/aukabunadur": {
    title: "Aukabúnaður til hífinga | Skralli",
    description: "Vottaður aukabúnaður fyrir hífingar af öllum stærðum og gerðum: keðjutalíur, H-lásar, D-lásar, öryggiskrókar og fleira.",
  },
  "/hifi-festibunadur/bordastrekkjarar": {
    title: "Borðastrekkjarar og strappar | Skralli",
    description: "Borðastrekkjarar í mörgum stærðum, frá 1 tonna burðarþoli, ásamt ströppum fyrir bílaflutninga og hornvörn.",
  },
};

/** Full page metadata for a route. Throws so a missing entry fails the build. */
export function routeMetadata(path: string): Metadata {
  const meta = PAGE_META[path];
  if (!meta) throw new Error(`No entry in PAGE_META for ${path}`);
  return pageMetadata({ ...meta, path });
}
