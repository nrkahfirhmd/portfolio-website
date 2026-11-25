import Image from "next/image";
import Link from "next/link";
import { PERSON } from "@/content/site";
import { WorkWithMeButton } from "./work-with-me";

const NAV = [
  { label: "Work", href: "/work" },
  { label: "About Me", href: "/about" },
  { label: "My Journey", href: "/journey" },
  { label: "Side Quests", href: "/side-quests" },
] as const;

type NavHref = (typeof NAV)[number]["href"];

/** The brand, the four-page nav and the contact button. `active` marks the current page; none on the index. */
export function SiteHeader({ active }: { active?: NavHref }) {
  return (
    <header className="gh-header">
      <Link
        href="/"
        className="gh-brand"
        transitionTypes={["nav-back"]}
        aria-label={`${PERSON.name}, home`}
      >
        <span className="gh-mark" aria-hidden="true">
          <Image src="/kv_avatar.webp" alt="" width={44} height={44} className="gh-avatar" priority />
        </span>
        <span className="gh-identity">
          <span className="gh-name">{PERSON.name.toLowerCase()}</span>
          <span className="gh-role">Software Engineer</span>
        </span>
      </Link>

      <nav className="gh-nav" aria-label="Primary">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            transitionTypes={[!active || item.href === active ? "nav-forward" : "nav-back"]}
            className="gh-nav-link"
            data-active={item.href === active || undefined}
            aria-current={item.href === active ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <WorkWithMeButton />
    </header>
  );
}
