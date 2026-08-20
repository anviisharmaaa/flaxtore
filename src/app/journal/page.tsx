import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { journalPosts } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Notes on process, nutrition and everyday habits from Flaxtore.",
  alternates: { canonical: "/journal" },
};

export default function JournalPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Journal"
        title="Notes on process, food and everyday habits."
        description="Short reads on how Flaxtore is made, what's actually in it, and how it fits into a day."
      />

      <Container className="py-16 md:py-20">
        <Stagger gap={0.1} className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2">
          {journalPosts.map((post) => (
            <StaggerItem key={post.slug}>
              <Link href={`/journal/${post.slug}`} className="group flex flex-col gap-4">
                <div className="aspect-[16/10] overflow-hidden rounded-[var(--radius-lg)]">
                  <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                    <PlaceholderImage label="Journal — pending photography" />
                  </div>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-500">
                    {post.category} · {post.readTime}
                  </span>
                  <h2 className="mt-2 font-display text-2xl text-ink group-hover:text-brand-700">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-ink-muted">{post.excerpt}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}
