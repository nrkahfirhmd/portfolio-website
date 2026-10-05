import type { Metadata } from "next";
import Link from "next/link";
import { CursorDot } from "../cursor-dot";
import { AutoplayToggle } from "../games/cart-media";
import { MagneticGrid } from "../magnetic-grid";
import { SOCIALS } from "../socials";
import { BackArrow } from "./parts";
import { Bento } from "./project-lists";
import { CURRENT, PERSON, SOFTWARE } from "@/content/site";
import "../home.css";
import "./software.css";
import "./project-lists.css";
import { PageTransition } from "../page-transition";

export const metadata: Metadata = {
  title: SOFTWARE.title,
  description: SOFTWARE.description,
};

export default function SoftwarePage() {
  return (
    <PageTransition>
      <main className="sw sw-full">
        <CursorDot />
        <MagneticGrid />

        <header className="sw-bar">
          <Link href="/" className="sw-home" aria-label="Back to the index" transitionTypes={["nav-back"]}>
            kv<span aria-hidden="true">/</span>software
          </Link>
        </header>

        <section className="sw-intro" aria-labelledby="sw-name">
          <div className="sw-intro-text rise">
            <h1 id="sw-name" className="sw-name">
              {PERSON.name}
            </h1>
            {CURRENT && (
              <p className="sw-now">
                {CURRENT.role} @ <a href={CURRENT.companyUrl}>{CURRENT.company}</a>
              </p>
            )}
            <p className="sw-lede">{SOFTWARE.summary}</p>
            {PERSON.openToWork && (
              <a href="#contact" className="status sw-status">
                Open to work
              </a>
            )}
          </div>
        </section>

        <section id="work" className="sw-work" aria-labelledby="work-heading">
          <div className="sw-work-head">
            <h2 id="work-heading" className="sw-h2">
              {SOFTWARE.workHeading}
            </h2>
            <AutoplayToggle />
          </div>
          <Bento />
        </section>

        <footer id="contact" className="sw-contact">
          <ul className="remotes" aria-label="Contact">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a className="remote" href={s.href} title={displayUrl(s.href)}>
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
                  <span className="remote-name">{remoteName(s.label)}</span>
                </a>
              </li>
            ))}
          </ul>

          <Link className="back" href="/" transitionTypes={["nav-back"]}>
            <BackArrow />
            Back to index
          </Link>
        </footer>
      </main>
    </PageTransition>
  );
}

/** "itch.io" -> "itchio", the way a git remote would be named. */
function remoteName(label: string) {
  return label.toLowerCase().replace(/[^a-z]/g, "");
}

function displayUrl(href: string) {
  return href.replace(/^mailto:|^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
