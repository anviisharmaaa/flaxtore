import type { Cart, CartLine } from "@/types/commerce";
import type {
  ShopifyCart,
  CartCreateResult,
  CartQueryResult,
  CartLinesAddResult,
  CartLinesUpdateResult,
  CartLinesRemoveResult,
} from "./types";
import { shopifyFetch, assertNoUserErrors } from "./client";
import { CART_QUERY } from "./queries";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_LINES_REMOVE_MUTATION,
} from "./mutations";
import { getLocalContentBySlug } from "@/data/products";

/**
 * All cart operations below pass `cache: "no-store"` — cart reads and
 * mutations must never be cached (a stale cart is a customer-visible
 * bug: wrong subtotal, wrong line items, or a stale checkoutUrl).
 */
const NO_STORE = { cache: "no-store" as const };

function withBuyerIp(buyerIp?: string) {
  return buyerIp ? { ...NO_STORE, buyerIp } : NO_STORE;
}

function resolveLineWeightLabel(line: ShopifyCart["lines"]["edges"][number]["node"]): string {
  const weightOption = line.merchandise.selectedOptions.find((o) => /weight|size/i.test(o.name));
  if (weightOption?.value) return weightOption.value;
  if (line.merchandise.title && line.merchandise.title !== "Default Title") return line.merchandise.title;
  return "";
}

function mapShopifyLine(node: ShopifyCart["lines"]["edges"][number]["node"]): CartLine {
  const slug = node.merchandise.product.handle;
  const local = getLocalContentBySlug(slug);

  return {
    id: node.id,
    productId: node.merchandise.product.id,
    slug,
    name: node.merchandise.product.title,
    flavour: local?.flavour ?? node.merchandise.product.title,
    accent: local?.accent ?? "var(--color-flavour-classic)",
    image: node.merchandise.image?.url,
    price: Number(node.merchandise.price.amount),
    weight: resolveLineWeightLabel(node),
    quantity: node.quantity,
  };
}

/**
 * Shopify's Cart API returns `checkoutUrl` hosted on whatever domain is
 * set as this shop's connected/primary domain in Shopify Admin →
 * Settings → Domains — for this project, historically `flaxtore.com`.
 * That domain's DNS is now intentionally pointed at this Vercel
 * deployment instead of Shopify, so a raw `checkoutUrl` resolves to
 * `.../cart/c/<token>` on the Vercel app itself, which has no such
 * route and 404s. Shopify's checkout is reachable at the dedicated
 * `checkout.flaxtore.com` subdomain connected to this store instead.
 *
 * Every domain connected to a Shopify store routes to the same
 * checkout backend, so swapping just the *host* of Shopify's own
 * checkoutUrl — while leaving its path and query (including the `key=`
 * parameter some cart tokens carry) byte-for-byte as Shopify generated
 * them — is sufficient and doesn't require guessing or reconstructing
 * anything about the cart itself. Configured via `SHOPIFY_CHECKOUT_DOMAIN`
 * so nothing is hardcoded here; if that env var isn't set, `checkoutUrl`
 * passes through completely unchanged (today's behavior), so this is a
 * no-op until the var is added.
 */
function resolveCheckoutUrl(rawCheckoutUrl: string): string {
  const configured = process.env.SHOPIFY_CHECKOUT_DOMAIN;
  if (!configured) return rawCheckoutUrl;

  const checkoutDomain = configured.replace(/^https?:\/\//, "").replace(/\/+$/, "");

  try {
    const url = new URL(rawCheckoutUrl);
    url.host = checkoutDomain;
    return url.toString();
  } catch {
    // Malformed URL from Shopify (shouldn't happen) — fail safe by
    // passing through exactly what Shopify sent rather than throwing.
    return rawCheckoutUrl;
  }
}

export function mapShopifyCartToLocal(cart: ShopifyCart): Cart {
  return {
    id: cart.id,
    checkoutUrl: resolveCheckoutUrl(cart.checkoutUrl),
    subtotal: Number(cart.cost.subtotalAmount.amount),
    lines: cart.lines.edges.map(({ node }) => mapShopifyLine(node)),
  };
}

export async function shopifyCreateCart(
  lines?: { merchandiseId: string; quantity: number }[],
  buyerIp?: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResult>(CART_CREATE_MUTATION, { lines }, withBuyerIp(buyerIp));
  assertNoUserErrors(data.cartCreate.userErrors, "Could not create cart");
  if (!data.cartCreate.cart) {
    throw new Error("Shopify cartCreate returned no cart.");
  }
  return data.cartCreate.cart;
}

export async function shopifyGetCart(cartId: string, buyerIp?: string): Promise<ShopifyCart | null> {
  const data = await shopifyFetch<CartQueryResult>(CART_QUERY, { cartId }, withBuyerIp(buyerIp));
  return data.cart;
}

export async function shopifyAddCartLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[],
  buyerIp?: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesAddResult>(
    CART_LINES_ADD_MUTATION,
    { cartId, lines },
    withBuyerIp(buyerIp)
  );
  assertNoUserErrors(data.cartLinesAdd.userErrors, "Could not add item to cart");
  if (!data.cartLinesAdd.cart) {
    throw new Error("Shopify cartLinesAdd returned no cart.");
  }
  return data.cartLinesAdd.cart;
}

export async function shopifyUpdateCartLines(
  cartId: string,
  lines: { id: string; quantity: number }[],
  buyerIp?: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesUpdateResult>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines },
    withBuyerIp(buyerIp)
  );
  assertNoUserErrors(data.cartLinesUpdate.userErrors, "Could not update cart quantity");
  if (!data.cartLinesUpdate.cart) {
    throw new Error("Shopify cartLinesUpdate returned no cart.");
  }
  return data.cartLinesUpdate.cart;
}

export async function shopifyRemoveCartLines(
  cartId: string,
  lineIds: string[],
  buyerIp?: string
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesRemoveResult>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds },
    withBuyerIp(buyerIp)
  );
  assertNoUserErrors(data.cartLinesRemove.userErrors, "Could not remove item from cart");
  if (!data.cartLinesRemove.cart) {
    throw new Error("Shopify cartLinesRemove returned no cart.");
  }
  return data.cartLinesRemove.cart;
}
