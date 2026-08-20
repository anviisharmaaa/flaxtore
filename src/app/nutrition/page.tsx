import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { NutritionPanel } from "@/components/product/NutritionPanel";
import { Reveal } from "@/components/motion/Reveal";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";
import { baseNutrition, nutritionHighlights } from "@/data/nutrition";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Nutrition",
  description: "Full, verified nutrition information for Flaxtore roasted flaxseed, per 20g serving.",
  alternates: { canonical: "/nutrition" },
};

export default function NutritionPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Nutrition"
        title="What's actually in a serving."
        description={`Per ${baseNutrition.servingSize}, ${baseNutrition.servingsPerPack} servings per pack. No rounding tricks, no fine print.`}
      />

      <Container className="grid grid-cols-1 gap-14 py-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20 md:py-20">
        <Reveal>
          <NutritionPanel nutrition={baseNutrition} />
        </Reveal>

        <div className="flex flex-col gap-8">
          <Stagger gap={0.08} className="grid grid-cols-2 gap-6">
            {nutritionHighlights.map((item) => (
              <StaggerItem key={item.label} className="flex items-start gap-3 border-t border-border-strong pt-4">
                {"image" in item && item.image ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-cream">
                    <Image src={item.image} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                ) : null}
                <div>
                  <span className="font-display text-3xl text-brand-700">{item.value}</span>
                  <p className="mt-1 text-sm text-ink-muted">{item.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.1} className="flex flex-col gap-4 text-pretty leading-relaxed text-ink-muted">
            <p>
              Flaxseed is naturally a source of plant-based Omega-3 (ALA),
              dietary fibre and plant protein. Roasting doesn&rsquo;t change
              that — it changes the texture, turning a seed that&rsquo;s
              usually ground into something you actually want to eat whole.
            </p>
            <p className="text-sm text-ink-faint">
              Flaxtore is a food product. It is not a medicine, is not
              intended to diagnose, treat, cure or prevent any disease, and
              does not replace medical or dietary advice from a qualified
              professional.
            </p>
            <p className="text-xs text-ink-faint">
              The figures above are reference/development data used to build
              this site. [VERIFY BEFORE PUBLISHING: confirm against final,
              lab-tested values on approved packaging.]
            </p>
          </Reveal>

          <Button href="/shop" className="w-fit">
            Shop The Range
          </Button>
        </div>
      </Container>
    </div>
  );
}
