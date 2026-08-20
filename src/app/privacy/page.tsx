import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { LegalSection, ContentNeeded } from "@/components/ui/LegalSection";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Flaxtore collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="pb-24">
      <PageHeader eyebrow="Legal" title="Privacy Policy" description="Last updated: [CONTENT NEEDED]" />
      <Container className="max-w-2xl py-16 md:py-20">
        <div className="flex flex-col gap-8">
          <LegalSection title="Information we collect">
            <ContentNeeded note="List the categories of personal data collected (e.g. name, email, address, order/payment data, device/analytics data) before publishing." />
          </LegalSection>
          <LegalSection title="How we use your information">
            <p>
              In general, information collected through this site would be
              used to fulfil orders, provide customer support, and — where
              you&rsquo;ve opted in — send updates about Flaxtore.
            </p>
            <ContentNeeded note="Confirm the full, accurate list of uses before publishing." />
          </LegalSection>
          <LegalSection title="Sharing with third parties">
            <ContentNeeded note="List any payment processors, shipping partners, or analytics/marketing tools that receive data before publishing." />
          </LegalSection>
          <LegalSection title="Cookies">
            <ContentNeeded note="Confirm cookie usage once analytics/marketing tools are selected." />
          </LegalSection>
          <LegalSection title="Your rights">
            <ContentNeeded note="Confirm applicable data protection rights and how to exercise them (access, correction, deletion) before publishing." />
          </LegalSection>
          <LegalSection title="Contact">
            <p>
              Questions about this policy can be sent to{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-brand-700 hover:text-brand-900">
                {siteConfig.contact.email}
              </a>
              .
            </p>
          </LegalSection>
        </div>
      </Container>
    </div>
  );
}
