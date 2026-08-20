"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type Seed = {
  top: string;
  left: string;
  size: number;
  rotate: number;
  delay: number;
  opacity: number;
  hideOnMobile?: boolean;
};

const DEFAULT_SEEDS: Seed[] = [
  { top: "12%", left: "8%", size: 22, rotate: -18, delay: 0, opacity: 0.5 },
  { top: "68%", left: "4%", size: 14, rotate: 30, delay: 0.4, opacity: 0.35, hideOnMobile: true },
  { top: "22%", left: "92%", size: 18, rotate: 8, delay: 0.8, opacity: 0.4 },
  { top: "78%", left: "90%", size: 26, rotate: -40, delay: 1.2, opacity: 0.3, hideOnMobile: true },
  { top: "48%", left: "50%", size: 12, rotate: 60, delay: 0.2, opacity: 0.25, hideOnMobile: true },
];

/**
 * The signature Flaxtore seed motif — a handful of single seed marks that
 * drift almost imperceptibly. Used sparingly as ambient texture behind
 * hero/story sections, never as a dense particle system. Reduced count on
 * small screens, disabled entirely for prefers-reduced-motion.
 */
export function SeedField({
  className,
  seeds = DEFAULT_SEEDS,
  tone = "var(--color-brand-400)",
}: {
  className?: string;
  seeds?: Seed[];
  tone?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {seeds.map((seed, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 40"
          width={seed.size}
          height={seed.size * 1.6}
          className={cn("absolute", seed.hideOnMobile && "hidden md:block")}
          style={{
            top: seed.top,
            left: seed.left,
            opacity: seed.opacity,
            rotate: seed.rotate,
          }}
          initial={{ y: 0 }}
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: seed.delay,
          }}
        >
          <path
            d="M12 0C16 8 24 16 24 26C24 33.7 18.6 40 12 40C5.4 40 0 33.7 0 26C0 16 8 8 12 0Z"
            fill={tone}
          />
          <path
            d="M12 4C12 4 12 20 12 36"
            stroke="var(--color-ivory)"
            strokeWidth="0.75"
            strokeLinecap="round"
            opacity="0.6"
          />
        </motion.svg>
      ))}
    </div>
  );
}
