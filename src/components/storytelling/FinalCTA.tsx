import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/motion/TextReveal";
import { SeedField } from "@/components/motion/SeedField";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-800 py-24 text-center text-ivory md:py-32">
      <SeedField />
      <Container className="relative flex flex-col items-center gap-8">
        <h2 className="text-display max-w-3xl text-balance text-[clamp(2.25rem,5.5vw,4.5rem)]">
          <TextReveal text="Open. Crunch. Repeat." />
        </h2>
        <p className="max-w-md text-pretty text-ivory/70">
          Three flavours. One seriously good crunch. Your move.
        </p>
        <Button href="/shop" size="lg" variant="inverse">
          Shop Now
        </Button>
      </Container>
    </section>
  );
}
