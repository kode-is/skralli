"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { lightsInquiry } from "@/lib/fyrirokumannin";
import { DOT_PATTERN_STYLE } from "./icons";

const INTERVAL_MS = 1700;
const EASE = [0.21, 0.47, 0.32, 0.98] as const;

const COLUMNS = ["make", "model", "year"] as const;

/**
 * The "make / model / year" figure in the lights inquiry, rolling through
 * lightsInquiry.examples like a departures board so no single dealer is
 * the example. Each column flips in turn (make, then model, then year),
 * and the machine type in the corner flips with them.
 *
 * It pauses while hovered and never starts for visitors who ask for
 * reduced motion. The server and first client render both show the first
 * example, so hydration always matches.
 */
export function MachineTicker() {
  const { examples, exampleLabels } = lightsInquiry;
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const running = !hovered && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % examples.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [running, examples.length]);

  const example = examples[index];

  return (
    <figure
      className="@container relative mt-8 overflow-hidden rounded-[20px] bg-brand-dark px-6 pt-6 pb-7 text-white md:mt-10 md:px-9 md:pt-8 md:pb-9"
      style={DOT_PATTERN_STYLE}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-start justify-between gap-3">
        <figcaption className="font-ui text-xs font-semibold tracking-[.12em] text-white/60 uppercase">
          {lightsInquiry.exampleCaption}
        </figcaption>
        <span className="relative h-7 shrink-0 overflow-hidden rounded-full bg-white/10 px-3 font-ui text-xs leading-7 font-medium whitespace-nowrap text-accent-yellow">
          <AnimatePresence mode="popLayout" initial={false}>
            <m.span
              key={example.type + index}
              className="block"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE, delay: 0.12 }}
            >
              {example.type}
            </m.span>
          </AnimatePresence>
        </span>
      </div>

      {/* Fixed column widths so the row never jumps as names change length;
          the type scales with the card (cqw) so "Liebherr" fits on phones. */}
      <dl className="mt-5 grid grid-cols-[1.3fr_1.15fr_0.85fr]">
        {COLUMNS.map((column, columnIndex) => (
          <div key={column} className="flex min-w-0 flex-col-reverse">
            <dt className="mt-3 mr-2 border-t-2 border-accent-yellow pt-2 font-ui text-[11px] leading-snug text-white/80 sm:text-xs md:mr-4 md:text-[13px]">
              {exampleLabels[column]}
            </dt>
            <dd className="relative h-[1.1em] overflow-hidden font-stat text-[clamp(18px,7.4cqw,60px)] leading-[1.1] font-bold">
              <AnimatePresence mode="popLayout" initial={false}>
                <m.span
                  key={example[column] + index}
                  className="block whitespace-nowrap"
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE, delay: columnIndex * 0.05 }}
                >
                  {example[column]}
                </m.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 font-ui text-[13px] text-white/60">{lightsInquiry.exampleNote}</p>
    </figure>
  );
}
