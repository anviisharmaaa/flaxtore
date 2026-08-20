"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils/cn";

/**
 * The "who this fits into" chapter of the homepage story — told through
 * lifestyle moments rather than a labeled audience grid. Three story beats
 * quietly cover the brand's health-conscious, active-lifestyle and
 * everyday-wellness audiences without ever naming them as segments.
 *
 * Sits between the "how it's made" chapter (Nutrition) and "how you enjoy
 * it" (WaysToEat) — replacing the old LifestyleStory/WellnessStory sections,
 * which covered overlapping ground less cohesively.
 */
const stories = [
  {
    number: "01",
    title: "The Better Snacker",
    copy: "Because choosing better shouldn't mean choosing boring.",
    detail:
      "A slow-roasted crunch that sits right next to the oats, the yoghurt bowl, the afternoon tea — no compromise speech required.",
    image: "/images/lifestyle/work-desk.webp",
    imageAlt: "Everyday desk snacking with Flaxtore",
    accent: "var(--color-brand-500)",
    href: "/nutrition",
    linkLabel: "See what's inside",
  },
  {
    number: "02",
    title: "The Always-Moving One",
    copy: "For gym bags, desk drawers, backpacks and days that don't slow down.",
    detail:
      "Flaxtore is a food, not a supplement stack — it just happens to travel well. Tears open on a platform, in a lecture hall, between sets.",
    image: "/images/lifestyle/travel.webp",
    imageAlt: "Flaxtore packed for travel, on the go",
    accent: "var(--color-accent)",
    href: "/shop",
    linkLabel: "Find your on-the-go flavour",
  },
  {
    number: "03",
    title: "The Everyday Ritual",
    copy: "Small everyday choices can become rituals worth keeping.",
    detail:
      "Stirred into breakfast, kept on the counter, part of a morning that's already yours. Flaxtore is everyday nutrition, not a treatment — just one good habit, repeated.",
    image: "/images/lifestyle/breakfast.webp",
    imageAlt: "Flaxtore stirred into a morning breakfast bowl",
    accent: "var(--color-brand-700)",
    href: "/why-flax",
    linkLabel: "See why flax, every day",
  },
];

const sectionTones = ["var(--color-ivory)", "var(--color-cream)", "var(--color-brand-50)"];

export function SnackStory() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stories[activeIndex];

  const handleEnter = useCallback((index: number) => setActiveIndex(index), []);

  return (
    <motion.section
      aria-label="Who Flaxtore fits into your day"
      className="relative py-24 md:py-32"
      animate={{ backgroundColor: sectionTones[activeIndex] }}
      initial={false}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Container>
        <SectionHeading
          eyebrow="Made For You"
          title="Made for the way you snack."
          description="Different days. Different routines. One seriously satisfying crunch."
          align="center"
          className="mx-auto mb-16 max-w-2xl md:mb-24"
        />

        {/* Desktop / large-screen scrollytelling layout */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_1.05fr] lg:gap-20 xl:gap-28">
          {/*
            Outer wrapper stretches to the grid row's full height (the right
            column's, since it's the taller of the two) so the sticky panel
            below has room to stay pinned across all three story beats
            instead of un-sticking as soon as its own short content ends.
          */}
          <div className="relative">
            <div className="sticky top-32">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xl)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.number}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={active.image}
                      alt={active.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute left-6 top-6 flex items-baseline gap-2 text-ivory">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={active.number}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3 }}
                      className="font-display text-3xl"
                    >
                      {active.number}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-xs uppercase tracking-[0.2em] text-ivory/60">— 03</span>
                </div>
              </div>

              <div className="mt-6 h-1 overflow-hidden rounded-full bg-border">
                <motion.div
                  className="h-full rounded-full"
                  animate={{ width: `${((activeIndex + 1) / stories.length) * 100}%`, background: active.accent }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            {stories.map((story, i) => (
              <StoryBeat key={story.title} story={story} index={i} onEnter={handleEnter} />
            ))}
          </div>
        </div>

        {/* Mobile / tablet — clean vertical sequence, no hover or scroll-tracking dependency */}
        <div className="flex flex-col gap-14 lg:hidden">
          {stories.map((story) => (
            <div key={story.title} className="flex flex-col gap-6">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)]">
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <StoryText story={story} />
            </div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}

function StoryBeat({
  story,
  index,
  onEnter,
}: {
  story: (typeof stories)[number];
  index: number;
  onEnter: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Fires whenever this beat crosses the vertical center band of the
  // viewport — used purely to drive the sticky panel's active story, kept
  // separate from the beat's own on-scroll fade-in below.
  const inCenterBand = useInView(ref, { margin: "-45% 0px -45% 0px" });

  useEffect(() => {
    if (inCenterBand) onEnter(index);
  }, [inCenterBand, index, onEnter]);

  return (
    <div ref={ref} className="flex min-h-[62vh] flex-col justify-center gap-5 py-10">
      <Reveal>
        <StoryText story={story} />
      </Reveal>
    </div>
  );
}

function StoryText({ story }: { story: (typeof stories)[number] }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex max-w-md flex-col gap-4">
      <span
        className="text-xs font-semibold uppercase tracking-[0.22em]"
        style={{ color: story.accent }}
      >
        Story {story.number}
      </span>
      <h3 className="font-display text-3xl text-ink md:text-4xl">{story.title}</h3>
      <p className="text-pretty text-lg leading-relaxed text-ink-muted">{story.copy}</p>
      <p className="text-pretty text-sm leading-relaxed text-ink-faint">{story.detail}</p>
      <Link
        href={story.href}
        className={cn(
          "group mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-ink",
          "transition-colors duration-300 hover:text-brand-700"
        )}
      >
        {story.linkLabel}
        <ArrowUpRight
          size={15}
          className={cn(
            "transition-transform duration-300",
            !reduceMotion && "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          )}
        />
      </Link>
    </div>
  );
}
