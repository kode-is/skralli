import { routeMetadata } from "@/lib/page-meta";
import { PageHero } from "@/components/PageHero";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Container } from "@/components/Container";
import { ContactForm } from "@/components/ContactForm";
import { ContactMapSection } from "@/components/ContactMapSection";
import { Reveal } from "@/components/motion/Reveal";

export const metadata = routeMetadata("/hafa-samband");

export default function HafaSambandPage() {
  return (
    <main id="main">
      <PageHero
        image={{ src: "/images/hafa-samband/01-7ea80875.jpeg", alt: "Vinir við vegin", width: 512, height: 341 }}
        title="Hafa Samband"
      />
      <Breadcrumb items={[{ text: "Hafa samband" }]} />
      <section className="bg-white py-16 md:py-24">
        <Container>
          <Reveal as="h2" className="text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
            Sendu okkur fyrirspurn!
          </Reveal>
          <div className="mx-auto mt-10 max-w-[600px]">
            <ContactForm showPhone submitLabel="Senda!" />
          </div>
        </Container>
      </section>
      <ContactMapSection />
    </main>
  );
}
