import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StaggerItem, Stagger } from "@/components/motion/Stagger";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const moments = [
  { title: "The Commute", copy: "In a bag, in a pocket, ready before the platform announcement finishes." },
  { title: "The Desk", copy: "A drawer staple for the 4pm slump that has nothing to do with willpower." },
  { title: "The Gym Bag", copy: "Post-workout, pre-shower, no cooler bag required." },
  { title: "The Study Session", copy: "Something to reach for that isn't your phone." },
  { title: "The Trip", copy: "Packs flat, survives a backpack, outlasts the flight." },
  { title: "The Morning", copy: "Stirred into breakfast before the day picks up speed." },
];

export function LifestyleStory() {
  return (
    <section className="bg-ivory py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Everyday Lifestyle"
          title="Fuel for days that don't stop."
          description="Flaxtore is built to fit into a routine, not interrupt it — wherever that routine happens to be today."
          align="center"
        />

        <Stagger gap={0.08} className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6">
          {moments.map((m) => (
            <StaggerItem key={m.title} className="group flex flex-col gap-3">
              <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)]">
                <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                  <PlaceholderImage label="Lifestyle — pending photography" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-base text-ink md:text-lg">{m.title}</h3>
                <p className="mt-0.5 text-xs text-ink-muted md:text-sm">{m.copy}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
