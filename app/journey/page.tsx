import type { Metadata } from "next";
import Image from "next/image";
import { JOURNEY, JOURNEY_STOPS, PERSON } from "@/content/site";
import { PageTransition } from "../page-transition";
import { SiteFooter } from "../site-footer";
import { SOCIALS } from "../socials";
import { JourneyShell } from "./journey-shell";
import { StoryPanel } from "./story-panel";
import type { JourneyStop } from "./types";
import "../home.css";
import "../work/work.css";
import "./journey.css";
import { SiteHeader } from "@/app/site-header";

export const metadata: Metadata = {
  title: `${PERSON.shortName} | My Journey`,
  description: JOURNEY.description,
};

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

/** A dated list of stops, one row each (education, honors). */
function ListSection({ id, heading, stops }: { id: string; heading: string; stops: JourneyStop[] }) {
  return (
              <section id={id} className="jr-section" aria-labelledby={`${id}-h`}>
                <div className="jr-section-head">
                  <h2 id={`${id}-h`} className="jr-section-title">
                    {heading}
                  </h2>
                </div>

                <ol className="jr-edu">
                  {stops.map((stop) => (
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
  );
}

export default function JourneyPage() {
  const careerStops = stopsOf("work");
  const eduStops = stopsOf("education");
  const awardStops = stopsOf("award");

  return (
    <PageTransition>
      <div className="home-gallery jr-page">
        <SiteHeader active="/journey" />

        <JourneyShell>
          <section className="jr-hero" aria-labelledby="jr-heading">
            <h1 id="jr-heading" className="jr-hero-title">
              {JOURNEY.heading}
            </h1>
            <p className="jr-hero-lede">{JOURNEY.tagline}</p>
          </section>

              <section id="jr-career" className="jr-section" aria-labelledby="jr-career-h">
                <div className="jr-section-head">
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

              <ListSection id="jr-education" heading="Education" stops={eduStops} />
              <ListSection id="jr-awards" heading="Honors & Awards" stops={awardStops} />
        </JourneyShell>

        <SiteFooter
          openToWork={PERSON.openToWork}
          socials={SOCIALS.map((s) => ({ label: s.label, href: s.href, d: s.d }))}
        />
      </div>
    </PageTransition>
  );
}
