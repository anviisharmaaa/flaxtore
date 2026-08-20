import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { FaqAccordion } from "@/components/storytelling/FaqAccordion";
import { faqGroups } from "@/data/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about Flaxtore products, nutrition and orders.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="FAQ" title="Good to know." />
      <Container className="max-w-3xl py-16 md:py-20">
        <div className="flex flex-col gap-14">
          {faqGroups.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 font-display text-2xl text-ink">{group.title}</h2>
              <FaqAccordion items={group.items} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
