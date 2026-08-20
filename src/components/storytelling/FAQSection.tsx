import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "./FaqAccordion";
import { faqGroups } from "@/data/faq";

export function FAQSection() {
  const items = faqGroups.flatMap((g) => g.items).slice(0, 5);

  return (
    <section className="bg-ivory py-24 md:py-32">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow="FAQ" title="Good to know." />
          <Link href="/faq" className="mt-6 inline-block text-sm font-medium text-brand-700 hover:text-brand-900">
            View all questions →
          </Link>
        </div>
        <FaqAccordion items={items} />
      </Container>
    </section>
  );
}
