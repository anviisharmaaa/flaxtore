import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = ComponentPropsWithoutRef<"input"> & { label?: string; id: string };

export function Input({ label, id, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <input
        id={id}
        className={cn(
          "h-12 rounded-[var(--radius-md)] border border-border bg-surface px-4 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-500 focus:outline-none",
          className
        )}
        {...props}
      />
    </div>
  );
}

type TextareaProps = ComponentPropsWithoutRef<"textarea"> & { label?: string; id: string };

export function Textarea({ label, id, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-ink-soft">
          {label}
        </label>
      ) : null}
      <textarea
        id={id}
        className={cn(
          "min-h-32 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-500 focus:outline-none",
          className
        )}
        {...props}
      />
    </div>
  );
}
