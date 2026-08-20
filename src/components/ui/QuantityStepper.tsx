"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function QuantityStepper({
  quantity,
  onChange,
  className,
  size = "md",
}: {
  quantity: number;
  onChange: (next: number) => void;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-ink/15",
        size === "sm" ? "h-9" : "h-11",
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(0, quantity - 1))}
        className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:text-brand-700"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="w-6 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="flex h-full w-9 items-center justify-center text-ink transition-colors hover:text-brand-700"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
