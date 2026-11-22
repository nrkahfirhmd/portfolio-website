import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JOURNEY, JOURNEY_STOPS, PERSON } from "@/content/site";
import { PageTransition } from "../page-transition";
import { SiteFooter } from "../site-footer";
import { SOCIALS } from "../socials";
import { StoryPanel } from "./story-panel";
import type { JourneyStop } from "./types";
import "../home.css";
import "./journey.css";

export const metadata: Metadata = {
  title: `${PERSON.shortName} | My Journey`,
  description: JOURNEY.description,
};

const NAV_LINKS = [
  { label: "Work", href: "/work", active: false },
  { label: "About Me", href: "/about", active: false },
  { label: "My Journey", href: "/journey", active: true },
  { label: "Side Quests", href: "/side-quests", active: false },
] as const;

const MONTHS = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i;

/** Start as a sortable month count: first month + first year ("Nov 2025 – Jan 2026" -> Nov 2025). */
function start(when: string) {
  const month = MONTHS.exec(when)?.[0].toLowerCase();
  const year = Number(/\d{4}/.exec(when)?.[0] ?? 0);
  return year * 12 + (month ? "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(month) / 3 : 0);
}

const isNow = (when: string) => /now$/i.test(when);

const stopsOf = (kind: JourneyStop["kind"]) =>
  JOURNEY_STOPS.filter((s) => s.kind === kind).sort((a, b) => start(b.when) - start(a.when));

export default function JourneyPage() {
  const careerStops = stopsOf("work");
  const eduStops = stopsOf("education");

  return (
    <PageTransition>
      <div className="home-gallery jr-page">
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

        <main className="jr-main">
          <section className="jr-hero" aria-labelledby="jr-heading">
            <p className="jr-eyebrow">MY JOURNEY</p>
            <h1 id="jr-heading" className="jr-hero-title">
              {JOURNEY.heading}
            </h1>
            <p className="jr-hero-lede">{JOURNEY.tagline}</p>
          </section>

          <div className="jr-layout">
            <aside className="jr-rail" aria-label="Journey sections">
              <nav className="jr-rail-nav">
                <a href="#jr-career" className="jr-rail-link">
                  <span className="jr-rail-num">01</span>
                  <span>CAREER</span>
                </a>
                <a href="#jr-education" className="jr-rail-link">
                  <span className="jr-rail-num">02</span>
                  <span>EDUCATION</span>
                </a>
              </nav>

              <div className="jr-rail-legend">
                <span className="jr-now-dot" aria-hidden="true" />
                <span>Currently active</span>
              </div>
            </aside>

            <div className="jr-content">
              <section id="jr-career" className="jr-section" aria-labelledby="jr-career-h">
                <div className="jr-section-head">
                  <span className="jr-section-num" aria-hidden="true">
                    01
                  </span>
                  <h2 id="jr-career-h" className="jr-section-title">
                    Career
                  </h2>
                </div>

                <ol className="jr-timeline">
                  {careerStops.map((stop) => {
                    const active = isNow(stop.when);
                    return (
                      <li
                        key={`${stop.when}-${stop.title}`}
                        className="jr-entry"
                        data-now={active || undefined}
                      >
                        <span className="jr-node" aria-hidden="true" />

                        <article className="jr-card">
                          <div className="jr-meta">
                            <time className="jr-when">{stop.when}</time>
                            {active ? (
                              <span className="jr-now-pill">
                                <span className="jr-now-dot" aria-hidden="true" />
                                Active
                              </span>
                            ) : null}
                          </div>

                          <h3 className="jr-title">{stop.title}</h3>
                          {stop.place ? <p className="jr-place">{stop.place}</p> : null}
                          {stop.summary ? <p className="jr-summary">{stop.summary}</p> : null}

                          {stop.images?.length ? (
                            <ul className="jr-media" aria-label={`${stop.images.length} photos`}>
                              {stop.images.map((src) => (
                                <li key={src}>
                                  <Image src={src} alt="" width={128} height={96} />
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          <div className="jr-foot">
                            {stop.skills?.length ? (
                              <ul className="jr-skills">
                                {stop.skills.slice(0, 3).map((skill) => (
                                  <li key={skill}>{skill}</li>
                                ))}
                              </ul>
                            ) : (
                              <span />
                            )}

                            <span className="jr-read" aria-hidden="true">
                              Read story <span className="jr-read-arrow">&rarr;</span>
                            </span>
                          </div>

                          <StoryPanel stop={stop} />
                        </article>
                      </li>
                    );
                  })}
                </ol>
              </section>

              <section id="jr-education" className="jr-section" aria-labelledby="jr-edu-h">
                <div className="jr-section-head">
                  <span className="jr-section-num" aria-hidden="true">
                    02
                  </span>
                  <h2 id="jr-edu-h" className="jr-section-title">
                    Education
                  </h2>
                </div>

                <ol className="jr-edu">
                  {eduStops.map((stop) => (
                    <li
                      key={`${stop.when}-${stop.title}`}
                      className="jr-edu-row"
                      data-now={isNow(stop.when) || undefined}
                    >
                      <time className="jr-when jr-edu-when">{stop.when}</time>
                      <div className="jr-edu-body">
                        <h3 className="jr-title">{stop.title}</h3>
                        {stop.place ? <p className="jr-place">{stop.place}</p> : null}
                        {stop.summary ? <p className="jr-summary">{stop.summary}</p> : null}

                        <div className="jr-foot">
                          {stop.skills?.length ? (
                            <ul className="jr-skills">
                              {stop.skills.slice(0, 3).map((skill) => (
                                <li key={skill}>{skill}</li>
                              ))}
                            </ul>
                          ) : (
                            <span />
                          )}

                          <span className="jr-read" aria-hidden="true">
                            Read story <span className="jr-read-arrow">&rarr;</span>
                          </span>
                        </div>
                      </div>
                      <StoryPanel stop={stop} />
                    </li>
                  ))}
                </ol>
              </section>
            </div>
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
