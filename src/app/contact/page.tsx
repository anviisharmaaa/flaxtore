"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // No backend is wired up yet — this simply confirms receipt in the UI.
    // TODO: connect to a real form handler / support inbox.
    setSubmitted(true);
  }

  return (
    <div className="pb-24 pt-32 md:pt-40">
      <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500">Contact</span>
          <h1 className="font-display mt-3 text-[clamp(2.25rem,5vw,3.5rem)] text-ink">
            Say hello.
          </h1>
          <p className="mt-4 max-w-sm text-pretty text-ink-muted">
            Questions about an order, a flavour, or anything else — we read
            every message.
          </p>
          <div className="mt-8 flex flex-col gap-2 text-sm">
            <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-brand-700 hover:text-brand-900">
              {siteConfig.contact.email}
            </a>
            <a href={`mailto:${siteConfig.contact.supportEmail}`} className="text-ink-muted hover:text-ink">
              {siteConfig.contact.supportEmail} (order support)
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          {submitted ? (
            <div className="rounded-[var(--radius-lg)] border border-border bg-cream p-8">
              <p className="font-display text-xl text-ink">Message received.</p>
              <p className="mt-2 text-sm text-ink-muted">
                We&rsquo;ll get back to you as soon as we can.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Input id="name" name="name" label="Name" placeholder="Your name" required />
                <Input id="email" name="email" type="email" label="Email" placeholder="you@example.com" required />
              </div>
              <Input id="subject" name="subject" label="Subject" placeholder="What's this about?" />
              <Textarea id="message" name="message" label="Message" placeholder="Tell us more…" required />
              <Button type="submit" size="lg" className="w-fit">
                Send Message
              </Button>
            </form>
          )}
        </Reveal>
      </Container>
    </div>
  );
}
