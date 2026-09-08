/**
 * Decorative dot-pattern section divider — the same asset and treatment
 * duplicated across components/oryggisrudur/IntroSection.tsx,
 * components/siubunadur/IntroSection.tsx and
 * components/fyrirokumannin/FloorMatsSection.tsx (each after their own
 * `text`/`link` scrape block: oryggisrudur.json block 12, siubunadur.json
 * block 10, fyrirokumannin.json block 75). Not the same as the taller,
 * more-opaque variant in components/home/StepsSection.tsx and
 * components/smurkerfi/FeaturesSection.tsx, which is intentionally left
 * alone.
 */
export function DotDivider() {
  return (
    <div
      aria-hidden="true"
      className="mt-16 h-20 w-full bg-repeat opacity-10"
      style={{ backgroundImage: "url(/images/home/20-463dd036.svg)" }}
    />
  );
}
