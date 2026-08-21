import { socials, type Social } from "@/lib/content";

function Icon({ type }: { type: Social["key"] }) {
  const common = {
    "aria-hidden": true,
    className: "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
  } as const;

  switch (type) {
    case "github":
      return (
        <svg {...common}>
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 3.98 2.58 7.35 6.16 8.54.45.08.62-.2.62-.43v-1.52c-2.5.54-3.03-1.2-3.03-1.2-.41-1.04-1-1.32-1-1.32-.82-.56.06-.55.06-.55.9.06 1.38.93 1.38.93.8 1.37 2.1.98 2.62.75.08-.58.31-.98.57-1.2-2-.23-4.1-1-4.1-4.45 0-.98.35-1.79.93-2.42-.1-.23-.4-1.15.09-2.4 0 0 .76-.24 2.5.93a8.6 8.6 0 0 1 4.54 0c1.73-1.17 2.5-.93 2.5-.93.49 1.25.18 2.17.09 2.4.58.63.93 1.44.93 2.42 0 3.46-2.1 4.22-4.11 4.44.32.28.61.83.61 1.67v2.47c0 .24.16.52.62.43A9 9 0 0 0 21 12c0-4.97-4.03-9-9-9Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 10v7M7 7v.01M11 17v-4a2 2 0 0 1 4 0v4" />
        </svg>
      );
  }
}

export function SocialLinks() {
  return (
    <ul className="flex flex-wrap gap-3">
      {socials.map((social) => (
        <li key={social.key}>
          <a
            href={social.href}
            aria-label={social.label}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-ink transition-[color,background-color,border-color] duration-150 hover:border-accent hover:bg-accent-soft hover:text-accent-active"
          >
            <Icon type={social.key} />
          </a>
        </li>
      ))}
    </ul>
  );
}
