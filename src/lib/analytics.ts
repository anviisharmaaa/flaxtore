/**
 * Analytics-ready event layer. No analytics provider is wired up yet — each
 * call is a no-op that logs in development, so hooking up a real provider
 * later (GA4, Segment, etc.) means implementing `dispatch` once, not
 * touching every call site.
 */
export type AnalyticsEvent =
  | { name: "view_product"; slug: string }
  | { name: "select_flavour"; slug: string; flavour: string }
  | { name: "add_to_cart"; slug: string; flavour: string; quantity: number }
  | { name: "remove_from_cart"; slug: string; flavour: string }
  | { name: "begin_checkout"; subtotal: number; itemCount: number }
  | { name: "newsletter_signup"; source: string };

function dispatch(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== "production") {
    console.debug("[analytics]", event.name, event);
  }
  // TODO: forward to the configured analytics provider once selected.
}

export const track = {
  viewProduct: (slug: string) => dispatch({ name: "view_product", slug }),
  selectFlavour: (slug: string, flavour: string) =>
    dispatch({ name: "select_flavour", slug, flavour }),
  addToCart: (slug: string, flavour: string, quantity: number) =>
    dispatch({ name: "add_to_cart", slug, flavour, quantity }),
  removeFromCart: (slug: string, flavour: string) =>
    dispatch({ name: "remove_from_cart", slug, flavour }),
  beginCheckout: (subtotal: number, itemCount: number) =>
    dispatch({ name: "begin_checkout", subtotal, itemCount }),
  newsletterSignup: (source: string) =>
    dispatch({ name: "newsletter_signup", source }),
};
