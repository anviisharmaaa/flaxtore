import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";

const steps = [
  {
    step: "01",
    title: "Seeds",
    copy: "Raw flaxseed arrives in bulk, straight from the harvest.",
  },
  {
    step: "02",
    title: "Selection",
    copy: "Optical Sortex sorting separates by size, colour and quality.",
  },
  {
    step: "03",
    title: "Cleaning",
    copy: "Broken seeds, husks and foreign material are removed.",
  },
  {
    step: "04",
    title: "Quality",
    copy: "What's left is a consistent batch, ready for the roaster.",
  },
];

/**
 * One real editorial shot of the sortex-cleaning stage, paired with the
 * four process steps as a plain numbered list rather than a thumbnail per
 * step — we only have one photograph of this stage, so four repeated crops
 * of it would misrepresent it as four separate documentary shots.
 */
export function SortexStory() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <ImageReveal className="relative aspect-[4/3] w-full rounded-[var(--radius-xl)]">
          <Image
            src="/images/brand/sortex-cleaning.webp"
            alt="Sortex-cleaning flaxseed for size, colour and quality"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>

        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="The Process — Part One"
            title="Sortex-cleaned, before anything else."
            description="An unglamorous step that decides everything after it. We start every batch here, not because it's exciting, but because it isn't optional."
          />

          <Stagger gap={0.08} className="grid grid-cols-2 gap-x-6 gap-y-6">
            {steps.map((s) => (
              <StaggerItem key={s.step} className="border-t border-border-strong pt-4">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-500">
                  {s.step}
                </span>
                <h3 className="mt-1 font-display text-lg text-ink">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-muted">{s.copy}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
