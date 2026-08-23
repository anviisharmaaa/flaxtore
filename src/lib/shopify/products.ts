import type { Product, ProductImage } from "@/types/product";
import type {
  ShopifyProduct,
  ShopifyProductsQueryResult,
  ShopifyProductByHandleQueryResult,
} from "./types";
import { shopifyFetch } from "./client";
import { PRODUCTS_QUERY, PRODUCT_BY_HANDLE_QUERY } from "./queries";
import { getLocalContentBySlug, getLocalContentOrDefault } from "@/data/products";

/**
 * Product reads use the same 60s revalidation window the pages that call
 * them already declare (`export const revalidate = 60` on `/`, `/shop`,
 * `/products/[slug]`) — see those files. Kept as one constant so the
 * fetch-level cache and the route-level ISR window can't drift apart.
 */
const PRODUCTS_REVALIDATE_SECONDS = 60;

function resolveWeightLabel(variant: ShopifyProduct["variants"]["edges"][number]["node"]): string {
  const weightOption = variant.selectedOptions.find((o) => /weight|size/i.test(o.name));
  if (weightOption?.value) return weightOption.value;
  if (variant.title && variant.title !== "Default Title") return variant.title;
  if (variant.weight != null && variant.weightUnit) {
    const unit = variant.weightUnit.toLowerCase();
    const unitLabel = unit === "grams" ? "g" : unit === "kilograms" ? "kg" : unit;
    return `${variant.weight}${unitLabel}`;
  }
  return "";
}

function mapShopifyImages(shopifyProduct: ShopifyProduct): ProductImage[] {
  return shopifyProduct.images.edges.map(({ node }) => ({
    src: node.url,
    alt: node.altText ?? shopifyProduct.title,
  }));
}

/**
 * Maps a raw Shopify Storefront product into the existing UI-facing
 * `Product` type. Shopify supplies the commerce fields; local editorial
 * content (flavour label, accent color, badge, ingredients, storage,
 * nutrition, and fallback photography) is merged in by slug == handle.
 * See the `Product` / `LocalProductContent` doc comments in
 * `src/types/product.ts` for the full field-by-field source breakdown.
 */
export function mapShopifyProductToLocal(shopifyProduct: ShopifyProduct): Product {
  // Surface handle mismatches at build/request time instead of failing
  // silently — if this fires, the Shopify product's handle doesn't match
  // any slug in src/data/products.ts, so it renders with generic
  // fallback copy (no badge, no ingredients, not featured) until either
  // the Shopify handle or the local slug is corrected to match. Safe to
  // log: only the handle and title, never credentials.
  if (!getLocalContentBySlug(shopifyProduct.handle)) {
    console.warn(
      `[shopify] No local editorial content for handle "${shopifyProduct.handle}" (title: "${shopifyProduct.title}"). ` +
        `Add a matching entry to src/data/products.ts, or update the product's handle in Shopify Admin, so it gets its ` +
        `flavour copy, badge, and featured status.`
    );
  }
  const local = getLocalContentOrDefault(shopifyProduct.handle, shopifyProduct.title);
  const variant = shopifyProduct.variants.edges[0]?.node;
  const shopifyImages = mapShopifyImages(shopifyProduct);

  return {
    id: shopifyProduct.id,
    slug: shopifyProduct.handle,
    variantId: variant?.id ?? "",
    name: shopifyProduct.title,
    flavour: local.flavour,
    flavourKey: local.flavourKey,
    shortDescription: local.shortDescription,
    description: shopifyProduct.description,
    price: variant ? Number(variant.price.amount) : 0,
    compareAtPrice: variant?.compareAtPrice ? Number(variant.compareAtPrice.amount) : undefined,
    weight: variant ? resolveWeightLabel(variant) : "",
    // Prefer Shopify-hosted commerce images; fall back to local
    // photography only if the Shopify product has none uploaded yet.
    images: shopifyImages.length > 0 ? shopifyImages : local.fallbackImages,
    accent: local.accent,
    badge: local.badge,
    ingredients: local.ingredients,
    storage: local.storage,
    nutrition: local.nutrition,
    featured: local.featured,
    available: variant ? variant.availableForSale : shopifyProduct.availableForSale,
  };
}

export async function getShopifyProducts(): Promise<Product[]> {
  const data = await shopifyFetch<ShopifyProductsQueryResult>(
    PRODUCTS_QUERY,
    { first: 50 },
    { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: ["shopify-products"] }
  );
  return data.products.edges.map(({ node }) => mapShopifyProductToLocal(node));
}

export async function getShopifyProductByHandle(handle: string): Promise<Product | undefined> {
  const data = await shopifyFetch<ShopifyProductByHandleQueryResult>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle },
    { revalidate: PRODUCTS_REVALIDATE_SECONDS, tags: ["shopify-products", `shopify-product-${handle}`] }
  );
  return data.productByHandle ? mapShopifyProductToLocal(data.productByHandle) : undefined;
}
