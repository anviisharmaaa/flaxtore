import type { CommerceClient } from "@/types/commerce";
import { products, getProductBySlug, getRelatedProducts } from "@/data/products";

/**
 * In-memory commerce client used during development and for the visual
 * frontend build. Mirrors the shape a real Storefront API client would
 * return so swapping in `ShopifyCommerceClient` later requires no UI
 * changes — only the data source behind this interface changes.
 */
export class MockCommerceClient implements CommerceClient {
  async getProducts() {
    return products;
  }

  async getProductBySlug(slug: string) {
    return getProductBySlug(slug);
  }

  async getFeaturedProducts() {
    return products.filter((p) => p.featured);
  }

  async getRelatedProducts(slug: string) {
    return getRelatedProducts(slug);
  }
}
