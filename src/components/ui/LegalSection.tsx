import type { ReactNode } from "react";

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-border pt-8">
      <h2 className="font-display text-xl text-ink md:text-2xl">{title}</h2>
      <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-muted md:text-base">
        {children}
      </div>
    </section>
  );
}

export function ContentNeeded({ note }: { note: string }) {
  return (
    <p className="rounded-[var(--radius-md)] border border-dashed border-border-strong bg-cream px-4 py-3 text-xs text-ink-faint">
      [CONTENT NEEDED] {note}
    </p>
  );
}
