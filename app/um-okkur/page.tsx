import { routeMetadata } from "@/lib/page-meta";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContactCta } from "@/components/ContactCta";
import { ContactMapSection } from "@/components/ContactMapSection";
import { StatsSection } from "@/components/StatsSection";
import { AboutIntro } from "@/components/um-okkur/AboutIntro";
import { GoalsSection } from "@/components/um-okkur/GoalsSection";
import { TeamSection } from "@/components/um-okkur/TeamSection";

export const metadata = routeMetadata("/um-okkur");

export default function UmOkkurPage() {
  return (
    <main id="main">
      <PageHero
        image={{
          src: "/images/um-okkur/01-143b289f.png",
          alt: "Starfsmenn Skralla að vinna í vinnuvél",
          width: 1440,
          height: 642,
        }}
        title="Um okkur"
      />
      <Breadcrumb items={[{ text: "Um okkur" }]} />
      <AboutIntro />
      <GoalsSection />
      <StatsSection />
      <TeamSection />
      <ContactMapSection />
      <ContactCta />
    </main>
  );
}
