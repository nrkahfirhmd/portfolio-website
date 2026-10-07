import Link from "next/link";
import { BaliClock } from "./bali-clock";
import { Canopy } from "./canopy";
import { CursorDot } from "./cursor-dot";
import { CursorParallax } from "./cursor-parallax";
import { GithubActivity } from "./github-activity";
import { MagneticGrid } from "./magnetic-grid";
import { PaintName } from "./paint-name";
import { PortraitToggle } from "./portrait-toggle";
import { SOCIALS } from "./socials";
import { SparkWord } from "./spark-word";
import { GATEWAYS, HOME, PERSON } from "@/content/site";
import "./home.css";
import { PageTransition } from "./page-transition";

export default function Home() {
  return (
    <PageTransition>
      <main className="home">
        <CursorParallax />
        <CursorDot />
        <MagneticGrid />

        <Canopy />

        <div className="eyebrow flex justify-between items-center w-full" data-enter style={{ "--i": 0 } as React.CSSProperties}>
          <p className="kv" aria-label="KV">
            <span className="kv-letter" tabIndex={0}>
              <span className="kv-base" aria-hidden="true">K</span>
              <span className="kv-alt" aria-hidden="true">ƙ</span>
            </span>
            <span className="kv-letter" tabIndex={0}>
              <span className="kv-base" aria-hidden="true">V</span>
              <span className="kv-alt" aria-hidden="true">Ɣ</span>
            </span>
          </p>
          <GithubActivity username={PERSON.github} nowBuilding={HOME.nowBuilding} />
          <BaliClock />
        </div>

        <div className="stage">
          <div className="halo" data-enter style={{ "--i": 1 } as React.CSSProperties}>
            <PortraitToggle name={PERSON.name} />
          </div>

          <PaintName>{PERSON.name}</PaintName>

          <p className="tagline" data-enter style={{ "--i": 3 } as React.CSSProperties}>
            {/* "[word]" in the tagline marks a spark: split puts those at odd indexes. */}
            {HOME.tagline.split(/\[(.+?)\]/).map((part, i) =>
              i % 2 ? <SparkWord key={i}>{part}</SparkWord> : part,
            )}
            <br />
            <span className="muted">{HOME.roles}</span>
          </p>

          <nav className="gates" aria-label="Portfolios">
            {GATEWAYS.map((g, i) => (
              <Link
                key={g.slug}
                transitionTypes={["nav-forward"]}
                className="gate"
                href={`/${g.slug}`}
                data-enter
                style={{ "--i": i + 4 } as React.CSSProperties}
              >
                <svg
                  className="arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden="true"
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
                <h2>{g.name}</h2>
                <p>{g.desc}</p>
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom-left: the door to the side quests. */}
        <Link
          href="/side-quests"
          className="door"
          aria-label="Side quests"
          transitionTypes={["nav-forward"]}
          data-enter
          style={{ "--i": 8 } as React.CSSProperties}
        >
          <span className="door-frame" aria-hidden="true">
            <span className="door-leaf" />
          </span>
          <span className="door-label">Side quests</span>
        </Link>

        {/* Bottom-right: the trail to the journey. */}
        <Link
          href="/journey"
          className="trail"
          aria-label="Journey"
          transitionTypes={["nav-forward"]}
          data-enter
          style={{ "--i": 8 } as React.CSSProperties}
        >
          <span className="door-label">Journey</span>
          <svg className="trail-icon" viewBox="0 0 30 30" aria-hidden="true">
            <path className="trail-line" d="M3 27c6 0 5-9 11-9s5-9 11-9" />
            <path className="trail-pin" d="M25 9.5c-2.2-2.4-3.3-4.1-3.3-5.2a3.3 3.3 0 0 1 6.6 0c0 1.1-1.1 2.8-3.3 5.2z" />
          </svg>
        </Link>

        <footer className="foot" data-enter style={{ "--i": 7 } as React.CSSProperties}>
          <nav className="socials" aria-label="Contact and social">
            {SOCIALS.map((s) => (
              <a key={s.label} className="social" href={s.href} aria-label={s.label}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </nav>
          {PERSON.openToWork && <span className="status">Open to work</span>}
        </footer>
      </main>
    </PageTransition>
  );
}
