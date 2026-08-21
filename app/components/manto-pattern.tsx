export function MantoPattern() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-accent-600"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="seigaiha"
          width="120"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.25">
            <path d="M0 60a60 60 0 0 1 60-60a60 60 0 0 1 60 60" />
            <path d="M0 60a48 48 0 0 1 48-48a48 48 0 0 1 48 60" />
            <path d="M0 60a36 36 0 0 1 36-36a36 36 0 0 1 36 60" />
            <path d="M0 60a24 24 0 0 1 24-24a24 24 0 0 1 24 60" />
            <path d="M0 60a12 12 0 0 1 12-12a12 12 0 0 1 12 60" />
          </g>
        </pattern>
        <pattern
          id="seigaiha-move"
          width="120"
          height="60"
          patternUnits="userSpaceOnUse"
        >
          <g fill="none" stroke="currentColor" strokeWidth="1.25">
            <path d="M0 60a60 60 0 0 1 60-60a60 60 0 0 1 60 60" />
            <path d="M0 60a48 48 0 0 1 48-48a48 48 0 0 1 48 60" />
            <path d="M0 60a36 36 0 0 1 36-36a36 36 0 0 1 36 60" />
            <path d="M0 60a24 24 0 0 1 24-24a24 24 0 0 1 24 60" />
            <path d="M0 60a12 12 0 0 1 12-12a12 12 0 0 1 12 60" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#seigaiha)" opacity="0.28" />
      <rect
        className="manto-drift"
        width="100%"
        height="100%"
        fill="url(#seigaiha-move)"
        opacity="0.16"
      />
    </svg>
  );
}
