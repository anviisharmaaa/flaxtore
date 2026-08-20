import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/ui/Container";

const pillars = [
  { label: "Health", detail: "Real, whole-seed nutrition." },
  { label: "Taste", detail: "Slow-roasted, never bland." },
  { label: "Crunch", detail: "The kind you feel, not just hear." },
  { label: "Convenience", detail: "Pouch open, snack solved." },
];

export function BrandPromise() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <Container>
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-display text-balance text-[clamp(1.75rem,4vw,3rem)] leading-[1.15] text-ink">
            A healthier crunch that makes everyday snacking{" "}
            <span className="italic text-brand-600">genuinely delicious.</span>
          </p>
        </Reveal>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-8 border-t border-border pt-12 md:grid-cols-4 md:gap-6">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.label} delay={i * 0.08} className="flex flex-col gap-1.5">
              <span className="font-display text-lg text-brand-700 md:text-xl">{pillar.label}</span>
              <span className="text-sm text-ink-muted">{pillar.detail}</span>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
