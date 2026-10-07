import type { Metadata } from "next";
import { JOURNEY, JOURNEY_STOPS } from "@/content/site";
import { BackLink, PageShell } from "../page-shell";
import { StoryPanel } from "./story-panel";
import type { JourneyStop } from "./types";
// The story panel is side-quests' article card; its styles come from there.
import "../side-quests/side-quests.css";
import "./journey.css";

export const metadata: Metadata = {
  title: JOURNEY.title,
  description: JOURNEY.description,
};



/** One row's stretch of path (100x100, stretched): centre, out to the node at x, back to centre, so rows join into one line. */
function bend(x: number) {
  return `M50 0 C50 25 ${x} 25 ${x} 50 C${x} 75 50 75 50 100`;
}

const MONTHS = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i;

/** Start as a sortable month count: first month + first year ("Nov 2025 – Jan 2026" -> Nov 2025); a bare year is January. */
function start(when: string) {
  const month = MONTHS.exec(when)?.[0].toLowerCase();
  const year = Number(/\d{4}/.exec(when)?.[0] ?? 0);
  return year * 12 + (month ? "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(month) / 3 : 0);
}

const isNow = (when: string) => /now$/i.test(when);

/** One kind of stop, newest first. */
const stopsOf = (kind: JourneyStop["kind"]) =>
  JOURNEY_STOPS.filter((s) => s.kind === kind).sort((a, b) => start(b.when) - start(a.when));

/** Work: one winding path, each job leading to the next. */
function CareerPath({ stops }: { stops: JourneyStop[] }) {
  return (
    <ol className="jr-path">
      {stops.map((stop, i) => {
        const side = i % 2 ? "right" : "left";
        const d = bend(side === "left" ? 20 : 80);
        return (
          <li key={`${stop.when}-${stop.title}`} className="jr-stop" data-side={side} data-now={isNow(stop.when) || undefined}>
            <svg className="jr-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <path className="jr-trail-base" d={d} />
              <path className="jr-trail-walked" d={d} />
            </svg>
            <span className="jr-node" aria-hidden="true" />
            <article className="jr-card reveal">
              <p className="jr-meta">
                <time>{stop.when}</time>
              </p>
              <h3 className="jr-title">{stop.title}</h3>
              {stop.place && <p className="jr-place">{stop.place}</p>}
              <StoryPanel stop={stop} />
            </article>
          </li>
        );
      })}
    </ol>
  );
}

/** Education: overlapping stages, so a plain transcript list. */
function EducationList({ stops }: { stops: JourneyStop[] }) {
  return (
    <ol className="jr-edu">
      {stops.map((stop) => (
        <li key={`${stop.when}-${stop.title}`} className="jr-edu-row reveal" data-now={isNow(stop.when) || undefined}>
          <time className="jr-edu-when">{stop.when}</time>
          <div className="jr-edu-body">
            <h3 className="jr-title">{stop.title}</h3>
            {stop.place && <p className="jr-place">{stop.place}</p>}
            <StoryPanel stop={stop} />
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Competitions: separate events, so cards with the result as the headline. */
function CompetitionGrid({ stops }: { stops: JourneyStop[] }) {
  return (
    <ul className="jr-comps">
      {stops.map((stop) => (
        <li key={`${stop.when}-${stop.title}`} className="jr-comp reveal">
          <p className="jr-result" data-pending={!stop.result || undefined}>
            {stop.result ?? "Result to come"}
          </p>
          <h3 className="jr-title">{stop.title}</h3>
          <p className="jr-place">
            {[stop.place, stop.when].filter(Boolean).join(" · ")}
          </p>
          <StoryPanel stop={stop} />
        </li>
      ))}
    </ul>
  );
}

const SECTIONS = [
  { kind: "work", heading: "Professional career", List: CareerPath },
  { kind: "education", heading: "Education", List: EducationList },
  { kind: "competition", heading: "Competitions", List: CompetitionGrid },
] as const;

/** The story so far: career path, education, competitions, each newest first. */
export default function JourneyPage() {
  return (
    <PageShell section="journey">
        <section className="page-intro rise" aria-labelledby="jr-heading">
          <h1 id="jr-heading" className="page-title">
            {JOURNEY.heading}
          </h1>
          <p className="page-lede">{JOURNEY.tagline}</p>
        </section>

        {SECTIONS.map(({ kind, heading, List }) => {
          const stops = stopsOf(kind);
          if (!stops.length) return null;
          return (
            <section key={kind} className="jr-section" aria-labelledby={`jr-${kind}`}>
              <h2 id={`jr-${kind}`} className="jr-h2">
                {heading}
              </h2>
              <List stops={stops} />
            </section>
          );
        })}

        <BackLink className="page-back" />
    </PageShell>
  );
}
