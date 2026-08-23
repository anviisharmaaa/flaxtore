import type { CommerceClient } from "@/types/commerce";
import { mockProducts, getMockProductBySlug, getMockRelatedProducts } from "@/data/mock-products";

/**
 * In-memory commerce client used only when Shopify isn't configured
 * (see `src/lib/commerce/index.ts`) — local development / UI work
 * without live Shopify credentials. Mirrors the shape
 * `ShopifyCommerceClient` returns so no UI changes are needed when
 * Shopify is configured; only the data source behind this interface
 * changes.
 */
export class MockCommerceClient implements CommerceClient {
  async getProducts() {
    return mockProducts;
  }

  async getProductBySlug(slug: string) {
    return getMockProductBySlug(slug);
  }

  async getFeaturedProducts() {
    return mockProducts.filter((p) => p.featured);
  }

  async getRelatedProducts(slug: string) {
    return getMockRelatedProducts(slug);
  }
}
