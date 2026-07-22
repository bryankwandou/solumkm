/**
 * Solumkm mark.
 *
 * A rounded token holding a rising step-line — the shape a small business's
 * numbers make when they finally go up and to the right — that resolves into a
 * verification tick at its end. Two brand stops (green → purple) run along the
 * stroke so the growth line and the trust mark are literally the same gesture.
 */
export function SolumkmMark({ size = 26 }: { size?: number }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="solumkm-fill" x1="0" y1="32" x2="32" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0E8F62" />
          <stop offset="0.55" stopColor="#1FA97D" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="solumkm-stroke" x1="6" y1="24" x2="26" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAFBF3" />
          <stop offset="1" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* token */}
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#solumkm-fill)" />
      <rect
        x="1.75"
        y="1.75"
        width="28.5"
        height="28.5"
        rx="8.25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />

      {/* rising step-line that ends in a verification tick */}
      <path
        d="M6.5 21.5 L12 21.5 L15.5 16 L19 19 L25.5 9.5"
        stroke="url(#solumkm-stroke)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* tick foot, so the line-end reads as a check, not just a slope */}
      <path
        d="M21.4 12.9 L19 19"
        stroke="url(#solumkm-stroke)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeOpacity="0"
      />
      <circle cx="25.5" cy="9.5" r="2.1" fill="#ffffff" />
    </svg>
  );
}
