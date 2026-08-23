import type { Product } from "./product";

export type CartLine = {
  id: string;
  productId: string;
  slug: string;
  name: string;
  flavour: string;
  accent: string;
  /** Primary product image, if one was available when the line was added. */
  image?: string;
  price: number;
  weight: string;
  quantity: number;
};

export type Cart = {
  id: string;
  lines: CartLine[];
  subtotal: number;
  /**
   * Shopify's hosted checkout URL for this cart. Absent for an empty/
   * not-yet-created cart (no Shopify cart exists until the first item is
   * added). The existing Checkout CTA navigates here directly — Shopify
   * Checkout remains the only checkout implementation; nothing custom is
   * built in this app.
   */
  checkoutUrl?: string;
};

export type AddLineInput = {
  productId: string;
  quantity?: number;
};

/**
 * Abstraction over the commerce backend. The frontend is built against this
 * interface so the storytelling/UI layer never depends directly on Shopify.
 * `MockCommerceClient` powers local development; `ShopifyCommerceClient` is
 * the Storefront-API-ready implementation to wire up when credentials exist.
 */
export interface CommerceClient {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getFeaturedProducts(): Promise<Product[]>;
  getRelatedProducts(slug: string): Promise<Product[]>;
}
