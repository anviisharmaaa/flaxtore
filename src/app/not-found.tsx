import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BrandMark } from "@/components/brand/BrandMark";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <BrandMark size={44} className="opacity-70" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">404</p>
          <h1 className="font-display mt-3 text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
            This page went missing.
          </h1>
          <p className="mt-3 max-w-sm text-ink-muted">
            Maybe it got eaten. The rest of the pouch is still here.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/">Back Home</Button>
          <Button href="/shop" variant="secondary">
            Shop Flavours
          </Button>
        </div>
      </Container>
    </div>
  );
}
