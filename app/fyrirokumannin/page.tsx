import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactCta } from "@/components/ContactCta";
import { CATEGORY_ICONS } from "@/components/CategoryIcons";
import { JumpNav } from "@/components/fyrirokumannin/JumpNav";
import { SeatCoversSection } from "@/components/fyrirokumannin/SeatCoversSection";
import { IconBand } from "@/components/fyrirokumannin/IconBand";
import { FloorMatsSection } from "@/components/fyrirokumannin/FloorMatsSection";
import { ShoeTraySection } from "@/components/fyrirokumannin/ShoeTraySection";
import { LightsBanner } from "@/components/fyrirokumannin/LightsBanner";
import { BarGuide } from "@/components/fyrirokumannin/BarGuide";
import { LightMakersSection } from "@/components/fyrirokumannin/LightMakersSection";
import { LightsInquirySection } from "@/components/fyrirokumannin/LightsInquirySection";
import { BUILD_ICONS, DOT_PATTERN_STYLE, FIT_ICONS } from "@/components/fyrirokumannin/icons";
import { buildBand, fitBand } from "@/lib/fyrirokumannin";

// docs/scrape/fyrirokumannin.json — same <title>/<meta description> as
// every other route on the live site.
export const metadata = pageMetadata({
  title: "Skralli - Þinn samstarfsaðili",
  description: "Skralli - Innflutningur & Ráðgjöf. Við erum hér til að þjónusta þig.",
  path: "/fyrirokumannin",
});

// docs/scrape/fyrirokumannin.json block 1. Scraped at a 512x683 thumbnail;
// the actual downloaded file is 3024x4032 (same ~0.75 aspect), so that's
// what is passed to next/image to avoid the small-thumbnail distortion
// noted on the /thjonusta hero (see components/smurkerfi's HERO_IMAGE
// comment).
const HERO_IMAGE = {
  src: "/images/home/26-94902b25.jpeg",
  alt: "Sætisáklæði",
  width: 3024,
  height: 4032,
};

const CarIcon = CATEGORY_ICONS.fyrirokumannin;

export default function FyrirOkumanninPage() {
  return (
    <main id="main">
      <PageHero
        image={HERO_IMAGE}
        title="Fyrir ökumanninn"
        subtitle="Sætisáklæði, gólfmottur, ljósabúnaður og fleira - sérsniðið að þínu tæki"
        icon={CarIcon ? <CarIcon className="h-6 w-6" /> : null}
        pattern
      />
      <Breadcrumb items={[{ text: "Fyrir ökumanninn" }]} />
      <JumpNav />
      {/* In the cab: PeBe seat covers, mats and shoe trays. */}
      <SeatCoversSection />
      <IconBand heading={fitBand.heading} items={fitBand.items} icons={FIT_ICONS} />
      <FloorMatsSection />
      <ShoeTraySection />
      {/* On the machine: MittX and Entrax light bars. */}
      <LightsBanner />
      <BarGuide />
      <IconBand heading={buildBand.heading} items={buildBand.items} icons={BUILD_ICONS} style={DOT_PATTERN_STYLE} />
      <LightMakersSection />
      <LightsInquirySection />
      <ContactCta />
    </main>
  );
}
