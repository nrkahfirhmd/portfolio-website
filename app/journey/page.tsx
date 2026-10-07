import type { Metadata } from "next";
import Link from "next/link";
import { JOURNEY, JOURNEY_STOPS } from "@/content/site";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { PageTransition } from "../page-transition";
import { BackArrow } from "../software/parts";
import { StoryPanel } from "./story-panel";
import type { JourneyStop } from "./types";
import "../home.css";
// The story panel is side-quests' article card; its styles come from there.
import "../side-quests/side-quests.css";
import "./journey.css";

export const metadata: Metadata = {
  title: JOURNEY.title,
  description: JOURNEY.description,
};



/**
 * The path's share for one stop, in a 100x100 box stretched over the stop's
 * row: down from the centre line, out to the stop's node on one side, and
 * back to the centre at the bottom. Every row starts and ends at the centre,
 * so the rows join into one continuous winding path.
 */
function bend(x: number) {
  return `M50 0 C50 25 ${x} 25 ${x} 50 C${x} 75 50 75 50 100`;
}

const MONTHS = /jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/i;

/** When a stop began, as a sortable month count: its first month and first
 * year ("Feb – Dec 2024" -> Feb 2024, "Nov 2025 – Jan 2026" -> Nov 2025).
 * A year alone counts as January. */
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

/** Education: long stages that overlap rather than follow one another, so
 * a plain list: period, then programme and institution. */
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

/** Competitions: separate events where the result is the point, so a grid
 * of cards with the placement as the headline. */
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

/** The story so far: the career as a winding path, then education and
 * competitions, each newest first. */
export default function JourneyPage() {
  return (
    <PageTransition>
      <main className="jr">
        <CursorDot />
        <MagneticGrid />

        <header className="jr-bar">
          <Link href="/" className="jr-home" aria-label="Back to the index" transitionTypes={["nav-back"]}>
            kv<span aria-hidden="true">/</span>journey
          </Link>
        </header>

        <section className="jr-intro rise" aria-labelledby="jr-heading">
          <h1 id="jr-heading" className="jr-heading">
            {JOURNEY.heading}
          </h1>
          <p className="jr-tagline">{JOURNEY.tagline}</p>
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

        <Link className="back jr-back" href="/" transitionTypes={["nav-back"]}>
          <BackArrow />
          Back to index
        </Link>
      </main>
    </PageTransition>
  );
}
