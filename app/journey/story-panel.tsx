"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { JourneyStop } from "./types";

const KIND_LABEL: Record<JourneyStop["kind"], string> = {
  work: "Career",
  education: "Education",
  award: "Award",
};

/**
 * Native modal <dialog> for a journey stop's full story.
 * The trigger stretches over the entry so the entire row is clickable without nesting headings inside a <button>.
 */
export function StoryPanel({ stop }: { stop: JourneyStop }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();
  const gallery = [...(stop.gallery ?? []), ...(stop.images?.slice(1) ?? [])];
  
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

          <article className="jr-dialog-body">
            <p className="jr-dialog-meta">
              <span className="jr-dialog-badge">{KIND_LABEL[stop.kind]}</span>
              <span className="jr-dialog-badge jr-dialog-badge--date">{stop.when}</span>
            </p>

            <header className="jr-dialog-head">
              <h2 className="jr-dialog-title">{stop.title}</h2>
              {stop.place ? <p className="jr-dialog-place">{stop.place}</p> : null}
              {stop.summary ? <p className="jr-dialog-lead">{stop.summary}</p> : null}
            </header>

            {stop.images?.[0] ? (
              <div className="jr-dialog-cover">
                <Image
                  src={stop.images[0]}
                  alt=""
                  fill
                  sizes="(max-width: 800px) 100vw, 46rem"
                  className="jr-dialog-cover-img"
                />
              </div>
            ) : null}

            <div className="jr-dialog-prose">
              {stop.story?.length ? (
                stop.story.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)
              ) : (
                <p className="jr-pending">The story behind this one is still being written.</p>
              )}
            </div>

            {stop.skills?.length ? (
              <ul className="jr-skills jr-skills--panel" aria-label="Skills">
                {stop.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            ) : null}

            {stop.stats?.length ? (
              <ul className="jr-stats">
                {stop.stats.map((st) => (
                  <li key={st.label}>
                    <strong>{st.value}</strong>
                    <span>{st.label}</span>
                    {st.note ? <small>{st.note}</small> : null}
                  </li>
                ))}
              </ul>
            ) : null}

            {stop.highlights?.length ? (
              <section className="jr-box" aria-label="Highlights">
                <h3 className="jr-eyebrow-sm">Highlights</h3>
                <ul className="jr-checks">
                  {stop.highlights.map((h) => (
                    <li key={h.slice(0, 24)}>{h}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {stop.coursework?.length ? (
              <section className="jr-chapter" aria-label="Relevant coursework">
                <p className="jr-eyebrow-sm">Relevant coursework</p>
                <ul className="jr-skills jr-skills--panel">
                  {stop.coursework.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {stop.chapters?.map((c, i) => (
              <section key={c.title} className="jr-chapter">
                <p className="jr-eyebrow-sm jr-eyebrow-sm--dot">Chapter {i + 1}</p>
                <h3 className="jr-chapter-title">{c.title}</h3>
                {c.quote ? <p className="jr-chapter-quote">&ldquo;{c.quote}&rdquo;</p> : null}
                <div className="jr-dialog-prose">
                  {c.body.map((para) => (
                    <p key={para.slice(0, 24)}>{para}</p>
                  ))}
                </div>
                {c.points?.length ? (
                  <ul className="jr-points">
                    {c.points.map((pt) => (
                      <li key={pt.title}>
                        <h4>{pt.title}</h4>
                        <p>{pt.text}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {gallery.length ? (
              <ul className="jr-gallery" aria-label="Photos">
                {gallery.map((src) => (
                  <li key={src}>
                    <Image src={src} alt="" fill sizes="(max-width: 800px) 50vw, 15rem" />
                  </li>
                ))}
              </ul>
            ) : null}

            {stop.links?.length ? (
              <section className="jr-outcomes" aria-label="Related work">
                <p className="jr-eyebrow-sm">Applied outcomes</p>
                <ul className="jr-outcome-grid" data-stack={stop.stackLinks || undefined}>
                  {stop.links.map((l) => (
                    <li key={l.label}>
                      {l.href ? (
                        <Link href={l.href} className="jr-outcome" transitionTypes={["nav-forward"]}>
                          <span>{l.label}</span>
                          <span aria-hidden="true">↗</span>
                        </Link>
                      ) : (
                        <div className="jr-outcome jr-outcome--static">
                          <span>{l.label}</span>
                          {l.note ? <small>{l.note}</small> : null}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {stop.reflection ? (
              <blockquote className="jr-box jr-reflection">
                <p className="jr-eyebrow-sm">Key reflection</p>
                <p>&ldquo;{stop.reflection}&rdquo;</p>
              </blockquote>
            ) : null}
          </article>
        </div>
      </dialog>
    </>
  );
}
