import type { NutritionData } from "@/types/nutrition";

/**
 * VERIFY BEFORE PUBLISHING
 * ------------------------------------------------------------------
 * This is reference/development nutrition data provided for build
 * purposes only. It is centralized here so it can be swapped for the
 * final, lab-verified values from approved packaging in one place —
 * every panel on the site reads from this file (or a per-flavour
 * override below), nothing is hardcoded into components.
 */
export const baseNutrition: NutritionData = {
  servingSize: "20g",
  servingsPerPack: 10,
  energyKcal: 110,
  proteinG: 3.8,
  totalFatG: 8.0,
  omega3AlaG: 4.2,
  carbohydratesG: 4.6,
  dietaryFiberG: 5.3,
  totalSugarsG: 0.2,
};

export const nutritionHighlights = [
  {
    label: "Omega-3 (ALA)",
    value: `${baseNutrition.omega3AlaG}g`,
    note: "per 20g serving",
    image: "/images/nutrition/omega-3.webp",
  },
  {
    label: "Dietary Fibre",
    value: `${baseNutrition.dietaryFiberG}g`,
    note: "per 20g serving",
    image: "/images/nutrition/fiber.webp",
  },
  {
    label: "Protein",
    value: `${baseNutrition.proteinG}g`,
    note: "per 20g serving",
    image: "/images/nutrition/protein.webp",
  },
  {
    label: "Energy",
    value: `${baseNutrition.energyKcal} kcal`,
    note: "per 20g serving",
  },
] as const;
