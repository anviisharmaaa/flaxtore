"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * A subtle fade + settle-into-place reveal for editorial imagery. Uses the
 * same `variants`-driven `whileInView` mechanism as `Reveal` (rather than
 * animating raw `clipPath`/`scale` objects directly) — that distinction
 * matters here: a two-level nested-motion.div version of this component
 * that animated `clipPath` directly never fired its `whileInView` triggers
 * in this Framer Motion version, leaving wrapped images permanently
 * clipped to zero height. It went unnoticed while every image slot held a
 * background-toned placeholder (an invisible placeholder looks the same as
 * a rendered one); it became obvious the moment real photography replaced
 * those placeholders. This single-level, variants-based version mirrors
 * `Reveal`'s proven-reliable pattern.
 */
const revealVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } },
};

export function ImageReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={reduceMotion ? reducedVariants : revealVariants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
