import type { NutritionData } from "@/types/nutrition";
import { cn } from "@/lib/utils/cn";

const rows: { key: keyof NutritionData; label: string; unit: string }[] = [
  { key: "energyKcal", label: "Energy", unit: "kcal" },
  { key: "proteinG", label: "Protein", unit: "g" },
  { key: "totalFatG", label: "Total Fat", unit: "g" },
  { key: "omega3AlaG", label: "— Omega-3 (ALA)", unit: "g" },
  { key: "carbohydratesG", label: "Carbohydrates", unit: "g" },
  { key: "dietaryFiberG", label: "Dietary Fibre", unit: "g" },
  { key: "totalSugarsG", label: "Total Sugars", unit: "g" },
];

export function NutritionPanel({
  nutrition,
  className,
  compact = false,
}: {
  nutrition: NutritionData;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("rounded-[var(--radius-lg)] border border-border bg-surface p-6", className)}>
      <div className="mb-4 flex items-baseline justify-between border-b border-border pb-4">
        <h3 className="font-display text-lg text-ink">Nutrition Facts</h3>
        <span className="text-xs text-ink-muted">
          Serving: {nutrition.servingSize} · {nutrition.servingsPerPack} per pack
        </span>
      </div>
      <dl className="flex flex-col divide-y divide-border">
        {rows.map((row) => (
          <div key={row.key} className="flex items-center justify-between py-2.5 text-sm">
            <dt className={cn("text-ink-muted", row.label.startsWith("—") && "pl-4 text-ink-faint")}>
              {row.label}
            </dt>
            <dd className="font-medium tabular-nums text-ink">
              {nutrition[row.key]}
              {row.unit}
            </dd>
          </div>
        ))}
      </dl>
      {!compact ? (
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          Reference values per {nutrition.servingSize} serving. Verify against
          final approved packaging before production use. Flaxtore is a food
          product, not a medicine, and is not intended to diagnose, treat,
          cure or prevent any disease.
        </p>
      ) : null}
    </div>
  );
}
