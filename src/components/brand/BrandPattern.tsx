import { cn } from "@/lib/utils/cn";

/**
 * A restrained repeating seed-mark texture for use as a section divider or
 * footer backdrop — never as a loud, all-over pattern.
 */
export function BrandPattern({ className, tone = "var(--color-brand-300)" }: { className?: string; tone?: string }) {
  return (
    <svg
      className={cn("absolute inset-0 h-full w-full", className)}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="flax-seed-pattern" width="64" height="64" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
          <path
            d="M8 0C10.5 5 16 10 16 17C16 22 12.4 26 8 26C3.6 26 0 22 0 17C0 10 5.5 5 8 0Z"
            fill={tone}
            opacity="0.12"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#flax-seed-pattern)" />
    </svg>
  );
}
