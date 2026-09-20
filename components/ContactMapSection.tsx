import { Container } from "@/components/Container";
import { ContactMap } from "@/components/ContactMap";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The "Staðsetning" section, used on /hafa-samband and /um-okkur.
 *
 * Deliberately not a client component: only the map inside it needs
 * interactivity, so the heading stays server-rendered.
 */
export function ContactMapSection() {
  return (
    <section className="bg-white pb-16 md:pb-24">
      <Container>
        <Reveal as="h2" className="text-center text-3xl font-semibold text-neutral-900 md:text-4xl">
          Staðsetning
        </Reveal>
        <div className="mt-10">
          <ContactMap />
        </div>
      </Container>
    </section>
  );
}
