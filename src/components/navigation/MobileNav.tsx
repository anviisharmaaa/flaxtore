"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { primaryNav } from "@/config/site";
import { IconButton, Button } from "@/components/ui/Button";
import { FlaxtoreLogo } from "@/components/brand/FlaxtoreLogo";

export function MobileNav({ tone = "ink" }: { tone?: "ink" | "ivory" }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <IconButton
        label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className={tone === "ivory" ? "text-ivory hover:bg-ivory/10 md:hidden" : "md:hidden"}
      >
        {open ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
      </IconButton>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[var(--z-overlay)] flex flex-col bg-ivory md:hidden"
          >
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
              <FlaxtoreLogo />
              <IconButton label="Close menu" onClick={() => setOpen(false)}>
                <X size={22} strokeWidth={1.75} />
              </IconButton>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center gap-2 px-6">
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
            <div className="flex flex-col gap-3 px-6 pb-10 pt-4">
              <Button href="/shop" size="lg" className="w-full" onClick={() => setOpen(false)}>
                Shop Now
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
