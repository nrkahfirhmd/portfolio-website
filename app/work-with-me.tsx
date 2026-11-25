"use client";

import { useId, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";

/** Header "Work With Me" CTA + native modal <dialog> contact form. */
export function WorkWithMeButton() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const baseId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  // Honeypot: people never see it, bots fill it.
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const open = () => {
    setError("");
    setSubmitted(false);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  const resetForm = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setWebsite("");
    setError("");
    setSubmitted(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill out all fields before sending.");
      return;
    }

    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not send message. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="gh-header-actions">
        <ThemeToggle />
        <button
          type="button"
          className="gh-cta"
          aria-haspopup="dialog"
          onClick={open}
        >
          Work With Me
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="wwm-dialog"
        aria-labelledby={`${baseId}-title`}
        onClick={(e) => e.target === e.currentTarget && close()}
      >
        <div className="wwm-inner">
          <div className="wwm-head">
            <div>
              <h2 id={`${baseId}-title`} className="wwm-title">
                {submitted ? "Message sent" : "Work With Me"}
              </h2>
              {!submitted && (
                <p className="wwm-sub">
                  Tell me what you&apos;re building and how we can collaborate.
                </p>
              )}
            </div>
            <button
              type="button"
              className="wwm-close"
              aria-label="Close contact form"
              onClick={close}
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {submitted ? (
            <div className="wwm-sent" role="status">
              <p className="wwm-sent-copy">
                Thanks, {name.trim()}. Your message has been sent and I&apos;ll
                reply to {email.trim()} soon.
              </p>
              <div className="wwm-sent-actions">
                <button
                  type="button"
                  className="wwm-submit"
                  onClick={close}
                >
                  Done
                </button>
                <button
                  type="button"
                  className="wwm-secondary"
                  onClick={resetForm}
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form className="wwm-form" onSubmit={handleSubmit} noValidate>
              <div className="wwm-field">
                <label htmlFor={`${baseId}-name`} className="wwm-label">
                  Name
                </label>
                <input
                  id={`${baseId}-name`}
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="wwm-input"
                  disabled={sending}
                />
              </div>

              <div className="wwm-field">
                <label htmlFor={`${baseId}-email`} className="wwm-label">
                  Email
                </label>
                <input
                  id={`${baseId}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={254}
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="wwm-input"
                  disabled={sending}
                />
              </div>

              <div className="wwm-field">
                <label htmlFor={`${baseId}-subject`} className="wwm-label">
                  Subject
                </label>
                <input
                  id={`${baseId}-subject`}
                  name="subject"
                  type="text"
                  required
                  maxLength={150}
                  placeholder="Project Collaboration"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="wwm-input"
                  disabled={sending}
                />
              </div>

              <div className="wwm-field">
                <label htmlFor={`${baseId}-message`} className="wwm-label">
                  Message
                </label>
                <textarea
                  id={`${baseId}-message`}
                  name="message"
                  rows={4}
                  required
                  maxLength={5000}
                  placeholder="Hey, I'd love to chat about building a mobile app..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="wwm-textarea"
                  disabled={sending}
                />
              </div>

              <div className="sr-only" aria-hidden="true">
                <label htmlFor={`${baseId}-website`}>Leave this empty</label>
                <input
                  id={`${baseId}-website`}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              {error && (
                <p className="wwm-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="wwm-submit" disabled={sending}>
                <span>{sending ? "Sending..." : "Send Message"}</span>
                {!sending && (
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 2 11 13" />
                    <path d="m22 2-7 20-4-9-9-4Z" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
