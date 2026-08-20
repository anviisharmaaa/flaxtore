/**
 * Central site configuration — navigation, brand copy, and social/contact
 * details. Kept separate from UI components so copy can be updated in one
 * place without touching layout code.
 */

/**
 * Canonical production URL — the single source of truth for metadataBase,
 * canonical links, sitemap/robots URLs and Open Graph URLs. Reads
 * NEXT_PUBLIC_SITE_URL when set (e.g. for a staging environment) and falls
 * back to the real production domain, so every consumer below stays in
 * sync without hardcoding the domain in more than one place.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://flaxtore.com";

export const siteConfig = {
  name: "Flaxtore",
  shortName: "Flaxtore",
  tagline: "Healthy never had this much crunch.",
  description:
    "Sortex-cleaned, slow-roasted flaxseeds in three flavours. A healthier crunch that makes everyday snacking genuinely delicious.",
  url: SITE_URL,
  ogImage: "/images/brand/og-image.jpg",
  keywords: [
    "roasted flaxseeds",
    "flax snack",
    "healthy snacking",
    "sortex cleaned flaxseed",
    "high fiber snack",
    "omega 3 snack",
    "Flaxtore",
  ],
  contact: {
    email: "hello@flaxtore.com",
    supportEmail: "support@flaxtore.com",
  },
  social: {
    instagram: "https://instagram.com/flaxtore",
    facebook: "https://facebook.com/flaxtore",
  },
} as const;

export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Why Flax", href: "/why-flax" },
  { label: "Nutrition", href: "/nutrition" },
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/journal" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "All Flavours", href: "/shop" },
      { label: "Why Flax", href: "/why-flax" },
      { label: "Nutrition", href: "/nutrition" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Journal", href: "/journal" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export const announcementMessages = [
  "Sortex-cleaned. Slow-roasted. Seriously crunchy.",
  "Three flavours. One seriously good crunch.",
  "Healthy never had this much crunch.",
];
