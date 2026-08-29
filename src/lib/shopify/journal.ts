import { shopifyFetch, isShopifyConfigured } from "./client";
import { BLOG_ARTICLES_QUERY, ARTICLE_BY_HANDLE_QUERY, FIRST_BLOG_HANDLE_QUERY } from "./queries";
import type {
  ShopifyArticle,
  ShopifyBlogArticlesQueryResult,
  ShopifyArticleByHandleQueryResult,
  ShopifyFirstBlogQueryResult,
} from "./types";

/**
 * Journal reads use their own revalidation window, kept the same as the
 * catalogue's (see PRODUCTS_REVALIDATE_SECONDS in products.ts) so a
 * newly published Shopify article surfaces within about a minute,
 * without requiring a redeploy.
 */
const JOURNAL_REVALIDATE_SECONDS = 60;
const ARTICLES_PER_PAGE = 50;

/**
 * The Shopify Blog whose articles power /journal. Configurable via
 * SHOPIFY_BLOG_HANDLE for stores that name their blog something other
 * than "journal" (this store's blog is literally named/handled
 * "journal", so this is a working default, not a placeholder).
 */
const DEFAULT_BLOG_HANDLE = "journal";
const WORDS_PER_MINUTE = 200;

/**
 * UI-facing shape /journal and /journal/[slug] render. Deliberately
 * mirrors the fields the previous local `JournalPost` (src/data/journal.ts,
 * now retired — see _to_delete/) exposed, plus the extra fields Shopify
 * actually gives us (image, author, publishedAt, SEO) — so the page
 * components changed only where Shopify genuinely has more to offer.
 */
export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  readTime: string;
  author?: string;
  publishedAt?: string;
  image?: string;
  imageAlt?: string;
  seoTitle?: string;
  seoDescription?: string;
};

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateReadTime(contentHtml: string): string {
  const wordCount = stripHtml(contentHtml).split(" ").filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

function mapShopifyArticleToLocal(article: ShopifyArticle): JournalPost {
  const excerpt = article.excerpt ? stripHtml(article.excerpt) : stripHtml(article.contentHtml).slice(0, 200);

  return {
    slug: article.handle,
    title: article.title,
    excerpt,
    contentHtml: article.contentHtml,
    readTime: estimateReadTime(article.contentHtml),
    author: article.authorV2?.name,
    publishedAt: article.publishedAt,
    image: article.image?.url,
    imageAlt: article.image?.altText ?? article.title,
    seoTitle: article.seo?.title ?? undefined,
    seoDescription: article.seo?.description ?? undefined,
  };
}

function configuredBlogHandle(): string {
  return process.env.SHOPIFY_BLOG_HANDLE || DEFAULT_BLOG_HANDLE;
}

/**
 * Last-resort fallback so this works out of the box even if a store's
 * blog isn't named "journal" and SHOPIFY_BLOG_HANDLE hasn't been set.
 */
async function firstBlogHandle(): Promise<string | undefined> {
  const data = await shopifyFetch<ShopifyFirstBlogQueryResult>(FIRST_BLOG_HANDLE_QUERY, undefined, {
    revalidate: JOURNAL_REVALIDATE_SECONDS,
    tags: ["shopify-journal"],
  });
  return data.blogs.edges[0]?.node.handle;
}

export async function getShopifyJournalPosts(): Promise<JournalPost[]> {
  if (!isShopifyConfigured()) return [];

  const handle = configuredBlogHandle();
  let data = await shopifyFetch<ShopifyBlogArticlesQueryResult>(
    BLOG_ARTICLES_QUERY,
    { blogHandle: handle, first: ARTICLES_PER_PAGE },
    { revalidate: JOURNAL_REVALIDATE_SECONDS, tags: ["shopify-journal"] }
  );

  if (!data.blog) {
    const fallback = await firstBlogHandle();
    if (!fallback || fallback === handle) return [];
    data = await shopifyFetch<ShopifyBlogArticlesQueryResult>(
      BLOG_ARTICLES_QUERY,
      { blogHandle: fallback, first: ARTICLES_PER_PAGE },
      { revalidate: JOURNAL_REVALIDATE_SECONDS, tags: ["shopify-journal"] }
    );
  }

  if (!data.blog) return [];
  return data.blog.articles.edges.map(({ node }) => mapShopifyArticleToLocal(node));
}

export async function getShopifyJournalPostByHandle(articleHandle: string): Promise<JournalPost | undefined> {
  if (!isShopifyConfigured()) return undefined;

  const handle = configuredBlogHandle();
  let data = await shopifyFetch<ShopifyArticleByHandleQueryResult>(
    ARTICLE_BY_HANDLE_QUERY,
    { blogHandle: handle, articleHandle },
    { revalidate: JOURNAL_REVALIDATE_SECONDS, tags: ["shopify-journal", `shopify-journal-${articleHandle}`] }
  );

  if (!data.blog?.articleByHandle) {
    const fallback = await firstBlogHandle();
    if (fallback && fallback !== handle) {
      data = await shopifyFetch<ShopifyArticleByHandleQueryResult>(
        ARTICLE_BY_HANDLE_QUERY,
        { blogHandle: fallback, articleHandle },
        { revalidate: JOURNAL_REVALIDATE_SECONDS, tags: ["shopify-journal", `shopify-journal-${articleHandle}`] }
      );
    }
  }

  const article = data.blog?.articleByHandle;
  return article ? mapShopifyArticleToLocal(article) : undefined;
}
