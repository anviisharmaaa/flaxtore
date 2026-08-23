import type { Product } from "@/types/product";
import { getLocalContentBySlug } from "@/data/products";

/**
 * Offline-development-only mock commerce data. Used exclusively by
 * `MockCommerceClient` (see `src/lib/commerce/mock-client.ts`), which the
 * commerce factory (`src/lib/commerce/index.ts`) falls back to when
 * `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN` aren't set —
 * so the app still runs (e.g. for UI work) without live Shopify
 * credentials. In production, once Shopify is configured, this file is
 * never read: `ShopifyCommerceClient` (`src/lib/commerce/shopify-client.ts`)
 * is used instead, and Shopify is the sole source of truth for price,
 * name, description, images, and availability.
 *
 * VERIFY BEFORE PUBLISHING
 * ------------------------------------------------------------------
 * Pricing/description text below is working reference content carried
 * over from before the Shopify integration — it has no effect once
 * Shopify credentials are set, but keep it plausible for local dev.
 */
function buildMockProduct(
  slug: string,
  name: string,
  description: string,
  price: number,
  compareAtPrice: number
): Product {
  const local = getLocalContentBySlug(slug);
  if (!local) {
    throw new Error(`Mock product data references unknown slug "${slug}" — no local editorial content found.`);
  }
  return {
    id: `mock-${slug}`,
    slug,
    variantId: `mock-variant-${slug}`,
    name,
    flavour: local.flavour,
    flavourKey: local.flavourKey,
    shortDescription: local.shortDescription,
    description,
    price,
    compareAtPrice,
    weight: "200g",
    images: local.fallbackImages,
    accent: local.accent,
    badge: local.badge,
    ingredients: local.ingredients,
    storage: local.storage,
    nutrition: local.nutrition,
    featured: local.featured,
    available: true,
  };
}

export const mockProducts: Product[] = [
  buildMockProduct(
    "classic-roasted-flaxseed",
    "Flaxtore Classic Roasted",
    "Our signature flavour. Sortex-cleaned flaxseeds, slow-roasted in small batches until they turn deeply nutty and shatteringly crunchy — nothing added, nothing to hide behind.",
    349,
    399
  ),
  buildMockProduct(
    "himalayan-salt-pepper-flaxseed",
    "Flaxtore Himalayan Salt & Pepper",
    "The classic roast, finished with Himalayan pink salt and a crack of pepper for a savoury edge that's built for your desk drawer, your gym bag and everything between.",
    369,
    419
  ),
  buildMockProduct(
    "peri-peri-flaxseed",
    "Flaxtore Peri Peri",
    "For when snack time needs an edge. A bold peri peri seasoning over our slow-roasted flaxseeds — tangy, warm, and gone before you know it.",
    369,
    419
  ),
];

export function getMockProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug === slug);
}

export function getMockRelatedProducts(slug: string, limit = 2) {
  return mockProducts.filter((p) => p.slug !== slug).slice(0, limit);
}
