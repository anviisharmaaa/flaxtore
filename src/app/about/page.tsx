import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";
import { FinalCTA } from "@/components/storytelling/FinalCTA";

export const metadata: Metadata = {
  title: "Our Story",
  description: "Why Flaxtore exists, and the bet it's built on.",
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Honest food", copy: "One ingredient list you can actually read. No health-halo tricks." },
  { title: "Slow, on purpose", copy: "We chose the slower, harder process because it makes a better seed." },
  { title: "No exaggeration", copy: "We won't claim what we can't back up — on the pack or on this site." },
];

export default function AboutPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Our Story"
        title="Built on a simple bet."
        description="That a genuinely good snack shouldn't need an asterisk."
      />

      <Container className="grid grid-cols-1 items-center gap-14 py-20 lg:grid-cols-2 lg:gap-20 md:py-28">
        <div className="flex flex-col gap-5 text-pretty leading-relaxed text-ink-muted">
          <Reveal>
            <p>
              Flaxtore started with one question: why does &ldquo;healthy&rdquo;
              so often mean &ldquo;bland&rdquo;? Every roasted-seed snack we
              tried either tasted like cardboard or leaned so hard into
              flavour that the seed itself was an afterthought.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              So we built the thing we actually wanted to eat: sortex-cleaned
              flaxseed, slow-roasted until it genuinely crunches, in flavours
              that don&rsquo;t apologise for existing. No supplement-aisle
              packaging. No lecture about wellness. Just a snack that happens
              to be a genuinely useful thing to have around.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              We&rsquo;re a small, early team — this site, and this brand, is
              still being built in public. What won&rsquo;t change is the
              standard: honest ingredients, a process we&rsquo;re not
              cutting corners on, and language you can trust because we
              refuse to overstate it.
            </p>
          </Reveal>
        </div>
        <ImageReveal className="relative aspect-[4/5] w-full rounded-[var(--radius-xl)]">
          <Image
            src="/images/brand/quality.webp"
            alt="Flaxtore quality and care"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
      </Container>

      <div className="bg-cream py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="What We Won't Compromise" title="Three things we hold the line on." />
          <Stagger gap={0.1} className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {values.map((v) => (
              <StaggerItem key={v.title} className="flex flex-col gap-2 border-t border-border-strong pt-5">
                <h3 className="font-display text-xl text-ink">{v.title}</h3>
                <p className="text-sm text-ink-muted">{v.copy}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </div>

      <FinalCTA />
    </div>
  );
}
