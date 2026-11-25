# Design System: Kahfi Rahmada Portfolio

Derived strictly from the home page ([app/gallery-home.tsx](app/gallery-home.tsx), [app/home.css](app/home.css), [app/layout.tsx](app/layout.tsx), [app/page.tsx](app/page.tsx)). Use this document as the single source of truth when refining or extending other routes.

**Direction:** Gallery-minimalist editorial canvas on pure white, paired with frosted-glass chrome controls and frameless layered 16:9 project dioramas.
**Dial:** `ENERGY 3 / RHYTHM 2 / MOTION 2`

---

## 1. Color Tokens

All foreground/background pairings meet WCAG AA (4.5:1 normal text, 3:1 large text).

| Role | Token / Value | Contrast on `#ffffff` | Usage |
|---|---|---|---|
| Canvas ground | `#ffffff` | - | Page background, diorama negative space |
| Primary ink | `--gh-ink: #0f0f0f` | 19.17:1 | Headlines, brand name, active controls |
| Muted ink | `--gh-muted: #57534e` | 7.63:1 | Secondary copy, subtitles, section labels |
| Chrome ink | `#3f3f46` / `#27272a` | 10.4:1 / 14.89:1 | Nav links, social icons, colophon, clock |
| Hairline border | `rgba(15, 15, 20, 0.08)` | - | Outer definition on glass surfaces & frames |
| Brand accent | `--gh-accent: #166238` | 7.40:1 | Role subtitle, link hovers, CTA hover, focus |
| Status ink | `#145932` | 6.85:1 (on tint) | `OPEN TO WORK` badge text |
| Status dot | `#1c8049` | - | Solid indicator dot (real state only, no pulse) |

### Glassmorphism Surfaces

Use glassmorphism strictly on floating chrome controls (navigation, CTA, status pill, social dock, clock, and integrated diorama tags). Never blur body text containers.

| Surface | Background | Blur | Border & Shadow |
|---|---|---|---|
| Light frosted glass | `rgba(244, 244, 247, 0.68)` | `blur(16px) saturate(160%)` | `1px solid rgba(255,255,255,0.85)`, `0 0 0 1px rgba(15,15,20,0.08)`, `inset 0 1px 0 rgba(255,255,255,0.95)`, `0 10px 26px -14px rgba(15,15,20,0.2)` |
| Diorama frosted tag | `rgba(255, 255, 255, 0.78)` | `blur(14px) saturate(160%)` | `1px solid rgba(255,255,255,0.9)`, `0 0 0 1px rgba(15,15,20,0.08)`, `0 8px 20px -10px rgba(15,15,20,0.22)` |
| Smoked dark glass (CTA) | `rgba(18, 18, 22, 0.82)` (hover `rgba(22, 98, 56, 0.9)`) | `blur(16px) saturate(160%)` | `1px solid rgba(255,255,255,0.16)`, `inset 0 1px 0 rgba(255,255,255,0.28)`, `0 8px 20px -10px rgba(15,15,20,0.38)` |
| Tinted emerald glass | `rgba(220, 248, 232, 0.72)` | `blur(16px) saturate(160%)` | `1px solid rgba(255,255,255,0.85)`, `0 0 0 1px rgba(22,98,56,0.22)`, `0 8px 20px -12px rgba(22,98,56,0.28)` |

---

## 2. Typography

Three Google Fonts loaded in [app/layout.tsx](app/layout.tsx), each with a single job:

| Role | Font Family | CSS Variable | Weight / Tracking | Usage |
|---|---|---|---|---|
| Brand mark | `Syne` | `--font-brand` | `700`, `-0.03em`, `1.0625rem` | Header wordmark (`kahfi rahmada`) |
| Primary sans | `DM Sans` | `--font-sans` | `400`, `500`, `600`, `700` | Hero `<h1>`, nav, buttons, captions, body |
| Technical mono | `JetBrains Mono` | `--font-mono` | `500`, `tabular-nums`, `0.75rem` | Live `BaliClock` city & time readout |

