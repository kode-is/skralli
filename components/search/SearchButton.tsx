"use client";

import { AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";

// ssr:false + dynamic import: the dialog (its fetch/keyboard/focus-trap
// logic, plus the `search`/`normalize` matcher it pulls in) is only loaded
// once someone actually opens search, so the header's own bundle — present
// on every page — stays small.
const SearchDialog = dynamic(() => import("./SearchDialog").then((mod) => mod.SearchDialog), {
  ssr: false,
});

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

/**
 * Header search entry point (docs/superpowers/specs/2026-09-20-site-search-design.md):
 * an icon-only button that opens the search overlay. Owns the open state
 * and the global "/" and ⌘K/Ctrl+K shortcuts so they work from anywhere on
 * the page, not just while this button has focus.
 */
export function SearchButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.isComposing) return; // never react mid IME composition
      // Exactly Cmd+K or Ctrl+K: no Alt/Shift, so other apps' chords pass through.
      const isModK =
        (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k";
      if (isModK) {
        event.preventDefault();
        openDialog();
        return;
      }
      // A bare "/" only: Ctrl+/, Alt+/ and Cmd+/ belong to the browser or OS.
      const bareSlash = event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey;
      if (bareSlash && !isTypingTarget(event.target)) {
        event.preventDefault();
        openDialog();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openDialog]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Leita"
        aria-haspopup="dialog"
        aria-keyshortcuts="/ Control+K Meta+K"
        onClick={openDialog}
        className="flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:text-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6.25" stroke="currentColor" strokeWidth={1.75} />
          <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open ? <SearchDialog onClose={closeDialog} returnFocusRef={buttonRef} /> : null}
      </AnimatePresence>
    </>
  );
}
