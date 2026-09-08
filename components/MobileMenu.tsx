"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navCta } from "@/lib/site";

type NavItem = { text: string; href: string };

type MobileMenuProps = {
  nav: readonly NavItem[];
};

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ nav }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu, Tab/Shift+Tab is trapped inside the open panel
  // (a full-screen overlay covering the header/page behind it), and opening
  // moves focus onto the panel's own close button.
  function close() {
    setOpen(false);
    toggleButtonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleButtonRef}
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
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Valmynd"
          className="fixed inset-0 z-[60] flex flex-col bg-brand-dark"
        >
          <div className="flex items-center justify-between px-6 py-6">
            <Link href="/" onClick={close}>
              <Image
                src="/logos/skralli-white-on-transparent.png"
                alt="Skralli"
                width={537}
                height={146}
                className="h-9 w-auto"
              />
            </Link>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Loka valmynd"
              onClick={close}
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
                onClick={close}
                className="text-2xl font-medium text-white"
              >
                {item.text}
              </Link>
            ))}
            <Link
              href={navCta.href}
              onClick={close}
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
