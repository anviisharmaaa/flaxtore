export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  title: string;
  items: FaqItem[];
};

export const faqGroups: FaqGroup[] = [
  {
    title: "Product",
    items: [
      {
        question: "What exactly is Flaxtore?",
        answer:
          "Flaxtore is Sortex-cleaned, slow-roasted flaxseed, made to be eaten as an everyday snack rather than measured out as a supplement. It comes in three flavours.",
      },
      {
        question: "Do I need to prepare it before eating?",
        answer:
          "No. Every seed is roasted and ready to eat straight from the pouch — or stirred into yogurt, oats, smoothies and salads. See Ways to Eat on the homepage for ideas.",
      },
      {
        question: "Is Flaxtore whole flaxseed or ground?",
        answer:
          "Flaxtore is roasted whole flaxseed, sortex-cleaned before roasting for consistent quality. [VERIFY BEFORE PUBLISHING: confirm whether seeds are cracked/ground during roasting.]",
      },
    ],
  },
  {
    title: "Nutrition",
    items: [
      {
        question: "What's the nutritional value per serving?",
        answer:
          "A 20g serving contains 110 kcal, 3.8g protein, 8.0g total fat (including 4.2g Omega-3 ALA), 4.6g carbohydrates, 5.3g dietary fibre and 0.2g total sugars. Full detail is on our Nutrition page. This is reference data — always check the pack for the final, approved panel.",
      },
      {
        question: "Does Flaxtore help with any specific health condition?",
        answer:
          "We don't make medical claims, and Flaxtore isn't intended to diagnose, treat, cure or prevent any condition. It's a nutritious everyday snack — for anything specific to your health, please speak with a qualified professional.",
      },
    ],
  },
  {
    title: "Orders & Shipping",
    items: [
      {
        question: "Where do you ship?",
        answer:
          "[CONTENT NEEDED: confirm serviceable pin codes / regions before publishing.]",
      },
      {
        question: "How long does delivery take?",
        answer:
          "[CONTENT NEEDED: confirm delivery timelines before publishing.] See our Shipping page for details as they're finalised.",
      },
      {
        question: "What's your return policy?",
        answer:
          "[CONTENT NEEDED: confirm return window and conditions before publishing.] See our Returns page for details as they're finalised.",
      },
    ],
  },
];
