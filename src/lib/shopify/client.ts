/**
 * Low-level Shopify Storefront API GraphQL client. Server-only by
 * construction, not by package: every caller in this app is a Server
 * Component, a Server Action, or a route that itself only runs on the
 * server (sitemap, generateStaticParams). Nothing here is imported from
 * a "use client" file, so the Storefront token never reaches the
 * browser bundle. (The `server-only` npm package would enforce this at
 * build time, but per this integration's constraints no new dependency
 * is installed — the existing "use client"/Server Component boundary
 * already used throughout this codebase does the same job.)
 */

const DEFAULT_API_VERSION = "2026-04";

export class ShopifyConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyConfigError";
  }
}

/**
 * Thrown for both transport failures (network, non-2xx) and GraphQL-level
 * failures (the `errors` array, or a mutation's `userErrors`). Callers
 * catch this one type and decide how to degrade — never let the raw
 * GraphQL error shape reach a customer-facing page.
 */
export class ShopifyApiError extends Error {
  readonly cause?: unknown;
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "ShopifyApiError";
    this.cause = cause;
  }
}

export function isShopifyConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_STORE_DOMAIN) && Boolean(process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN);
}

function getConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  const version = process.env.SHOPIFY_API_VERSION || DEFAULT_API_VERSION;

  if (!domain || !token) {
    throw new ShopifyConfigError(
      "Shopify is not configured. Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN in your environment."
    );
  }

  return { domain, token, version };
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string; extensions?: Record<string, unknown> }[];
};

/**
 * Options mirror the subset of Next.js's extended `fetch` this app needs:
 * `revalidate` for ISR-cached catalogue reads, or `cache: "no-store"` for
 * cart mutations, which must never be cached.
 */
export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { revalidate?: number; cache?: RequestCache; tags?: string[] }
): Promise<T> {
  const { domain, token, version } = getConfig();
  const url = `https://${domain}/api/${version}/graphql.json`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Shopify's Storefront API has two distinct token types with two
        // distinct header names (see
        // https://shopify.dev/docs/api/storefront#authentication):
        //   - public access token  -> X-Shopify-Storefront-Access-Token
        //     (meant to be visible to buyers, e.g. embedded in a browser bundle)
        //   - private access token -> Shopify-Storefront-Private-Token
        //     (meant to stay secret, used only from a server)
        // Every call in this app runs server-side only (Server Components /
        // Server Actions — see the file header above), which is exactly the
        // "private" use case Shopify's own docs describe, so this client
        // sends the private header. If your Storefront token is a *public*
        // one instead (e.g. issued for a client-side/browser integration),
        // swap this back to "X-Shopify-Storefront-Access-Token" — sending a
        // token under the wrong header name is rejected with HTTP 401
        // before Shopify even evaluates the GraphQL query.
        "Shopify-Storefront-Private-Token": token,
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables }),
      ...(options?.cache ? { cache: options.cache } : {}),
      ...(options?.revalidate !== undefined || options?.tags
        ? { next: { revalidate: options.revalidate, tags: options.tags } }
        : {}),
    });
  } catch (err) {
    throw new ShopifyApiError("Network error contacting Shopify Storefront API.", err);
  }

  if (!response.ok) {
    const hint =
      response.status === 401
        ? " A 401 here almost always means the token/header pair is mismatched — confirm SHOPIFY_STOREFRONT_ACCESS_TOKEN is a Storefront API token (not an Admin API token) and that its type (public/private) matches the header this client sends (see the comment in shopifyFetch)."
        : "";
    throw new ShopifyApiError(`Shopify Storefront API request failed with status ${response.status}.${hint}`);
  }

  let json: GraphQLResponse<T>;
  try {
    json = (await response.json()) as GraphQLResponse<T>;
  } catch (err) {
    throw new ShopifyApiError("Shopify Storefront API returned a non-JSON response.", err);
  }

  if (json.errors?.length) {
    throw new ShopifyApiError(
      `Shopify Storefront API returned GraphQL errors: ${json.errors.map((e) => e.message).join("; ")}`,
      json.errors
    );
  }

  if (!json.data) {
    throw new ShopifyApiError("Shopify Storefront API returned no data.");
  }

  return json.data;
}

/**
 * Shared handling for mutation `userErrors` (Shopify's typed, expected
 * validation errors — e.g. an out-of-stock variant — as opposed to
 * transport/GraphQL failures already handled by `shopifyFetch`). Throws a
 * `ShopifyApiError` with the first user error's friendly message so
 * callers can surface it directly without ever touching raw GraphQL
 * shapes.
 */
export function assertNoUserErrors(
  userErrors: { field?: string[] | null; message: string }[] | null | undefined,
  context: string
) {
  if (userErrors && userErrors.length > 0) {
    throw new ShopifyApiError(`${context}: ${userErrors[0].message}`, userErrors);
  }
}
