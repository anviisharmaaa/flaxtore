"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { fadeUp } from "./variants";

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  once?: boolean;
};

/**
 * Fades + lifts content into place as it enters the viewport. The single
 * building block used across storytelling sections. Honors
 * prefers-reduced-motion by skipping the transform and only cross-fading.
 */
export function Reveal({ delay = 0, once = true, children, ...props }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      variants={reduceMotion ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : fadeUp}
      transition={{ delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
