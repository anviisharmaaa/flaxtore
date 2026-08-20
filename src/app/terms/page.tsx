import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { LegalSection, ContentNeeded } from "@/components/ui/LegalSection";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing the use of the Flaxtore website and purchases.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Legal" title="Terms of Service" description="Last updated: [CONTENT NEEDED]" />
      <Container className="max-w-2xl py-16 md:py-20">
        <div className="flex flex-col gap-8">
          <LegalSection title="Overview">
            <ContentNeeded note="Confirm the legal entity name and registered address operating Flaxtore before publishing." />
          </LegalSection>
          <LegalSection title="Orders & payment">
            <ContentNeeded note="Confirm accepted payment methods, pricing/currency terms and order acceptance policy before publishing." />
          </LegalSection>
          <LegalSection title="Product information">
            <p>
              We aim to describe products, including nutrition information,
              as accurately as possible. Reference nutrition figures on this
              site are subject to final verification against approved
              packaging.
            </p>
          </LegalSection>
          <LegalSection title="Limitation of liability">
            <ContentNeeded note="Confirm limitation-of-liability language with legal counsel before publishing." />
          </LegalSection>
          <LegalSection title="Governing law">
            <ContentNeeded note="Confirm governing jurisdiction before publishing." />
          </LegalSection>
        </div>
      </Container>
    </div>
  );
}
