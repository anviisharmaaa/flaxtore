import type { NutritionData } from "./nutrition";

export type ProductImage = {
  /** Path under /public, or a fully qualified URL once real photography lands. */
  src: string;
  alt: string;
  /** true while this is a placeholder composition rather than real photography. */
  isPlaceholder?: boolean;
};

/**
 * The UI-facing product shape. Assembled by the commerce layer from two
 * sources (see `src/lib/commerce/shopify-client.ts`):
 *
 * - Shopify (source of truth for commerce data): id, slug (Shopify
 *   product handle), variantId (the merchandiseId Shopify's cart
 *   mutations require), name, description, price, compareAtPrice,
 *   weight, images, availability.
 * - Local editorial content, keyed by slug (see `src/data/products.ts`):
 *   flavour, flavourKey, shortDescription, accent, badge, ingredients,
 *   storage, nutrition, featured — brand storytelling / nutrition
 *   education that doesn't live in Shopify and shouldn't have to.
 *
 * This is unchanged from the pre-Shopify shape except for the addition
 * of `variantId` and `available` — every existing field a component
 * already reads is still present, so no component prop signature had to
 * change.
 */
export type Product = {
  id: string;
  slug: string;
  /** Shopify ProductVariant GID — the `merchandiseId` cart mutations require. */
  variantId: string;
  name: string;
  flavour: string;
  flavourKey: "classic" | "salt" | "peri";
  shortDescription: string;
  description: string;
  /** Price in INR (paise-free, whole rupees). Sourced from the Shopify variant. */
  price: number;
  compareAtPrice?: number;
  weight: string;
  images: ProductImage[];
  accent: string;
  badge?: string;
  ingredients: string[];
  storage: string;
  nutrition: NutritionData;
  featured?: boolean;
  /** Shopify variant availability — false once Shopify reports it out of stock. */
  available: boolean;
};

/**
 * Local, non-commerce editorial content for one product, keyed by slug
 * (== the Shopify product handle). See `src/data/products.ts`. Everything
 * here is brand storytelling / nutrition education Shopify doesn't (and
 * shouldn't need to) store — it's merged onto the Shopify-sourced fields
 * above to produce the full `Product` the UI renders.
 */
export type LocalProductContent = {
  slug: string;
  flavour: string;
  flavourKey: "classic" | "salt" | "peri";
  shortDescription: string;
  accent: string;
  badge?: string;
  ingredients: string[];
  storage: string;
  nutrition: NutritionData;
  featured?: boolean;
  /**
   * Local photography used only as a fallback when the Shopify product
   * has no images uploaded yet (see IMAGE_MAPPING notes from the CSV
   * export — Shopify likely has zero images until they're uploaded in
   * Shopify Admin). Once Shopify has real images, those are preferred.
   */
  fallbackImages: ProductImage[];
};
