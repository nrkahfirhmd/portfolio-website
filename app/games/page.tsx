import type { Metadata } from "next";
import { GAMES, PERSON, STAGES, STUDIO } from "@/content/site";
import { BackLink, PageShell } from "../page-shell";
import { SOCIALS } from "../socials";
import { AutoplayToggle } from "./cart-media";
import { Library } from "./library";
import "../software/project-lists.css";
import "./games.css";

export const metadata: Metadata = {
  title: GAMES.title,
  description: GAMES.description,
};

export default function GamesPage() {
  return (
    <PageShell section="games">
      <section className="page-intro rise" aria-labelledby="gd-name">
        <h1 id="gd-name" className="page-title">
          {PERSON.name}
        </h1>
        <p className="page-sub">
          {GAMES.role} @ <a href={STUDIO.url}>{STUDIO.name}</a>
        </p>
        <p className="page-lede">{GAMES.summary}</p>
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
                <a href={s.href}>{s.display}</a>
              </dd>
            </div>
          ))}
        </dl>
        <p className="thanks">{GAMES.thanks}</p>
        <BackLink />
      </footer>
    </PageShell>
  );
}
