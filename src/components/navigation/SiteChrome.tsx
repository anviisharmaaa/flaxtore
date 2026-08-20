"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      {/*
        Announcement bar + header are pinned together as a single fixed
        stack (not `sticky`) so the header can genuinely sit *over* the
        homepage hero — a sticky element still occupies its own row in
        normal flow at scroll-top, which pushed the hero down behind a
        transparent bar and made ivory nav text land on the plain page
        background instead of the dark hero (illegible). Every page
        compensates with its own top padding sized to clear this stack.
      */}
      <div className="fixed inset-x-0 top-0 z-[var(--z-header)]">
        <AnnouncementBar />
        <Header floating={isHome} />
      </div>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
