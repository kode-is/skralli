import { Container } from "@/components/Container";
import { StatCounter } from "@/components/StatCounter";

// Settled values (see docs/scrape/home.json, patched from the mid-animation
// capture 483/133/4/4 to the values verified live and in the server-rendered
// HTML). The "Ísett smurkefi" label typo is preserved verbatim.
const STATS = [
  { value: "480", suffix: "+", label: "Ísett smurkefi" },
  { value: "130", suffix: "+", label: "Innflutt tæki" },
  { value: "1", suffix: "klst", label: "Fyrirspurnum svarað innan" },
  { value: "50", suffix: "+", label: "Vörumerki" },
];

export function StatsSection() {
  return (
    <section className="bg-brand-dark py-14 md:py-16">
      <Container>
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/15">
          {STATS.map((stat, index) => (
            <div key={stat.label} className={index > 0 ? "md:pl-8" : undefined}>
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
