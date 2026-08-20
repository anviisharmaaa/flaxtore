"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "./CartProvider";
import { CartLineItem } from "./CartLineItem";
import { Button, IconButton } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/currency";
import { track } from "@/lib/analytics";

export function CartDrawer() {
  const { lines, subtotal, itemCount, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            aria-label="Close cart"
            onClick={closeCart}
            className="fixed inset-0 z-[var(--z-overlay)] bg-ink/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 z-[var(--z-drawer)] flex h-dvh w-full flex-col bg-ivory shadow-[var(--shadow-lg)] sm:w-[420px]"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-display text-xl text-ink">Your Bag ({itemCount})</h2>
              <IconButton label="Close cart" onClick={closeCart}>
                <X size={20} />
              </IconButton>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={36} strokeWidth={1.25} className="text-ink-faint" />
                <div>
                  <p className="font-display text-xl text-ink">Your bag is empty</p>
                  <p className="mt-1 text-sm text-ink-muted">
                    Three flavours are waiting. Let&rsquo;s fix that.
                  </p>
                </div>
                <Button href="/shop" onClick={closeCart} className="mt-2">
                  Shop Flavours
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 divide-y divide-border">
                  {lines.map((line) => (
                    <CartLineItem
                      key={line.id}
                      line={line}
                      onUpdateQuantity={(q) => updateQuantity(line.id, q)}
                      onRemove={() => removeItem(line.id)}
                    />
                  ))}
                </div>
                <div className="border-t border-border px-6 py-6">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Subtotal</span>
                    <span className="text-base font-semibold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-ink-faint">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={() => track.beginCheckout(subtotal, itemCount)}
                  >
                    Checkout
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
