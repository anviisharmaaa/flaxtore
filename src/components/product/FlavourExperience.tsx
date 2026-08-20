import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FlavourSelector } from "./FlavourSelector";
import type { Product } from "@/types/product";

export function FlavourExperience({ products }: { products: Product[] }) {
  return (
    <section id="flavours" className="bg-ivory py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Three Flavours"
          title="Pick your crunch."
          description="Same slow roast, three different personalities. Tap through to find yours."
          className="mb-14"
        />
        <FlavourSelector products={products} />
      </Container>
    </section>
  );
}
