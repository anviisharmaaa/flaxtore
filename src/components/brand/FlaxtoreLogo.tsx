import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { cn } from "@/lib/utils/cn";

/**
 * Primary lockup: supplied mark + typeset wordmark in the display serif.
 * The mark is the single source of visual truth (never redrawn); the
 * wordmark simply sits beside it in the brand's own typography.
 */
export function FlaxtoreLogo({
  className,
  markOnly = false,
  tone = "ink",
  href = "/",
}: {
  className?: string;
  markOnly?: boolean;
  tone?: "ink" | "ivory";
  href?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Flaxtore home"
    >
      <BrandMark size={30} className="transition-transform duration-300 group-hover:-rotate-6" />
      {!markOnly ? (
        <span
          className={cn(
            "text-display text-[1.5rem] leading-none tracking-[-0.01em]",
            tone === "ivory" ? "text-ivory" : "text-ink"
          )}
        >
          Flaxtore
        </span>
      ) : null}
    </Link>
  );
}
