"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  /** Reveal by line (word-wrapped span) rather than per-word, for headings. */
  splitBy?: "word" | "char";
};

const container = (delay: number, stagger: number): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

const unitVariant: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * Reveals text word-by-word (or char-by-char for short marks) as it enters
 * view, each unit masked by an overflow-hidden wrapper so it rises up from
 * behind its own baseline rather than simply fading.
 *
 * Implementation note: a *single* whileInView trigger lives on the outer
 * container, which staggers its children via variants. Giving every word
 * its own IntersectionObserver (the naive approach) multiplies observer
 * count across a long page for no benefit and made reveals unreliable
 * under fast/programmatic scrolling — one observer per heading is both
 * cheaper and more robust.
 */
export function TextReveal({
  text,
  as = "span",
  className,
  delay = 0,
  splitBy = "word",
}: TextRevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  const units = splitBy === "word" ? text.split(" ") : text.split("");

  if (reduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component
      className={cn("inline-flex flex-wrap", splitBy === "word" && "gap-x-[0.28em]", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={container(delay, splitBy === "word" ? 0.045 : 0.02)}
    >
      {units.map((unit, i) => (
        <span key={i} className="overflow-hidden inline-block pb-[0.08em]">
          <motion.span className="inline-block will-change-transform" variants={unitVariant}>
            {unit}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
