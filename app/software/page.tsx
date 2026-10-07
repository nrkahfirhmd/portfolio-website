import type { Metadata } from "next";
import { CURRENT, PERSON, SOFTWARE } from "@/content/site";
import { AutoplayToggle } from "../games/cart-media";
import { BackLink, PageShell } from "../page-shell";
import { SOCIALS } from "../socials";
import { Bento } from "./project-lists";
import "./software.css";
import "./project-lists.css";

export const metadata: Metadata = {
  title: SOFTWARE.title,
  description: SOFTWARE.description,
};

export default function SoftwarePage() {
  return (
    <PageShell section="software">
      <section className="page-intro rise" aria-labelledby="sw-name">
        <h1 id="sw-name" className="page-title">
          {PERSON.name}
        </h1>
        {CURRENT && (
          <p className="page-sub">
            {CURRENT.role} @ <a href={CURRENT.companyUrl}>{CURRENT.company}</a>
          </p>
        )}
        <p className="page-lede">{SOFTWARE.summary}</p>
        {PERSON.openToWork && (
          <a href="#contact" className="status sw-status">
            Open to work
          </a>
        )}
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
              <a className="remote" href={s.href} title={s.display}>
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
                {/* "itch.io" -> "itchio", the way a git remote would be named. */}
                <span className="remote-name">{s.label.toLowerCase().replace(/[^a-z]/g, "")}</span>
              </a>
            </li>
          ))}
        </ul>
        <BackLink />
      </footer>
    </PageShell>
  );
}
