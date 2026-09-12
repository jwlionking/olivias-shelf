export function CometMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect width="32" height="32" rx="10" fill="#1A2744" />
      <path
        d="M6 22c6-2 10-7 12-13"
        stroke="#D45A3A"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M8 24c5-1.2 8.5-5.5 10-11"
        stroke="#E8B86D"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="21.5" cy="8.5" r="3.4" fill="#F6F0E4" />
      <circle cx="21.5" cy="8.5" r="1.5" fill="#D45A3A" />
    </svg>
  );
}
