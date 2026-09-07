import { Container } from "@/components/Container";

// docs/scrape/siubunadur.json blocks 14-18: five bare H3s with no body copy
// or images in the scrape, shown as a row of plain white pill tiles
// (docs/reference/siubunadur.desktop.jpg) rather than an equal-width grid —
// they wrap naturally at their own content width.
const SUITABILITY = [
  "Endurvinnsla",
  "Jarðgerð",
  "Flutningar og geymsla",
  "Niðurrif bygginga",
  "Námuvinnsla",
];

export function SuitabilitySection() {
  return (
    <section className="bg-[#f0f4fa] py-16 md:py-20">
      <Container>
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">Hvar hentar BMair?</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
          Sérhver grein hefur sín efni sem hafa áhrif á loftgæði og heilsu vélamanna.
        </p>
        {/* Partial bold from docs/scrape/formatting.json's "strong" list. */}
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
          Við höfum búnaðinn sem hentar{" "}
          <strong className="font-semibold text-neutral-900">þínu umhverfi</strong> best, hvort
          sem það er:
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          {SUITABILITY.map((item) => (
            <div key={item} className="rounded-2xl bg-white px-6 py-4 shadow-sm">
              <h3 className="text-base font-semibold text-neutral-900">{item}</h3>
            </div>
          ))}
        </div>
        <p className="mt-10 text-sm leading-relaxed text-neutral-600 md:text-base">
          Ert þú eða þitt starfsfólk að vinna í menguðu umhverfi?
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600 md:text-base">
          Fáðu tilboð strax í dag og taktu stjórn á loftgæðunum.
        </p>
      </Container>
    </section>
  );
}
