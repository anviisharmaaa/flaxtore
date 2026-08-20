import { BrandPattern } from "@/components/brand/BrandPattern";
import { SeedField } from "@/components/motion/SeedField";

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-900">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_80%_0%,rgba(124,145,99,0.28),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_10%_100%,rgba(16,22,13,0.6),transparent_55%)]" />
      <BrandPattern className="opacity-40" tone="var(--color-brand-500)" />
      <SeedField />
      <div className="grain absolute inset-0" />
    </div>
  );
}
