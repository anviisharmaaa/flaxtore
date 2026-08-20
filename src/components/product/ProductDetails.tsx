import Link from "next/link";
import type { Product } from "@/types/product";
import { AddToCartButton } from "./AddToCartButton";
import { ProductBadge } from "./ProductBadge";
import { formatPrice } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

export function ProductDetails({
  product,
  allFlavours,
}: {
  product: Product;
  allFlavours: Product[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {product.badge ? <ProductBadge badge={product.badge} /> : null}

      <div>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
          {product.flavour}
        </span>
        <h1 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight text-ink">
          {product.name}
        </h1>
      </div>

      <p className="max-w-lg text-pretty leading-relaxed text-ink-muted">{product.description}</p>

      <div className="flex items-center gap-3">
        <span className="text-2xl font-semibold text-ink">{formatPrice(product.price)}</span>
        {product.compareAtPrice ? (
          <span className="text-base text-ink-faint line-through">
            {formatPrice(product.compareAtPrice)}
          </span>
        ) : null}
        <span className="text-sm text-ink-faint">{product.weight}</span>
      </div>

      {allFlavours.length > 1 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Flavour
          </p>
          <div className="flex flex-wrap gap-2">
            {allFlavours.map((f) => (
              <Link
                key={f.slug}
                href={`/products/${f.slug}`}
                className={cn(
                  "flex items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-medium transition-colors",
                  f.slug === product.slug
                    ? "border-transparent bg-brand-800 text-ivory"
                    : "border-border text-ink-muted hover:border-ink/30 hover:text-ink"
                )}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: f.accent }} aria-hidden />
                {f.flavour}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <AddToCartButton product={product} className="pt-2" />

      <div className="grid grid-cols-1 gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Ingredients
          </h3>
          <ul className="flex flex-col gap-1 text-sm text-ink-muted">
            {product.ingredients.map((ing) => (
              <li key={ing}>{ing}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Storage
          </h3>
          <p className="text-sm text-ink-muted">{product.storage}</p>
        </div>
      </div>
    </div>
  );
}
