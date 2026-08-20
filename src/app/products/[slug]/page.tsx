import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { NutritionPanel } from "@/components/product/NutritionPanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { commerce } from "@/lib/commerce";
import { products as allProducts } from "@/data/products";

/**
 * Pre-rendered at build time via generateStaticParams below (one static
 * page per product), then revalidated in the background on this interval —
 * Incremental Static Regeneration. This is the product detail page, so it's
 * the most important place to avoid indefinitely-stale price/availability
 * once this reads from Shopify: visitors keep getting an instantly-served
 * static page, while Next.js refreshes the underlying data roughly every
 * minute rather than only at the next deploy. Kept in sync with the same
 * window used on `/` and `/shop`.
 */
export const revalidate = 60;

export async function generateStaticParams() {
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await commerce.getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await commerce.getProductBySlug(slug);

  if (!product) notFound();

  const related = await commerce.getRelatedProducts(slug);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="pb-24 pt-28 md:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />
        <ProductDetails product={product} allFlavours={allProducts} />
      </Container>

      <Container className="mt-16 md:mt-24">
        <NutritionPanel nutrition={product.nutrition} className="max-w-xl" />
      </Container>

      {related.length > 0 ? (
        <Container className="mt-24 md:mt-32">
          <SectionHeading eyebrow="Also Try" title="More from Flaxtore" className="mb-10" />
          <ProductGrid products={related} />
        </Container>
      ) : null}
    </div>
  );
}
