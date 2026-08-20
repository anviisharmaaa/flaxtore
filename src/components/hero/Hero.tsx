import { Container } from "@/components/ui/Container";
import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";
import { HeroSeeds } from "./HeroSeeds";

export function Hero() {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pt-36 pb-20 md:pt-32">
      <HeroBackground />
      <Container className="relative grid grid-cols-1 items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <div className="order-1">
          <HeroContent />
        </div>
        <div className="order-2 lg:order-2">
          <HeroSeeds />
        </div>
      </Container>
    </section>
  );
}
