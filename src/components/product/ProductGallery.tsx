"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils/cn";

export function ProductGallery({ product }: { product: Product }) {
  const [active, setActive] = useState(0);
  const image = product.images[active];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-xl)] bg-cream sm:aspect-[4/5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={image?.src ?? active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            {image ? (
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
                priority={active === 0}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {product.images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {product.images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] border-2 bg-cream transition-colors",
                i === active ? "border-brand-600" : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img.src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
