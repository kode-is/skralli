import { Container } from "@/components/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { gigantMore, plows, type GigantModelTable } from "@/lib/vetrarbunadur";
import { CheckIcon, GIGANT_ICONS, PlusIcon } from "./icons";

function ModelTable({ table }: { table: GigantModelTable }) {
  return (
    <div className="mb-6 overflow-x-auto rounded-[15px] border border-[#E3E9F2]">
      <table className="w-full border-collapse text-left font-ui text-[13px] sm:text-sm md:text-[15px]">
        <caption className="sr-only">{table.caption}</caption>
        <thead className="bg-[#f0f4fa] text-[#171717]">
          <tr>
            {table.headers.map((header) => (
              <th key={header} scope="col" className="px-2.5 py-3 font-semibold whitespace-nowrap sm:px-3 md:px-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E3E9F2] text-[#444444]">
          {table.rows.map(([model, ...values]) => (
            <tr key={model}>
              <th scope="row" className="px-2.5 py-3 font-semibold whitespace-nowrap text-brand-dark sm:px-3 md:px-4">
                {model}
              </th>
              {values.map((value, index) => (
                <td key={`${model}-${table.headers[index + 1]}`} className="px-2.5 py-3 whitespace-nowrap sm:px-3 md:px-4">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Gigant's sand and salt spreaders, spreader wagons and ice and road scraper,
// with model data from gigantprodukter.no/produkter/vinter.
export function GigantMoreSection() {
  return (
    <section id="halkuvarnir" className="scroll-mt-6 bg-[#f0f4fa] py-16 md:py-24">
      <Container>
        <Reveal as="h2" className="text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]">
          {gigantMore.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-3 max-w-2xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
          {gigantMore.text}
        </Reveal>

        <Stagger className="mt-10 grid gap-5 md:mt-12 md:gap-7">
          {gigantMore.items.map((product) => {
            const Icon = GIGANT_ICONS[product.icon];
            return (
              <StaggerItem key={product.name} className="min-w-0 rounded-[20px] bg-white p-6 md:p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
                  <div className="min-w-0">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0f4fa] text-brand-dark">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h3 className="mt-5 font-ui text-xl font-semibold text-[#171717] md:text-2xl">{product.name}</h3>
                    <p className="mt-2 text-[15px] leading-[1.6] text-[#444444] md:text-base">{product.text}</p>

                    <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-4 border-t border-[#E3E9F2] pt-5">
                      {product.specs.map((spec) => (
                        <div key={spec.value} className="flex flex-col-reverse">
                          <dt className="mt-1 font-ui text-xs text-[#6b7280]">{spec.label}</dt>
                          <dd className="font-stat text-2xl leading-none font-bold text-brand-dark md:text-[28px]">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="min-w-0">
                    {product.models ? <ModelTable table={product.models} /> : null}
                    <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                      {product.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 font-ui text-sm text-[#171717] md:text-[15px]">
                          <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-green" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {product.accessories?.length ? (
                  <div className="mt-7 border-t border-[#E3E9F2] pt-6">
                    <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-[#6b7280] uppercase">
                      {plows.accessoriesLabel}
                    </p>
                    <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {product.accessories.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 font-ui text-sm text-[#444444] md:text-[15px]">
                          <PlusIcon className="mt-0.5 h-4 w-4 shrink-0 text-brand-dark" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
