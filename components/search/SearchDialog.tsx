"use client";

import { m } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { prepare, search } from "@/lib/search/search";
import type { SearchEntry, SearchKind, SearchResultGroup } from "@/lib/search/search";

const KIND_LABELS: Record<SearchKind, string> = {
  page: "Síður",
  product: "Vörur",
  brand: "Vörumerki",
  faq: "Spurt & svarað",
  row: "Vörunúmer",
};

const EXAMPLE_QUERIES = ["smurkerfi", "hífikeðjur", "GW-100"];

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Fetched once per page session (not once per open) — a module-level cache
// so re-opening search after the first time never re-fetches.
let cachedEntries: SearchEntry[] | null = null;
let cachedPromise: Promise<SearchEntry[]> | null = null;

function loadIndex(): Promise<SearchEntry[]> {
  if (cachedEntries) return Promise.resolve(cachedEntries);
  if (!cachedPromise) {
    cachedPromise = fetch("/search-index.json")
      .then((res) => {
        if (!res.ok) throw new Error(`search index request failed: ${res.status}`);
        return res.json() as Promise<SearchEntry[]>;
      })
      .then((data) => {
        cachedEntries = prepare(data);
        return cachedEntries;
      })
      .catch((err) => {
        // Allow a retry (the button below calls loadIndex() again) instead
        // of permanently caching the failure.
        cachedPromise = null;
        throw err;
      });
  }
  return cachedPromise;
}

/** Row results are the only entries whose url has a `#fragment` — see
 * navigateTo()'s comment for why those need a real navigation instead of
 * router.push()/next/link's client-side transition. */
