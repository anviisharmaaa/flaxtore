import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Reveal } from "@/components/motion/Reveal";
import { journalPosts, getJournalPostBySlug } from "@/data/journal";

export async function generateStaticParams() {
  return journalPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getJournalPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
  };
}

export default async function JournalPostPage(props: PageProps<"/journal/[slug]">) {
  const { slug } = await props.params;
  const post = getJournalPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="pb-24 pt-32 md:pt-40">
      <Container className="max-w-3xl">
        <Link href="/journal" className="text-sm font-medium text-brand-700 hover:text-brand-900">
          ← Journal
        </Link>
        <Reveal>
          <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
            {post.category} · {post.readTime}
          </span>
          <h1 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">{post.title}</h1>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius-xl)]">
          <PlaceholderImage label="Journal — pending photography" className="rounded-[var(--radius-xl)]" />
        </Reveal>

        <div className="mt-10 flex flex-col gap-5 text-pretty text-lg leading-relaxed text-ink-soft">
          {post.content.map((para, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p>{para}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </article>
  );
}
