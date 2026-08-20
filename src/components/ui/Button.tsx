import Link from "next/link";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import type { Route } from "next";
import { cn } from "@/lib/utils/cn";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-sans font-semibold tracking-wide transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

const variants = {
  primary:
    "bg-brand-700 text-ivory hover:bg-brand-800 active:bg-brand-900 shadow-[var(--shadow-brand)]",
  secondary:
    "bg-transparent text-ink border border-ink/25 hover:border-ink hover:bg-ink/5",
  inverse:
    "bg-ivory text-brand-800 hover:bg-cream",
  ghost:
    "bg-transparent text-brand-700 hover:text-brand-900 underline underline-offset-4 decoration-1 rounded-none px-0",
  accent:
    "bg-accent text-ivory hover:bg-accent-dark",
} as const;

const sizes = {
  sm: "text-xs px-4 py-2.5 min-h-[40px]",
  md: "text-sm px-6 py-3.5 min-h-[48px]",
  lg: "text-sm md:text-base px-8 py-4 min-h-[52px]",
} as const;

type ButtonOwnProps = {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = ButtonOwnProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof ButtonOwnProps> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonOwnProps & {
  href: Route | string;
} & Omit<ComponentPropsWithoutRef<typeof Link>, keyof ButtonOwnProps | "href">;

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(base, variants[variant], variant !== "ghost" && sizes[size], className);

  if ("href" in props && props.href) {
    const { href, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href as Route} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}

export function IconButton({
  as: Component = "button",
  className,
  children,
  label,
  ...props
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  label: string;
} & ComponentPropsWithoutRef<"button">) {
  return (
    <Component
      aria-label={label}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors duration-[var(--duration-fast)] hover:bg-ink/5 focus-visible:outline-2",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
