import { Container } from "@/components/Container";

// docs/scrape/sturtuvagnar.json blocks 14-20: H2 "Af hverju hjólagröfuvagn
// frá Gigant?" followed by seven H3s with no body text or images in the
// scrape.
// docs/reference/sturtuvagnar.desktop.jpg shows them as a 3-column grid of
// plain white tiles (7 items -> 2 full rows + a lone third-row tile), so
// that's reproduced here as a data-only list, no invented copy.
const FEATURES = [
  "Sérhannað bremsukerfi",
  "Hardox 500 TUF",
  "Sveigður framgafl",
  "Vökvavör",
  "LED-ljós",
  "Verkfærakassi",
  "10 gata felgur",
];

export function FeaturesSection() {
  return (
    <section className="bg-[#f0f4fa] py-16 md:py-20">
      <Container>
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">
          Af hverju hjólagröfuvagn frá Gigant?
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature}
              className="flex items-center rounded-2xl bg-white px-6 py-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-neutral-900">{feature}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
