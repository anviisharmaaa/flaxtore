"use server";

import { cookies } from "next/headers";
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

function friendlyMessage(err: unknown): string {
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
    const shopifyCart = await shopifyGetCart(cartId);
    if (!shopifyCart) {
      // Expired/invalid cart on Shopify's side — clear it and start
      // fresh on the next add, rather than surfacing an error for what
      // is normal cart-lifetime behavior.
      await clearCartId();
      return {};
    }
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err) };
  }
}

export async function addToCartAction(variantId: string, quantity: number): Promise<CartActionResult> {
  if (!isShopifyConfigured()) return { error: friendlyMessage(new ShopifyConfigError("not configured")) };
  if (!variantId) return { error: "This flavour isn't available right now." };
  if (quantity <= 0) return { error: "Quantity must be at least 1." };

  try {
    const cartId = await readCartId();
    let shopifyCart;

    if (!cartId) {
      shopifyCart = await shopifyCreateCart([{ merchandiseId: variantId, quantity }]);
    } else {
      try {
        shopifyCart = await shopifyAddCartLines(cartId, [{ merchandiseId: variantId, quantity }]);
      } catch {
        // The stored cart id may have expired or been invalidated —
        // create a new cart rather than failing the add.
        shopifyCart = await shopifyCreateCart([{ merchandiseId: variantId, quantity }]);
      }
    }

    await writeCartId(shopifyCart.id);
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err) };
  }
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<CartActionResult> {
  if (!isShopifyConfigured()) return { error: friendlyMessage(new ShopifyConfigError("not configured")) };

  const cartId = await readCartId();
  if (!cartId) return { error: "Your cart has expired. Please add the item again." };

  try {
    const shopifyCart =
      quantity <= 0
        ? await shopifyRemoveCartLines(cartId, [lineId])
        : await shopifyUpdateCartLines(cartId, [{ id: lineId, quantity }]);
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err) };
  }
}

export async function removeCartLineAction(lineId: string): Promise<CartActionResult> {
  if (!isShopifyConfigured()) return { error: friendlyMessage(new ShopifyConfigError("not configured")) };

  const cartId = await readCartId();
  if (!cartId) return { error: "Your cart has expired." };

  try {
    const shopifyCart = await shopifyRemoveCartLines(cartId, [lineId]);
    return { cart: mapShopifyCartToLocal(shopifyCart) };
  } catch (err) {
    return { error: friendlyMessage(err) };
  }
}
