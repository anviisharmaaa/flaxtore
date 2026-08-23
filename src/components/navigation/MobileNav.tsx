"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { primaryNav } from "@/config/site";
import { IconButton, Button } from "@/components/ui/Button";
import { FlaxtoreLogo } from "@/components/brand/FlaxtoreLogo";

const MOBILE_MENU_ID = "mobile-menu";

export function MobileNav({ tone = "ink" }: { tone?: "ink" | "ivory" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  /**
   * Rendered via a portal straight onto <body> rather than in place here.
   * `MobileNav` is mounted inside <Header>, and the solid header state
   * applies `backdrop-blur-md` — a CSS backdrop-filter, which (like
   * `transform`/`filter`/`will-change`) creates a new containing block for
   * `position: fixed` descendants. Left in place, this overlay's "fixed
   * inset-0" was being resolved against the header's own small box instead
   * of the viewport, collapsing it to header-height and letting the nav
   * links spill out over the page underneath instead of covering it. A
   * portal sidesteps that entirely: the overlay's fixed positioning is
   * resolved against the real viewport regardless of what any ancestor
   * (here or in the future) does with transforms/filters. `document` is
   * only ever touched client-side (the portal target is evaluated during
   * render, so this file stays "use client" and only mounts after
   * hydration, matching how the rest of the component already only reads
   * `document` inside effects/handlers).
   */
  const overlay = (
    <AnimatePresence>
      {open ? (
        <motion.div
          id={MOBILE_MENU_ID}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[var(--z-overlay)] flex flex-col overflow-y-auto bg-ivory md:hidden"
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <FlaxtoreLogo />
            <IconButton label="Close menu" onClick={() => setOpen(false)}>
              <X size={22} strokeWidth={1.75} />
            </IconButton>
          </div>
          <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-6 py-6">
            {primaryNav.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href as never}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-3xl font-display text-ink"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          <div className="flex shrink-0 flex-col gap-3 px-6 pb-10 pt-4">
            <Button href="/shop" size="lg" className="w-full" onClick={() => setOpen(false)}>
              Shop Now
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <IconButton
        label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls={MOBILE_MENU_ID}
        onClick={() => setOpen((v) => !v)}
        className={tone === "ivory" ? "text-ivory hover:bg-ivory/10 md:hidden" : "md:hidden"}
      >
        {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
      </IconButton>

      {typeof document !== "undefined" ? createPortal(overlay, document.body) : null}
    </>
  );
}
