import Link from "next/link";
import { InstagramIcon, FacebookIcon } from "@/components/ui/SocialIcons";
import { Container } from "@/components/ui/Container";
import { FlaxtoreLogo } from "@/components/brand/FlaxtoreLogo";
import { footerNav, siteConfig } from "@/config/site";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-900 text-ivory">
      <Container className="relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_repeat(4,1fr)] md:gap-8">
          <div className="flex flex-col gap-4">
            <FlaxtoreLogo tone="ivory" />
            <p className="max-w-xs text-sm leading-relaxed text-ivory/60">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Flaxtore on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-ivory/40 hover:text-ivory"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Flaxtore on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory/15 text-ivory/70 transition-colors hover:border-ivory/40 hover:text-ivory"
              >
                <FacebookIcon size={17} />
              </a>
            </div>
          </div>

          {footerNav.map((group) => (
            <div key={group.title} className="flex flex-col gap-3.5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-ivory/45">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as never}
                      className="text-sm text-ivory/75 transition-colors hover:text-ivory"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-ivory/10 pt-8 md:mt-16 md:flex-row md:items-end md:justify-between">
          <NewsletterForm />
          <p className="text-xs text-ivory/40">
            © {new Date().getFullYear()} Flaxtore. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
