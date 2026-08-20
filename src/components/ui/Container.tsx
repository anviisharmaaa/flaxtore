import type { ReactNode, ElementType } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
  as: Component = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Component className={cn("container-flax", className)}>{children}</Component>;
}
