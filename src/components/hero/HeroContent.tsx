"use client";

import { motion } from "framer-motion";
import { TextReveal } from "@/components/motion/TextReveal";
import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/motion/Magnetic";

export function HeroContent() {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-200"
      >
        Sortex-Cleaned · Slow-Roasted · Three Flavours
      </motion.span>

      <h1 className="text-display max-w-3xl text-balance text-[clamp(2.75rem,7.2vw,6.5rem)] text-ivory">
        <TextReveal text="Healthy never had this much crunch." delay={0.15} />
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="max-w-md text-pretty text-base leading-relaxed text-ivory/70 md:text-lg"
      >
        Sortex-cleaned. Slow-roasted. Seriously crunchy. A snack built for
        real, everyday appetites — not a compromise dressed up as one.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="flex flex-wrap items-center gap-4 pt-1"
      >
        <Magnetic>
          <Button href="/shop" size="lg" variant="inverse">
            Shop Now
          </Button>
        </Magnetic>
        <Button href="/why-flax" size="lg" variant="secondary" className="border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory/10">
          Explore The Crunch
        </Button>
      </motion.div>
    </div>
  );
}
