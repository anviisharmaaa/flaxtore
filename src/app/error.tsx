"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">
          Something went wrong
        </p>
        <h1 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] text-ink">
          That didn&rsquo;t crunch the way it should have.
        </h1>
        <p className="max-w-sm text-ink-muted">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>Try Again</Button>
          <Button href="/" variant="secondary">
            Back Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
