import type { CommerceClient } from "@/types/commerce";
import type { Product } from "@/types/product";

/**
 * Shopify Storefront-API-ready implementation. Intentionally stubbed —
 * wire this up once `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` and
 * `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN` are configured (see
 * `.env.example`). Only the public Storefront token is ever used here;
 * the Admin API and its credentials must never be called from the
 * client or committed to this repo.
 *
 * The GraphQL queries are intentionally left as TODOs rather than
 * fabricated — implement them against the real Storefront schema once
 * the store is provisioned.
 */
export class ShopifyCommerceClient implements CommerceClient {
  private readonly domain: string;
  private readonly token: string;

  constructor() {
    this.domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? "";
    this.token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";
  }

  private assertConfigured() {
    if (!this.domain || !this.token) {
      throw new Error(
        "ShopifyCommerceClient is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN, or use MockCommerceClient during development."
      );
    }
  }

  async getProducts(): Promise<Product[]> {
    this.assertConfigured();
    // TODO: query Storefront API `products` connection and map to `Product`.
    throw new Error("ShopifyCommerceClient.getProducts is not yet implemented.");
  }

  async getProductBySlug(): Promise<Product | undefined> {
    this.assertConfigured();
    // TODO: query Storefront API `productByHandle` and map to `Product`.
    throw new Error("ShopifyCommerceClient.getProductBySlug is not yet implemented.");
  }

  async getFeaturedProducts(): Promise<Product[]> {
    this.assertConfigured();
    // TODO: query a Storefront collection (e.g. `featured`) for products.
    throw new Error("ShopifyCommerceClient.getFeaturedProducts is not yet implemented.");
  }

  async getRelatedProducts(): Promise<Product[]> {
    this.assertConfigured();
    // TODO: derive related products from a Storefront collection or metafield.
    throw new Error("ShopifyCommerceClient.getRelatedProducts is not yet implemented.");
  }
}
