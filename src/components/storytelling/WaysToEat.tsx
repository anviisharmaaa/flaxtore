import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";

const ways = [
  "Straight from the pouch",
  "Stirred into yogurt",
  "Scattered over oats",
  "Blended into a smoothie",
  "Folded into a breakfast bowl",
  "Tossed over a salad",
  "Mixed into a snack mix",
];

export function WaysToEat() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <ImageReveal className="relative order-1 aspect-[4/5] w-full rounded-[var(--radius-xl)]">
          <Image
            src="/images/lifestyle/everyday-snacking.webp"
            alt="Flaxtore, an everyday snacking moment"
            fill
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>

        <div className="order-2 flex flex-col gap-8">
          <SectionHeading eyebrow="Ways To Eat It" title="Seven ways in. Zero rules." />
          <Stagger gap={0.06} className="flex flex-wrap items-center gap-3">
            {ways.map((way) => (
              <StaggerItem key={way}>
                <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-border-strong bg-surface px-5 py-3 font-display text-base text-ink shadow-[var(--shadow-sm)] md:text-lg">
                  {way}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
}
