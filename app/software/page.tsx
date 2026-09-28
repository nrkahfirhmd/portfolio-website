import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CursorDot } from "../cursor-dot";
import { MagneticGrid } from "../magnetic-grid";
import { SOCIALS } from "../socials";
import { BackArrow, Diffstat, ProjectLinks, Refs } from "./parts";
import { CURRENT, PROJECTS, STORY_REPOS, type Project } from "./projects";
import "../home.css";
import "./software.css";

export const metadata: Metadata = {
  title: "Software Engineering — Kv",
  description:
    "Software engineering work by Kahfi Rahmada: web apps, backends, smart contracts, and data systems.",
};

export default function SoftwarePage() {
  return (
    <main className="sw">
      <CursorDot />
      <MagneticGrid />

      <header className="sw-bar">
        <Link href="/" className="sw-home" aria-label="Back to the index">
          kv<span aria-hidden="true">/</span>software
        </Link>
        <nav aria-label="Sections" className="sw-nav">
          <a href="#log">Log</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="sw-intro" aria-labelledby="sw-name">
        <div className="halo sw-halo">
          <Image
            className="sw-photo"
            src="/portrait.png"
            alt="Kahfi Rahmada"
            width={320}
            height={320}
            priority
          />
        </div>
        <div className="sw-intro-text">
          <h1 id="sw-name" className="sw-name">
            Kahfi Rahmada
          </h1>
          <p className="sw-lede">
            Software engineer. I build the whole thing, from the contract and
            the backend to the screen people{" "}
            <span className="flourish">actually touch</span>.
          </p>
          <p className="sw-now">
            Currently {CURRENT.role} @{" "}
            <a href={CURRENT.companyUrl}>{CURRENT.company}</a>.
          </p>
          <a href="#contact" className="status sw-status">
            Open to work
          </a>
        </div>
      </section>

      <section id="log" className="sw-log" aria-labelledby="log-heading">
        <h2 id="log-heading" className="sw-cmd">
          <span aria-hidden="true">$ </span>git log --graph
        </h2>
        <ol className="graph">
          {PROJECTS.map((p, i) => (
            <Commit key={p.repo} project={p} head={i === 0} index={i} />
          ))}
        </ol>
      </section>

      <section id="contact" className="sw-contact" aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="sw-cmd">
          <span aria-hidden="true">$ </span>git remote -v
        </h2>
        <ul className="remotes">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a className="remote" href={s.href}>
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
                <span className="remote-url">{displayUrl(s.href)}</span>
                <span className="remote-dir" aria-hidden="true">
                  (push)
                </span>
              </a>
            </li>
          ))}
        </ul>

        <Link className="back" href="/">
          <BackArrow />
          Back to index
        </Link>
      </section>
    </main>
  );
}

function Commit({ project: p, head, index }: { project: Project; head: boolean; index: number }) {
  return (
    <li className="commit" style={{ "--i": index } as React.CSSProperties}>
      <details>
        <summary>
          <span className="node" aria-hidden="true" />
          <span className="commit-line">
            <code className="sha">{p.sha}</code>
            <Refs project={p} head={head} />
            <span className="date">{p.period}</span>
          </span>
          <span className="commit-name">{p.name}</span>
          <span className="commit-msg">{p.message}</span>
          <svg
            className="toggle"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </summary>

        <div className="show">
          <p className="show-body">{p.body}</p>
          <Diffstat project={p} />
          <ProjectLinks project={p} story={STORY_REPOS.has(p.repo)} />
        </div>
      </details>
    </li>
  );
}

/** "itch.io" -> "itchio", the way a git remote would be named. */
function remoteName(label: string) {
  return label.toLowerCase().replace(/[^a-z]/g, "");
}

function displayUrl(href: string) {
  return href.replace(/^mailto:|^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
