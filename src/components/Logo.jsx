// Restaurant mark: framed letter "A" (same as the favicon).

export default function Logo({ size = 44, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#0E1813" />
      <rect x="3" y="3" width="58" height="58" rx="11" fill="none" stroke="#E3AE3C" strokeWidth="2" />
      <path
        d="M32 14 L46 50 H40.5 L37.6 42 H26.4 L23.5 50 H18 Z M28.2 37 H35.8 L32 26.6 Z"
        fill="#E3AE3C"
        fillRule="evenodd"
      />
    </svg>
  );
}
