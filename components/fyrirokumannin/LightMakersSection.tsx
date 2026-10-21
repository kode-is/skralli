import { Container } from "@/components/Container";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { lightMakers } from "@/lib/fyrirokumannin";

const CHIP = "inline-flex items-center rounded-full bg-[#f0f4fa] px-3 py-1.5 font-ui text-xs font-medium text-brand-dark";
const BRAND_CHIP =
  "inline-flex items-center rounded-full border border-[#E3E9F2] bg-white px-3 py-1.5 font-ui text-xs font-medium text-[#171717] md:text-[13px]";

/**
 * "Ljósabogar frá MittX og Entrax": the two makers named in a heading and
 * a card each (so the page is found on their names), beside the live
 * page's video, then the machine brands the bars are made for. Comes after
 * the bar guide and build band: product first, makers after.
 */
export function LightMakersSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <Container>
        <Reveal as="p" className="font-ui text-[11px] font-semibold tracking-[.12em] text-brand-dark uppercase md:text-xs">
          {lightMakers.eyebrow}
        </Reveal>
        <Reveal
          as="h2"
          delay={0.05}
          className="mt-3 text-[32px] leading-[1.15] font-semibold text-[#171717] md:text-[50px] md:leading-[1.08]"
        >
          {lightMakers.heading}
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-3 max-w-2xl text-base leading-[1.65] text-[#444444] md:mt-4 md:text-lg">
          {lightMakers.text}
        </Reveal>

        {/* The video is upright (9:16), so it takes a narrow column of its
            own and the maker cards stack beside it at about its height. */}
        <div className="mt-10 grid items-start gap-6 md:mt-14 md:grid-cols-[minmax(0,300px)_1fr] md:gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-10">
          <YouTubeEmbed
            videoId={lightMakers.video.id}
            params={lightMakers.video.params}
            title={lightMakers.video.title}
            aspect={lightMakers.video.aspect}
            className="mx-auto max-w-[320px] rounded-[20px] shadow-[0_18px_40px_-24px_rgba(0,83,128,0.35)] md:mx-0 md:max-w-none"
          />
          <Stagger className="grid gap-4 md:gap-5">
            {lightMakers.makers.map((maker) => (
              <StaggerItem key={maker.name} className="rounded-[20px] border border-[#E3E9F2] bg-white p-6 md:p-7">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-ui text-2xl font-semibold text-[#171717]">{maker.name}</h3>
                  <p className="font-ui text-[11px] font-semibold tracking-[.12em] text-[#6b7280] uppercase">{maker.country}</p>
                </div>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[#444444]">{maker.text}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${lightMakers.productsLabel} frá ${maker.name}`}>
                  {maker.products.map((product) => (
                    <li key={product} className={CHIP}>
                      {product}
                    </li>
                  ))}
                </ul>
                <a
                  href={maker.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 font-ui text-sm font-semibold text-brand-dark transition-colors duration-200 hover:text-brand-mid"
                >
                  {maker.link.text}
                  <span aria-hidden="true">↗</span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E3E9F2] pt-6 md:mt-12 md:flex-row md:items-center md:gap-5">
          <p className="shrink-0 font-ui text-sm font-semibold text-[#171717]">{lightMakers.brandsLabel}</p>
          <ul className="flex flex-wrap gap-1.5">
            {lightMakers.brands.map((brand) => (
              <li key={brand} className={BRAND_CHIP}>
                {brand}
              </li>
            ))}
            <li className="inline-flex items-center px-1.5 font-ui text-xs text-[#6b7280] md:text-[13px]">{lightMakers.brandsMore}</li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
