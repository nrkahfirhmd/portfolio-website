import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GATEWAYS } from "../gateways";
import "../home.css";

/** Placeholders only for portfolios not yet live — a live one has its own
 * static route. Anything else still 404s properly. */
export function generateStaticParams() {
  return GATEWAYS.filter((g) => !g.live).map((g) => ({ portfolio: g.slug }));
}

export const dynamicParams = false;

function find(slug: string) {
  return GATEWAYS.find((g) => g.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ portfolio: string }>;
}): Promise<Metadata> {
  const gateway = find((await params).portfolio);
  if (!gateway) return {};
  return {
    title: `${gateway.name} — Kv`,
    description: gateway.desc,
  };
}

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ portfolio: string }>;
}) {
  const gateway = find((await params).portfolio);
  if (!gateway || gateway.live) notFound();

  return (
    <main className="soon-page">
      <p className="eyebrow" data-enter style={{ "--i": 0 } as React.CSSProperties}>
        {gateway.name}
      </p>

      <h1 data-enter style={{ "--i": 1 } as React.CSSProperties}>
        Still <span className="flourish">building</span>.
      </h1>

      <p data-enter style={{ "--i": 2 } as React.CSSProperties}>
        {gateway.blurb}
      </p>

      <Link
        className="back"
        href="/"
        data-enter
        style={{ "--i": 3 } as React.CSSProperties}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Back to index
      </Link>
    </main>
  );
}
