/**
 * Nutrition data type. Values are populated from reference/development data
 * supplied for build purposes only — see `src/data/nutrition.ts` for the
 * verification note. This must be checked against final approved packaging
 * before production use.
 */
export type NutritionData = {
  servingSize: string;
  servingsPerPack: number;
  energyKcal: number;
  proteinG: number;
  totalFatG: number;
  omega3AlaG: number;
  carbohydratesG: number;
  dietaryFiberG: number;
  totalSugarsG: number;
};