### Type Scale
- **Hero `<h1>`**: `clamp(1.55rem, 2.75vw, 2.35rem)` (mobile `clamp(1.375rem, 5.8vw, 1.85rem)`), weight `600`, tracking `-0.035em`, line-height `1.14`, `max-width: 26ch`, `text-wrap: balance`.
- **Body / Status**: `0.875rem`, line-height `1.5`, color `--gh-muted`.
- **Nav / CTA / Tag title**: `0.8125rem` to `0.84375rem`, weight `500` to `600`.
- **Section label / Colophon**: `0.75rem`, uppercase, tracking `0.04em` to `0.06em`, weight `500` to `600`.
- **Tag subtitle**: `0.6875rem` (mobile `0.625rem`), weight `500`.

---

## 3. Radii, Spacing & Layout Grid

### Border Radius Scale
- `8px`: Inner hover chips inside glass docks (`.gh-nav-link`, `.gh-social-link`) and mobile diorama tags.
- `10px`: Standalone pills (`.gh-cta`, `.gh-open-status`, `.gh-diorama-tag`).
- `12px`: Grouped frosted containers (`.gh-nav`, `.gh-socials`, `.gh-clock-pill`).
- `14px`: Portrait vignette frame (`.gh-vignette .photo`).
- `9999px`: Status dot (`.gh-open-dot`).

### Page Shell & Breakpoints
- **Outer shell**: `display: grid; grid-template-rows: auto 1fr auto; min-height: 100dvh; overflow-x: clip;`.
- **Horizontal gutter**: `--gh-pad-x: clamp(1.25rem, 4.2vw, 3.75rem)`.
- **Desktop (`>= 1024px`)**:
  - Sticky 3-column header (`grid-template-columns: 1fr auto 1fr`): brand left, frosted nav dead-center, smoked-glass CTA right.
  - Intro section offset `20%` from the left edge (`padding-inline: max(var(--gh-pad-x), 20%) var(--gh-pad-x)`).
  - Full-bleed horizontal infinite marquee (`gap: clamp(1.25rem, 2.8vw, 2.25rem)`).
- **Tablet (`640px` to `1023px`)**:
  - 2-row header (`1fr auto` on row 1, full-width `.gh-nav` on row 2).
  - Intro resets to standard `--gh-pad-x` gutter.
- **Mobile (`< 640px`) & Touch (`hover: none` and `pointer: coarse`)**:
  - Header switches to `position: relative` (never steals vertical viewport height).
  - `.gh-nav` becomes a single-row horizontally scrollable frosted strip.
  - Marquee switches from JS auto-scroll to native `scroll-snap-type: x mandatory` (`86vw` card width, clones hidden).
  - Below `420px`, portrait stacks above the `<h1>`.
  - Every interactive control meets `44px` minimum touch target height/width; footer respects `env(safe-area-inset-bottom)`.

---

## 4. Components

1. **Brand Lockup (`.gh-brand`)**: `44×44px` avatar (`/kv_avatar.webp`) paired with lowercase `Syne` name and cobalt `DM Sans` role subtitle.
2. **Frosted Nav Bar (`.gh-nav`)**: Centered light frosted glass bar holding real destinations (`Work`, `About Me`, `My Journey`, `Side Quests`) with white frosted hover chips.
3. **Primary CTA (`.gh-cta`)**: Smoked dark glass button (`Work With Me` -> `mailto:`), shifting to frosted cobalt on hover/focus and `scale(0.97)` on press.
4. **Editorial Intro (`.gh-intro`)**: Interactive square portrait vignette (`PortraitToggle`, `clamp(80px, 8.2vw, 114px)`) beside a 2-line bold `<h1>` and a single `Currently building at` status link.
5. **Layered 16:9 Project Diorama (`.gh-diorama-card`)**:
   - Frameless 16:9 transparent canvas (`.gh-diorama-stage`) composed of individually positioned PNG layers (`z: 1` backdrop, `z: 2` device mockup, `z: 3` floating top accents, `z: 4` foreground characters/props).
   - Integrated frosted label (`.gh-diorama-tag`, `z: 6`) placed in each composition's open negative space, showing strictly `"NAME"` + `"PLATFORM"` (`iOS App`, `Game`, `Website`).
