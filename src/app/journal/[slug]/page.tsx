import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Reveal } from "@/components/motion/Reveal";
import { getShopifyJournalPosts, getShopifyJournalPostByHandle } from "@/lib/shopify/journal";

/**
 * Same revalidation window as the listing page (see src/app/journal/page.tsx).
 */
export const revalidate = 60;

/**
 * Pre-renders one static page per currently-published Shopify article.
 * `dynamicParams` is left at its Next.js default (true) — a Shopify
 * article published after the last build still resolves: Next renders it
 * on its first request and caches it for `revalidate` seconds, so no
 * redeploy or manual slug is ever required.
 */
export async function generateStaticParams() {
  const posts = await getShopifyJournalPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getShopifyJournalPostByHandle(slug);
  if (!post) return {};

  const title = post.seoTitle ?? post.title;
  const description = post.seoDescription ?? post.excerpt;

  return {
    title,
    description,
    // Canonical always points at this app's own URL — never at Shopify's
    // own hosted article/blog URL — so Shopify never becomes a competing
    // canonical for this content.
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title,
      description,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function JournalPostPage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const post = await getShopifyJournalPostByHandle(slug);
  if (!post) notFound();

  return (
    <article className="pb-24 pt-32 md:pt-40">
      <Container className="max-w-3xl">
        <Link href="/journal" className="text-sm font-medium text-brand-700 hover:text-brand-900">
          ← Journal
        </Link>
        <Reveal>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
            {post.author ?? "Flaxtore Journal"} · {post.readTime}
          </span>
          <h1 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">{post.title}</h1>
        </Reveal>

        <Reveal delay={0.1} className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-xl)]">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.imageAlt ?? post.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <PlaceholderImage label="Journal — pending photography" className="rounded-[var(--radius-xl)]" />
          )}
        </Reveal>

        {/*
          Shopify's own rich-text article body (contentHtml) — trusted
          first-party content authored in Shopify Admin, the same way a
          Shopify theme renders `article.content` unescaped. Replaces the
          previous per-paragraph array rendering (the old local data was a
          plain string[]); the same base typography classes are kept, with
          a few child-element rules added only so headings/lists/links
          inside Shopify's HTML inherit sensible spacing — no visual
          restyling of the page itself.
        */}
        <Reveal
          delay={0.15}
          className="mt-10 text-pretty text-lg leading-relaxed text-ink-soft [&>*+*]:mt-5 [&_a]:text-brand-700 [&_a]:underline [&_h2]:font-display [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:text-ink [&_h3]:font-display [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:text-ink [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </Container>
    </article>
  );
}
