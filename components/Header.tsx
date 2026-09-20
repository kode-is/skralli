import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";
import { ServicesMenu } from "./ServicesMenu";
import { SearchButton } from "./search/SearchButton";
import { nav, navCta } from "@/lib/site";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between py-6 md:py-8">
        <Link href="/" aria-label="Skralli - Forsíða">
          <Image
            src="/logos/skralli-header.png"
            alt="Skralli"
            width={537}
            height={146}
            priority
            className="h-[30px] w-auto md:h-12"
          />
        </Link>

        {/* Nav, search, CTA and the mobile menu toggle are one flex group
            (right-aligned via `ml-auto`) so the search button can sit
            between the nav and the CTA at md+ and immediately left of the
            hamburger below md, using the same single instance either way —
            each of the other three is simply hidden/shown per breakpoint,
            never removed from this group. It's also `relative` so
            ServicesMenu's hover panel can anchor (right-0) to this group's
            right edge — i.e. the "Hafa samband" button's right edge —
            instead of centring under the "Þjónusta" word; since that panel
            only opens from the (md+-only) nav, its anchor is unaffected by
            what's hidden below md. */}
        <div className="relative ml-auto flex items-center gap-x-[30px]">
          <nav aria-label="Aðalvalmynd" className="hidden items-center gap-x-[30px] md:flex">
            {nav.map((item) =>
              item.text === "Þjónusta" ? (
                <ServicesMenu key={item.href} href={item.href} text={item.text} />
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-base font-normal text-white transition hover:text-white/80"
                >
                  {item.text}
                </Link>
              ),
            )}
          </nav>

          <SearchButton />

          <Link
            href={navCta.href}
            className="hidden items-center justify-center rounded-md border border-white/70 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-dark md:inline-flex"
          >
            {navCta.text}
          </Link>

          <MobileMenu nav={nav.map((item) => ({ text: item.text, href: item.href }))} />
        </div>
      </Container>
    </header>
  );
}
