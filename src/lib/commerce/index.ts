import type { CommerceClient } from "@/types/commerce";
import { MockCommerceClient } from "./mock-client";
import { ShopifyCommerceClient } from "./shopify-client";

/**
 * Single factory the rest of the app imports from. Automatically uses the
 * Shopify-ready client once store credentials are present in the
 * environment; otherwise falls back to mock data so the site always runs.
 */
function createCommerceClient(): CommerceClient {
  const hasShopifyConfig =
    Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) &&
    Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN);

  return hasShopifyConfig ? new ShopifyCommerceClient() : new MockCommerceClient();
}

export const commerce = createCommerceClient();
export { MockCommerceClient } from "./mock-client";
export { ShopifyCommerceClient } from "./shopify-client";
