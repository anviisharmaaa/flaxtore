"use client";

import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/commerce";
import type { Product } from "@/types/product";
import { track } from "@/lib/analytics";
import {
  getCartAction,
  addToCartAction,
  updateCartLineAction,
  removeCartLineAction,
} from "@/lib/shopify/cart-actions";

type CartContextValue = {
  lines: CartLine[];
  subtotal: number;
  itemCount: number;
  checkoutUrl?: string;
  isOpen: boolean;
  /** True while a cart mutation (add/update/remove) is in flight. */
  isPending: boolean;
  /** A customer-safe message from the most recent failed cart operation, if any. */
  error: string | null;
  clearError: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  /** Resolves to true on success, false if the add failed (see `error`). */
  addItem: (product: Product, quantity?: number) => Promise<boolean>;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Avoids a stale-closure race if a mutation resolves after a newer one
  // has already started — only the latest mutation's result is applied.
  const requestId = useRef(0);

  useEffect(() => {
    // One-time load of the Shopify-backed cart on mount, mirroring the
    // previous one-time localStorage hydration this replaced. Wrapped in
    // startTransition since this dispatches a Server Action from an
    // effect (see the Next.js Server Actions guide).
    startTransition(() => {
      getCartAction().then((result) => {
        if (result.cart) {
          setLines(result.cart.lines);
          setSubtotal(result.cart.subtotal);
          setCheckoutUrl(result.cart.checkoutUrl);
        }
        if (result.error) setError(result.error);
      });
    });
  }, []);

  function applyCart(cart: NonNullable<Awaited<ReturnType<typeof getCartAction>>["cart"]>) {
    setLines(cart.lines);
    setSubtotal(cart.subtotal);
    setCheckoutUrl(cart.checkoutUrl);
  }

  const addItem = useCallback(async (product: Product, quantity = 1) => {
    const id = ++requestId.current;
    setIsPending(true);
    setError(null);
    try {
      const result = await addToCartAction(product.variantId, quantity);
      if (id !== requestId.current) return Boolean(result.cart);
      if (result.cart) {
        applyCart(result.cart);
        track.addToCart(product.slug, product.flavour, quantity);
        setIsOpen(true);
        return true;
      }
      if (result.error) {
        setError(result.error);
        // Open the cart so the error banner (rendered in CartDrawer) is
        // actually visible — otherwise a failed add looks like nothing
        // happened at all, since the drawer only auto-opens on success.
        setIsOpen(true);
      }
      return false;
    } finally {
      if (id === requestId.current) setIsPending(false);
    }
  }, []);

  const removeItem = useCallback(
    (lineId: string) => {
      const line = lines.find((l) => l.id === lineId);
      const id = ++requestId.current;
      setIsPending(true);
      setError(null);
      removeCartLineAction(lineId)
        .then((result) => {
          if (id !== requestId.current) return;
          if (result.cart) {
            applyCart(result.cart);
            if (line) track.removeFromCart(line.slug, line.flavour);
          } else if (result.error) {
            setError(result.error);
          }
        })
        .finally(() => {
          if (id === requestId.current) setIsPending(false);
        });
    },
    [lines]
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    const id = ++requestId.current;
    setIsPending(true);
    setError(null);
    updateCartLineAction(lineId, quantity)
      .then((result) => {
        if (id !== requestId.current) return;
        if (result.cart) {
          applyCart(result.cart);
        } else if (result.error) {
          setError(result.error);
        }
      })
      .finally(() => {
        if (id === requestId.current) setIsPending(false);
      });
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);
  const clearError = useCallback(() => setError(null), []);

  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);

  const value: CartContextValue = {
    lines,
    subtotal,
    itemCount,
    checkoutUrl,
    isOpen,
    isPending,
    error,
    clearError,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    removeItem,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
