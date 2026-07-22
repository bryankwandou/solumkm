/**
 * Solumkm mark — a sprout breaking out of a coin.
 * Small business growing; the ring is the verified record around it.
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
        <linearGradient id="solumkm-g" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0E8F62" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#solumkm-g)" />
      <path
        d="M16 24V14.5"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M16 15c0-3.1 2.3-5.6 5.4-5.9.3 3.2-2 5.9-5.4 5.9Z"
        fill="#fff"
      />
      <path
        d="M15.6 18.4c-2.8 0-4.9-2.1-5-4.9 2.8-.1 5 2 5 4.9Z"
        fill="#fff"
        fillOpacity="0.75"
      />
    </svg>
  );
}
