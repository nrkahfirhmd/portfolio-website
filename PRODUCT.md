# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, weighted equally on the role portfolios:

- **Recruiters and hiring managers** who received Kv's link (applications, referrals, outreach). They skim fast and decide within seconds whether to dig in.
- **Engineers reviewing a candidate** (technical interviewers, leads). They open repos and long-form stories and judge decisions and depth.

Every surface needs a skim layer for the first and a depth layer for the second.

## Product Purpose

A personal site for Kahfi Rahmada (Kv): a single-viewport gateway (`/`) routing to two role portfolios, Software Engineering (`/software`) and Game Development (`/games`), plus contact. Success is Kv using it as *the* link in applications, and visitors reaching the right portfolio and a real piece of work in one or two clicks.

## Positioning

Range across stacks, built end to end: Solidity contracts, Python/FastAPI backends, LangChain agents, TypeScript web apps, Laravel, RDF/SPARQL knowledge graphs, MPI on Kubernetes. Kv builds the whole thing, "from the contract and the backend to the screen people actually touch."

## Operating Context

- Visitors arrive with the link already in hand; SEO is a non-goal.
- Project facts come from Kv's public GitHub repos (`github.com/nrkahfirhmd`); commit SHAs and per-language byte counts are real, pulled via `gh api`, and do not auto-update.
- Long-form project stories are MDX in `content/software/`, previewable at `/software/preview/[slug]` in dev.
- Currently iOS Applied AI Engineer at Apple Developer Academy (Bali). Open to work.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, MDX, static; no backend, CMS, or analytics. Deployed on Vercel.
- Project registry: `app/software/projects.ts`. Games registry: `app/games/games.ts`. Socials: `app/socials.ts`.
- Theme pinned light; tokens in `docs/design-tokens.css`.

## Brand Commitments

- Name: Kahfi Rahmada, mark "Kv". Tagline voice: "Building things that think. Creating worlds that play. Engineering systems that last."
- Every page must respond to input (spec P0: no dead elements), stay keyboard-navigable, and respect `prefers-reduced-motion`.

## Evidence on Hand

- Five software projects with real repo, SHA, period, language bytes, and live URLs where they exist (`app/software/projects.ts`).
- One software story draft (`content/software/base-hackathon.mdx`).
- Portrait: `public/portrait.png`.
- **No project screenshots exist yet.** Do not fabricate them; leave labelled slots or use code-authored visuals derived from real data.
- No metrics, user counts, or testimonials. Never invent them.

## Product Principles

1. Skim in seconds, depth on demand: every project readable without a click, detail one step away.
2. Show the range: stack diversity is the claim, so make it visible, not listed.
3. Real facts only: SHAs, languages, dates, and links are true or absent.
4. The site is itself the craft demo: interactive, but never at the cost of reading.

## Accessibility & Inclusion

WCAG AA contrast, visible focus rings, full keyboard access, reduced-motion fallbacks with no dead elements (spec P0 #9).
