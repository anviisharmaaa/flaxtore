import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { LegalSection, ContentNeeded } from "@/components/ui/LegalSection";

export const metadata: Metadata = {
  title: "Shipping",
  description: "Flaxtore shipping information.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Support" title="Shipping" />
      <Container className="max-w-2xl py-16 md:py-20">
        <div className="flex flex-col gap-8">
          <LegalSection title="Where we ship">
            <ContentNeeded note="Confirm serviceable regions / pin codes before publishing." />
          </LegalSection>
          <LegalSection title="Delivery timelines">
            <ContentNeeded note="Confirm dispatch and delivery windows before publishing." />
          </LegalSection>
          <LegalSection title="Shipping costs">
            <ContentNeeded note="Confirm shipping rates and any free-shipping threshold before publishing." />
          </LegalSection>
          <LegalSection title="Order tracking">
            <ContentNeeded note="Confirm how tracking information is shared with customers before publishing." />
          </LegalSection>
        </div>
      </Container>
    </div>
  );
}
