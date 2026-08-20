import type { NutritionData } from "./nutrition";

export type ProductImage = {
  /** Path under /public, or a fully qualified URL once real photography lands. */
  src: string;
  alt: string;
  /** true while this is a placeholder composition rather than real photography. */
  isPlaceholder?: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  flavour: string;
  flavourKey: "classic" | "salt" | "peri";
  shortDescription: string;
  description: string;
  /** Price in INR (paise-free, whole rupees). Reference pricing — confirm before launch. */
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
};
