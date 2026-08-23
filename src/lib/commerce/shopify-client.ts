import type { CommerceClient } from "@/types/commerce";
import type { Product } from "@/types/product";
import { getShopifyProducts, getShopifyProductByHandle } from "@/lib/shopify/products";

/**
 * Shopify Storefront API-backed commerce client — the production
 * implementation once `SHOPIFY_STORE_DOMAIN` and
 * `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are set (see `.env.example` and the
 * factory in `./index.ts`). Only the public Storefront API is used here;
 * the Admin API and its credentials are never called from this app.
 *
 * Errors are intentionally NOT swallowed here — a Shopify outage should
 * surface as a real error on the commerce pages that need Shopify data
 * (`/`, `/shop`, `/products/[slug]`), where Next's route-level
 * `error.tsx` (already brand-styled) catches it with a friendly message
 * and a retry action. Editorial-only routes (`/about`, `/nutrition`,
 * `/journal`, `/faq`, etc.) never call this client at all, so a Shopify
 * failure here has no effect on them.
 */
export class ShopifyCommerceClient implements CommerceClient {
  async getProducts(): Promise<Product[]> {
    return getShopifyProducts();
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return getShopifyProductByHandle(slug);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await getShopifyProducts();
    const featured = products.filter((p) => p.featured);
    // `featured` is a local-editorial flag (see src/data/products.ts),
    // matched onto a Shopify product by handle. Shopify remains the
    // source of truth for which products exist; local content only
    // curates which of them get highlighted here. If a Shopify handle
    // doesn't match any local entry, every product silently falls back
    // to `featured: false` and this would return an empty list — which
    // would in turn leave the homepage flavour selector with nothing to
    // show. Rather than let a content-matching gap hide the whole
    // catalogue, fall back to showing every available product.
    return featured.length > 0 ? featured : products;
  }

  async getRelatedProducts(slug: string, limit = 2): Promise<Product[]> {
    const products = await getShopifyProducts();
    return products.filter((p) => p.slug !== slug).slice(0, limit);
  }
}
