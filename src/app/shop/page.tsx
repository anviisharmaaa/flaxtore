import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { commerce } from "@/lib/commerce";

/**
 * Statically generated with a background revalidation window rather than
 * fully dynamic — this page reads product price/availability data through
 * `commerce`, which will eventually be Shopify-backed. A short revalidate
 * window keeps pages served instantly from the static cache (preserving
 * current performance) while ensuring catalogue data is refreshed roughly
 * every minute instead of staying frozen at build time indefinitely.
 * Editorial-only pages (About, Why Flax, Journal, FAQ, legal) intentionally
 * do NOT set this — they have no commerce dependency and can stay static
 * until the next deploy.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Shop All Flavours",
  description: "Sortex-cleaned, slow-roasted flaxseed in three flavours. Shop the full Flaxtore range.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await commerce.getProducts();

  return (
    <div className="pb-24 pt-32 md:pt-40">
      <Container>
        <div className="mb-14 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">Shop</span>
          <h1 className="font-display mt-3 text-[clamp(2.25rem,5vw,4rem)] text-ink">
            Three flavours. One slow roast.
          </h1>
          <p className="mt-4 text-pretty text-ink-muted">
            Every bag starts the same way — sortex-cleaned, slow-roasted flaxseed. From there, three
            different personalities.
          </p>
        </div>
        <ProductGrid products={products} />
      </Container>
    </div>
  );
}
