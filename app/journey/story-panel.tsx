"use client";

import Image from "next/image";
import { useRef } from "react";
import type { JourneyStop } from "./types";

const KIND_LABEL: Record<JourneyStop["kind"], string> = {
  work: "Career",
  education: "Education",
  competition: "Competition",
};

/**
 * Opens a stop's story in the same article card as /side-quests: cover on
 * top (the photo, or the site's dotted placeholder), then badge and date,
 * title, place, the result as the lead line, and the story. It reuses
 * side-quests.css' classes so the two can't drift.
 *
 * A native <dialog>: showModal() gives focus trapping, Escape to close, and
 * the backdrop for free. The trigger is an overlay button stretched over
 * its card, since the card's heading can't nest inside a <button>.
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
        // A click on the dialog itself, not its content, is a click on the
        // backdrop.
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="sq-dialog-cover">
          {stop.image ? (
            <Image className="sq-cover" src={stop.image} alt="" fill sizes="(max-width: 768px) 100vw, 48rem" />
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
          {stop.result && <p className="sq-lead">{stop.result}</p>}
          {stop.story?.length ? (
            stop.story.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)
          ) : (
            <p className="jr-pending">The story behind this one is still being written.</p>
          )}
        </div>
      </dialog>
    </>
  );
}
