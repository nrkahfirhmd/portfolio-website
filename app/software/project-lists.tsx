import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/content/site";
import { CartVideo } from "../games/cart-media";
import { SharedTitle } from "../page-transition";
import { Masonry } from "./masonry";

/** "tall": one cell across, two down; "wide": two across, one down. */
export type Shape = "tall" | "wide" | "square";

/** A tile's media, shared with /games: blurred backdrop, and in front a device screen (tall/wide) or a logo (square). */
export function Showcase({
  name,
  shape,
  backdrop,
  screen,
  logo,
}: {
  name: string;
  shape: Shape;
  backdrop?: string;
  screen?: string;
  logo?: string;
}) {
  const video = screen && /\.(mp4|webm|mov)$/i.test(screen);
  return (
    <span className="showcase" aria-hidden="true">
      {/* Blurred 16px anyway, so a small variant (128px, 256px on 2x) looks the same at a fraction of the bytes. */}
      {backdrop && <Image className="showcase-bg" src={backdrop} alt="" fill sizes="128px" />}
      {shape === "square" ? (
        logo ? (
          <span className="showcase-logo">
            <Image src={logo} alt="" fill sizes="(max-width: 640px) 50vw, 12rem" />
          </span>
        ) : (
          <span className="showcase-logo showcase-wordmark">{name}</span>
        )
      ) : (
        <span className="showcase-screen">
          {video ? (
            // #t=0.1 paints a frame while paused instead of a blank screen.
            <CartVideo src={`${screen}#t=0.1`} />
          ) : screen ? (
            <Image src={screen} alt="" fill sizes="(max-width: 640px) 80vw, 24rem" />
          ) : (
            <span className="showcase-blank">{name}</span>
          )}
        </span>
      )}
    </span>
  );
}

const SHAPE = { mobile: "tall", web: "wide" } as const;

/** "Selected work": a masonry of project tiles, each opening its story page. */
export function Bento() {
  return (
    <Masonry className="bento">
      {PROJECTS.map((p) => (
        <Link
          key={p.slug}
          className="tile reveal"
          data-shape={p.platform && SHAPE[p.platform]}
          href={`/software/work/${p.slug}`}
          transitionTypes={["nav-forward"]}
          data-cursor-label="Read the story"
        >
          <Showcase
            name={p.name}
            shape={p.platform ? SHAPE[p.platform] : "square"}
            backdrop={p.cover}
            screen={p.screen}
            logo={p.logo ?? p.cover}
          />
          <span className="tile-caption">
            <SharedTitle name={`title-${p.slug}`}>
              <span className="tile-name">{p.name}</span>
            </SharedTitle>
            {p.period && <span className="tile-when">{p.period}</span>}
          </span>
        </Link>
      ))}
    </Masonry>
  );
}
