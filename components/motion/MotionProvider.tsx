"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Mounted once in app/layout.tsx around the body content. `LazyMotion` with
 * the `domAnimation` feature bundle keeps the shipped animation code small —
 * every animated element site-wide must use `m.*` components (never
 * `motion.*`, which pulls in the full, un-lazy bundle and throws under
 * `strict`). `MotionConfig reducedMotion="user"` makes every transform/
 * opacity animation respect the visitor's OS-level reduced-motion
 * preference automatically, without each component checking it manually.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
