import type { Metadata } from "next";
import Link from "next/link";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { SOCIALS } from "../socials";
import { BackArrow } from "../software/parts";
import { AutoplayToggle } from "./cart-media";
import { GAMES, PERSON, STAGES, STUDIO } from "@/content/site";
import { Library } from "./library";
import "../home.css";
import "../software/project-lists.css";
import "./games.css";
import { PageTransition } from "../page-transition";

export const metadata: Metadata = {
  title: GAMES.title,
  description: GAMES.description,
};

export default function GamesPage() {
  return (
    <PageTransition>
      <main className="gd gd-full">
        <CursorDot />
        <MagneticGrid />

        <header className="gd-bar">
          <Link href="/" className="gd-home" aria-label="Back to the index" transitionTypes={["nav-back"]}>
            kv<span aria-hidden="true">/</span>games
          </Link>
        </header>

        {/* Same shape as /software's intro: a compact block centred on the
            page, text left-aligned inside. */}
        <section className="gd-intro rise" aria-labelledby="gd-name">
          <h1 id="gd-name" className="gd-name">
            {PERSON.name}
          </h1>
          <p className="gd-role">
            {GAMES.role} @ <a href={STUDIO.url}>{STUDIO.name}</a>
          </p>
          <p className="gd-lede">{GAMES.summary}</p>
        </section>

        <section id="library" className="gd-library" aria-labelledby="library-heading">
          <div className="gd-library-head">
            <h2 id="library-heading" className="gd-h2">
              {GAMES.libraryHeading}
            </h2>
            <AutoplayToggle />
          </div>
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
          <p className="thanks">{GAMES.thanks}</p>

          <Link className="back" href="/" transitionTypes={["nav-back"]}>
            <BackArrow />
            Back to index
          </Link>
        </footer>
      </main>
    </PageTransition>
  );
}
