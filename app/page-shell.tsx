import Link from "next/link";
import type { ReactNode } from "react";
import { CursorDot } from "./cursor-dot";
import { MagneticGrid } from "./magnetic-grid";
import { PageTransition } from "./page-transition";

/** Every page but the index: the page column, cursor, magnetic grid, and the "kv/<section>" bar back up. */
export function PageShell({
  section,
  up = "/",
  className,
  children,
}: {
  section: string;
  /** Where the bar leads: the index, or a story's portfolio. */
  up?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <PageTransition>
      <main className={className ? `page ${className}` : "page"}>
        <CursorDot />
        <MagneticGrid />
        <header className="page-bar">
          <Link href={up} className="page-home" transitionTypes={["nav-back"]}>
            kv<span aria-hidden="true">/</span>
            {section}
          </Link>
        </header>
        {children}
      </main>
    </PageTransition>
  );
}

/** The pill link back up a level. */
export function BackLink({
  href = "/",
  className,
  children = "Back to index",
}: {
  href?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Link className={className ? `back ${className}` : "back"} href={href} transitionTypes={["nav-back"]}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      {children}
    </Link>
  );
}
