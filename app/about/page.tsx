import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ABOUT, FRIENDS, PERSON } from "@/content/site";
import { PageTransition } from "../page-transition";
import { SiteFooter } from "../site-footer";
import { SOCIALS } from "../socials";
import { DottedGlobe } from "./dotted-globe";
import "../home.css";
import "./about.css";

export const metadata: Metadata = {
  title: ABOUT.title,
  description: ABOUT.description,
};

const NAV_LINKS = [
  { label: "Work", href: "/work", active: false },
  { label: "About Me", href: "/about", active: true },
  { label: "My Journey", href: "/journey", active: false },
  { label: "Side Quests", href: "/side-quests", active: false },
] as const;

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="home-gallery ab-page">
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

        <main className="ab-main">
          {/* 1. About Me (full-screen editorial profile) */}
          <section className="ab-hero" aria-labelledby="ab-heading">
            <h1 id="ab-heading" className="ab-hero-name">
              {PERSON.name.toUpperCase()}
            </h1>

            <div className="ab-hero-body">
              <div className="ab-hero-copy">
                <div className="ab-bio">
                  {ABOUT.bio.map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>

                <div className="ab-hero-actions">
                  <Link href="/work" className="ab-btn ab-btn--primary" transitionTypes={["nav-forward"]}>
                    Explore Work
                  </Link>
                  <Link href="/journey" className="ab-btn" transitionTypes={["nav-forward"]}>
                    My Journey
                  </Link>
                </div>
              </div>

              <div className="ab-photo-grid" role="group" aria-label="Photos of Kahfi Rahmada">
                {ABOUT.photos.map((photo) => (
                  <figure
                    key={photo.src}
                    className={
                      photo.featured
                        ? "ab-photo-tile ab-photo-tile--featured"
                        : "ab-photo-tile"
                    }
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes={
                        photo.featured
                          ? "(max-width: 639px) 50vw, (max-width: 959px) 280px, 240px"
                          : "(max-width: 639px) 50vw, (max-width: 959px) 240px, 210px"
                      }
                      className="ab-photo-img"
                      style={
                        photo.objectPosition
                          ? { objectPosition: photo.objectPosition }
                          : undefined
                      }
                      priority={photo.featured}
                    />
                    {photo.caption ? (
                      <figcaption className="ab-portrait-tag">
                        <span className="ab-portrait-dot" aria-hidden="true" />
                        <span>{photo.caption}</span>
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Quote */}
          <section className="ab-section ab-quote-section" aria-label="Guiding quote">
            <figure className="ab-quote">
              <blockquote className="ab-quote-text">
                &ldquo;{ABOUT.quote.text}&rdquo;
              </blockquote>
              <figcaption className="ab-quote-author">
                <span className="ab-quote-rule" aria-hidden="true" />
                <cite>{ABOUT.quote.author}</cite>
              </figcaption>
            </figure>
          </section>

          {/* 3. My Values */}
          <section className="ab-section ab-values-section" aria-labelledby="ab-values-heading">
            <div className="ab-split">
              <div className="ab-split-head">
                <span className="ab-section-num" aria-hidden="true">
                  01
                </span>
                <h2 id="ab-values-heading" className="ab-section-title">
                  My Values
                </h2>
                <p className="ab-section-sub">
                  Principles that guide how I design systems, work with teams, and finish products.
                </p>
              </div>

              <ol className="ab-values-grid">
                {ABOUT.values.map((v) => (
                  <li key={v.number} className="ab-value-card">
                    <span className="ab-value-num">{v.number}</span>
                    <h3 className="ab-value-title">{v.title}</h3>
                    <p className="ab-value-body">{v.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 3. Interactive Dotted Globe */}
          <section className="ab-section ab-globe-section" aria-labelledby="ab-globe-heading">
            <DottedGlobe places={ABOUT.globePlaces} />

            <div className="ab-globe-copy">
              <h2 id="ab-globe-heading" className="ab-globe-title">
                {ABOUT.globeHeading}
              </h2>
              <p className="ab-globe-sub">{ABOUT.globeSubtitle}</p>
            </div>
          </section>

          {/* 4. Wall of Friends */}
          <section className="ab-section ab-friends-section" aria-labelledby="ab-friends-heading">
            <div className="ab-friends-head">
              <div>
                <p className="ab-eyebrow">03 / COMMUNITY</p>
                <h2 id="ab-friends-heading" className="ab-friends-title">
                  Friends &amp; Mentors
                </h2>
              </div>
              <p className="ab-friends-note">
                People, studios, and communities who shaped how I build.
              </p>
            </div>

            <ul className="ab-friends-grid">
              {FRIENDS.map((friend, index) => (
                <li key={`${friend.name}-${index}`} className="ab-friend-item">
                  {friend.url ? (
                    <a
                      href={friend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ab-friend-card"
                    >
                      <span className="ab-friend-name">
                        {friend.name}
                        <span className="ab-friend-arrow" aria-hidden="true">
                          ↗
                        </span>
                      </span>
                      <span className="ab-friend-role">{friend.role}</span>
                      {friend.domain ? (
                        <span className="ab-friend-domain">{friend.domain}</span>
                      ) : null}
                    </a>
                  ) : (
                    <div className="ab-friend-card ab-friend-card--static">
                      <span className="ab-friend-name">{friend.name}</span>
                      <span className="ab-friend-role">{friend.role}</span>
                      {friend.domain ? (
                        <span className="ab-friend-domain">{friend.domain}</span>
                      ) : null}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
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
