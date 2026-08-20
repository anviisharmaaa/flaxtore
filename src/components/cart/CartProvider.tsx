"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/commerce";
import type { Product } from "@/types/product";
import { track } from "@/lib/analytics";

const STORAGE_KEY = "flaxtore.cart.v1";

type CartContextValue = {
  lines: CartLine[];
  subtotal: number;
  itemCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage on mount. This intentionally runs
    // once (empty deps below) to sync client-only storage into state — it
    // isn't a reactive effect responding to prop/state changes, so the
    // synchronous setState here doesn't cascade.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setLines(JSON.parse(raw));
    } catch {
      // ignore malformed/blocked storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // ignore storage failures (private mode, quota, etc.)
    }
  }, [lines, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === product.id);
      if (existing) {
        return prev.map((l) =>
          l.productId === product.id ? { ...l, quantity: l.quantity + quantity } : l
        );
      }
      const line: CartLine = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        flavour: product.flavour,
        accent: product.accent,
        image: product.images[0]?.src,
        price: product.price,
        weight: product.weight,
        quantity,
      };
      return [...prev, line];
    });
    track.addToCart(product.slug, product.flavour, quantity);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (lineId: string) => {
      const line = lines.find((l) => l.id === lineId);
      if (line) track.removeFromCart(line.slug, line.flavour);
      setLines((prev) => prev.filter((l) => l.id !== lineId));
    },
    [lines]
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.id !== lineId)
        : prev.map((l) => (l.id === lineId ? { ...l, quantity } : l))
    );
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    [lines]
  );
  const itemCount = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines]
  );

  const value: CartContextValue = {
    lines,
    subtotal,
    itemCount,
    isOpen,
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
