import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { VEHICLE_ICONS } from "@/components/vetrarbunadur/icons";
import { vehicleSections, vehicleSectionsLabel } from "@/lib/snjokedjur";
import { vehiclesHeading } from "@/lib/vetrarbunadur";

/**
 * One card per vehicle group, each with its own "Snjókeðjur fyrir ..."
 * heading and the approved chain lines for those vehicles. The line details
 * live once in the Keðjutýpur section below, so these link down to them.
 */
export function VehicleChainsSection() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {vehiclesHeading}
        </Reveal>
        <Stagger className="mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-7">
          {vehicleSections.map((section) => {
            const Icon = VEHICLE_ICONS[section.icon];
            return (
              <StaggerItem
                key={section.id}
                as="article"
                id={section.id}
                className="scroll-mt-6 rounded-[20px] border border-[#E3E9F2] bg-white p-6 md:p-8"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                    <Icon className="h-7 w-7" />
                  </span>
                  <div>
                    <h3 className="font-ui text-lg leading-snug font-semibold text-[#171717] md:text-xl">{section.heading}</h3>
                    <p className="mt-1 text-[15px] leading-[1.55] text-[#444444] md:text-base">{section.text}</p>
                  </div>
                </div>

                <p className="mt-6 font-ui text-[11px] font-semibold tracking-[.12em] text-[#6b7280] uppercase">
                  {vehicleSectionsLabel}
                </p>
                <ul className="mt-2.5 divide-y divide-[#E3E9F2] border-t border-[#E3E9F2]">
                  {section.lines.map((line) => (
                    <li key={line.id}>
                      <a
                        href={`#${line.id}`}
                        className="group flex items-center justify-between gap-4 py-3.5 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-mid"
                      >
                        <span className="min-w-0">
                          <span className="block font-ui text-[15px] font-semibold text-[#171717] transition-colors duration-200 group-hover:text-brand-dark md:text-base">
                            {line.name}
                            <span className="ml-2 font-normal text-[#6b7280]">{line.kicker}</span>
                          </span>
                          <span className="mt-0.5 block text-sm leading-[1.5] text-[#444444]">{line.fits.join(" · ")}</span>
                        </span>
                        <span className="shrink-0 font-stat text-sm font-bold whitespace-nowrap text-brand-dark md:text-[15px]">
                          {line.sizes.join(" · ")} mm
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
