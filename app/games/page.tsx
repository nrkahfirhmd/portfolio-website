import type { Metadata } from "next";
import Link from "next/link";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { SOCIALS } from "../socials";
import { BackArrow } from "../software/parts";
import { STAGES, STUDIO } from "./games";
import { Library } from "./library";
import "../home.css";
import "../software/project-lists.css";
import "./games.css";

export const metadata: Metadata = {
  title: "Game Development — Kv",
  description:
    "Games by Kahfi Rahmada with Batang Kayu Studio: stealth comedy, crowd-spotting puzzles, and whatever's next in the forge.",
};

export default function GamesPage() {
  return (
    <main className="gd gd-full">
      <CursorDot />
      <MagneticGrid />

      <header className="gd-bar">
        <Link href="/" className="gd-home" aria-label="Back to the index">
          kv<span aria-hidden="true">/</span>games
        </Link>
      </header>

      {/* Same shape as /software's intro: a compact block centred on the
          page, text left-aligned inside. */}
      <section className="gd-intro" aria-labelledby="gd-name">
        <h1 id="gd-name" className="gd-name">
          Kahfi Rahmada
        </h1>
        <p className="gd-role">
          Game Developer @ <a href={STUDIO.url}>{STUDIO.name}</a>
        </p>
        {/* TODO(kv): draft; say it your way. */}
        <p className="gd-lede">
          I make games that stay with you long after the credits roll. Design, code, art, sound: whatever it needs, I take it to done.
        </p>
      </section>

      <section id="library" className="gd-library" aria-labelledby="library-heading">
        <h2 id="library-heading" className="gd-h2">
          Library
        </h2>
        <Library stages={STAGES} />
      </section>

      <footer id="contact" className="gd-contact" aria-labelledby="credits-heading">
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
      </footer>
    </main>
  );
}
