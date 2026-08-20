"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/**
 * The hero's product-facing visual — the flagship Classic Roasted packshot.
 * Above-the-fold, so this is the one product image on the page loaded with
 * `priority` rather than lazily.
 */
export function HeroSeeds() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="relative mx-auto aspect-[4/5] w-full max-w-md"
    >
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative h-full w-full overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] ring-1 ring-ivory/10"
      >
        <Image
          src="/images/products/classic-roasted/hero.webp"
          alt="Flaxtore Classic Roasted flaxseed pouch"
          fill
          sizes="(min-width: 1024px) 40vw, 90vw"
          className="object-cover"
          priority
        />
      </motion.div>
      <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-ivory px-5 py-4 shadow-[var(--shadow-md)] sm:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          Per 20g serving
        </p>
        <p className="font-display text-2xl text-brand-800">4.2g Omega-3</p>
      </div>
    </motion.div>
  );
}
