import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { SOCIALS } from "../socials";
import { BackArrow } from "../software/parts";
import { STAGES, STUDIO } from "./games";
import { LevelMap } from "./level-map";
import "../home.css";
import "./games.css";

export const metadata: Metadata = {
  title: "Game Development — Kv",
  description:
    "Games by Kahfi Rahmada with Batang Kayu Studio: stealth comedy, crowd-spotting puzzles, and whatever's next in the forge.",
};

export default function GamesPage() {
  return (
    <main className="gd">
      <CursorDot />
      <MagneticGrid />

      <header className="gd-bar">
        <Link href="/" className="gd-home" aria-label="Back to the index">
          kv<span aria-hidden="true">/</span>games
        </Link>
        <nav aria-label="Sections" className="gd-nav">
          <a href="#levels">Levels</a>
          <a href="#credits">Credits</a>
        </nav>
      </header>

      {/* Title screen: centred, the way a game boots. The portrait is served
          tiny and scaled up with nearest-neighbour, so the same photo the
          rest of the site uses turns up here as a sprite. */}
      <section className="gd-title" aria-labelledby="gd-name">
        <Image
          className="gd-sprite"
          src="/portrait.png"
          alt="Kahfi Rahmada, as a pixel sprite"
          // 16px at 1x, 32px at 2x — few enough pixels that each one reads
          // as a block once CSS scales it up.
          width={16}
          height={16}
          priority
        />
        <h1 id="gd-name" className="gd-name">
          Kahfi Rahmada
        </h1>
        <p className="gd-lede">
          Designing systems, mechanics, and moments worth{" "}
          <span className="flourish">playing</span>.
        </p>
        <p className="gd-studio">
          Making games with <a href={STUDIO.url}>{STUDIO.name}</a>.
        </p>
        <a className="start" href="#levels">
          Press start
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          </svg>
        </a>
      </section>

      <section id="levels" className="gd-levels" aria-labelledby="levels-heading">
        <h2 id="levels-heading" className="gd-h2">
          Level select
        </h2>
        <LevelMap stages={STAGES} />
      </section>

      <section id="credits" className="gd-credits" aria-labelledby="credits-heading">
        <h2 id="credits-heading" className="gd-h2">
          Credits
        </h2>
        <dl className="roll">
          <div>
            <dt>Studio</dt>
            <dd>
              <a href={STUDIO.url}>{STUDIO.name}</a>
            </dd>
          </div>
          {SOCIALS.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>
                <a href={s.href}>{s.href.replace(/^mailto:|^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a>
              </dd>
            </div>
          ))}
        </dl>
        <p className="thanks">Thanks for playing.</p>

        <Link className="back" href="/">
          <BackArrow />
          Back to index
        </Link>
      </section>
    </main>
  );
}
