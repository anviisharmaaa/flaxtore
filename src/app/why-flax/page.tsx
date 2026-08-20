import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CrunchStory } from "@/components/storytelling/CrunchStory";
import { SortexStory } from "@/components/storytelling/SortexStory";
import { RoastingStory } from "@/components/storytelling/RoastingStory";
import { NutritionSection } from "@/components/storytelling/NutritionSection";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";
import { FinalCTA } from "@/components/storytelling/FinalCTA";

export const metadata: Metadata = {
  title: "Why Flax",
  description: "Why flaxseed, why sortex-cleaned, why slow-roasted — the case for Flaxtore.",
  alternates: { canonical: "/why-flax" },
};

const reasons = [
  {
    title: "Plant-based Omega-3",
    copy: "Flaxseed is a source of ALA, a plant-based Omega-3 — useful, everyday nutrition without needing to be a supplement.",
  },
  {
    title: "Genuinely high in fibre",
    copy: "5.3g of dietary fibre per 20g serving — see our Nutrition page for the full, verified breakdown.",
  },
  {
    title: "A snack, not a chore",
    copy: "Roasted whole, not ground into something you have to disguise. It's a snack you actually want to reach for.",
  },
];

export default function WhyFlaxPage() {
  return (
    <div className="pb-24">
      <PageHeader
        eyebrow="Why Flax"
        title="Why we built a whole brand around one seed."
        description="Flaxseed isn't new. What's new is treating it like something worth actually enjoying."
      />

      <Container className="py-16 md:py-20">
        <SectionHeading eyebrow="The Case For Flax" title="Small seed. Real reasons." className="mb-12" />
        <Stagger gap={0.1} className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {reasons.map((r) => (
            <StaggerItem key={r.title} className="flex flex-col gap-2 border-t border-border-strong pt-5">
              <h3 className="font-display text-xl text-ink">{r.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{r.copy}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>

      <SortexStory />
      <RoastingStory />
      <CrunchStory />
      <NutritionSection />
      <FinalCTA />
    </div>
  );
}
