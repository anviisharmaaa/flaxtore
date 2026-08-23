"use server";

import { cookies, headers } from "next/headers";
import type { Cart } from "@/types/commerce";
import { isShopifyConfigured, ShopifyApiError, ShopifyConfigError } from "./client";
import {
  shopifyCreateCart,
  shopifyGetCart,
  shopifyAddCartLines,
  shopifyUpdateCartLines,
  shopifyRemoveCartLines,
  mapShopifyCartToLocal,
} from "./cart";

/**
 * Server Actions the client-side `CartProvider` calls for every cart
 * mutation (see `src/components/cart/CartProvider.tsx`). The Shopify
 * cart is authoritative: every action re-fetches/re-derives the full
 * cart from Shopify's response and returns it whole — the caller never
 * merges partial updates into its own guess of cart state.
 *
 * The cart's identity (its Shopify cart id) lives in an httpOnly cookie,
 * never in client-readable storage or state, and is always stored/read
 * verbatim — never parsed, trimmed, or re-encoded — so nothing Shopify
 * appends to the id is ever stripped.
 */

const CART_COOKIE = "flaxtore_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type CartActionResult = {
  /** Present whenever the mutation succeeded — the full, fresh cart. */
  cart?: Cart;
  /**
   * A customer-safe message, present on failure. Callers should keep
   * showing the previous cart state (if any) and surface this message
   * rather than clearing the cart on a transient error.
   */
  error?: string;
};

async function readCartId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value || undefined;
}

/**
 * The real buyer IP for this request, to pass to Shopify as
 * `Shopify-Storefront-Buyer-IP` (see client.ts) so checkout risk/fraud
 * analysis has accurate attribution — Shopify's own recommendation for
 * private/server-side Storefront requests that come from real buyer
 * traffic (cart mutations, checkout URL retrieval).
 *
 * Deliberately NOT read from a client-supplied form field or body value
 * (there is none — nothing in this app lets a caller specify their own
 * "IP") — this only reads request headers Vercel's own edge network sets
 * on the way in. `x-vercel-forwarded-for` is Vercel-specific and reflects
 * exactly what Vercel's edge observed, so it's preferred when present;
 * `x-forwarded-for`'s first entry is the standard fallback (used in local
 * dev, and any other host). Never trusted for authorization — only ever
 * forwarded to Shopify as an informational attribute.
 */
async function getBuyerIp(): Promise<string | undefined> {
  const store = await headers();
  const vercelForwarded = store.get("x-vercel-forwarded-for");
  if (vercelForwarded) return vercelForwarded.split(",")[0]?.trim() || undefined;
  const forwarded = store.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || undefined;
  return undefined;
}

async function writeCartId(cartId: string) {
  const store = await cookies();
  store.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}

async function clearCartId() {
  const store = await cookies();
  store.delete(CART_COOKIE);
}

/**
 * Converts any error into a customer-safe message — but first logs the
 * real error server-side (message + name only, never request/response
 * bodies, headers, or the Shopify token) so it's visible in Vercel
 * Runtime Logs. Before this, every catch block below discarded the
 * actual error entirely: a production failure surfaced to the customer
 * as a generic message with nothing in the logs to diagnose it. `label`
 * identifies which action failed, since all four share this helper.
 */
function friendlyMessage(err: unknown, label: string): string {
  console.error(`[cart] ${label} failed:`, err instanceof Error ? `${err.name}: ${err.message}` : err);
  if (err instanceof ShopifyConfigError) {
    return "The shop is still being set up — cart isn't available yet.";
  }
  if (err instanceof ShopifyApiError) {
    return "We couldn't reach the shop just now. Please try again in a moment.";
  }
  return "Something went wrong with your cart. Please try again.";
}

export async function getCartAction(): Promise<CartActionResult> {
  if (!isShopifyConfigured()) return {};

  const cartId = await readCartId();
  if (!cartId) return {};

  try {
    const shopifyCart = await shopifyGetCart(cartId, await getBuyerIp());
    if (!shopifyCart) {
      // Expired/invalid cart on Shopify's side — clear it and start
      // fresh on the next add, rather than surfacing an error for what
      // is normal cart-lifetime behavior.
      await clearCartId();
      return {};
    }
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err, "getCartAction") };
  }
}

export async function addToCartAction(variantId: string, quantity: number): Promise<CartActionResult> {
  if (!isShopifyConfigured())
    return { error: friendlyMessage(new ShopifyConfigError("not configured"), "addToCartAction") };
  if (!variantId) return { error: "This flavour isn't available right now." };
  if (quantity <= 0) return { error: "Quantity must be at least 1." };

  try {
    const cartId = await readCartId();
    const buyerIp = await getBuyerIp();
    let shopifyCart;

    if (!cartId) {
      shopifyCart = await shopifyCreateCart([{ merchandiseId: variantId, quantity }], buyerIp);
    } else {
      try {
        shopifyCart = await shopifyAddCartLines(cartId, [{ merchandiseId: variantId, quantity }], buyerIp);
      } catch {
        // The stored cart id may have expired or been invalidated —
        // create a new cart rather than failing the add.
        shopifyCart = await shopifyCreateCart([{ merchandiseId: variantId, quantity }], buyerIp);
      }
    }

    await writeCartId(shopifyCart.id);
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err, "addToCartAction") };
  }
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<CartActionResult> {
  if (!isShopifyConfigured())
    return { error: friendlyMessage(new ShopifyConfigError("not configured"), "updateCartLineAction") };

  const cartId = await readCartId();
  if (!cartId) return { error: "Your cart has expired. Please add the item again." };

  try {
    const buyerIp = await getBuyerIp();
    const shopifyCart =
      quantity <= 0
        ? await shopifyRemoveCartLines(cartId, [lineId], buyerIp)
        : await shopifyUpdateCartLines(cartId, [{ id: lineId, quantity }], buyerIp);
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err, "updateCartLineAction") };
  }
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  if (!isShopifyConfigured())
    return { error: friendlyMessage(new ShopifyConfigError("not configured"), "removeCartLineAction") };

  const cartId = await readCartId();
  if (!cartId) return { error: "Your cart has expired." };

  try {
    const shopifyCart = await shopifyRemoveCartLines(cartId, [lineId], await getBuyerIp());
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err, "removeCartLineAction") };
  }
}
