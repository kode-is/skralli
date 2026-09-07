"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { navCta } from "@/lib/site";

type NavItem = { text: string; href: string };

type MobileMenuProps = {
  nav: readonly NavItem[];
};

export function MobileMenu({ nav }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label="Opna valmynd"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="relative z-10 flex h-10 w-10 items-center justify-center text-white"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60] flex flex-col bg-brand-dark">
          <div className="flex items-center justify-between px-6 py-6">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/logos/skralli-white-on-transparent.png"
                alt="Skralli"
                width={537}
                height={146}
                className="h-9 w-auto"
              />
            </Link>
            <button
              type="button"
              aria-label="Loka valmynd"
              onClick={() => setOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-2xl font-medium text-white"
              >
                {item.text}
              </Link>
            ))}
            <Link
              href={navCta.href}
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-md border border-white px-8 py-3 text-lg font-semibold text-white"
            >
              {navCta.text}
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
