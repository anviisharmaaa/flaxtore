"use client";

import { useEffect, useState } from "react";
import { FlaxtoreLogo } from "@/components/brand/FlaxtoreLogo";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { CartButton } from "./CartButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

/**
 * Rendered inside a fixed wrapper (see SiteChrome) so it always overlays
 * the page. On `floating` pages (currently just the homepage) it starts
 * transparent over the hero and resolves to a solid, blurred bar once the
 * page scrolls — matching the brief's "begin over the hero, become sticky
 * after scrolling" direction. Everywhere else it's simply solid from the
 * start, so secondary pages never risk illegible nav-over-content.
 */
export function Header({ floating = false }: { floating?: boolean }) {
  const [scrolled, setScrolled] = useState(!floating);

  useEffect(() => {
    if (!floating) return;
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [floating]);

  const solid = !floating || scrolled;

  return (
    <header
      className={cn(
        "w-full transition-all duration-500",
        solid
          ? "bg-ivory/95 backdrop-blur-md shadow-[0_1px_0_var(--color-border)]"
          : "bg-transparent"
      )}
    >
      <Container className="flex h-18 items-center justify-between py-4 md:h-20">
        <FlaxtoreLogo tone={solid ? "ink" : "ivory"} />
        <DesktopNav tone={solid ? "ink" : "ivory"} />
        <div className="flex items-center gap-1.5 md:gap-3">
          <Button
            href="/shop"
            size="sm"
            variant={solid ? "primary" : "inverse"}
            className="hidden md:inline-flex"
          >
            Shop Now
          </Button>
          <CartButton tone={solid ? "ink" : "ivory"} />
          <MobileNav tone={solid ? "ink" : "ivory"} />
        </div>
      </Container>
    </header>
  );
}
