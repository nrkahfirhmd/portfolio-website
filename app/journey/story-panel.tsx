"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { JourneyStop } from "./types";

const KIND_LABEL: Record<JourneyStop["kind"], string> = {
  work: "Career",
  education: "Education",
};

/**
 * A stop's story as side-quests' article card (its classes, so they can't drift), in a native modal <dialog>.
 * The trigger is a button stretched over the card, since a heading can't nest inside a <button>.
 */
export function StoryPanel({ stop }: { stop: JourneyStop }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        className="jr-open"
        aria-haspopup="dialog"
        aria-label={`Read the story: ${stop.title}`}
        data-cursor-label="Read the story"
        onClick={() => dialog.current?.showModal()}
      />
      <dialog
        ref={dialog}
        className="sq-dialog jr-panel"
        aria-label={stop.title}
        // A click on the dialog itself (not its content) is the backdrop.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="sq-dialog-cover">
          {stop.images?.length ? (
            <Image className="sq-cover" src={stop.images[0]} alt="" fill sizes="(max-width: 768px) 100vw, 48rem" />
          ) : (
            <span className="sq-cover sq-art" aria-hidden="true" />
          )}
          <button type="button" className="sq-close" aria-label="Close story" onClick={close} autoFocus>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="sq-dialog-body">
          <p className="sq-meta">
            <span className="sq-badge">{KIND_LABEL[stop.kind]}</span>
            {stop.when}
          </p>
          <div>
            <h2 className="sq-dialog-title">{stop.title}</h2>
            {stop.place && <p className="sq-org">{stop.place}</p>}
          </div>
          {stop.story?.length ? (
            stop.story.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)
          ) : (
            <p className="jr-pending">The story behind this one is still being written.</p>
          )}
          {stop.images && stop.images.length > 1 && (
            <ul className="jr-gallery">
              {stop.images.slice(1).map((src) => (
                <li key={src}>
                  <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 16rem" />
                </li>
              ))}
            </ul>
          )}
          {stop.skills?.length ? (
            <ul className="sq-skills">
              {stop.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          ) : null}
          {stop.links?.length ? (
            <p className="jr-links">
              {stop.links.map((l) => (
                <Link key={l.href} href={l.href} transitionTypes={["nav-forward"]}>
                  {l.label}
                </Link>
              ))}
            </p>
          ) : null}
        </div>
      </dialog>
    </>
  );
}
