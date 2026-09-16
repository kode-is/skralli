import { Container } from "@/components/Container";
import { StatCounter } from "@/components/StatCounter";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";
import { stats } from "@/lib/stats";

/** Used on both the home page and /um-okkur — see lib/stats.ts. */
export function StatsSection() {
  return (
    <section className="bg-brand-dark py-14 md:py-16">
      <Container>
        <Stagger className="grid grid-cols-2 gap-y-10 md:grid-cols-4 md:divide-x md:divide-white/15">
          {stats.map((stat, index) => (
            <StaggerItem key={stat.label} className={index > 0 ? "md:pl-8" : undefined}>
              <StatCounter value={stat.value} suffix={stat.suffix} label={stat.label} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
