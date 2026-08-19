# Design System — Portfolio Gateway

Companion to [`spec.md`](./spec.md). Tokens live in [`design-tokens.json`](./design-tokens.json) → [`design-tokens.css`](./design-tokens.css).

The shipped page pins one configuration: **centre-stage layout, light theme (not switchable), green accent, comfortable density.** The token layer still supports dark, three other accents, and two other densities — see [Theming](#theming). Nothing on the page exposes a switch.

## Direction

Minimalist but fun. White paper, one green accent, mono-led type with a single serif flourish for personality. Flat surfaces + hairline borders instead of gray drop-shadows — depth comes from a green glow on hover, not blur. Motion is a spring, not a fade: `ease-out` for entrances, a slight overshoot spring for playful hovers, both stripped to instant color/opacity swaps under `prefers-reduced-motion`.

## Color

Not pure `#F5F5F5` gray — **ink** is a warm, near-black neutral (`#0A0A09` base) so white reads as paper rather than clinical white-on-white. **Green** is a grounded mid-saturation accent (`#1C8049` at 600), not a neon/Tailwind-default green — reads professional at body-text size, still pops as a CTA/hover color.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-surface` | `#FFFFFF` | `ink-950` | Page background |
| `--color-surface-sunken` | `ink-50` | `ink-900` | Sunken panels, code-like surfaces |
| `--color-ink` | `ink-950` | `ink-50` | Primary text |
| `--color-ink-muted` | `ink-600` | `ink-400` | Secondary text |
| `--color-border` | `ink-200` | `ink-800` | Default hairline borders |
| `--color-accent` | `accent-600` | `accent-400` | Links, active state, primary CTA |
| `--color-accent-hover` | `accent-700` | `accent-300` | Hover |
| `--color-accent-soft` | `accent-50` | `accent-950` | Hover fills, badges |
| `--color-focus-ring` | `accent-500` | `accent-400` | Keyboard focus ring only |

Accent is reserved for interactive/live elements — it should never appear as a static decoration, so every accent pixel on the page implies "this responds to you."

`ink-muted` is `ink-600`, not `ink-500`. `ink-500` on white measures 4.47:1 and misses WCAG AA for the secondary text it carries; `ink-600` clears it at ~7:1.

## Theming

Three independent root attributes, all driven by tokens — no component knows a theme exists.

| Attribute | Values | Default | Shipped as |
|---|---|---|---|
| `data-theme` | `light`, `dark`, *(absent)* = follow system | absent | `light` (pinned) |
| `data-accent` | `green`, `amber`, `indigo`, `clay` | `green` | omitted = green |
| `data-density` | `compact`, `comfortable`, *(absent)* = default scale | absent | `comfortable` |

These are set once on `<html>` in [`app/layout.tsx`](../app/layout.tsx). Because `data-theme="light"` emits `color-scheme: only light`, a visitor whose OS is in dark mode still gets the light page — that is the intended lock, not an oversight. Removing the attribute is all it takes to re-enable system-following.

**Light/dark** uses a single `light-dark(lightValue, darkValue)` definition per semantic token rather than three duplicated blocks. `color-scheme: light dark` on `:root` makes it follow the system; `data-theme` pins it by switching to `color-scheme: only light|dark`.

**Accent** is an indirection. `data-accent` swaps an `--accent-50…950` ramp, and every semantic accent token points at a step in whatever ramp is live. Adding a fifth accent means adding one ramp — no other file changes. Every ramp's `600` clears 4.5:1 on white and its `400` clears 4.5:1 on ink-950, so contrast survives any theme × accent pairing (verified across all 8).

**Density** retunes the spacing scale only. Type and radius hold, so the identity survives and only breathing room moves. Layout clamps take density on the *ceiling* (`clamp(1rem, 3.5vh, var(--spacing-gutter-lg))`) — the fixed floor keeps the single-viewport no-scroll guarantee intact even on `comfortable`.

**Shadows** are derived with `color-mix()` from the live `--color-accent` and `--color-border-strong`, so they follow theme and accent automatically instead of needing a variant per mode.

Component tokens reference semantic tokens only — never a raw hex. That is the rule that makes all three switches work; a single hardcoded `#FFFFFF` in a component token breaks dark mode for that component.

## Type

**Primary: JetBrains Mono** (falls back to IBM Plex Mono → system mono). Carries nav, labels, body copy, gateway names — the "professional mono" identity, and it directly signals the AI/Systems Engineering half of Kv's work.

**Accent: Fraunces**, italic, used in exactly one place — a single word or short phrase inside the intro line (e.g. the tagline's key verb) — as the "aesthetic touch." It's a high-personality serif against a monospace field, so it should stay rare; if it shows up more than once on screen it stops reading as a flourish and starts reading as an inconsistent system.

| Token | Size | Weight | Use |
|---|---|---|---|
| `--typography-display` | 5.5rem / 88px | 700 | Name |
| `--typography-heading` | 2.25rem / 36px | 500 | Section labels (rare — page is single-viewport) |
| `--typography-tagline` | 1.125rem / 18px | 400 (Fraunces italic for the accent word) | Positioning line |
| `--typography-body` | 1rem / 16px | 400 | Body copy |
| `--typography-label` | 0.875rem / 14px | 500, `tracking-wide` | Gateway labels, nav |
| `--typography-caption` | 0.75rem / 12px | 500, `tracking-wider`, uppercase | Section labels, chip/badge text |

Google Fonts: `JetBrains+Mono:wght@400;500;700` and `Fraunces:ital,wght@1,500`. Load only the italic-500 cut of Fraunces — nothing else uses it.

## Spacing & Radius

4px-derived scale (`--spacing-stack-xs` 8px → `--spacing-stack-lg` 40px), tight because the whole layout has to fit one viewport with no scroll — generous section padding isn't available, so rhythm comes from consistent small increments instead.

Radius is mixed on purpose: `--radius-lg` (14px) on rectangular surfaces (gateway cards) keeps them looking structured/professional; `--radius-full` on anything circular (social icons, the mute toggle, decorative dots) is where "fun" shows up. Nothing gets `radius-md`-and-below softness — either sharp-ish rectangle or full pill/circle, no in-between mush.

## Elevation

No ambient gray shadows at rest — surfaces sit flush against the page with a 1px hairline border (`--gateway-card-shadow`, effectively a border-as-shadow so it composites cleanly with the hover state). On hover/focus, elevation becomes an **accent-tinted glow** (`--gateway-card-shadow-hover`) plus a small upward translate (`--gateway-card-lift-hover: -4px`) — depth and accent color arrive together, reinforcing that accent = "alive right now."

## Motion

| Token | Duration | Easing | Use |
|---|---|---|---|
| `--motion-press` | 80ms | — | Active/pressed state |
| `--motion-hover` | 150ms | `ease-default` (`cubic-bezier(0.16,1,0.3,1)`) | Color/border hover transitions |
| `--motion-enter` | 220ms | `ease-default` | Page-load stagger, focus ring |
| `--motion-playful` | 420ms | `ease-playful` (`cubic-bezier(0.34,1.56,0.64,1)`, slight overshoot) | Gateway card lift, cursor-follow settle, easter-egg interactions |

`prefers-reduced-motion: reduce` — every rule using `motion-playful`/transform must fall back to a plain `motion-hover` opacity or color change, no translate/scale/spring. Ambient/ammient background motion (parallax, ticking SVGs) must be disabled outright under reduced-motion, not just slowed down.

## Component tokens (initial set)

- `gateway-card-*` — the three portfolio links: name + short description only, no eyebrow/number label. Hairline at rest → green glow + lift on hover/focus.
- `social-icon-*` — circular, 44px (meets tap-target minimum), fills with `accent-soft` and borders in `accent` on hover.
- `focus-ring-*` — 2px solid `focus-ring` color, 3px offset, applies uniformly to every interactive element regardless of its own hover treatment. Never suppressed.
- `chip-*` — inverted (ink bg / white fg) pill, reserved for the "coming soon" badge on gateways whose destination isn't live yet.

## Open items to confirm with Kv

- Photo treatment (duotone in ink/accent? full color? masked shape?) — affects whether we need an extra `--color-photo-*` token group.
- Whether the Fraunces flourish appears in the name or only in the tagline — affects `--typography-display` font-family.
- Which accent ships as the default. `green` is current; `amber`, `indigo`, and `clay` are built and contrast-verified.
- Whether the theme/accent/density controls stay user-facing on the live page or are a build-time choice only. They currently live in the `/options` preview chrome, not the page itself.
