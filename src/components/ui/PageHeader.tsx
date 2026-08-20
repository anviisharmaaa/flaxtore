import type { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-ivory pb-14 pt-32 md:pb-20 md:pt-40">
      <Container>
        <Reveal className="max-w-2xl">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="font-display mt-3 text-[clamp(2.25rem,5vw,4rem)] text-ink">{title}</h1>
          {description ? (
            <p className="mt-4 text-pretty text-lg text-ink-muted">{description}</p>
          ) : null}
        </Reveal>
      </Container>
    </div>
  );
}