function hasFragment(url: string): boolean {
  return url.includes("#");
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Wraps literal, case-insensitive matches of the raw query's words inside
 * `title` in `<mark>`. Best-effort only: a match found purely through
 * stemming/normalisation (e.g. "keðja" matching "Hífikeðjur") won't appear
 * as a literal substring of the display title, so nothing gets highlighted
 * for it — a cosmetic gap, not a functional one. */
function highlightTitle(title: string, query: string): ReactNode {
  const words = [...new Set(query.trim().split(/\s+/).filter(Boolean))].sort((a, b) => b.length - a.length);
  if (words.length === 0) return title;
  const pattern = words.map(escapeRegExp).join("|");
  const parts = title.split(new RegExp(`(${pattern})`, "gi"));
  if (parts.length === 1) return title;
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-transparent text-brand-dark">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

type Status = "loading" | "ready" | "error";
type Option = { entry: SearchEntry; kind: SearchKind };

type SearchDialogProps = {
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
};

/**
 * The search overlay itself (docs/superpowers/specs/2026-09-20-site-search-design.md +
 * .superpowers/sdd/search/brief.md). A WAI-ARIA combobox-with-listbox-popup:
 * the input keeps real DOM focus at all times, ArrowUp/Down/Home/End move
 * `aria-activedescendant` across the flattened option list, and Enter
 * programmatically navigates to whichever option is active — options are
 * also real `<Link>`s so a mouse click, middle-click, or Tab-then-Enter all
 * work independently of that virtual-focus system.
 */
export function SearchDialog({ onClose, returnFocusRef }: SearchDialogProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(cachedEntries ? "ready" : "loading");
  const [entries, setEntries] = useState<SearchEntry[] | null>(cachedEntries);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const inputId = useId();

  const close = useCallback(() => {
    onClose();
    returnFocusRef.current?.focus();
  }, [onClose, returnFocusRef]);

  const fetchIndex = useCallback(() => {
    setStatus("loading");
    loadIndex()
      .then((data) => {
        setEntries(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (!cachedEntries) fetchIndex();
  }, [fetchIndex]);

  // Focus the input on open.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lock background scroll while open, restoring whatever it was before.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Escape closes from anywhere in the dialog; Tab is trapped inside it.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
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
  }, [close]);

  const groups = useMemo<SearchResultGroup[]>(() => {
    if (!entries || query.trim() === "") return [];
    return search(entries, query);
  }, [entries, query]);

  const options = useMemo<Option[]>(
    () => groups.flatMap((group) => group.items.map((entry) => ({ entry, kind: group.kind }))),
    [groups],
  );

  const optionDomId = useCallback((entryId: string) => `${listboxId}-opt-${entryId}`.replace(/[^\w-]/g, "-"), [
    listboxId,
  ]);

  // Keep the active option valid as results change; default to the first.
  useEffect(() => {
    setActiveId((current) => {
      if (options.length === 0) return null;
      if (current && options.some((o) => o.entry.id === current)) return current;
      return options[0].entry.id;
    });
  }, [options]);

  const moveActive = useCallback(
    (direction: 1 | -1) => {
      if (options.length === 0) return;
      const currentIndex = options.findIndex((o) => o.entry.id === activeId);
      const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + options.length) % options.length;
      const next = options[nextIndex].entry.id;
      setActiveId(next);
      document.getElementById(optionDomId(next))?.scrollIntoView({ block: "nearest" });
    },
    [options, activeId, optionDomId],
  );

  const navigateTo = useCallback(
    (url: string) => {
      if (hasFragment(url)) {
        // `router.push()` updates `location.hash` but — confirmed by hand
        // against this exact flow — Chromium doesn't re-run the "scroll to
        // the fragment" algorithm for a History-API hash change to a
        // *different* route, so `:target` (app/globals.css's row
        // highlight) never engages even though the URL and scroll position
        // are both correct. A real navigation does trigger it natively, and
        // this only affects `row` results (the only entries with a `#...`),
        // a secondary path where losing the SPA transition is an acceptable
        // trade for the highlight actually working.
        window.location.assign(url);
        return;
      }
      router.push(url);
      close();
    },
    [router, close],
  );

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveActive(-1);
        break;
      case "Home":
        if (options.length > 0) {
          event.preventDefault();
          setActiveId(options[0].entry.id);
        }
        break;
      case "End":
        if (options.length > 0) {
          event.preventDefault();
          setActiveId(options[options.length - 1].entry.id);
        }
        break;
      case "Enter": {
        const active = options.find((o) => o.entry.id === activeId);
        if (active) {
          event.preventDefault();
          navigateTo(active.entry.url);
        }
        break;
      }
      default:
        break;
    }
  }

  function useExample(example: string) {
    setQuery(example);
    inputRef.current?.focus();
  }

  const totalCount = groups.reduce((sum, group) => sum + group.total, 0);
  const isEmptyQuery = query.trim() === "";

  return (
    <>
      <m.div
        className="motion-fade fixed inset-0 z-[100] bg-[#001A28]/55 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={close}
      />
      <div className="fixed inset-0 z-[110] flex justify-center overflow-y-auto px-4 pb-6" onClick={close}>
        <m.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Leit"
          className="motion-fade mt-[12vh] h-fit w-[min(680px,calc(100vw-32px))] overflow-hidden rounded-[15px] bg-white shadow-2xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5 shrink-0 text-neutral-400" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="6.25" stroke="currentColor" strokeWidth={1.75} />
              <path d="M13.5 13.5L18 18" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeId ? optionDomId(activeId) : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder="Leita á skralli.is…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
              className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[18px] text-neutral-900 outline-none placeholder:text-neutral-400"
            />
            <span className="hidden shrink-0 rounded-md border border-neutral-200 px-1.5 py-0.5 font-ui text-[11px] font-medium text-neutral-400 sm:inline-block">
              Esc
            </span>
          </div>

          <div id={listboxId} role="listbox" aria-label="Niðurstöður leitar" className="max-h-[60vh] overflow-y-auto p-2">
            {status === "loading" ? (
              <p className="px-3 py-8 text-center font-ui text-sm text-neutral-500">Hleð…</p>
            ) : status === "error" ? (
              <div className="flex flex-col items-center gap-3 px-3 py-8 text-center">
                <p className="font-ui text-sm text-neutral-600">Ekki tókst að hlaða leitinni. Reyndu aftur.</p>
                <button
                  type="button"
                  onClick={fetchIndex}
                  className="rounded-md border border-neutral-300 px-3 py-1.5 font-ui text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Reyna aftur
                </button>
              </div>
            ) : isEmptyQuery ? (
              <div className="px-3 py-4 font-ui text-sm text-neutral-500">
                <span>Prófaðu: </span>
                {EXAMPLE_QUERIES.map((example, i) => (
                  <span key={example}>
                    <button
                      type="button"
                      onClick={() => useExample(example)}
                      className="font-medium text-brand-dark underline-offset-2 hover:underline"
                    >
                      {example}
                    </button>
                    {i < EXAMPLE_QUERIES.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            ) : options.length === 0 ? (
              <p className="px-3 py-8 text-center font-ui text-sm text-neutral-500">
                Engar niðurstöður fyrir „{query}“
              </p>
            ) : (
              groups.map((group) => {
                const groupHeadingId = `${listboxId}-heading-${group.kind}`;
                return (
                  <div key={group.kind} role="group" aria-labelledby={groupHeadingId} className="mb-2 last:mb-0">
                    <h3
                      id={groupHeadingId}
                      className="px-3 py-1.5 font-ui text-[11px] font-semibold uppercase tracking-[.1em] text-brand-dark"
                    >
                      {KIND_LABELS[group.kind]}
                    </h3>
                    <ul>
                      {group.items.map((entry) => {
                        const domId = optionDomId(entry.id);
                        const isActive = entry.id === activeId;
                        const optionContent = (
                          <>
                            <span className="block truncate font-ui text-[15px] font-semibold text-[#171717]">
                              {highlightTitle(entry.title, query)}
                            </span>
                            {entry.subtitle ? (
                              <span className="block truncate font-ui text-[13px] text-[#4a5568]">
                                {entry.subtitle}
                              </span>
                            ) : null}
                          </>
                        );
                        const optionClassName = `block rounded-lg px-3 py-2 ${isActive ? "bg-[#f0f4fa]" : ""}`;
                        return (
                          <li key={entry.id}>
                            {hasFragment(entry.url) ? (
                              // Plain <a>, not next/link: see navigateTo()'s
                              // comment — a real navigation is what makes
                              // `:target` (the row highlight) engage.
                              <a
                                id={domId}
                                role="option"
                                aria-selected={isActive}
                                href={entry.url}
                                onMouseEnter={() => setActiveId(entry.id)}
                                className={optionClassName}
                              >
                                {optionContent}
                              </a>
                            ) : (
                              <Link
                                id={domId}
                                role="option"
                                aria-selected={isActive}
                                href={entry.url}
                                onMouseEnter={() => setActiveId(entry.id)}
                                onClick={close}
                                className={optionClassName}
                              >
                                {optionContent}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-neutral-100 px-5 py-2.5 font-ui text-[12px] text-neutral-400">
            ↑↓ velja · Enter opna · Esc loka
          </div>

          <span role="status" aria-live="polite" className="sr-only">
            {status === "ready" && !isEmptyQuery ? `${totalCount} niðurstöður` : ""}
          </span>
        </m.div>
      </div>
    </>
  );
}
