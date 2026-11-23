import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { CHAIN_PATTERN_STYLE } from "@/components/vetrarbunadur/icons";
import { snowChainsBanner } from "@/lib/snjokedjur";

/** Home page link to /snjokedjur, under the product category grid. */
export function SnowChainsBanner() {
  return (
    <Reveal
      className="mt-10 flex flex-col items-start gap-6 rounded-[15px] bg-brand-dark px-[30px] py-8 text-white md:mt-[60px] md:flex-row md:items-center md:justify-between md:px-10 md:py-10"
      style={CHAIN_PATTERN_STYLE}
    >
      <div>
        <h3 className="text-2xl leading-[1.2] font-semibold md:text-3xl">{snowChainsBanner.heading}</h3>
        <p className="mt-2 text-[15px] leading-[1.6] text-white/80 md:text-base">{snowChainsBanner.text}</p>
      </div>
      <Link
        href={snowChainsBanner.cta.href}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md border border-white px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-brand-dark"
      >
        {snowChainsBanner.cta.text}
        <span aria-hidden="true">→</span>
      </Link>
    </Reveal>
  );
}
