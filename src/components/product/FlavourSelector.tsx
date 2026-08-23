"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/types/product";
import { AddToCartButton } from "./AddToCartButton";
import { formatPrice } from "@/lib/utils/currency";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils/cn";

/**
 * The core interactive flavour experience — reused on the homepage and
 * available for the product page. Fully data-driven off `products`, so
 * adding a fourth flavour (or fiftieth) requires no UI changes.
 */
export function FlavourSelector({ products }: { products: Product[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Defense in depth: `activeIndex` is clamped into the valid range for
  // whatever `products` actually is on this render — covers a shorter
  // list than expected (e.g. 1–2 products instead of 3), not just an
  // empty one. Callers (currently just FlavourExperience) already avoid
  // rendering this component with zero products, but this guard keeps a
  // future caller, or an unexpected empty/short response from the
  // commerce layer, from crashing on `active.images` below.
  const safeIndex = products.length > 0 ? Math.min(activeIndex, products.length - 1) : -1;
  const active = safeIndex >= 0 ? products[safeIndex] : undefined;

  function select(index: number) {
    setActiveIndex(index);
    track.selectFlavour(products[index].slug, products[index].flavour);
  }

  if (!active) return null;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xl)] bg-cream">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {active.images[0] ? (
              <Image
                src={active.images[0].src}
                alt={active.images[0].alt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col justify-center gap-6">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a flavour">
          {products.map((product, i) => (
            <button
              key={product.slug}
              role="tab"
              aria-selected={i === safeIndex}
              onClick={() => select(i)}
              className={cn(
                "flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-medium transition-all duration-300",
                i === safeIndex
                  ? "border-transparent bg-brand-800 text-ivory"
                  : "border-border text-ink-muted hover:border-ink/30 hover:text-ink"
              )}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: product.accent }}
                aria-hidden
              />
              {product.flavour}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <div>
              <h3 className="font-display text-3xl text-ink md:text-4xl">{active.name}</h3>
              <p className="mt-2 text-pretty text-ink-muted">{active.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-semibold text-ink">{formatPrice(active.price)}</span>
              {active.compareAtPrice ? (
                <span className="text-sm text-ink-faint line-through">
                  {formatPrice(active.compareAtPrice)}
                </span>
              ) : null}
              <span className="text-sm text-ink-faint">{active.weight}</span>
            </div>
            <AddToCartButton product={active} />
            <Link
              href={`/products/${active.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
            >
              View full details <ArrowUpRight size={15} />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
