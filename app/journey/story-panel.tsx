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
 * Native modal <dialog> for a journey stop's full story.
 * The trigger stretches over the entry so the entire row is clickable without nesting headings inside a <button>.
 */
export function StoryPanel({ stop }: { stop: JourneyStop }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  const hasPhotos = Boolean(stop.images?.length);

  return (
    <>
      <button
        type="button"
        className="jr-open"
        aria-haspopup="dialog"
        aria-label={`Read the story: ${stop.title}`}
        onClick={() => dialog.current?.showModal()}
      />

      <dialog
        ref={dialog}
        className="jr-dialog"
        aria-label={stop.title}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="jr-dialog-inner">
          {hasPhotos && stop.images ? (
            <div className="jr-dialog-cover">
              <Image
                src={stop.images[0]}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 42rem"
                className="jr-dialog-cover-img"
              />
              <button
                type="button"
                className="jr-dialog-close jr-dialog-close--overlay"
                aria-label="Close story"
                onClick={close}
                autoFocus
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="jr-dialog-bar">
              <p className="jr-dialog-meta">
                <span className="jr-dialog-badge">{KIND_LABEL[stop.kind]}</span>
                <span>{stop.when}</span>
              </p>
              <button
                type="button"
                className="jr-dialog-close"
                aria-label="Close story"
                onClick={close}
                autoFocus
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="jr-dialog-body">
            {hasPhotos ? (
              <p className="jr-dialog-meta">
                <span className="jr-dialog-badge">{KIND_LABEL[stop.kind]}</span>
                <span>{stop.when}</span>
              </p>
            ) : null}

            <header className="jr-dialog-head">
              <h2 className="jr-dialog-title">{stop.title}</h2>
              {stop.place ? <p className="jr-dialog-place">{stop.place}</p> : null}
            </header>

            <div className="jr-dialog-prose">
              {stop.story?.length ? (
                stop.story.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))
              ) : (
                <p className="jr-pending">The story behind this one is still being written.</p>
              )}
            </div>

            {stop.images && stop.images.length > 1 ? (
              <ul className="jr-gallery" aria-label="Additional photos">
                {stop.images.slice(1).map((src) => (
                  <li key={src}>
                    <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 18rem" />
                  </li>
                ))}
              </ul>
            ) : null}

            {stop.skills?.length ? (
              <ul className="jr-skills" aria-label="Skills">
                {stop.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : null}

            {stop.links?.length ? (
              <div className="jr-links">
                {stop.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="jr-link-pill"
                    transitionTypes={["nav-forward"]}
                  >
                    <span>{l.label}</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </dialog>
    </>
  );
}
