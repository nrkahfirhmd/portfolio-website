"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const EVENT_NAME = "portfolio-theme-change";

function readTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage quota / private mode restrictions
  }
  window.dispatchEvent(new CustomEvent<Theme>(EVENT_NAME, { detail: next }));
}

/** Frosted-glass light/dark theme switcher placed beside the header CTA. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(readTheme());

    const onThemeChange = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      setTheme(detail === "dark" ? "dark" : readTheme());
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        const next: Theme = e.newValue === "dark" ? "dark" : "light";
        document.documentElement.dataset.theme = next;
        setTheme(next);
      }
    };

    window.addEventListener(EVENT_NAME, onThemeChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT_NAME, onThemeChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      className="gh-theme-toggle"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      onClick={() => applyTheme(isDark ? "light" : "dark")}
    >
      <svg
        viewBox="0 0 24 24"
        width="17"
        height="17"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {isDark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2.5v2M12 19.5v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2.5 12h2M19.5 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M20.35 14.35A8.5 8.5 0 1 1 9.65 3.65a6.75 6.75 0 0 0 10.7 10.7Z" />
        )}
      </svg>
    </button>
  );
}
