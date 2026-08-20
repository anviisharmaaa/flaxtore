import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Reveal } from "@/components/motion/Reveal";

const stages = ["Raw", "Roasted", "Crunchy"];

export function RoastingStory() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <ImageReveal className="relative order-2 aspect-[4/3] w-full rounded-[var(--radius-xl)] lg:order-1">
          <Image
            src="/images/brand/roasting-process.webp"
            alt="Flaxseed roasting process"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <SectionHeading
            eyebrow="The Process — Part Two"
            title="Slow-roasted. On purpose."
            description="Flaxseed is small and oil-rich — push the heat too hard and the outside scorches before the inside is done. So we don't. Lower heat, longer time, a seed roasted evenly through."
          />
          <div className="flex items-center gap-3">
            {stages.map((stage, i) => (
              <Reveal key={stage} delay={i * 0.12} className="flex items-center gap-3">
                <span className="font-display text-lg text-brand-700 md:text-xl">{stage}</span>
                {i < stages.length - 1 ? (
                  <span aria-hidden className="h-px w-8 bg-border-strong md:w-12" />
                ) : null}
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
