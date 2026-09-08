import { Container } from "@/components/Container";

// The tile grid from lib/sturtuvagnar.ts's `groupFeatures` (currently only
// populated for the hjólagröfuvagnar group — see scripts/gen-sturtuvagnar.mjs
// / FeaturesSection.tsx, which renders this same data on /sturtuvagnar
// itself). Rendered on a product page only when its group has features.
//
// desktopColumns defaults to 3, matching /sturtuvagnar's own verified layout
// (docs/reference/sturtuvagnar.desktop.jpg: 7 tiles as 3+3+1). Mockup 1
// (design/Main.tpl.html) uses a 4-column grid for this same section on a
// product page instead (7 tiles as 4+3), so product pages pass 4 — same
// data, same tiles, a layout choice per call site rather than a second copy
// of this component.
export function FeatureTiles({
  heading,
  items,
  desktopColumns = 3,
}: {
  heading: string;
  items: string[];
  desktopColumns?: 3 | 4;
}) {
  return (
    <section className="bg-[#f0f4fa] py-16 md:py-20">
      <Container>
        <h2 className="text-3xl font-bold text-neutral-900 md:text-4xl">{heading}</h2>
        <div
          className={`mt-8 grid gap-4 sm:grid-cols-2 ${
            desktopColumns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center rounded-2xl bg-white px-6 py-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-neutral-900">{item}</h3>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
