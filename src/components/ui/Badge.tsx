import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function Badge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "accent" | "ivory" | "outline";
  className?: string;
}) {
  const tones = {
    brand: "bg-brand-700 text-ivory",
    accent: "bg-accent text-ivory",
    ivory: "bg-ivory text-brand-800",
    outline: "border border-ink/20 text-ink-muted",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
