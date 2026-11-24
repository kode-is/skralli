import { pageMetadata } from "@/lib/seo";
import { snowChainsJsonLd } from "@/lib/structured-data";
import {
  SNOW_CHAINS_PATH,
  snowChainsFaq,
  snowChainsHero,
  snowChainsJumpLinks,
  snowChainsMeta,
} from "@/lib/snjokedjur";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { Container } from "@/components/Container";
import { DetailsFaq } from "@/components/DetailsFaq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { VehicleChainsSection } from "@/components/snjokedjur/VehicleChainsSection";
import { ChainInquirySection } from "@/components/vetrarbunadur/ChainInquirySection";
import { ChainLinesSection } from "@/components/vetrarbunadur/ChainLinesSection";
import { JumpNav } from "@/components/vetrarbunadur/JumpNav";
import { LillesethSection } from "@/components/vetrarbunadur/LillesethSection";
import { SpikesSection } from "@/components/vetrarbunadur/SpikesSection";
import { WhyLillesethSection } from "@/components/vetrarbunadur/WhyLillesethSection";

export const metadata = pageMetadata({ ...snowChainsMeta, path: SNOW_CHAINS_PATH });

// Same photo as the /vetrarbunadur hero (3024x4032 source file).
const HERO_IMAGE = { src: "/images/thjonusta/08-e6009210.jpeg", alt: "", width: 3024, height: 4032 };

const SnowflakeIcon = CATEGORY_ICONS.vetrarbunadur;

export default function SnjokedjurPage() {
  return (
    <main id="main">
      <JsonLd data={snowChainsJsonLd({ ...snowChainsMeta, path: SNOW_CHAINS_PATH, faq: snowChainsFaq.items })} />
      <PageHero
        image={HERO_IMAGE}
        title={snowChainsHero.title}
        subtitle={snowChainsHero.subtitle}
        icon={SnowflakeIcon ? <SnowflakeIcon className="h-6 w-6" /> : null}
        pattern
      />
      <Breadcrumb items={[{ text: "Vetrarbúnaður", href: "/vetrarbunadur" }, { text: snowChainsHero.title }]} />
      <div className="bg-white pt-10 md:pt-14">
        <Container>
          <JumpNav links={snowChainsJumpLinks} />
        </Container>
      </div>
      <LillesethSection />
      <VehicleChainsSection />
      <ChainLinesSection />
      <WhyLillesethSection />
      <SpikesSection />
      <ChainInquirySection />
      <DetailsFaq heading={snowChainsFaq.heading} items={snowChainsFaq.items} surface="white" />
    </main>
  );
}
