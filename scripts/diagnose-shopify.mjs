// Standalone, dependency-free diagnostic for the Shopify Storefront API
// 401 issue. Run this from your machine (it needs real internet access to
// your Shopify store, which this cloud sandbox does not have):
//
//   node scripts/diagnose-shopify.mjs
//
// Run it from the project root (so it finds .env.local next to it).
// It NEVER prints your access token — only whether it exists, its length,
// the endpoint it's calling, and the HTTP status Shopify returns for each
// of the two possible auth header names.

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

console.log("--- Config (safe values only) ---");
console.log("SHOPIFY_STORE_DOMAIN:", domain || "(not set)");
console.log("SHOPIFY_API_VERSION:", version);
console.log("SHOPIFY_STOREFRONT_ACCESS_TOKEN present:", Boolean(token));
console.log("SHOPIFY_STOREFRONT_ACCESS_TOKEN length:", token ? token.length : 0);

if (!domain || !token) {
  console.error("\nMissing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local — stopping.");
  process.exit(1);
}

// Flags a common copy-paste mistake: including the protocol or a trailing
// slash in SHOPIFY_STORE_DOMAIN, which would malform the endpoint URL.
if (/^https?:\/\//.test(domain) || domain.endsWith("/")) {
  console.warn(
    "\nWARNING: SHOPIFY_STORE_DOMAIN looks malformed (has a protocol and/or trailing slash). It should look like: your-store.myshopify.com"
  );
}

const endpoint = `https://${domain}/api/${version}/graphql.json`;
console.log("\n--- Endpoint ---");
console.log(endpoint);

const query = "{ shop { name } }";

async function tryAuth(headerName) {
  console.log(`\n--- Trying header: ${headerName} ---`);
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        [headerName]: token,
      },
      body: JSON.stringify({ query }),
    });
    const status = res.status;
    let bodyText = await res.text();
    if (bodyText.length > 400) bodyText = bodyText.slice(0, 400) + "…";
    console.log("HTTP status:", status);
    console.log("Response body (safe — never contains your token):", bodyText);
    return status;
  } catch (err) {
    console.log("Network/fetch error:", err.message);
    return null;
  }
}

const privateStatus = await tryAuth("Shopify-Storefront-Private-Token");
const publicStatus = await tryAuth("X-Shopify-Storefront-Access-Token");

console.log("\n--- Conclusion ---");
if (privateStatus === 200 && publicStatus !== 200) {
  console.log("Your token is a PRIVATE Storefront access token. Use the 'Shopify-Storefront-Private-Token' header (this is what src/lib/shopify/client.ts now sends).");
} else if (publicStatus === 200 && privateStatus !== 200) {
  console.log("Your token is a PUBLIC Storefront access token. Change src/lib/shopify/client.ts back to send it via the 'X-Shopify-Storefront-Access-Token' header.");
} else if (privateStatus === 200 && publicStatus === 200) {
  console.log("Both headers returned 200 — unusual, but the app will work either way. No action needed.");
} else {
  console.log(
    "Neither header worked. This points to something other than a header mismatch: the token itself may be invalid/revoked, the domain may be wrong, or the token may lack Storefront API product-read permission. Re-check the token value and the store domain, and confirm the Headless channel (or custom app) that issued the token is still installed/active on this store."
  );
}
