import Image from "next/image";
import Link from "next/link";
import { Masonry } from "../software/masonry";
import { CartAudio, CartVideo } from "./cart-media";
import { shelve, STORY_SLUGS, STUDIO, type Stage } from "./games";
import { LockIcon } from "./stage-parts";

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
          <article key={s.id} className="tile" data-locked={s.locked || undefined}>
            {s.video ? (
              <CartVideo src={s.video} poster={s.cover} />
            ) : s.cover ? (
              <Image
                className="tile-cover"
                src={s.cover}
                alt=""
                // Remote covers have no known size; let the file set it.
                width={0}
                height={0}
                sizes="(max-width: 640px) 100vw, 22rem"
              />
            ) : (
              <span className="tile-empty" aria-hidden="true">
                {s.locked ? <LockIcon /> : s.id}
              </span>
            )}
            {/* The whole tile is the link: an overlay rather than a wrapper,
                since Play / Listen can't nest inside an <a>. */}
            {devlog ? (
              <Link
                className="tile-link"
                href={to}
                aria-label={name}
                data-cursor-label={s.kind && s.kind !== "game" ? "Read more" : "Read the devlog"}
              />
            ) : (
              <a className="tile-link" href={to} aria-label={name} />
            )}
            <span className="tile-caption" aria-hidden={!(s.play || s.audio) || undefined}>
              {s.kind && s.kind !== "game" && <span className="tile-kind">{KIND_LABEL[s.kind]}</span>}
              <span className="tile-name">{name}</span>
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
