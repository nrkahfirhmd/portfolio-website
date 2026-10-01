import type { Metadata } from "next";
import Link from "next/link";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { SOCIALS } from "../socials";
import { BackArrow } from "./parts";
import { Bento } from "./project-lists";
import { CURRENT } from "./projects";
import "../home.css";
import "./software.css";
import "./project-lists.css";

export const metadata: Metadata = {
  title: "Software Engineering — Kv",
  description:
    "Software engineering work by Kahfi Rahmada: web apps, backends, smart contracts, and data systems.",
};

export default function SoftwarePage() {
  return (
    <main className="sw sw-full">
      <CursorDot />
      <MagneticGrid />

      <header className="sw-bar">
        <Link href="/" className="sw-home" aria-label="Back to the index">
          kv<span aria-hidden="true">/</span>software
        </Link>
      </header>

      <section className="sw-intro" aria-labelledby="sw-name">
        <div className="sw-intro-text">
          <h1 id="sw-name" className="sw-name">
            Kahfi Rahmada
          </h1>
          {CURRENT && (
            <p className="sw-now">
              {CURRENT.role} @ <a href={CURRENT.companyUrl}>{CURRENT.company}</a>
            </p>
          )}
          <p className="sw-lede">
            I build software that makes everyday life a little better, with the small details that make it feel like home. Mobile, web, backend, blockchain, AI: whatever the product needs, I take it to done.
          </p>
          <a href="#contact" className="status sw-status">
            Open to work
          </a>
        </div>
      </section>

      <section id="work" className="sw-work" aria-labelledby="work-heading">
        <div className="sw-work-head">
          <h2 id="work-heading" className="sw-h2">
            Selected work
          </h2>
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

        <Link className="back" href="/">
          <BackArrow />
          Back to index
        </Link>
      </footer>
    </main>
  );
}

/** "itch.io" -> "itchio", the way a git remote would be named. */
function remoteName(label: string) {
  return label.toLowerCase().replace(/[^a-z]/g, "");
}

function displayUrl(href: string) {
  return href.replace(/^mailto:|^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
