/**
 * Minimal, brand-neutral outline glyphs for the two social links we need.
 * lucide-react intentionally ships no third-party brand marks, so these are
 * simple generic outline icons drawn to match the rest of the icon set
 * (1.75 stroke, 24px grid) rather than an official platform logo.
 */
export function InstagramIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5h3l.5-3.5h-3.5V7.5A1 1 0 0 1 12.5 6.5H15V3Z" strokeLinejoin="round" />
    </svg>
  );
}
