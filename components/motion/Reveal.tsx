"use client";

import { m } from "motion/react";
import type { ElementType, ReactNode } from "react";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const VIEWPORT = { once: true, margin: "-80px" } as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// `m` (from LazyMotion's domAnimation feature set) is a proxy keyed by tag
// name, same shape as `motion` — indexing it dynamically by an `as` prop
// works at runtime; this cast just gives TypeScript a signature for that.
const M = m as unknown as Record<string, typeof m.div>;

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: ElementType & string;
  // Passed straight through to the rendered element (e.g. `id` for
  // aria-labelledby wiring) — Reveal/Stagger/StaggerItem otherwise behave
  // like the plain tag they replace.
  [key: string]: unknown;
};

/**
 * Fade-up-on-scroll wrapper for section headings and their intro copy.
 * Fires once, ~80px before the element reaches the viewport. Never wrap a
 * layout container (main, grid, hero image) in this — it animates opacity
 * and a 24px translateY only, so it must not be relied on for layout.
 */
export function Reveal({ children, delay = 0, className, as = "div", ...rest }: RevealProps) {
  const Component = M[as];
  return (
    <Component
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Wraps a card grid: put the grid's own layout classes (grid, gap-*, etc.)
 * directly on `Stagger` — it renders the `m.div` that IS the grid — and put
 * each card's wrapper classes on `StaggerItem`, never on an extra element
 * around it, so the DOM shape (and therefore card positions) is unchanged.
 */
export function Stagger({ children, className, as = "div", ...rest }: RevealProps) {
  const Component = M[as];
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      transition={{ staggerChildren: 0.08 }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * Fade-up-on-mount wrapper for the hero title/subtitle/buttons (Hero.tsx,
 * PageHero.tsx). Unlike `Reveal`, this always plays once on load via
 * `initial`/`animate` — never `whileInView` — since hero content is already
 * above the fold when the page mounts.
 */
export function HeroReveal({ children, delay = 0, className, as = "div", ...rest }: RevealProps) {
  const Component = M[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Component>
  );
}

/**
 * StaggerItem sits between the grid and each card, so a card that relied on
 * being the direct grid/flex item to get stretched to its row's height
 * (equal-height cards in a row) loses that once wrapped, UNLESS either (a)
 * the card component sets its own `h-full` (FeatureCard.tsx and the wagon
 * product cards in WagonSections.tsx already do), or (b) the caller passes
 * `className="[&>*]:h-full"` here to force StaggerItem's one child to fill
 * it. Do the latter only when StaggerItem wraps exactly one full-card
 * element with no `h-full` of its own — passing it where StaggerItem wraps
 * multiple children (e.g. an image box with its own fixed height alongside
 * a text block) will stomp on those children's own height utilities.
 */
export function StaggerItem({ children, className, as = "div", ...rest }: RevealProps) {
  const Component = M[as];
  return (
    <Component
      className={className}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: EASE }}
      {...rest}
    >
      {children}
    </Component>
  );
}
