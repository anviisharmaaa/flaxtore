"use client";

import { ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/lib/utils/currency";
import { track } from "@/lib/analytics";

export default function CartPage() {
  const { lines, subtotal, itemCount, checkoutUrl, error, removeItem, updateQuantity } = useCart();

  return (
    <div className="min-h-[60vh] pb-24 pt-32 md:pt-40">
      <Container>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] text-ink">Your Bag</h1>

        {error ? (
          <p
            role="alert"
            className="mt-6 rounded-[var(--radius-md)] bg-accent/10 px-3 py-2 text-xs text-accent-dark"
          >
            {error}
          </p>
        ) : null}

        {lines.length === 0 ? (
          <div className="mt-16 flex flex-col items-center gap-4 py-16 text-center">
            <ShoppingBag size={40} strokeWidth={1.25} className="text-ink-faint" />
            <p className="font-display text-2xl text-ink">Your bag is empty</p>
            <p className="text-ink-muted">Three flavours are waiting.</p>
            <Button href="/shop" className="mt-2">
              Shop Flavours
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
            <div className="divide-y divide-border border-t border-b border-border">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  onUpdateQuantity={(q) => updateQuantity(line.id, q)}
                  onRemove={() => removeItem(line.id)}
                />
              ))}
            </div>
            <div className="h-fit rounded-[var(--radius-lg)] border border-border bg-surface p-6">
              <h2 className="mb-4 font-display text-xl text-ink">Order Summary</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-2 text-xs text-ink-faint">Shipping and taxes calculated at checkout.</p>
              {checkoutUrl ? (
                <Button
                  size="lg"
                  className="mt-6 w-full"
                  href={checkoutUrl}
                  onClick={() => track.beginCheckout(subtotal, itemCount)}
                >
                  Checkout
                </Button>
              ) : (
                <Button size="lg" className="mt-6 w-full" disabled>
                  Checkout
                </Button>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
