import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { ServicesMenu } from "./ServicesMenu";
import { nav, navCta } from "@/lib/site";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between py-6 md:py-8">
        <Link href="/" aria-label="Skralli - Forsíða">
          <Image
            src="/logos/skralli-white-on-transparent.png"
            alt="Skralli"
            width={537}
            height={146}
            priority
            className="h-8 w-auto md:h-10"
          />
        </Link>

        {/* Nav + CTA are grouped so the hover panel can anchor (right-0)
            to this group's right edge — i.e. the "Hafa samband" button's
            right edge — instead of centring under the "Þjónusta" word. */}
        <div className="relative hidden items-center gap-8 md:flex">
          <nav aria-label="Aðalvalmynd" className="flex items-center gap-8">
            {nav.map((item) =>
              item.text === "Þjónusta" ? (
                <ServicesMenu key={item.href} href={item.href} text={item.text} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-white/90 transition hover:text-white"
                >
                  {item.text}
                </Link>
              ),
            )}
          </nav>

          <Link
            href={navCta.href}
            className="inline-flex items-center justify-center rounded-md border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-dark"
          >
            {navCta.text}
          </Link>
        </div>

        <MobileMenu nav={nav.map((item) => ({ text: item.text, href: item.href }))} />
      </Container>
    </header>
  );
}
