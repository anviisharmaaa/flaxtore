import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";
import { Button } from "@/components/ui/Button";
import { nutritionHighlights, baseNutrition } from "@/data/nutrition";

export function NutritionSection() {
  return (
    <section className="bg-brand-900 py-24 text-ivory md:py-32">
      <Container>
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Nutrition"
            title="What's actually in a serving."
            tone="ivory"
            description={`Per ${baseNutrition.servingSize} — no rounding tricks, no fine print.`}
          />
          <Button href="/nutrition" variant="secondary" className="shrink-0 border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory/10">
            Full Nutrition Info
          </Button>
        </div>

        <Stagger gap={0.08} className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-4">
          {nutritionHighlights.map((item) => (
            <StaggerItem
              key={item.label}
              className="flex flex-col gap-1 border-t border-ivory/15 pt-5"
            >
              <span className="font-display text-4xl text-ivory md:text-5xl">{item.value}</span>
              <span className="text-sm text-ivory/70">{item.label}</span>
              <span className="text-xs text-ivory/40">{item.note}</span>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="mt-10 max-w-lg text-xs leading-relaxed text-ivory/40">
          Reference nutrition data — verify against final approved packaging
          before production use.
        </p>

        <ImageReveal className="relative mx-auto mt-14 h-[38vh] w-full max-w-5xl rounded-[var(--radius-xl)] md:h-[48vh]">
          <Image
            src="/images/nutrition/nutrition-hero.webp"
            alt="Flaxtore nutrition — plant-based Omega-3, fibre and protein"
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
      </Container>
    </section>
  );
}
