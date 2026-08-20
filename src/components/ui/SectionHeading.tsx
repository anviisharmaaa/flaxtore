import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { TextReveal } from "@/components/motion/TextReveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "ink",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "ink" | "ivory";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.22em]",
            tone === "ivory" ? "text-brand-200" : "text-brand-500"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-display text-balance text-[clamp(2rem,4.4vw,3.5rem)]",
          tone === "ivory" ? "text-ivory" : "text-ink",
          titleClassName
        )}
      >
        <TextReveal text={title} as="span" />
      </h2>
      {description ? (
        <p
          className={cn(
            "max-w-xl text-pretty text-base md:text-lg leading-relaxed",
            tone === "ivory" ? "text-ivory/75" : "text-ink-muted",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
