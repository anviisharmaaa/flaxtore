import type { LocalProductContent } from "@/types/product";
import { baseNutrition } from "@/data/nutrition";

/**
 * Local, non-commerce editorial content — keyed by slug, where slug ==
 * the Shopify product handle for each of the three already-imported
 * products (classic-roasted-flaxseed, himalayan-salt-pepper-flaxseed,
 * peri-peri-flaxseed). Shopify is the source of truth for commerce data
 * (title, price, variants, inventory, commerce images); this file only
 * holds what Shopify doesn't store — brand voice (flavour label, accent
 * color, badge), nutrition education, ingredients/storage copy, and a
 * local fallback photo set for use until real images are uploaded in
 * Shopify Admin. See `src/lib/shopify/products.ts` for how this is
 * merged onto the Shopify-sourced fields to build the full `Product`
 * the UI renders, and `src/lib/commerce/mock-client.ts` /
 * `src/data/mock-products.ts` for the offline-dev-only mock commerce
 * data (used only when no Shopify credentials are configured).
 *
 * VERIFY BEFORE PUBLISHING
 * ------------------------------------------------------------------
 * Nutrition figures below are reference/development data — see
 * `src/data/nutrition.ts`. Ingredients/storage copy should be checked
 * against final approved packaging before launch.
 */
export const localProductContent: LocalProductContent[] = [
  {
    slug: "classic-roasted-flaxseed",
    flavour: "Classic Roasted",
    flavourKey: "classic",
    shortDescription: "Slow-roasted, naturally nutty, endlessly snackable.",
    accent: "var(--color-flavour-classic)",
    badge: "Signature",
    ingredients: ["Sortex-cleaned flaxseeds (roasted)"],
    storage: "Store in a cool, dry place. Reseal after opening.",
    nutrition: baseNutrition,
    featured: true,
    fallbackImages: [
      { src: "/images/products/classic-roasted/hero.webp", alt: "Flaxtore Classic Roasted flaxseed pouch" },
      { src: "/images/products/classic-roasted/detail.webp", alt: "Flaxtore Classic Roasted flaxseeds, close-up detail" },
      { src: "/images/products/classic-roasted/lifestyle.webp", alt: "Flaxtore Classic Roasted in an everyday moment" },
      { src: "/images/packaging/classic-roasted/front.png", alt: "Flaxtore Classic Roasted pouch, front of packaging" },
      { src: "/images/packaging/classic-roasted/back.png", alt: "Flaxtore Classic Roasted pouch, back of packaging" },
    ],
  },
  {
    slug: "himalayan-salt-pepper-flaxseed",
    flavour: "Himalayan Salt & Pepper",
    flavourKey: "salt",
    shortDescription: "A savoury, cracked-pepper edge on our slow roast.",
    accent: "var(--color-flavour-salt)",
    ingredients: ["Sortex-cleaned flaxseeds (roasted)", "Himalayan pink salt", "Cracked black pepper"],
    storage: "Store in a cool, dry place. Reseal after opening.",
    nutrition: baseNutrition,
    featured: true,
    fallbackImages: [
      { src: "/images/products/himalayan-salt-pepper/hero.webp", alt: "Flaxtore Himalayan Salt & Pepper flaxseed pouch" },
      { src: "/images/products/himalayan-salt-pepper/detail.webp", alt: "Flaxtore Himalayan Salt & Pepper flaxseeds, close-up detail" },
      { src: "/images/products/himalayan-salt-pepper/lifestyle.webp", alt: "Flaxtore Himalayan Salt & Pepper in an everyday moment" },
      { src: "/images/packaging/himalayan-salt-pepper/front.png", alt: "Flaxtore Himalayan Salt & Pepper pouch, front of packaging" },
      { src: "/images/packaging/himalayan-salt-pepper/back.png", alt: "Flaxtore Himalayan Salt & Pepper pouch, back of packaging" },
    ],
  },
  {
    slug: "peri-peri-flaxseed",
    flavour: "Peri Peri",
    flavourKey: "peri",
    shortDescription: "A bold, tangy heat for the days that don't slow down.",
    accent: "var(--color-flavour-peri)",
    badge: "Bold",
    ingredients: ["Sortex-cleaned flaxseeds (roasted)", "Peri peri seasoning"],
    storage: "Store in a cool, dry place. Reseal after opening.",
    nutrition: baseNutrition,
    featured: true,
    fallbackImages: [
      { src: "/images/products/peri-peri/hero.webp", alt: "Flaxtore Peri Peri flaxseed pouch" },
      { src: "/images/products/peri-peri/detail.webp", alt: "Flaxtore Peri Peri flaxseeds, close-up detail" },
      { src: "/images/products/peri-peri/lifestyle.webp", alt: "Flaxtore Peri Peri in an everyday moment" },
      { src: "/images/packaging/peri-peri/front.png", alt: "Flaxtore Peri Peri pouch, front of packaging" },
      { src: "/images/packaging/peri-peri/back.png", alt: "Flaxtore Peri Peri pouch, back of packaging" },
    ],
  },
];

export function getLocalContentBySlug(slug: string): LocalProductContent | undefined {
  return localProductContent.find((p) => p.slug === slug);
}

/**
 * Safe default used only if Shopify ever returns a product handle with
 * no matching local content (e.g. a fourth flavour added in Shopify
 * before its editorial copy is written here). Keeps the page rendering
 * instead of crashing; the product simply shows generic copy until this
 * file is updated.
 */
export function getLocalContentOrDefault(slug: string, flavourTitle: string): LocalProductContent {
  return (
    getLocalContentBySlug(slug) ?? {
      slug,
      flavour: flavourTitle,
      flavourKey: "classic",
      shortDescription: "",
      accent: "var(--color-flavour-classic)",
      ingredients: [],
      storage: "Store in a cool, dry place. Reseal after opening.",
      nutrition: baseNutrition,
      featured: false,
      fallbackImages: [],
    }
  );
}
