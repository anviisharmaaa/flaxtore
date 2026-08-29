import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { commerce } from "@/lib/commerce";
import { getShopifyJournalPosts } from "@/lib/shopify/journal";

/**
 * Reads the product list through the same `commerce` abstraction as every
 * other page (see src/app/page.tsx, shop/page.tsx, products/[slug]/page.tsx)
 * rather than importing src/data/products.ts directly — so once
 * ShopifyCommerceClient is live, the sitemap reflects the real catalogue
 * without a separate code path to remember to update. Journal routes are
 * read the same way, through src/lib/shopify/journal.ts, so a newly
 * published Shopify article is picked up automatically too — never from
 * Shopify's own hosted article URL, only this app's own /journal/[slug].
 *
 * This stays a plain (non-revalidating) static route: sitemap freshness is
 * an SEO concern, not a user-facing price/availability concern, so there's
 * no need to pay for background revalidation here the way the product
 * pages do (see the `revalidate` exports on page.tsx/shop/page.tsx/
 * products/[slug]/page.tsx) — a new product or article simply appears in
 * the sitemap on the next deploy, which is an acceptable tradeoff for
 * this route.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const [products, journalPosts] = await Promise.all([commerce.getProducts(), getShopifyJournalPosts()]);

  const staticRoutes = [
    "",
    "/shop",
    "/about",
    "/why-flax",
    "/nutrition",
    "/journal",
    "/faq",
    "/contact",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const journalRoutes = journalPosts.map((p) => ({
    url: `${base}/journal/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...productRoutes, ...journalRoutes];
}
