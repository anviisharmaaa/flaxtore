import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

/**
 * Deliberately shares the same design language as the rest of the site —
 * no pastel/pink "women's wellness" styling — and stays in educational,
 * non-medical language per brand guidelines.
 */
export function WellnessStory() {
  return (
    <section className="bg-brand-50 py-24 md:py-32">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Everyday Wellness"
            title="Simple daily nutrition, for whatever your routine is."
            description="Flaxtore is a source of plant-based Omega-3 (ALA) and dietary fibre — an easy, tasty way to build one more genuinely good habit into your day."
          />
          <Reveal delay={0.15}>
            <p className="max-w-lg text-sm leading-relaxed text-ink-faint">
              We keep this simple on purpose: Flaxtore is a food, not a
              treatment. It isn&rsquo;t intended to diagnose, treat, cure or
              prevent any condition, and it doesn&rsquo;t replace medical
              advice. For anything specific to your health, a qualified
              professional is always the right call.
            </p>
          </Reveal>
        </div>
        <ImageReveal className="aspect-[4/5] w-full rounded-[var(--radius-xl)]">
          <PlaceholderImage label="Everyday wellness — pending photography" className="rounded-[var(--radius-xl)]" />
        </ImageReveal>
      </Container>
    </section>
  );
}
