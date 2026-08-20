import type { Product } from "@/types/product";
import { baseNutrition } from "@/data/nutrition";

/**
 * VERIFY BEFORE PUBLISHING
 * ------------------------------------------------------------------
 * Flavour names, descriptions and pricing below are working reference
 * content used to build a functioning three-flavour commerce experience.
 * They are centralized in this single file — swap in confirmed brand
 * copy, official flavour names and final MRP before launch. No health
 * or nutrition claims are made beyond the verified data in
 * `src/data/nutrition.ts`.
 */
export const products: Product[] = [
  {
    id: "prod-classic-roasted",
    slug: "classic-roasted-flaxseed",
    name: "Flaxtore Classic Roasted",
    flavour: "Classic Roasted",
    flavourKey: "classic",
    shortDescription: "Slow-roasted, naturally nutty, endlessly snackable.",
    description:
      "Our signature flavour. Sortex-cleaned flaxseeds, slow-roasted in small batches until they turn deeply nutty and shatteringly crunchy — nothing added, nothing to hide behind.",
    price: 349,
    compareAtPrice: 399,
    weight: "200g",
    images: [
      { src: "/images/products/classic-roasted/hero.webp", alt: "Flaxtore Classic Roasted flaxseed pouch" },
      { src: "/images/products/classic-roasted/detail.webp", alt: "Flaxtore Classic Roasted flaxseeds, close-up detail" },
      { src: "/images/products/classic-roasted/lifestyle.webp", alt: "Flaxtore Classic Roasted in an everyday moment" },
      { src: "/images/packaging/classic-roasted/front.png", alt: "Flaxtore Classic Roasted pouch, front of packaging" },
      { src: "/images/packaging/classic-roasted/back.png", alt: "Flaxtore Classic Roasted pouch, back of packaging" },
    ],
    accent: "var(--color-flavour-classic)",
    badge: "Signature",
    ingredients: ["Sortex-cleaned flaxseeds (roasted)"],
    storage: "Store in a cool, dry place. Reseal after opening.",
    nutrition: baseNutrition,
    featured: true,
  },
  {
    id: "prod-himalayan-salt-pepper",
    slug: "himalayan-salt-pepper-flaxseed",
    name: "Flaxtore Himalayan Salt & Pepper",
    flavour: "Himalayan Salt & Pepper",
    flavourKey: "salt",
    shortDescription: "A savoury, cracked-pepper edge on our slow roast.",
    description:
      "The classic roast, finished with Himalayan pink salt and a crack of pepper for a savoury edge that's built for your desk drawer, your gym bag and everything between.",
    price: 369,
    compareAtPrice: 419,
    weight: "200g",
    images: [
      { src: "/images/products/himalayan-salt-pepper/hero.webp", alt: "Flaxtore Himalayan Salt & Pepper flaxseed pouch" },
      { src: "/images/products/himalayan-salt-pepper/detail.webp", alt: "Flaxtore Himalayan Salt & Pepper flaxseeds, close-up detail" },
      { src: "/images/products/himalayan-salt-pepper/lifestyle.webp", alt: "Flaxtore Himalayan Salt & Pepper in an everyday moment" },
      { src: "/images/packaging/himalayan-salt-pepper/front.png", alt: "Flaxtore Himalayan Salt & Pepper pouch, front of packaging" },
      { src: "/images/packaging/himalayan-salt-pepper/back.png", alt: "Flaxtore Himalayan Salt & Pepper pouch, back of packaging" },
    ],
    accent: "var(--color-flavour-salt)",
    ingredients: ["Sortex-cleaned flaxseeds (roasted)", "Himalayan pink salt", "Cracked black pepper"],
    storage: "Store in a cool, dry place. Reseal after opening.",
    nutrition: baseNutrition,
    featured: true,
  },
  {
    id: "prod-peri-peri",
    slug: "peri-peri-flaxseed",
    name: "Flaxtore Peri Peri",
    flavour: "Peri Peri",
    flavourKey: "peri",
    shortDescription: "A bold, tangy heat for the days that don't slow down.",
    description:
      "For when snack time needs an edge. A bold peri peri seasoning over our slow-roasted flaxseeds — tangy, warm, and gone before you know it.",
    price: 369,
    compareAtPrice: 419,
    weight: "200g",
    images: [
      { src: "/images/products/peri-peri/hero.webp", alt: "Flaxtore Peri Peri flaxseed pouch" },
      { src: "/images/products/peri-peri/detail.webp", alt: "Flaxtore Peri Peri flaxseeds, close-up detail" },
      { src: "/images/products/peri-peri/lifestyle.webp", alt: "Flaxtore Peri Peri in an everyday moment" },
      { src: "/images/packaging/peri-peri/front.png", alt: "Flaxtore Peri Peri pouch, front of packaging" },
      { src: "/images/packaging/peri-peri/back.png", alt: "Flaxtore Peri Peri pouch, back of packaging" },
    ],
    accent: "var(--color-flavour-peri)",
    badge: "Bold",
    ingredients: ["Sortex-cleaned flaxseeds (roasted)", "Peri peri seasoning"],
    storage: "Store in a cool, dry place. Reseal after opening.",
    nutrition: baseNutrition,
    featured: true,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(slug: string, limit = 2) {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}
