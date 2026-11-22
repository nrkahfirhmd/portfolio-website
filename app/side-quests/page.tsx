import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PERSON,
  SIDE_QUEST_ALBUM,
  SIDE_QUEST_ENTRIES,
  SIDE_QUEST_KEEPSAKES,
  SIDE_QUEST_STICKERS,
  SIDE_QUESTS,
} from "@/content/site";
import { PageTransition } from "../page-transition";
import { SiteFooter } from "../site-footer";
import { SOCIALS } from "../socials";
import { SideQuestBento } from "./bento";
import "../home.css";
import "./side-quests.css";

export const metadata: Metadata = {
  title: `${PERSON.shortName} | Side Quests`,
  description: SIDE_QUESTS.description,
};

const NAV_LINKS = [
  { label: "Work", href: "/work", active: false },
  { label: "About Me", href: "/about", active: false },
  { label: "My Journey", href: "/journey", active: false },
  { label: "Side Quests", href: "/side-quests", active: true },
] as const;

export default function SideQuestsPage() {
  return (
    <PageTransition>
      <div className="home-gallery sq-page">
        <header className="gh-header">
          <Link
            href="/"
            className="gh-brand"
            transitionTypes={["nav-back"]}
            aria-label={`${PERSON.name}, home`}
          >
            <span className="gh-mark" aria-hidden="true">
              <Image
                src="/kv_avatar.svg"
                alt=""
                width={44}
                height={44}
                className="gh-avatar"
                priority
              />
            </span>
            <span className="gh-identity">
              <span className="gh-name">{PERSON.name.toLowerCase()}</span>
              <span className="gh-role">Software Engineer</span>
            </span>
          </Link>

          <nav className="gh-nav" aria-label="Primary">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                transitionTypes={[item.active ? "nav-forward" : "nav-back"]}
                className="gh-nav-link"
                data-active={item.active || undefined}
                aria-current={item.active ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href="mailto:nurkahfirahmada@gmail.com?subject=Work%20with%20Kahfi"
            className="gh-cta"
          >
            Work With Me
          </a>
        </header>

        <main className="sq-main">
          <section className="sq-hero" aria-labelledby="sq-heading">
            <p className="sq-eyebrow">SIDE QUESTS</p>
            <h1 id="sq-heading" className="sq-hero-title">
              {SIDE_QUESTS.heading}
            </h1>
            <p className="sq-hero-lede">{SIDE_QUESTS.tagline}</p>
          </section>

          <div className="sq-shell">
            <SideQuestBento
              entries={SIDE_QUEST_ENTRIES}
              album={SIDE_QUEST_ALBUM}
              keepsakes={SIDE_QUEST_KEEPSAKES}
              stickers={SIDE_QUEST_STICKERS}
              funFact={SIDE_QUESTS.funFact}
            />
          </div>
        </main>

        <SiteFooter
          name={PERSON.name}
          openToWork={PERSON.openToWork}
          socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
        />
      </div>
    </PageTransition>
  );
}
