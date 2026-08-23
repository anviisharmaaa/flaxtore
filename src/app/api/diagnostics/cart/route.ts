import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { isShopifyConfigured, shopifyFetch, ShopifyApiError, ShopifyConfigError } from "@/lib/shopify/client";
import { PRODUCTS_QUERY } from "@/lib/shopify/queries";
import { CART_CREATE_MUTATION } from "@/lib/shopify/mutations";
import { CART_QUERY } from "@/lib/shopify/queries";
import type {
  ShopifyProductsQueryResult,
  CartCreateResult,
  CartQueryResult,
} from "@/lib/shopify/types";

/**
 * PRODUCTION CART DIAGNOSTIC — temporary debugging tool, not a permanent
 * part of the app. Safe to hit directly in a browser or with curl against
 * the live Vercel deployment: it never returns the Shopify token, never
 * returns a complete cart id (only a short, non-reusable prefix), and
 * never touches the real `flaxtore_cart_id` cart cookie a shopper might
 * already have — it uses its own separate probe cookie instead.
 *
 * What it does, in order (matches the requested test plan exactly):
 *   1. products(first: 1) — confirms catalogue reads still work here.
 *   2. cartCreate with NO line items — creates an empty Shopify cart.
 *      No product/order/payment is ever created by this call.
 *   3. cart(id: ...) — re-reads the cart that was just created, proving
 *      the create -> read round trip works end-to-end.
 *   4. Confirms `checkoutUrl` is present on that cart.
 *   5. Does NOT place an order and does NOT enter payment information —
 *      nothing here reaches Shopify Checkout at all.
 *
 * It also reports cookie mechanics: whether a request to this route
 * carries the real cart cookie (presence only, never its value), and a
 * same-site round-trip check using its own short-lived probe cookie, set
 * with the exact same attributes `cart-actions.ts` uses for the real
 * cart cookie — if that probe cookie doesn't come back on a second call,
 * cookie writes aren't surviving in this environment.
 *
 * DELETE THIS FILE (or put it behind auth) once the cart issue is
 * resolved — it performs real (if trivial) Shopify mutations and is
 * unauthenticated by design so it's easy to hit while debugging.
 */

export const dynamic = "force-dynamic";

const PROBE_COOKIE = "flaxtore_diag_probe";

function redactCartId(id: string): string {
  // Shopify cart ids can carry a trailing `?key=...` — never logged or
  // returned in full. Just enough of the prefix to eyeball "yes, a real
  // gid://shopify/Cart/... id came back" without exposing the id itself.
  return id.length > 18 ? `${id.slice(0, 18)}…(${id.length} chars total)` : `(${id.length} chars total)`;
}

export async function GET() {
  const startedAt = Date.now();
  const result: Record<string, unknown> = {};

  // --- A. Config presence (never the token itself) ---
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION;
  result.config = {
    shopifyConfigured: isShopifyConfigured(),
    domain: domain ?? null,
    apiVersionEnvSet: Boolean(version),
    apiVersionUsed: version || "2026-04 (default)",
    tokenPresent: Boolean(token),
    tokenLength: token ? token.length : 0,
    // Purely informational, never proves validity — just flags an
    // accidental NEXT_PUBLIC_ leak of the private token, which would be
    // a real security bug distinct from the cart issue being diagnosed.
    accidentalPublicTokenEnvVarSet: Boolean(process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN),
  };

  if (!isShopifyConfigured()) {
    result.stoppedAfter = "config check";
    return NextResponse.json(result, { status: 200 });
  }

  // --- Buyer IP this request would use for a real mutation ---
  const hdrs = await headers();
  const vercelForwarded = hdrs.get("x-vercel-forwarded-for");
  const forwarded = hdrs.get("x-forwarded-for");
  result.buyerIpHeaderSeen = Boolean(vercelForwarded || forwarded);

  // --- Real cart cookie: presence only, never the value ---
  const cookieStore = await cookies();
  result.realCartCookiePresent = Boolean(cookieStore.get("flaxtore_cart_id")?.value);

  // --- Cookie round-trip probe ---
  const probeSeenOnThisRequest = Boolean(cookieStore.get(PROBE_COOKIE)?.value);
  result.cookieRoundTripConfirmedFromPreviousCall = probeSeenOnThisRequest;

  // --- 1. products(first: 1) ---
  try {
    const data = await shopifyFetch<ShopifyProductsQueryResult>(
      PRODUCTS_QUERY,
      { first: 1 },
      { cache: "no-store" }
    );
    const edges = data.products.edges;
    result.productsQuery = {
      ok: true,
      count: edges.length,
      firstHandle: edges[0]?.node.handle ?? null,
    };
  } catch (err) {
    result.productsQuery = { ok: false, error: describeError(err) };
    result.stoppedAfter = "products query";
    return finish(result, startedAt);
  }

  // --- 2. cartCreate (empty — no line items, nothing purchasable) ---
  let cartId: string | undefined;
  try {
    const buyerIp = vercelForwarded?.split(",")[0]?.trim() || forwarded?.split(",")[0]?.trim();
    const data = await shopifyFetch<CartCreateResult>(
      CART_CREATE_MUTATION,
      { lines: undefined },
      { cache: "no-store", buyerIp }
    );
    const userErrors = data.cartCreate.userErrors;
    cartId = data.cartCreate.cart?.id;
    result.cartCreate = {
      ok: userErrors.length === 0 && Boolean(cartId),
      userErrors: userErrors.length > 0 ? userErrors.map((e) => e.message) : undefined,
      cartIdRedacted: cartId ? redactCartId(cartId) : null,
      checkoutUrlPresent: Boolean(data.cartCreate.cart?.checkoutUrl),
    };
  } catch (err) {
    result.cartCreate = { ok: false, error: describeError(err) };
    result.stoppedAfter = "cartCreate";
    return finish(result, startedAt);
  }

  // --- 3. cart(id: ...) round-trip read ---
  if (cartId) {
    try {
      const data = await shopifyFetch<CartQueryResult>(CART_QUERY, { cartId }, { cache: "no-store" });
      result.cartReadBack = {
        ok: Boolean(data.cart),
        cartIdMatches: data.cart?.id === cartId,
        // --- 4. checkoutUrl confirmation ---
        checkoutUrlPresent: Boolean(data.cart?.checkoutUrl),
      };
    } catch (err) {
      result.cartReadBack = { ok: false, error: describeError(err) };
    }
  }

  const response = NextResponse.json(finishBody(result, startedAt), { status: 200 });
  // Round-trip probe for the *next* call — same attributes the real cart
  // cookie uses (see cart-actions.ts), short-lived since it's only a
  // mechanics check, not real cart state.
  response.cookies.set(PROBE_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 300,
  });
  return response;
}

function describeError(err: unknown): string {
  if (err instanceof ShopifyConfigError) return `ShopifyConfigError: ${err.message}`;
  if (err instanceof ShopifyApiError) return `ShopifyApiError: ${err.message}`;
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return "Unknown error (non-Error value thrown)";
}

function finishBody(result: Record<string, unknown>, startedAt: number) {
  return { ...result, durationMs: Date.now() - startedAt };
}

function finish(result: Record<string, unknown>, startedAt: number) {
  return NextResponse.json(finishBody(result, startedAt), { status: 200 });
}
