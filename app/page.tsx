import Link from "next/link";
import { CursorParallax } from "./cursor-parallax";
import { GATEWAYS } from "./gateways";
import "./home.css";

/** TODO(kv): swap the placeholder hrefs for real profiles. */
const SOCIALS = [
  {
    label: "GitHub",
    href: "#",
    d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.2-1.5 6.2-6.7A5.2 5.2 0 0 0 19.9 5a4.9 4.9 0 0 0-.1-3.6s-1.1-.4-3.7 1.4a12.7 12.7 0 0 0-6.6 0C6.9 1 5.8 1.4 5.8 1.4A4.9 4.9 0 0 0 5.7 5a5.2 5.2 0 0 0-1.4 3.7c0 5.2 3.2 6.4 6.2 6.7a3.4 3.4 0 0 0-.9 2.6V22",
  },
  {
    label: "LinkedIn",
    href: "#",
    d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  },
  {
    label: "Email",
    href: "#",
    d: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 7l-10 6L2 7",
  },
  {
    label: "itch.io",
    href: "#",
    d: "M3 7l2-4h14l2 4M3 7v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3c0 2 1.5 3 3 3s3-1 3-3M9 21v-6h6v6",
  },
];

export default function Home() {
  return (
    <main className="home">
      <CursorParallax />

      <p className="eyebrow" data-enter style={{ "--i": 0 } as React.CSSProperties}>
        Kahfi Rahmada · Portfolio Index
      </p>

      <div className="stage">
        {/* TODO(kv): replace with next/image once a real photo exists. */}
        <div className="halo" data-enter style={{ "--i": 1 } as React.CSSProperties}>
          <div
            className="photo"
            tabIndex={0}
            role="img"
            aria-label="Portrait of Kahfi Rahmada"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
        </div>

        <h1 className="name" data-enter style={{ "--i": 2 } as React.CSSProperties}>
          Kv
        </h1>

        <p className="tagline" data-enter style={{ "--i": 3 } as React.CSSProperties}>
          I build systems that <span className="flourish">think</span>, play, and
          hold up under load.{" "}
          <span className="muted">AI · Games · Infrastructure.</span>
        </p>

        <nav className="gates" aria-label="Portfolios">
          {GATEWAYS.map((g, i) => (
            <Link
              key={g.slug}
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
              <span className="gate-head">
                <h2>{g.name}</h2>
                {!g.live && <span className="chip">soon</span>}
              </span>
              <p>{g.desc}</p>
            </Link>
          ))}
        </nav>
      </div>

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
        <span className="status">Open to work</span>
      </footer>
    </main>
  );
}
