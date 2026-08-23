import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { BrandPromise } from "@/components/storytelling/BrandPromise";
import { ProductIntro } from "@/components/storytelling/ProductIntro";
import { CrunchStory } from "@/components/storytelling/CrunchStory";
import { SortexStory } from "@/components/storytelling/SortexStory";
import { RoastingStory } from "@/components/storytelling/RoastingStory";
import { FlavourExperience } from "@/components/product/FlavourExperience";
import { NutritionSection } from "@/components/storytelling/NutritionSection";
import { SnackStory } from "@/components/storytelling/SnackStory";
import { WaysToEat } from "@/components/storytelling/WaysToEat";
import { SocialProof } from "@/components/storytelling/SocialProof";
import { BrandStory } from "@/components/storytelling/BrandStory";
import { FAQSection } from "@/components/storytelling/FAQSection";
import { FinalCTA } from "@/components/storytelling/FinalCTA";
import { commerce } from "@/lib/commerce";

/**
 * The homepage is otherwise pure editorial content (no commerce data other
 * than the featured-flavour section), but it's still pre-rendered as static
 * HTML with a background revalidation window — see shop/page.tsx and
 * products/[slug]/page.tsx for the full reasoning. Kept in sync with those
 * so the featured-flavour prices/images shown here never drift further out
 * of date than the rest of the catalogue.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const products = await commerce.getFeaturedProducts();

  // Temporary, safe diagnostic — prints only product count/handles (never
  // tokens or headers) so a build run against the real store shows
  // exactly what commerce.getFeaturedProducts() returned to this page.
  // Remove once the Shopify handle/local-content mapping is confirmed
  // correct.
  console.log(
    `[homepage] getFeaturedProducts() returned ${products.length} product(s): ` +
      (products.length > 0 ? products.map((p) => p.slug).join(", ") : "(none)")
  );

  return (
    <>
      <Hero />
      <BrandPromise />
      <ProductIntro />
      <CrunchStory />
      <SortexStory />
      <RoastingStory />
      <FlavourExperience products={products} />
      <NutritionSection />
      <SnackStory />
      <WaysToEat />
      <SocialProof />
      <BrandStory />
      <FAQSection />
      <FinalCTA />
    </>
  );
}
