export type JournalPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string[];
};

/**
 * Educational brand content. Written in responsible, non-medical language —
 * no disease, hormone or weight-loss claims are made. Verify final copy
 * with brand/legal before publishing.
 */
export const journalPosts: JournalPost[] = [
  {
    slug: "what-is-sortex-cleaning",
    title: "What does 'Sortex-cleaned' actually mean?",
    excerpt:
      "The quiet quality step that happens before a single seed ever reaches the roaster.",
    category: "The Process",
    readTime: "3 min read",
    content: [
      "Before flaxseeds are roasted, they're sorted. Sortex cleaning uses optical sorting to separate seeds by size, colour and quality — removing broken seeds, husks and foreign material so what's left is a consistent, clean batch.",
      "It's an unglamorous step, but it's the one that determines whether the rest of the process even matters. Consistent seeds roast consistently. Inconsistent seeds don't.",
      "We start every batch here, not because it's exciting, but because it isn't optional.",
    ],
  },
  {
    slug: "why-slow-roast-flaxseed",
    title: "Why we roast slowly, not fast",
    excerpt: "The difference between a crunch that works and one that doesn't.",
    category: "The Process",
    readTime: "3 min read",
    content: [
      "Flaxseeds are small, oil-rich and easy to over-roast. Push the heat too hard and the outside scorches before the inside is done — you get bitterness, not crunch.",
      "Slow roasting trades speed for control. Lower heat, longer time, closer attention. The result is a seed that's roasted evenly through, with a snap instead of a crumble.",
      "It takes longer. We think that's the point.",
    ],
  },
  {
    slug: "flaxseed-and-everyday-nutrition",
    title: "Flaxseed and everyday nutrition, explained simply",
    excerpt:
      "What's actually in a spoonful — and what we're not going to claim about it.",
    category: "Nutrition",
    readTime: "4 min read",
    content: [
      "Flaxseed is a source of plant-based Omega-3 (ALA) and dietary fibre, alongside plant protein — the kind of everyday nutrition that's easy to fold into a routine without changing much else.",
      "We won't tell you it cures anything, balances anything, or replaces a conversation with your doctor. It doesn't, and we're not going to pretend otherwise.",
      "What we will say: it's a genuinely useful thing to have around, and a spoonful a day is an easy habit to keep. See our Nutrition page for the full, verified per-serving breakdown.",
    ],
  },
  {
    slug: "ways-to-eat-flaxtore",
    title: "Seven ways to eat a bag of Flaxtore before it disappears",
    excerpt: "From straight-out-of-the-pouch to a proper breakfast bowl.",
    category: "Everyday",
    readTime: "2 min read",
    content: [
      "Straight from the pouch, at your desk, mid-deadline. Stirred into yogurt for a mid-morning reset. Scattered over oats. Blended into a smoothie for texture as much as anything else.",
      "Folded into a breakfast bowl. Tossed over a salad in place of croutons. Mixed into your own trail mix for a flight, a hike, or a long day that doesn't have a clean break in it.",
      "None of these are rules. They're just what tends to happen once a bag is open.",
    ],
  },
];

export function getJournalPostBySlug(slug: string) {
  return journalPosts.find((p) => p.slug === slug);
}