6. **Home Footer Bar (`.gh-footer`)**, home only, so the page fits one screen: Left colophon (`©2026 KAHFI RAHMADA | OPEN TO WORK` emerald glass link); right grouped frosted social icon dock (`.gh-socials`) + interactive live `BaliClock` frosted pill (`.gh-clock-pill`).
7. **Footer (`.sf`)**, every other page: A print in one green family. The page melts through a Javanese batik motif into a flat sky that holds a short personal note, and an engraved landscape closes it. Four scenes ([app/footer/scenes.ts](app/footer/scenes.ts)): Bali (Mega Mendung clouds, scooter), Bandung (Kawung, steam train), the sea (Parang, phinisi), the forest (Truntum, canoe). The sea is the live one, set in [app/site-footer.tsx](app/site-footer.tsx); the others are kept but unused. Dark theme is not a recolor: land flips to a dark block cut with light, with stars, a crescent moon and lamps. Plates are distance fields baked by `node scripts/engrave-footer.mjs`. Motion is scroll-scrubbed; reduced motion shows the finished print.

8. **Scroll film (`.fm`)**, `/story` only: one continuous voice, played by scroll, one to one (no smoothing). Copy in `STORY` ([content/site.ts](content/site.ts)), lengths in [timeline.ts](app/story/film/timeline.ts). Every animation is a paused CSS animation whose `currentTime` [film.tsx](app/story/film/film.tsx) sets, so `1s` in live.css, opening.css and told.css is one second of film. Reduced motion and no-JS get the same scenes stacked and finished; tall screens put copy above pictures.
   - The yellow note is the narrator and the only character. It hops word to word ([narrator.ts](app/story/film/narrator.ts) measures every `[data-note]`), and becomes whatever the line needs: lens, badge, pad, pin, bookmark, slider knob, clock hand. `<Say>` in [parts.tsx](app/story/film/parts.tsx) sets a sentence; `quiet` ones come without it. `[Bracketed]` words turn into the picture.
   - Every scene opens out of the last one (a lens, a crossing, a star, the shredder, a pin); nothing cuts. Each brings its project's own ground colour.
   - The opening portrait goes from mono to colour through a noise mask ([bloom.ts](app/story/film/bloom.ts)). Handwriting is `Nanum Pen Script` (this page only).

---

## 5. Motion & Interaction Rules

- **Primary easing**: `--gh-ease: cubic-bezier(0.16, 1, 0.3, 1)` (`120ms` press, `150ms–160ms` hover, `360ms` spotlight).
- **Diorama spring pop**: `360ms cubic-bezier(0.22, 1.3, 0.36, 1)` translating each PNG layer by its custom `--hx`, `--hy`, `--hr` offsets on card hover/focus.
- **Depth-of-field spotlight**: Pure CSS `:has(.gh-diorama-card:hover)` / `:focus-visible`. Active card scales `1.045` (`translateY(-4px)`, `z-index: 10`); sibling cards recede to `blur(5px) saturate(0.75)`, `opacity: 0.42`, `scale(0.96)`.
- **Infinite marquee & wheel scrubbing**: Unified `requestAnimationFrame` loop (`44px/s` auto-scroll + `0.42` vertical-wheel inertia with `0.86` decay and bidirectional modulo wrap). Pauses on hover and keyboard focus.
- **Reduced motion (`prefers-reduced-motion: reduce`)**: Stops marquee loop, hides duplicate track, enables manual horizontal scroll, and disables all transforms/transitions.

---

## 6. Accessibility & Craft Baseline

- Native semantics only (`<header>`, `<nav>`, `<main>`, `<footer>`, `<a href>`, `<button type="button">`, single `<h1>`).
- Base-layer `cursor: pointer` on enabled controls, `cursor: not-allowed` on disabled controls, visible `2px` `:focus-visible` ring on every interactive element.
- Icon-only links carry `aria-label` + `title`; decorative SVGs and cloned marquee cards carry `aria-hidden="true"` (and `tabIndex={-1}` on clones).
- Zero em dashes (`—`) in UI copy; every link points to a verified route or real action.
