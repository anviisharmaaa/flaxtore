import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { TextReveal } from "@/components/motion/TextReveal";
import { Reveal } from "@/components/motion/Reveal";
import { ImageReveal } from "@/components/motion/ImageReveal";

export function CrunchStory() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-28 text-ivory md:py-36">
      <Container className="relative flex flex-col items-center gap-10 text-center">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-300">
            The Sound Of A Good Choice
          </span>
        </Reveal>
        <h2 className="text-display max-w-4xl text-balance text-[clamp(2.5rem,8vw,7rem)] leading-[0.95]">
          <TextReveal text="Hear that?" delay={0.05} />
          <span className="block italic text-brand-300">
            <TextReveal text="That's the crunch." delay={0.25} />
          </span>
        </h2>
        <Reveal delay={0.3} className="max-w-lg text-pretty text-ivory/60 md:text-lg">
          Every seed is roasted until it snaps, not crumbles. It&rsquo;s the
          difference between a snack you tolerate and one you actually crave.
        </Reveal>
      </Container>

      <ImageReveal className="relative mx-auto mt-16 h-[45vh] w-full max-w-5xl rounded-[var(--radius-xl)] px-6 md:h-[55vh]" delay={0.2}>
        <div className="relative h-full w-full overflow-hidden rounded-[var(--radius-xl)]">
          <Image
            src="/images/ingredients/the-crunch.webp"
            alt="Roasted flaxseed, macro texture — the crunch"
            fill
            sizes="(min-width: 1024px) 80vw, 100vw"
            className="object-cover"
          />
        </div>
      </ImageReveal>
    </section>
  );
}
