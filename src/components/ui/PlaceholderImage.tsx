import { cn } from "@/lib/utils/cn";

/**
 * Elegant stand-in for missing photography. Deliberately looks like a
 * *placeholder* rather than a fabricated product photo — a soft brand-toned
 * field with the seed mark and a caption — so no one mistakes it for real
 * Flaxtore imagery. Swap the parent for a `next/image` once real assets
 * land under public/images/{products,packaging,lifestyle,ingredients}.
 */
export function PlaceholderImage({
  label,
  className,
  tone = "cream",
  accent,
}: {
  label?: string;
  className?: string;
  tone?: "cream" | "brand";
  /** Optional flavour/product accent color to tint the field, e.g. `var(--color-flavour-peri)`. */
  accent?: string;
}) {
  const isDark = tone === "brand";
  return (
    <div
      className={cn(
        "relative flex h-full w-full items-center justify-center overflow-hidden",
        isDark ? "bg-brand-800" : "bg-cream",
        className
      )}
      style={
        accent
          ? {
              background: isDark
                ? `linear-gradient(150deg, color-mix(in srgb, ${accent} 35%, var(--color-brand-900)), var(--color-brand-900))`
                : `linear-gradient(150deg, color-mix(in srgb, ${accent} 16%, var(--color-cream)), var(--color-cream))`,
            }
          : undefined
      }
    >
      <div
        className={cn(
          "absolute inset-0 opacity-[0.5]",
          isDark
            ? "bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.08),transparent_60%)]"
            : "bg-[radial-gradient(ellipse_at_70%_30%,rgba(63,82,51,0.10),transparent_60%)]"
        )}
      />
      <svg
        width="15%"
        viewBox="0 0 24 40"
        className={cn("relative", isDark ? "opacity-20" : "opacity-[0.14]")}
        aria-hidden
      >
        <path
          d="M12 0C16 8 24 16 24 26C24 33.7 18.6 40 12 40C5.4 40 0 33.7 0 26C0 16 8 8 12 0Z"
          fill={accent ?? (isDark ? "var(--color-ivory)" : "var(--color-brand-700)")}
        />
      </svg>
      {label ? (
        <span
          className={cn(
            "absolute bottom-4 left-4 right-4 text-[11px] font-medium uppercase tracking-[0.14em]",
            isDark ? "text-ivory/50" : "text-ink-faint"
          )}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
