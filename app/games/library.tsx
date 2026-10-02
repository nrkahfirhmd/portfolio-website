import Link from "next/link";
import { Masonry } from "../software/masonry";
import { Showcase } from "../software/project-lists";
import { CartAudio } from "./cart-media";
import { shelve, STORY_SLUGS, STUDIO, type Stage } from "./games";
import { SharedTitle } from "../page-transition";

const KIND_LABEL = { art: "Art", video: "Video", music: "Music" } as const;

/** Where a tile goes: its devlog, else a playable build, else the studio. */
function href(s: Stage) {
  if (STORY_SLUGS.has(s.slug)) return `/games/stage/${s.slug}`;
  return s.play ?? STUDIO.url;
}

/**
 * The library: games, art, video, and music in the same masonry as
 * /software (its tile styles come from project-lists.css). A tile is its
 * media; hover or focus shows name and year, and the whole tile opens the
 * entry. Play / Listen sit in the caption, above the link overlay.
 */
export function Library({ stages }: { stages: Stage[] }) {
  return (
    <Masonry className="bento">
      {shelve(stages).map((s) => {
        const to = href(s);
        const devlog = to.startsWith("/");
        const name = s.locked ? "Coming soon" : s.name;

        return (
          <article
            key={s.id}
            className="tile reveal"
            data-shape={s.wide ? "wide" : undefined}
            data-locked={s.locked || undefined}
          >
            {/* Every entry is a showcase: the cover in front (on a screen
                when wide), over `bg` blurred, or the cover itself blurred
                until there's a bg. A screen, video, or logo takes the
                cover's place in front. */}
            <Showcase
              name={name}
              shape={s.wide ? "wide" : "square"}
              backdrop={s.bg ?? s.cover}
              screen={s.screen ?? s.video ?? s.cover}
              logo={s.logo ?? s.cover}
            />
            {/* The whole tile is the link: an overlay rather than a wrapper,
                since Play / Listen can't nest inside an <a>. */}
            {devlog ? (
              <Link
                className="tile-link"
                href={to}
                transitionTypes={["nav-forward"]}
                aria-label={name}
                data-cursor-label={s.kind && s.kind !== "game" ? "Read more" : "Read the devlog"}
              />
            ) : (
              <a className="tile-link" href={to} aria-label={name} />
            )}
            <span className="tile-caption" aria-hidden={!(s.play || s.audio) || undefined}>
              {s.kind && s.kind !== "game" && <span className="tile-kind">{KIND_LABEL[s.kind]}</span>}
              <SharedTitle name={`title-${s.slug}`}>
                <span className="tile-name">{name}</span>
              </SharedTitle>
              <span className="tile-when">{s.year ?? s.status}</span>
              {(s.play || s.audio) && (
                <span className="tile-actions">
                  {s.play && (
                    <a className="tile-btn" href={s.play}>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
                      </svg>
                      Play
                      <span className="sr-only"> {s.name}</span>
                    </a>
                  )}
                  {s.audio && <CartAudio src={s.audio} name={s.name} />}
                </span>
              )}
            </span>
          </article>
        );
      })}
    </Masonry>
  );
}
