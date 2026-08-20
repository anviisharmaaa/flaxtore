import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ImageReveal } from "@/components/motion/ImageReveal";
import { Button } from "@/components/ui/Button";

export function BrandStory() {
  return (
    <section className="bg-brand-900 py-24 text-ivory md:py-32">
      <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <ImageReveal className="relative aspect-[4/5] w-full rounded-[var(--radius-xl)] order-2 lg:order-1">
          <Image
            src="/images/brand/story.webp"
            alt="The Flaxtore brand story"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
        <div className="order-1 flex flex-col gap-6 lg:order-2">
          <SectionHeading
            eyebrow="Our Story"
            title="Built on a simple bet."
            tone="ivory"
            description={
              <>
                That a genuinely good snack shouldn&rsquo;t need an asterisk.
                Flaxtore started with one question — why does &ldquo;healthy&rdquo;
                so often mean &ldquo;bland&rdquo;? — and one answer: it doesn&rsquo;t
                have to.
              </>
            }
          />
          <Button href="/about" variant="secondary" className="w-fit border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory/10">
            Read Our Full Story
          </Button>
        </div>
      </Container>
    </section>
  );
}
