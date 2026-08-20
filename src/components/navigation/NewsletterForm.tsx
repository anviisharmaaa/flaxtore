"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "submitted">("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    track.newsletterSignup("footer");
    setStatus("submitted");
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-2.5">
      <label htmlFor="newsletter-email" className="text-xs font-semibold uppercase tracking-[0.16em] text-ivory/45">
        Stay in the loop
      </label>
      {status === "submitted" ? (
        <p className="text-sm text-ivory/80">You&rsquo;re on the list — thank you.</p>
      ) : (
        <div className="flex gap-2">
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-11 w-full rounded-full border border-ivory/20 bg-transparent px-4 text-sm text-ivory placeholder:text-ivory/40 focus:border-ivory/60 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-ivory px-5 text-sm font-semibold text-brand-800 transition-colors hover:bg-cream"
          >
            Join
          </button>
        </div>
      )}
    </form>
  );
}
