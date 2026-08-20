import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/**
 * The Flaxtore icon mark on its own — the supplied logo artwork, cropped to
 * its bounding box. Used where the full lockup won't fit (favicon-scale UI,
 * loading state, mobile nav collapse, seed motif anchor).
 */
export function BrandMark({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/images/brand/mark-square.png"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      priority
    />
  );
}
