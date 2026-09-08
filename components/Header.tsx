import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
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

        <nav aria-label="Aðalvalmynd" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-1 text-sm text-white/90 transition hover:text-white"
            >
              {item.text}
              {item.text === "Þjónusta" ? (
                <svg viewBox="0 0 12 8" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
                  <path
                    d="M1 1.5L6 6.5L11 1.5"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : null}
            </Link>
          ))}
        </nav>

        <Link
          href={navCta.href}
          className="hidden items-center justify-center rounded-md border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-dark md:inline-flex"
        >
          {navCta.text}
        </Link>

        <MobileMenu nav={nav.map((item) => ({ text: item.text, href: item.href }))} />
      </Container>
    </header>
  );
}
