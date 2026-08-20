import Link from "next/link";
import { GATEWAY_URL, SOCIALS } from "./projects";

// Anchors are absolute (`/#work`) rather than bare fragments so they still
// resolve from a story page under /work/.
export function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-surface border-b border-border">
      <nav className="max-w-5xl mx-auto px-gutter h-16 flex items-center justify-between">
        <a
          href={GATEWAY_URL}
          className="text-label font-medium tracking-wide text-ink hover:text-accent transition-colors duration-150"
        >
          kv<span className="text-ink-faint">/</span>ai
        </a>

        <ul className="flex items-center gap-stack-sm text-caption font-medium tracking-wider uppercase">
          <li>
            <Link
              href="/#work"
              className="text-ink-muted hover:text-accent transition-colors duration-150"
            >
              Work
            </Link>
          </li>
          <li>
            <Link
              href="/#contact"
              className="text-ink-muted hover:text-accent transition-colors duration-150"
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

const SOCIAL_ICONS = {
  GitHub: GitHubIcon,
  LinkedIn: LinkedInIcon,
  Email: MailIcon,
};

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border scroll-mt-16">
      <div className="max-w-5xl mx-auto px-gutter py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-stack-sm">
        <div>
          <p className="text-label text-ink">Kahfi Rahmada</p>
        </div>

        <ul className="flex items-center gap-stack-xs">
          {SOCIALS.map(({ label, href }) => {
            const Icon = SOCIAL_ICONS[label];
            return (
              <li key={label}>
                <a href={href} aria-label={label} className="social-icon">
                  <Icon />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5C5.73.5.99 5.24.99 11.5c0 4.85 3.15 8.96 7.51 10.41.55.1.75-.24.75-.53v-1.86c-3.06.67-3.71-1.48-3.71-1.48-.5-1.28-1.22-1.62-1.22-1.62-1-.68.08-.67.08-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.69 2.58 1.2 3.21.92.1-.71.39-1.2.7-1.48-2.44-.28-5.01-1.22-5.01-5.44 0-1.2.43-2.19 1.13-2.96-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.4 10.4 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.76 1.13 2.96 0 4.23-2.58 5.16-5.03 5.43.4.34.75 1.02.75 2.06v3.05c0 .29.2.64.76.53a11.02 11.02 0 0 0 7.5-10.41C23.01 5.24 18.27.5 12 .5Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.63c0-1.34-.03-3.07-1.9-3.07-1.9 0-2.19 1.46-2.19 2.97V21h-4V9Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3 6.5 9 6 9-6" />
    </svg>
  );
}
