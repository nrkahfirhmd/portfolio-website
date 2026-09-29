import Image from "next/image";
import Link from "next/link";
import { shelve, STORY_SLUGS, STUDIO, type Stage } from "./games";
import { LockIcon } from "./stage-parts";

/** The quiet fallback link for a cart with neither a devlog nor a build. */
function elsewhere(s: Stage) {
  if (s.repo) return { href: `https://github.com/nrkahfirhmd/${s.repo}`, label: "View source" };
  if (s.locked) return { href: STUDIO.url, label: "Follow on itch.io" };
  return null;
}

/**
 * Level select as a shelf of memory cartridges: box art, name, and a way in.
 * A cart with a devlog is one big link to it (the name, stretched over the
 * cart), and the cursor dot turns into a "Read the devlog" pill over it. A
 * playable build gets a Play button that sits above that link.
 */
export function Shelf({ stages }: { stages: Stage[] }) {
  return (
    <div className="shelf">
      {shelve(stages).map((s, i) => {
        const big = i === 0;
        const devlog = STORY_SLUGS.has(s.slug);
        const other = !devlog && !s.play ? elsewhere(s) : null;
        const name = s.locked ? "Coming soon" : s.name;

        return (
          <div key={s.id} className="cart" data-featured={big || undefined} data-locked={s.locked || undefined}>
            <span className="cart-shell">
              <span className="cart-body">
                <span className="cart-grip" aria-hidden="true" />
                <span className="cart-art">
                  {s.cover ? (
                    <Image
                      src={s.cover}
                      alt=""
                      fill
                      sizes={big ? "(max-width: 720px) 100vw, 30rem" : "(max-width: 720px) 50vw, 15rem"}
                      priority={big}
                    />
                  ) : (
                    <span className="cart-art-empty" aria-hidden="true">
                      {s.locked ? <LockIcon /> : s.id}
                    </span>
                  )}
                </span>
                <span className="cart-label">
                  <h3 className="cart-name">
                    {devlog ? (
                      <Link className="cart-link" href={`/games/stage/${s.slug}`} data-cursor-label="Read the devlog">
                        {name}
                      </Link>
                    ) : (
                      name
                    )}
                  </h3>
                  {devlog && (
                    // Shown only where there's no cursor pill to say it
                    // (touch, reduced motion).
                    <span className="cart-hint" aria-hidden="true">
                      Read the devlog
                    </span>
                  )}
                  {s.play && (
                    <a className="cart-play" href={s.play}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                      </svg>
                      Play
                      <span className="sr-only"> {s.name}</span>
                    </a>
                  )}
                  {other && (
                    <a className="cart-go" href={other.href}>
                      {other.label}
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 16 16 8M9 8h7v7" />
                      </svg>
                    </a>
                  )}
                </span>
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
