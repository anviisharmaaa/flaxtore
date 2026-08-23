// Standalone, dependency-free diagnostic for "getFeaturedProducts() /
// getProducts() returns 0 products" even though the Storefront API 401
// is fixed. Run this from your machine (it needs real internet access to
// your Shopify store, which the cloud sandbox / device bridge does not
// have):
//
//   node scripts/list-shopify-products.mjs
//
// Run it from the project root (so it finds .env.local next to it).
// It NEVER prints your access token — only the store domain, the query
// it sends, and the product handles/titles/availability Shopify's
// Storefront API actually returns for that domain+token.

import { readFileSync, existsSync } from "node:fs";

function loadEnvLocal() {
  const path = ".env.local";
  if (!existsSync(path)) {
    console.error(`No .env.local found at ${process.cwd()}/.env.local — run this from the project root.`);
    process.exit(1);
  }
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    out[key] = value;
  }
  return out;
}

const env = loadEnvLocal();
const domain = env.SHOPIFY_STORE_DOMAIN;
const token = env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const version = env.SHOPIFY_API_VERSION || "2026-04";

if (!domain || !token) {
  console.error("Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local — stopping.");
  process.exit(1);
}

const endpoint = `https://${domain}/api/${version}/graphql.json`;
console.log("--- Config (safe values only) ---");
console.log("SHOPIFY_STORE_DOMAIN:", domain);
console.log("SHOPIFY_API_VERSION:", version);
console.log("Endpoint:", endpoint);

// Same header this app's real client (src/lib/shopify/client.ts) sends —
// keep this in sync if that file's header choice ever changes.
const HEADER_NAME = "Shopify-Storefront-Private-Token";

const query = `
  query {
    products(first: 25) {
      edges {
        node {
          handle
          title
          availableForSale
          tags
          totalInventory
        }
      }
    }
    shop { name }
  }
`;

async function main() {
  console.log(`\n--- Querying products via header: ${HEADER_NAME} ---`);
  let res;
  try {
    res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        [HEADER_NAME]: token,
      },
      body: JSON.stringify({ query }),
    });
  } catch (err) {
    console.error("Network/fetch error:", err.message);
    process.exit(1);
  }

  console.log("HTTP status:", res.status);
  let json;
  try {
    json = await res.json();
  } catch (err) {
    console.error("Non-JSON response:", err.message);
    process.exit(1);
  }

  if (json.errors?.length) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
    process.exit(1);
  }

  const shopName = json.data?.shop?.name;
  const edges = json.data?.products?.edges ?? [];

  console.log("\n--- Result ---");
  console.log("Shop name (confirms token resolves to the right store):", shopName ?? "(none returned)");
  console.log("Product count returned by the Storefront API:", edges.length);

  if (edges.length === 0) {
    console.log(
      "\nZero products came back from Shopify's own Storefront API for this domain+token — this is NOT a\n" +
        "local-code mapping problem (there's nothing to map yet). The single most common cause: the products\n" +
        "exist in Shopify Admin but are not published to the sales channel/app this Storefront token belongs\n" +
        "to. Check, for EACH product in Shopify Admin:\n" +
        "  Admin → Products → (each product) → 'Sales channels and apps' section (right sidebar)\n" +
        "  → make sure the channel this Storefront token was generated for (e.g. 'Headless', or your custom\n" +
        "    app) is checked/published, not just 'Online Store'.\n" +
        "Also confirm each product's Status is 'Active', not 'Draft' or 'Archived' — draft/archived products\n" +
        "never appear in the Storefront API regardless of channel publication."
    );
  } else {
    console.log("\nHandle, Title, availableForSale, tags:");
    for (const { node } of edges) {
      console.log(`  - handle: "${node.handle}"  title: "${node.title}"  availableForSale: ${node.availableForSale}  tags: [${node.tags.join(", ")}]`);
    }
    console.log(
      "\nCompare each handle above against the `slug` values in src/data/products.ts — any handle listed here\n" +
        "that has no matching `slug` entry there is the mapping gap to fix."
    );
  }
}

main();
