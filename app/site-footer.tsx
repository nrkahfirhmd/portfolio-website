"use client";

import Link from "next/link";
import { FOOTER } from "@/content/site";
import { BaliClock } from "./bali-clock";
import { FooterArt } from "./footer/art";
import type { SocialLinkItem } from "./gallery-home";
import "./footer/footer.css";

interface SiteFooterProps {
  openToWork: boolean;
  socials: SocialLinkItem[];
}

/** The letter and the engraved sea that close a page. */
export function SeaFooter({ hello, note, socials }: { hello: string; note: string; socials: SocialLinkItem[] }) {
  return (
    <div className="sf" data-scene="sea">
      <FooterArt scene="sea" />
      <div className="sf-letter">
        <div>
          <p className="sf-hello">{hello}</p>
          <p className="sf-note">{note}</p>
          <a className="sf-email" href={`mailto:${FOOTER.email}`}>
            {FOOTER.email}
          </a>
        </div>

        <div className="sf-aside">
          <nav className="sf-links" aria-label="Footer">
            {FOOTER.links.map((link) => (
              <Link key={link.href} href={link.href} transitionTypes={["nav-forward"]}>
                {link.label}
              </Link>
            ))}
          </nav>
          <nav className="sf-links" aria-label="Social links">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </a>
            ))}
            <BaliClock />
          </nav>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter({ openToWork, socials }: SiteFooterProps) {
  return (
    <footer className="gh-footer-wrap">
      <SeaFooter
        hello={FOOTER.hello}
        note={openToWork ? `${FOOTER.note} ${FOOTER.openToWork}` : FOOTER.note}
        socials={socials}
      />
    </footer>
  );
}

/** The index's one-line bar: no landscape, so the page fits one screen. */
export function HomeFooter({ name, openToWork, socials }: SiteFooterProps & { name: string }) {
  return (
    <footer className="gh-footer-wrap">
      <div className="gh-footer">
        <div className="gh-colophon">
          <span>&copy;2026 {name.toUpperCase()}</span>
          {openToWork ? (
            <>
              <span className="gh-colophon-sep" aria-hidden="true">
                |
              </span>
              <a
                href={`mailto:${FOOTER.email}?subject=Inquiry%20Regarding%20Work%20Opportunity`}
                className="gh-open-status"
              >
                <span className="gh-open-dot" aria-hidden="true" />
                <span>OPEN TO WORK</span>
              </a>
            </>
          ) : null}
        </div>

        <div className="gh-footer-right">
          <nav className="gh-socials" aria-label="Social and contact links">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="gh-social-link"
                aria-label={s.label}
                title={s.label}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="17"
                  height="17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </nav>

          <div className="gh-clock-pill">
            <BaliClock />
          </div>
        </div>
      </div>
    </footer>
  );
}
