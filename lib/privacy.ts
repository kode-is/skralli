import { site } from "@/lib/site";

/**
 * Skralli's privacy policy, adapted from the policy Kode wrote for totus.is
 * (totus/app/personuvernd/page.tsx) at Einar's request on 2026-09-20.
 *
 * Carried over as-is in substance: controller, what is collected, purpose,
 * retention. Rewritten to be true for Skralli rather than copied: the
 * third-party section (Totus shares job details with electrical contractors;
 * Skralli does not, but it does use processors for hosting, form e-mail and
 * consented analytics) and the cookie section (Totus sets none; Skralli uses
 * Google Analytics, strictly after consent). Totus's "Réttindi þín" section
 * is left out on Einar's explicit instruction.
 *
 * Legal copy: Hlynur should read it before launch.
 */
export const privacyPolicy = {
  path: "/personuvernd",
  title: "Persónuverndarstefna",
  description:
    "Persónuverndarstefna Skralla ehf. — hvaða persónuupplýsingum við söfnum, í hvaða tilgangi, hvernig þær eru varðveittar og hvernig vafrakökur eru notaðar á skralli.is.",
  intro:
    "Skralli ehf. leggur áherslu á að vernda persónuupplýsingar viðskiptavina sinna og fara með þær í samræmi við íslensk persónuverndarlög. Hér að neðan má sjá hvernig við söfnum, notum og varðveitum upplýsingar.",
  updated: "Síðast uppfært: september 2026.",
  sections: [
    {
      title: "Ábyrgðaraðili",
      paragraphs: [
        `Skralli ehf. (${site.kennitala.replace(/^Kt\.\s*/i, "kt. ")}), ${site.address}, er ábyrgðaraðili þeirra persónuupplýsinga sem safnað er í gegnum vefinn skralli.is. Fyrirspurnir um persónuvernd má senda á ${site.email} eða í síma ${site.phone}.`,
      ],
    },
    {
      title: "Hvaða upplýsingum við söfnum",
      paragraphs: [
        "Þegar þú sendir okkur fyrirspurn eða óskar eftir tilboði í gegnum vefformin söfnum við þeim upplýsingum sem þú gefur upp: nafni, netfangi, símanúmeri (ef þú skráir það) og efni skilaboðanna. Við söfnum ekki persónuupplýsingum umfram það sem nauðsynlegt er til að svara erindinu.",
      ],
    },
    {
      title: "Í hvaða tilgangi",
      paragraphs: [
        "Upplýsingarnar eru einungis notaðar til að svara fyrirspurnum, veita ráðgjöf, gera tilboð og sinna þjónustu, ísetningu og viðgerðum. Þær eru ekki nýttar í markaðssetningu án samþykkis og eru aldrei seldar þriðja aðila.",
      ],
    },
    {
      title: "Miðlun til þriðju aðila",
      paragraphs: [
        "Skralli miðlar ekki persónuupplýsingum til þriðju aðila nema það sé nauðsynlegt til að sinna erindinu eða skylt samkvæmt lögum. Við rekstur vefsins nýtum við þjónustuaðila sem vinna upplýsingar fyrir okkar hönd: vefhýsingu (Vercel), sendingu tölvupósts úr vefformum (Resend) og, einungis ef þú samþykkir, vefmælingar (Google Analytics).",
      ],
    },
    {
      title: "Varðveisla",
      paragraphs: [
        "Persónuupplýsingum er einungis haldið eins lengi og nauðsynlegt er vegna erindisins eða til að uppfylla lagaskyldur (t.d. bókhaldslög). Þegar þeirra er ekki lengur þörf er þeim eytt á öruggan hátt.",
      ],
    },
    {
      title: "Vafrakökur",
      paragraphs: [
        "Vefurinn setur engar vafrakökur nema þú samþykkir það. Ef þú samþykkir notum við Google Analytics til að mæla umferð um vefinn og bæta hann; þær mælingar eru ekki notaðar í auglýsingaskyni. Þú getur breytt valinu eða afturkallað samþykki hvenær sem er með hlekknum „Vafrakökustillingar“ neðst á síðunni.",
      ],
    },
  ],
} as const;
