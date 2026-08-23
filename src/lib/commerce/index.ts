import type { CommerceClient } from "@/types/commerce";
import { MockCommerceClient } from "./mock-client";
import { ShopifyCommerceClient } from "./shopify-client";

/**
 * Single factory the rest of the app imports from. Automatically uses the
 * Shopify-ready client once store credentials are present in the
 * environment; otherwise falls back to mock data so the site always runs.
 *
 * `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN` are
 * deliberately server-only (no `NEXT_PUBLIC_` prefix): every consumer of
 * `commerce` is a Server Component, Server Action, or another server-only
 * module (see `src/lib/shopify/`), so the Storefront token never needs to
 * reach the browser bundle.
 */
function createCommerceClient(): CommerceClient {
  const hasShopifyConfig =
    Boolean(process.env.SHOPIFY_STORE_DOMAIN) && Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);

  return hasShopifyConfig ? new ShopifyCommerceClient() : new MockCommerceClient();
}

export const commerce = createCommerceClient();
export { MockCommerceClient } from "./mock-client";
export { ShopifyCommerceClient } from "./shopify-client";
