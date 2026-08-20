import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";

export function ProductIntro() {
  return (
    <section className="bg-ivory pt-4 pb-16 md:pb-20">
      <Container className="flex flex-col items-center gap-4 text-center">
        <Reveal className="max-w-2xl">
          <p className="text-display text-balance text-[clamp(1.5rem,3.2vw,2.25rem)] text-ink">
            One seed. Slow-roasted. <span className="text-brand-600">Three ways to crunch.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
