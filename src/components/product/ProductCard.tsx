"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";
import { ProductBadge } from "./ProductBadge";
import { formatPrice } from "@/lib/utils/currency";
import { track } from "@/lib/analytics";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={() => track.viewProduct(product.slug)}
        className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface transition-shadow duration-300 hover:shadow-[var(--shadow-md)]"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-cream">
          <div className="h-full w-full transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-105">
            {product.images[0] ? (
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            ) : null}
          </div>
          {product.badge ? (
            <div className="absolute left-4 top-4">
              <ProductBadge badge={product.badge} />
            </div>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-500">
            {product.flavour}
          </span>
          <h3 className="font-display text-xl text-ink">{product.name}</h3>
          <p className="line-clamp-2 text-sm text-ink-muted">{product.shortDescription}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-base font-semibold text-ink">{formatPrice(product.price)}</span>
            {product.compareAtPrice ? (
              <span className="text-sm text-ink-faint line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
            <span className="ml-auto text-xs text-ink-faint">{product.weight}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
