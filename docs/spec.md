# Personal Portfolio Landing Page — PRD

**Author:** Kv
**Date:** 2026-08-19
**Status:** Draft v1

## Problem Statement

Kv's work is split across two specialized portfolios — Software Engineering and Game Development — plus scattered social/contact links, with no single entry point that ties them together. A recruiter or employer who lands on any one link gets a partial picture of Kv and no obvious path to the other, and there's no page that establishes a strong first impression of who Kv is before someone digs into the work itself. Without a unifying gateway, Kv either has to hand out multiple links per context or rely on people finding the right one on their own, both of which dilute the first impression and add friction right when it matters most.

## Goals

- Give recruiters and employers a single, memorable URL that establishes who Kv is within seconds of arrival, with zero scrolling required.
- Route visitors to the correct specialized portfolio (Software Engineering, Game Development) in one click, with each clearly labeled.
- Consolidate social and contact links into one discoverable hub.
- Make the page's interactivity itself a demonstration of craft — every element responds to input, signaling design and technical ability before a single portfolio piece is opened.
- Load fast and hold the entire experience within one viewport on common desktop and mobile screen sizes.

## Non-Goals

- **Building the two destination portfolios** (Software Engineering, Game Development) — these are separate, not-yet-started initiatives. This spec covers only the gateway page.
- **Blog or long-form content** — this is a gateway, not a content site.
- **Backend, CMS, or contact-form handling** — v1 needs no server-side logic.
- **Multi-page navigation or additional sections** — the "no scrolling" constraint means everything lives in a single viewport; there is no v2 page to scroll to.
- **SEO / organic search optimization** — v1 optimizes for people who already have the link (referral, direct, applications), not search discovery.

## User Stories

1. As a recruiter who received Kv's link, I want to understand who Kv is and what they do within a few seconds, so I can decide whether to explore further without hunting for context.
2. As a recruiter hiring for a specific specialty, I want to click directly into the Software Engineering or Game Development portfolio that matches my role, so I don't have to sift through irrelevant work.
3. As any visitor, I want to reach Kv's social and contact channels in one click from the same page, so I don't need to search elsewhere.
4. As a visitor on mobile, I want the entire experience to fit my screen without scrolling, so the page feels complete and intentional rather than cut off.
5. As a visitor exploring the page, I want small interactive surprises (hover states, responsive SVGs, cursor-driven effects) so the page itself feels like a demonstration of Kv's craft.
6. As a visitor with accessibility needs, I want interactive elements to stay usable via keyboard and to respect reduced-motion preferences, so I'm not excluded from the experience.

## Requirements

### Must-Have (P0)

1. **Single fixed-viewport layout** — no page scroll on standard desktop (1280×800+) or common mobile viewports (390×844 and similar). *Acceptance:* no vertical or horizontal scrollbar appears at any target size; content reflows/scales to fit rather than being truncated.
2. **Short personal introduction** — name, tagline, and 1–2 sentence positioning visible immediately on load.
3. **At least one photo of Kv**, integrated into the layout rather than presented as a static headshot dump.
4. **Two clearly labeled gateways** to the Software Engineering Portfolio and Game Development Portfolio. *Acceptance:* each is a distinct interactive element with its own hover/focus state and links out — even if the destination is a placeholder route for now, since those sites don't exist yet.
5. **Social/contact links** present and clickable (exact set TBD — see Open Questions).
6. **Baseline micro-interactions on every primary element** — photo, portfolio gateways, social icons, decorative SVGs. *Acceptance:* no static/dead element; everything interactive changes appearance on hover, focus, or pointer movement.
7. **Built in React/Next.js**, deployable as a static or SSR site.
8. **Responsive** across desktop and mobile without introducing scroll or losing gateway clarity.
9. **Keyboard-navigable** (visible focus states, sane tab order) and respects `prefers-reduced-motion` for motion-heavy interactions.

### Nice-to-Have (P1)

1. **Playful/game-like interaction layer** — draggable or physics-based elements, cursor-follow effects, or a subtle easter egg that reinforces the Game Dev identity.
2. **Custom SVG illustrations/icons** (beyond stock icon sets) that animate or react to hover/click/cursor proximity.
3. **Ambient motion** — cursor- or device-tilt-driven parallax, animated background — that runs even without direct interaction, so the page feels alive on load.
4. **Subtle sound design** on interaction, muted by default with a visible mute/unmute toggle (autoplay audio on landing is generally unwelcome).
5. **"Coming soon" placeholder state** for any gateway whose destination portfolio isn't live yet, rather than a dead or broken link.

### Future Considerations (P2)

1. Theming (light/dark mode, or a rotating visual theme) without adding scroll or complexity.
2. Localization/multi-language intro, if Kv's audience becomes international.
3. Lightweight click analytics on the two gateways, to inform which destination portfolio to invest in next — deferred until a backend/analytics tool is chosen.
4. Shareable rich preview (Open Graph card) once the two destination portfolios exist and are worth previewing.

## Success Metrics

**Leading indicators:**
- Time-to-first-interaction (visitor hovers or clicks something) — target under 3 seconds median, indicating the page invites exploration rather than sitting static.
- Click-through rate from the landing page to at least one destination gateway or social link — target 40%+ of sessions (measurable once analytics is added; P2).
- Zero unwanted-scroll or layout-break reports across the top device/browser combinations Kv manually tests before launch (v1 has no analytics, so this is a manual QA checklist).

**Lagging indicators:**
- Qualitative feedback from recruiters or collaborators Kv shares the link with (e.g., "felt memorable," "easy to navigate").
- Whether Kv actually adopts this as *the* link used in applications and outreach — the clearest signal it solved the original problem.

Because v1 ships without a backend, most launch measurement is manual and qualitative; instrumented metrics become available if/when the P2 analytics item is built.

## Open Questions

- ~~Which exact social/contact links should appear~~ — **Resolved**: GitHub, LinkedIn, Email, itch.io. Shipped in `app/page.tsx`.
- ~~Do the photos and SVG assets already exist~~ — **Resolved**: yes, `public/portrait.png` + custom inline SVGs.
- ~~What should the gateway links point to before their destination portfolios exist~~ — **Resolved**: "coming soon" chip + placeholder page, keyed off `live` in `app/gateways.ts`.
- Is there a hard deadline driving this? — **Resolved**: no fixed date, but actively job-searching — ship soon, no hard cutoff.
- Where will this be hosted/deployed? — **Resolved**: Vercel.
- Should sound be included at all? — **Resolved**: no, for now. A muted-by-default music player shipped first and was then replaced by the GitHub activity island (`app/github-activity.tsx`), which backs the tagline with live data instead.

## Timeline Considerations

- No hard deadline stated yet. If Kv is actively job-searching, ship P0 first as a fast v1 — it already satisfies the core "single-click gateway" problem — then layer in P1 playful/motion/sound work as a fast-follow.
- Depends on the two destination portfolios eventually existing; until then, P0 #4 ships with placeholder or "coming soon" routes so this page isn't blocked on that separate, larger body of work.
- Solo project — no cross-team dependencies.
