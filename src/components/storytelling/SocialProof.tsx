import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Component architecture for customer social proof. No reviews, ratings,
 * names or counts are fabricated here — per brand content rules, this slot
 * stays honestly empty (with a clear placeholder) until real testimonials
 * are supplied, at which point they map directly onto `TestimonialCard`.
 */
type Testimonial = {
  quote: string;
  name: string;
  detail?: string;
};

const testimonials: Testimonial[] = [];

export function SocialProof() {
  if (testimonials.length === 0) {
    return (
      <section className="bg-ivory py-20">
        <Container>
          <Reveal className="mx-auto max-w-xl rounded-[var(--radius-lg)] border border-dashed border-border-strong px-8 py-14 text-center">
            <p className="font-display text-xl text-ink">Customer stories, coming soon.</p>
            <p className="mt-2 text-sm text-ink-muted">
              [CONTENT NEEDED: real customer testimonials — this section will
              populate automatically once reviews are supplied.]
            </p>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-ivory py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Reveal key={t.name} className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
              <p className="text-pretty text-ink">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm font-semibold text-ink-muted">
                {t.name}
                {t.detail ? <span className="font-normal text-ink-faint"> · {t.detail}</span> : null}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
