import Link from "next/link";
import { primaryNav } from "@/config/site";
import { cn } from "@/lib/utils/cn";

export function DesktopNav({ tone = "ink" }: { tone?: "ink" | "ivory" }) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
      {primaryNav.map((link) => (
        <Link
          key={link.href}
          href={link.href as never}
          className={cn(
            "relative text-sm font-medium tracking-wide transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full",
            tone === "ivory" ? "text-ivory/90 hover:text-ivory" : "text-ink-soft hover:text-ink"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
