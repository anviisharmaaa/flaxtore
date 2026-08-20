import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { LegalSection, ContentNeeded } from "@/components/ui/LegalSection";

export const metadata: Metadata = {
  title: "Returns",
  description: "Flaxtore returns and refunds information.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Support" title="Returns & Refunds" />
      <Container className="max-w-2xl py-16 md:py-20">
        <div className="flex flex-col gap-8">
          <LegalSection title="Return window">
            <ContentNeeded note="Confirm the return window and any conditions (e.g. unopened packaging) before publishing." />
          </LegalSection>
          <LegalSection title="Food product policy">
            <p>
              As a food product, Flaxtore is only eligible for return in
              specific cases such as damage in transit or a quality issue.
            </p>
            <ContentNeeded note="Confirm exact eligibility criteria before publishing." />
          </LegalSection>
          <LegalSection title="Refund process">
            <ContentNeeded note="Confirm refund timelines and method before publishing." />
          </LegalSection>
          <LegalSection title="How to start a return">
            <ContentNeeded note="Confirm the process (e.g. contact support email) before publishing." />
          </LegalSection>
        </div>
      </Container>
    </div>
  );
}
