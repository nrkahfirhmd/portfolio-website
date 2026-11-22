"use client";

import Link from "next/link";
import { useState } from "react";
import { HOME, PERSON } from "@/content/site";

type AcrylicSetId = "classic" | "neon" | "bauhaus" | "monolith" | "botanical" | "mix";

const SETS: { id: AcrylicSetId; name: string; desc: string }[] = [
  {
    id: "classic",
    name: "SET A · REFERENCE",
    desc: "Acid-yellow translucent triangle, moulded white track-sole, frosted blueprint tag & embossed butter seal",
  },
  {
    id: "neon",
    name: "SET B · FLUORESCENT LAB",
    desc: "Electric lime disc, smoked graphite hexagon, clear crosshair ruler & tangerine acrylic badge",
  },
  {
    id: "bauhaus",
    name: "SET C · BAUHAUS GLASS",
    desc: "Cobalt acrylic arch, alabaster serif pill, amber grid prism & frosted ice lozenge",
  },
  {
    id: "monolith",
    name: "SET D · MONOLITH",
    desc: "Smoked obsidian slab, mirror-white block, clear technical beam & acid-gold token",
  },
  {
    id: "botanical",
    name: "SET E · BALI RESIN",
    desc: "Jade sea-glass leaf, ceramic pebble, clear rain-grid strip & sun-amber resin seal",
  },
  {
    id: "mix",
    name: "★ CUSTOM MIX",
    desc: "Mix and match any variation (A–E) for each of the 4 stickers below",
  },
];

type DestId = "software" | "games" | "quests" | "journey";
type VariantIdx = 0 | 1 | 2 | 3 | 4;

const DEST_META: Record<DestId, { href: string; label: string; sub: string; restA: number; restX: number; restY: number; fanA: number; fanX: number; fanY: number }> = {
  software: {
    href: "/software",
    label: "01 · SOFTWARE ENGINEERING",
    sub: "Systems that behave · 14 shipped mobile, web & AI projects",
    restA: -15,
    restX: -36,
    restY: 16,
    fanA: -23,
    fanX: -166,
    fanY: 16,
  },
  games: {
    href: "/games",
    label: "02 · GAME DEVELOPMENT",
    sub: "Worlds that misbehave · Batang Kayu Studio (Unity & Godot)",
    restA: 8,
    restX: 26,
    restY: -22,
    fanA: -8,
    fanX: -54,
    fanY: -56,
  },
  quests: {
    href: "/side-quests",
    label: "03 · SIDE QUESTS",
    sub: "Teaching 40+ students, leading 70+ crew & video essays",
    restA: -4,
    restX: -10,
    restY: -4,
    fanA: 8,
    fanX: 56,
    fanY: -48,
  },
  journey: {
    href: "/journey",
    label: "04 · THE JOURNEY",
    sub: "Apple Developer Academy Bali, Unpad AI (3.92) & 9 stops",
    restA: 17,
    restX: 40,
    restY: 22,
    fanA: 22,
    fanX: 166,
    fanY: 20,
  },
};

export default function DeckPreviewPage() {
  const [setId, setSetId] = useState<AcrylicSetId>("classic");
  const [customPick, setCustomPick] = useState<Record<DestId, VariantIdx>>({
    software: 0,
    games: 0,
    quests: 0,
    journey: 0,
  });
  const [activeId, setActiveId] = useState<DestId | null>(null);
  const [fanned, setFanned] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const isSpread = fanned || activeId !== null;
  const currentSet = SETS.find((s) => s.id === setId)!;

  function getVariant(id: DestId): VariantIdx {
    if (setId === "classic") return 0;
    if (setId === "neon") return 1;
    if (setId === "bauhaus") return 2;
    if (setId === "monolith") return 3;
    if (setId === "botanical") return 4;
    return customPick[id];
  }

  function selectSet(next: AcrylicSetId) {
    setSetId(next);
    if (next !== "mix") {
      const idx: VariantIdx =
        next === "classic" ? 0 : next === "neon" ? 1 : next === "bauhaus" ? 2 : next === "monolith" ? 3 : 4;
      setCustomPick({ software: idx, games: idx, quests: idx, journey: idx });
    }
  }

  function cycleCustom(id: DestId, v: VariantIdx) {
    setSetId("mix");
    setCustomPick((prev) => ({ ...prev, [id]: v }));
  }

  function renderAcrylicSticker(id: DestId, v: VariantIdx) {
    /* =====================================================================
       01 · SOFTWARE VARIATIONS (A–E)
       ===================================================================== */
    if (id === "software") {
      // A: Translucent Acid-Yellow Rounded Triangle / Guitar-Pick with Engraved Ring (TEXT ONLY — Direct Reference match)
      if (v === 0) {
        return (
          <div className="ac-soft-a">
            <span className="ac-engraved-ring" aria-hidden="true" />
            <span className="ac-bevel-shine" aria-hidden="true" />
            <span className="ac-soft-a-word">software</span>
          </div>
        );
      }
      // B: Fluorescent Lime Acrylic Rotary Lens Disc with Terminal Logo + Text (LOGO + TEXT)
      if (v === 1) {
        return (
          <div className="ac-soft-b">
            <span className="ac-engraved-ring ac-engraved-ring--lg" aria-hidden="true" />
            <svg viewBox="0 0 40 40" className="ac-ico-36" aria-hidden="true">
              <path d="M10 13 L19 20 L10 27 M22 27 H31" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="ac-soft-b-word">SOFTWARE</span>
          </div>
        );
      }
      // C: Translucent Cobalt Acrylic Arch Window with Geometric Node Logo + Serif Text (LOGO + TEXT)
      if (v === 2) {
        return (
          <div className="ac-soft-c">
            <span className="ac-grid-overlay" aria-hidden="true" />
            <svg viewBox="0 0 44 44" className="ac-ico-38" aria-hidden="true">
              <circle cx="22" cy="22" r="16" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <polygon points="22,10 33,29 11,29" fill="currentColor" />
            </svg>
            <span className="ac-soft-c-word">Software</span>
          </div>
        );
      }
      // D: Smoked Obsidian Frosted Acrylic Slab with Bold Recessed Sans (TEXT ONLY)
      if (v === 3) {
        return (
          <div className="ac-soft-d">
            <span className="ac-engraved-pill" aria-hidden="true" />
            <span className="ac-soft-d-word">software.</span>
          </div>
        );
      }
      // E: Sea-Glass Jade Translucent Leaf Prism with Code Bracket Logo + Text (LOGO + TEXT)
      return (
        <div className="ac-soft-e">
          <span className="ac-engraved-ring" aria-hidden="true" />
          <svg viewBox="0 0 44 44" className="ac-ico-36" aria-hidden="true">
            <path d="M16 12 L7 22 L16 32 M28 12 L37 22 L28 32" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="ac-soft-e-word">software</span>
        </div>
      );
    }

    /* =====================================================================
       02 · GAMES VARIATIONS (A–E)
       ===================================================================== */
    if (id === "games") {
      // A: Moulded Matte White Track-Sole Capsule with Ribbed Grooves + D-Pad + Text (LOGO + TEXT — Direct Reference match)
      if (v === 0) {
        return (
          <div className="ac-games-a">
            <span className="ac-sole-ribs ac-sole-ribs--top" aria-hidden="true" />
            <svg viewBox="0 0 44 44" className="ac-ico-40" aria-hidden="true">
              <path d="M16 6 H28 V16 H38 V28 H28 V38 H16 V28 H6 V16 H16 Z" fill="currentColor" />
              <circle cx="22" cy="22" r="4.5" fill="#e8e6df" />
            </svg>
            <span className="ac-games-a-word">Games</span>
            <span className="ac-sole-ribs ac-sole-ribs--bot" aria-hidden="true" />
          </div>
        );
      }
      // B: Smoked Graphite Translucent Hexagon with Arcade Star + Text (LOGO + TEXT)
      if (v === 1) {
        return (
          <div className="ac-games-b">
            <span className="ac-grid-overlay" aria-hidden="true" />
            <svg viewBox="0 0 44 44" className="ac-ico-38" aria-hidden="true">
              <path d="M22 2 C24 16 28 20 42 22 C28 24 24 28 22 42 C20 28 16 24 2 22 C16 20 20 16 22 2 Z" fill="#e8ff54" />
            </svg>
            <span className="ac-games-b-word">GAMES</span>
          </div>
        );
      }
      // C: Moulded Ceramic Alabaster Pill with Italic Serif (TEXT ONLY)
      if (v === 2) {
        return (
          <div className="ac-games-c">
            <span className="ac-engraved-pill" aria-hidden="true" />
            <span className="ac-games-c-word">Games</span>
          </div>
        );
      }
      // D: Pure White Embossed Block with 3D Relief Lettering (TEXT ONLY — Reference "Photoworks" tag match)
      if (v === 3) {
        return (
          <div className="ac-games-d">
            <span className="ac-games-d-word">Games</span>
          </div>
        );
      }
      // E: Batang Kayu Sprout Controller on Warm Sand Matte Resin (LOGO + TEXT)
      return (
        <div className="ac-games-e">
          <svg viewBox="0 0 48 48" className="ac-ico-40" aria-hidden="true">
            <path d="M14 20 H34 A10 10 0 0 1 42 32 L39 40 A5 5 0 0 1 31 38 L28 33 H20 L17 38 A5 5 0 0 1 9 40 L6 32 A10 10 0 0 1 14 20 Z" fill="currentColor" />
            <path d="M24 20 V10 C24 10 31 6 35 11" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
          <span className="ac-games-e-word">games</span>
        </div>
      );
    }

    /* =====================================================================
       03 · SIDE QUESTS VARIATIONS (A–E)
       ===================================================================== */
    if (id === "quests") {
      // A: Clear Frosted Blueprint Grid Tag with Crosshair & Vertical Editorial Type (TEXT ONLY — Reference "Editorial 03" match)
      if (v === 0) {
        return (
          <div className="ac-quests-a">
            <span className="ac-crosshair" aria-hidden="true" />
            <span className="ac-quests-a-word">Side Quests</span>
          </div>
        );
      }
      // B: Clear Polycarbonate Protractor Tag with Spark Logo + Vertical Text (LOGO + TEXT)
      if (v === 1) {
        return (
          <div className="ac-quests-b">
            <svg viewBox="0 0 40 40" className="ac-ico-32" aria-hidden="true">
              <polygon points="20,2 25,15 38,20 25,25 20,38 15,25 2,20 15,15" fill="#e8ff54" />
            </svg>
            <span className="ac-quests-b-word">SIDE QUESTS</span>
          </div>
        );
      }
      // C: Translucent Amber Grid Prism with Portal Arch Logo + Text (LOGO + TEXT)
      if (v === 2) {
        return (
          <div className="ac-quests-c">
            <span className="ac-grid-overlay" aria-hidden="true" />
            <svg viewBox="0 0 40 44" className="ac-ico-36" aria-hidden="true">
              <path d="M6 40 V18 A14 14 0 0 1 34 18 V40 Z" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="20" cy="19" r="4.5" fill="currentColor" />
            </svg>
            <span className="ac-quests-c-word">Side Quests</span>
          </div>
        );
      }
      // D: Frosted Ice Acrylic Beam with Oversized Cropped Type (TEXT ONLY)
      if (v === 3) {
        return (
          <div className="ac-quests-d">
            <span className="ac-crosshair" aria-hidden="true" />
            <span className="ac-quests-d-word">QUESTS</span>
          </div>
        );
      }
      // E: Clear Rain-Grid Acrylic Strip with Flourish Serif (TEXT ONLY)
      return (
        <div className="ac-quests-e">
          <span className="ac-crosshair" aria-hidden="true" />
          <span className="ac-quests-e-word">side quests</span>
        </div>
      );
    }

    /* =====================================================================
       04 · JOURNEY VARIATIONS (A–E)
       ===================================================================== */
    // A: Moulded Matte Butter-Yellow Cat Silhouette Seal with Embossed Facial Lines + Text (LOGO + TEXT — Reference Cat Charm match)
    if (v === 0) {
      return (
        <div className="ac-journey-a">
          <svg viewBox="0 0 64 54" className="ac-cat-ico" aria-hidden="true">
            <path
              d="M10 22 L8 5 L24 14 C29 12 35 12 40 14 L56 5 L54 22 C59 29 58 41 49 47 C39 53 25 53 15 47 C6 41 5 29 10 22 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="4.2"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="29" r="3.5" fill="currentColor" />
            <circle cx="40" cy="29" r="3.5" fill="currentColor" />
            <path d="M2 27 H11 M2 34 H12 M62 27 H53 M62 34 H52" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
          </svg>
          <span className="ac-journey-a-word">JOURNEY</span>
        </div>
      );
    }
    // B: Translucent Tangerine Acrylic Compass Disc with Pin Logo + Text (LOGO + TEXT)
    if (v === 1) {
      return (
        <div className="ac-journey-b">
          <span className="ac-engraved-ring" aria-hidden="true" />
          <svg viewBox="0 0 44 44" className="ac-ico-36" aria-hidden="true">
            <path d="M8 34 C18 34 16 22 25 22 S31 10 37 10" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="4 4" />
            <circle cx="36" cy="10" r="5" fill="currentColor" />
          </svg>
          <span className="ac-journey-b-word">journey</span>
        </div>
      );
    }
    // C: Frosted Ice Lozenge with North-Star Compass + Text (LOGO + TEXT)
    if (v === 2) {
      return (
        <div className="ac-journey-c">
          <svg viewBox="0 0 44 44" className="ac-ico-36" aria-hidden="true">
            <circle cx="22" cy="22" r="16" fill="none" stroke="currentColor" strokeWidth="2.2" />
            <polygon points="22,7 26,22 22,37 18,22" fill="currentColor" />
          </svg>
          <span className="ac-journey-c-word">Journey</span>
        </div>
      );
    }
    // D: Acid-Gold Translucent Square Token with Engraved Concentric Rings (TEXT ONLY)
    if (v === 3) {
      return (
        <div className="ac-journey-d">
          <span className="ac-engraved-ring" aria-hidden="true" />
          <span className="ac-journey-d-word">JOURNEY</span>
        </div>
      );
    }
    // E: Sun-Amber Resin Seal with Bali Sunburst Logo + Text (LOGO + TEXT)
    return (
      <div className="ac-journey-e">
        <svg viewBox="0 0 44 44" className="ac-ico-36" aria-hidden="true">
          <circle cx="22" cy="22" r="9" fill="currentColor" />
          <path d="M22 4 V9 M22 35 V40 M4 22 H9 M35 22 H40 M9 9 L13 13 M31 31 L35 35 M35 9 L31 13 M13 31 L9 35" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" />
        </svg>
        <span className="ac-journey-e-word">Journey</span>
      </div>
    );
  }

  const LETTERS = ["A", "B", "C", "D", "E"] as const;

  return (
    <div className="ac-stage" data-deck-theme={theme}>
      <header className="ac-nav">
        <Link href="/" className="ac-nav-item">
          HOME
        </Link>
        <Link href="/software" className="ac-nav-item">
          WORKS
        </Link>
        <Link href="/journey" className="ac-nav-item">
          JOURNEY
        </Link>
        <a href="mailto:nurkahfirahmada@gmail.com" className="ac-nav-item">
          CONTACT
        </a>
      </header>

      <div className="ac-body">
        <aside className="ac-wing ac-wing--left">
          <p className="ac-wing-label">
            {activeId ? DEST_META[activeId].label : currentSet.name}
          </p>
          <p className="ac-wing-sub">
            {activeId ? DEST_META[activeId].sub : currentSet.desc}
          </p>

          {/* Per-Sticker Variation Mixer (5 variants per destination = 20 Acrylic Stickers) */}
          <div className="ac-mixer" aria-label="Mix individual sticker variations">
            {(["software", "games", "quests", "journey"] as const).map((id) => {
              const curV = getVariant(id);
              return (
                <div key={id} className="ac-mixer-row">
                  <span className="ac-mixer-name">{id.toUpperCase()}</span>
                  <div className="ac-mixer-btns">
                    {LETTERS.map((ltr, idx) => (
                      <button
                        key={ltr}
                        type="button"
                        className="ac-var-btn"
                        data-active={curV === idx || undefined}
                        onClick={() => cycleCustom(id, idx as VariantIdx)}
                      >
                        {ltr}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Center Object: 4 Overlapping Acrylic Studio Stickers */}
        <div
          className="ac-cluster"
          data-fanned={isSpread}
          onMouseEnter={() => setFanned(true)}
          onMouseLeave={() => {
            setFanned(false);
            setActiveId(null);
          }}
        >
          <nav className="ac-pile" aria-label="Acrylic Studio Portfolio Stickers">
            {(["software", "games", "quests", "journey"] as const).map((id, idx) => {
              const pos = DEST_META[id];
              const isActive = activeId === id;
              const order = ["software", "games", "quests", "journey"] as const;
              const activeIndex = activeId ? order.indexOf(activeId) : -1;

              const baseAngle = isSpread ? pos.fanA : pos.restA;
              const baseX = isSpread ? pos.fanX : pos.restX;
              const baseY = isSpread ? pos.fanY : pos.restY;

              const neighborPush =
                activeIndex === -1
                  ? 0
                  : idx < activeIndex
                    ? -22
                    : idx > activeIndex
                      ? 22
                      : 0;

              const angle = baseAngle + neighborPush * 0.24;
              const x = baseX + neighborPush * 1.35;
              const y = isActive ? baseY - 20 : baseY;

              return (
                <Link
                  key={id}
                  href={pos.href}
                  className="ac-item"
                  data-active={isActive || undefined}
                  onMouseEnter={() => setActiveId(id)}
                  onFocus={() => setActiveId(id)}
                  onBlur={() => setActiveId(null)}
                  style={
                    {
                      "--angle": `${angle}deg`,
                      "--tx": `${x}px`,
                      "--ty": `${y}px`,
                      zIndex: isActive ? 40 : 10 + idx,
                    } as React.CSSProperties
                  }
                >
                  {renderAcrylicSticker(id, getVariant(id))}
                </Link>
              );
            })}
          </nav>
        </div>

        <aside className="ac-wing ac-wing--right">
          <p className="ac-wing-label">{PERSON.name.toUpperCase()} 2026</p>
          <p className="ac-wing-sub">
            {PERSON.openToWork ? "● OPEN TO WORK · BALI" : "BALI · UTC+8"}
          </p>
        </aside>
      </div>

      {/* Bottom Bar: 5 Preset Acrylic Sets + Custom Mix + Fan + Surface */}
      <footer className="ac-footer">
        <div className="ac-sets" role="group" aria-label="Acrylic Studio Sets">
          {SETS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="ac-set-chip"
              data-selected={setId === s.id || undefined}
              onClick={() => selectSet(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>

        <div className="ac-controls">
          <button
            type="button"
            className="ac-pill-btn"
            onClick={() => setFanned((f) => !f)}
          >
            {isSpread ? "PILE" : "SPREAD"}
          </button>
          <button
            type="button"
            className="ac-pill-btn"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            {theme.toUpperCase()}
          </button>
        </div>
      </footer>

      <style>{`
        .ac-stage {
          --bg: #040405;
          --fg: #f4f3ef;
          --muted: #8e8a7e;
          --border: rgba(255, 255, 255, 0.14);
          position: relative;
          display: grid;
          grid-template-rows: auto 1fr auto;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          background: var(--bg);
          color: var(--fg);
          padding: clamp(1.25rem, 3.5vh, 2.5rem) clamp(1.5rem, 4vw, 3.5rem);
          font-family: var(--font-mono), ui-monospace, monospace;
          transition: background 260ms ease, color 260ms ease;
        }
        .ac-stage[data-deck-theme="light"] {
          --bg: #eae7e0;
          --fg: #141310;
          --muted: #656155;
          --border: rgba(20, 19, 16, 0.14);
        }

        .ac-nav {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          align-items: center;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
        }
        .ac-nav-item {
          color: var(--fg);
          text-decoration: none;
          opacity: 0.82;
          transition: opacity 150ms ease, color 150ms ease;
        }
        .ac-nav-item:nth-child(2),
        .ac-nav-item:nth-child(3) { text-align: center; }
        .ac-nav-item:nth-child(4) { text-align: right; }
        .ac-nav-item:hover,
        .ac-nav-item:focus-visible {
          opacity: 1;
          color: #e8ff54;
        }

        .ac-body {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          min-height: 0;
        }

        .ac-wing {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
          max-width: 28ch;
        }
        .ac-wing--right {
          justify-self: end;
          text-align: right;
        }
        .ac-wing-label {
          margin: 0;
          font-size: 0.78rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }
        .ac-wing-sub {
          margin: 0;
          font-size: 0.7rem;
          color: var(--muted);
          letter-spacing: 0.03em;
          line-height: 1.45;
        }

        /* Individual Sticker Variation Mixer */
        .ac-mixer {
          margin-top: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          padding-top: 0.65rem;
          border-top: 1px solid var(--border);
        }
        .ac-mixer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
        }
        .ac-mixer-name {
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          color: var(--muted);
        }
        .ac-mixer-btns {
          display: flex;
          gap: 3px;
        }
        .ac-var-btn {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          border: 1px solid var(--border);
          background: transparent;
          color: var(--muted);
          font: inherit;
          font-size: 0.6rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .ac-var-btn:hover {
          color: var(--fg);
          border-color: var(--fg);
        }
        .ac-var-btn[data-active] {
          background: #e8ff54;
          color: #090a06;
          border-color: #e8ff54;
        }

        .ac-cluster {
          position: relative;
          display: grid;
          place-items: center;
          width: 580px;
          height: 440px;
          user-select: none;
        }
        .ac-pile {
          position: relative;
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
        }

        .ac-item {
          position: absolute;
          text-decoration: none;
          transform: translate3d(var(--tx, 0px), var(--ty, 0px), 0) rotate(var(--angle, 0deg));
          transition:
            transform 440ms cubic-bezier(0.22, 1, 0.36, 1),
            filter 260ms ease;
          cursor: pointer;
          filter: drop-shadow(0 22px 34px rgba(0, 0, 0, 0.65));
        }
        .ac-item[data-active] {
          transform: translate3d(var(--tx, 0px), var(--ty, 0px), 0) rotate(calc(var(--angle, 0deg) * 0.32)) scale(1.1);
          filter: drop-shadow(0 32px 52px rgba(0, 0, 0, 0.85));
        }

        /* Shared Acrylic Hardware Details */
        .ac-ico-40 { width: 40px; height: 40px; flex-shrink: 0; position: relative; z-index: 2; }
        .ac-ico-38 { width: 38px; height: 38px; flex-shrink: 0; position: relative; z-index: 2; }
        .ac-ico-36 { width: 36px; height: 36px; flex-shrink: 0; position: relative; z-index: 2; }
        .ac-ico-32 { width: 32px; height: 32px; flex-shrink: 0; position: relative; z-index: 2; }

        .ac-engraved-ring {
          position: absolute;
          width: 112px;
          height: 112px;
          border-radius: 999px;
          border: 1.5px solid rgba(255, 255, 255, 0.42);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25), 0 1px 0 rgba(255, 255, 255, 0.35);
          pointer-events: none;
        }
        .ac-engraved-ring--lg {
          width: 142px;
          height: 142px;
        }
        .ac-engraved-pill {
          position: absolute;
          inset: 14px;
          border-radius: inherit;
          border: 1.5px solid rgba(255, 255, 255, 0.35);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
          pointer-events: none;
        }
        .ac-grid-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(rgba(255, 255, 255, 0.18) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.18) 1px, transparent 1px) 0 0 / 22px 22px;
          pointer-events: none;
        }
        .ac-crosshair {
          position: absolute;
          top: 16px;
          left: 16px;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          border: 1.5px solid rgba(255, 255, 255, 0.68);
          pointer-events: none;
        }
        .ac-crosshair::before,
        .ac-crosshair::after {
          content: "";
          position: absolute;
          background: rgba(255, 255, 255, 0.68);
        }
        .ac-crosshair::before { left: 50%; top: -4px; bottom: -4px; width: 1.5px; transform: translateX(-50%); }
        .ac-crosshair::after { top: 50%; left: -4px; right: -4px; height: 1.5px; transform: translateY(-50%); }

        /* =========================================================
           01 · SOFTWARE (Variants A–E)
           ========================================================= */
        /* A: Translucent Acid-Yellow Rounded Triangle Wedge (Reference "motion 01" match) */
        .ac-soft-a {
          position: relative;
          width: 224px;
          height: 164px;
          border-radius: 26px 88px 22px 30px;
          background: linear-gradient(135deg, rgba(248, 232, 44, 0.84) 0%, rgba(214, 192, 14, 0.72) 100%);
          border: 2px solid rgba(255, 252, 185, 0.88);
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.95),
            inset 0 -6px 14px rgba(130, 105, 0, 0.38),
            inset 0 0 26px rgba(255, 248, 120, 0.35);
          backdrop-filter: blur(7px);
          display: grid;
          place-items: center;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-soft-a-word {
          position: relative;
          z-index: 2;
          font-size: 1.78rem;
          font-weight: 800;
          letter-spacing: -0.04em;
          text-shadow: 0 1px 3px rgba(90, 70, 0, 0.35);
        }

        /* B: Fluorescent Electric-Lime Acrylic Rotary Lens Disc */
        .ac-soft-b {
          position: relative;
          width: 184px;
          height: 184px;
          border-radius: 999px;
          background: linear-gradient(145deg, rgba(214, 255, 62, 0.84) 0%, rgba(74, 222, 128, 0.72) 100%);
          border: 2px solid rgba(240, 255, 180, 0.9);
          box-shadow:
            inset 0 2px 5px rgba(255, 255, 255, 0.95),
            inset 0 -6px 14px rgba(16, 95, 45, 0.35);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #07190c;
        }
        .ac-soft-b-word {
          position: relative;
          z-index: 2;
          font-size: 1.2rem;
          font-weight: 900;
          letter-spacing: 0.06em;
        }

        /* C: Translucent Cobalt Acrylic Arch Window */
        .ac-soft-c {
          position: relative;
          width: 168px;
          height: 214px;
          border-radius: 84px 84px 20px 20px;
          background: linear-gradient(160deg, rgba(59, 130, 246, 0.78) 0%, rgba(29, 78, 216, 0.68) 100%);
          border: 2px solid rgba(191, 219, 254, 0.85);
          box-shadow:
            inset 0 2px 5px rgba(255, 255, 255, 0.9),
            inset 0 -6px 14px rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(9px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-soft-c-word {
          position: relative;
          z-index: 2;
          font-family: var(--font-flourish), Georgia, serif;
          font-style: italic;
          font-size: 1.85rem;
        }

        /* D: Smoked Obsidian Frosted Acrylic Slab */
        .ac-soft-d {
          position: relative;
          width: 228px;
          height: 112px;
          border-radius: 24px;
          background: linear-gradient(160deg, rgba(38, 42, 50, 0.82) 0%, rgba(15, 17, 22, 0.76) 100%);
          border: 2px solid rgba(255, 255, 255, 0.48);
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.55),
            inset 0 -6px 12px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          display: grid;
          place-items: center;
          color: #f4f3ef;
        }
        .ac-soft-d-word {
          font-size: 1.95rem;
          font-weight: 900;
          letter-spacing: -0.05em;
        }

        /* E: Jade Sea-Glass Translucent Leaf Prism */
        .ac-soft-e {
          position: relative;
          width: 214px;
          height: 148px;
          border-radius: 54px 18px 54px 18px;
          background: linear-gradient(145deg, rgba(52, 211, 153, 0.8) 0%, rgba(16, 185, 129, 0.66) 100%);
          border: 2px solid rgba(209, 250, 229, 0.85);
          box-shadow:
            inset 0 2px 5px rgba(255, 255, 255, 0.9),
            inset 0 -6px 14px rgba(6, 78, 59, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #ffffff;
        }
        .ac-soft-e-word {
          font-size: 1.55rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        /* =========================================================
           02 · GAMES (Variants A–E)
           ========================================================= */
        /* A: Moulded Matte White Track-Sole Capsule (Reference "02" Shoe-sole tag match) */
        .ac-games-a {
          position: relative;
          width: 136px;
          height: 248px;
          border-radius: 999px;
          background: linear-gradient(170deg, #f5f4f0 0%, #d5d2c8 100%);
          border: 2px solid #ffffff;
          box-shadow:
            inset 0 3px 6px rgba(255, 255, 255, 0.98),
            inset 0 -8px 14px rgba(0, 0, 0, 0.18);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          color: #181715;
          overflow: hidden;
        }
        .ac-sole-ribs {
          width: 78px;
          height: 18px;
          background: repeating-linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.14) 0 2.5px,
            rgba(255, 255, 255, 0.8) 2.5px 5px
          );
          border-radius: 8px;
        }
        .ac-games-a-word {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        /* B: Smoked Graphite Translucent Hexagon */
        .ac-games-b {
          position: relative;
          width: 174px;
          height: 194px;
          border-radius: 36px;
          background: linear-gradient(155deg, rgba(64, 72, 84, 0.78) 0%, rgba(24, 28, 36, 0.72) 100%);
          border: 2px solid rgba(255, 255, 255, 0.62);
          box-shadow:
            inset 0 2px 4px rgba(255, 255, 255, 0.75),
            inset 0 -6px 14px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-games-b-word {
          position: relative;
          z-index: 2;
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        /* C: Ceramic Alabaster Pill with Italic Serif */
        .ac-games-c {
          position: relative;
          width: 216px;
          height: 112px;
          border-radius: 999px;
          background: linear-gradient(170deg, #faf9f5 0%, #dedad0 100%);
          border: 2px solid #ffffff;
          box-shadow:
            inset 0 3px 6px #ffffff,
            inset 0 -6px 12px rgba(0, 0, 0, 0.14);
          display: grid;
          place-items: center;
          color: #161513;
        }
        .ac-games-c-word {
          font-family: var(--font-flourish), Georgia, serif;
          font-style: italic;
          font-size: 2.3rem;
        }

        /* D: Pure White Embossed 3D Relief Tag (Reference "Photoworks" tag match) */
        .ac-games-d {
          width: 112px;
          height: 256px;
          border-radius: 14px;
          background: linear-gradient(165deg, #f3f2ee 0%, #d8d6ce 100%);
          border: 2px solid #ffffff;
          box-shadow:
            inset 0 2px 5px #ffffff,
            inset 0 -6px 12px rgba(0, 0, 0, 0.15);
          display: grid;
          place-items: center;
        }
        .ac-games-d-word {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 2.65rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          color: #e9e7e0;
          text-shadow:
            -2px -2px 3px #ffffff,
            2px 3px 5px rgba(0, 0, 0, 0.28);
        }

        /* E: Warm Sand Matte Resin with Batang Kayu Sprout Controller */
        .ac-games-e {
          width: 196px;
          height: 132px;
          border-radius: 36px;
          background: linear-gradient(165deg, #f5efe2 0%, #d8ccb8 100%);
          border: 2px solid #ffffff;
          box-shadow:
            inset 0 3px 6px #ffffff,
            inset 0 -6px 12px rgba(90, 70, 40, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #1f1a12;
        }
        .ac-games-e-word {
          font-size: 1.5rem;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        /* =========================================================
           03 · SIDE QUESTS (Variants A–E)
           ========================================================= */
        /* A: Clear Frosted Blueprint Grid Tag (Reference "Editorial 03" match) */
        .ac-quests-a {
          position: relative;
          width: 118px;
          height: 268px;
          border-radius: 16px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px) 0 0 / 24px 24px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.22) 1px, transparent 1px) 0 0 / 24px 24px,
            linear-gradient(165deg, rgba(195, 210, 228, 0.5), rgba(120, 136, 156, 0.36));
          border: 2px solid rgba(255, 255, 255, 0.78);
          box-shadow:
            inset 0 1px 3px rgba(255, 255, 255, 0.95),
            inset 0 -4px 10px rgba(0, 0, 0, 0.22);
          backdrop-filter: blur(10px);
          display: grid;
          place-items: center;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-stage[data-deck-theme="light"] .ac-quests-a,
        .ac-stage[data-deck-theme="light"] .ac-quests-b,
        .ac-stage[data-deck-theme="light"] .ac-quests-d,
        .ac-stage[data-deck-theme="light"] .ac-quests-e {
          background:
            linear-gradient(rgba(255, 255, 255, 0.16) 1px, transparent 1px) 0 0 / 24px 24px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.16) 1px, transparent 1px) 0 0 / 24px 24px,
            linear-gradient(165deg, rgba(55, 68, 86, 0.86), rgba(28, 35, 46, 0.9));
        }
        .ac-quests-a-word {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 2.15rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          white-space: nowrap;
        }

        /* B: Clear Polycarbonate Protractor Tag with Spark Logo + Vertical Text */
        .ac-quests-b {
          position: relative;
          width: 122px;
          height: 268px;
          border-radius: 60px 60px 16px 16px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(165deg, rgba(185, 205, 225, 0.48), rgba(110, 128, 150, 0.34));
          border: 2px solid rgba(255, 255, 255, 0.78);
          box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 20px 12px 22px;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-quests-b-word {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 1.55rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          white-space: nowrap;
        }

        /* C: Translucent Amber Grid Prism with Portal Arch Logo */
        .ac-quests-c {
          position: relative;
          width: 176px;
          height: 206px;
          border-radius: 26px;
          background: linear-gradient(150deg, rgba(251, 191, 36, 0.82) 0%, rgba(217, 119, 6, 0.72) 100%);
          border: 2px solid rgba(254, 243, 199, 0.88);
          box-shadow:
            inset 0 2px 5px rgba(255, 255, 255, 0.9),
            inset 0 -6px 14px rgba(120, 53, 15, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-quests-c-word {
          position: relative;
          z-index: 2;
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        /* D: Frosted Ice Acrylic Beam with Oversized Cropped Type */
        .ac-quests-d {
          position: relative;
          width: 114px;
          height: 264px;
          border-radius: 16px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.22) 1px, transparent 1px) 0 0 / 20px 20px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.22) 1px, transparent 1px) 0 0 / 20px 20px,
            linear-gradient(165deg, rgba(210, 225, 242, 0.55), rgba(135, 155, 178, 0.4));
          border: 2px solid rgba(255, 255, 255, 0.82);
          backdrop-filter: blur(11px);
          display: grid;
          place-items: center;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-quests-d-word {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 2.75rem;
          font-weight: 900;
          letter-spacing: -0.04em;
        }

        /* E: Clear Rain-Grid Acrylic Strip with Flourish Italic Serif */
        .ac-quests-e {
          position: relative;
          width: 118px;
          height: 264px;
          border-radius: 999px;
          background:
            linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px) 0 0 / 22px 22px,
            linear-gradient(165deg, rgba(185, 212, 202, 0.52), rgba(105, 138, 126, 0.38));
          border: 2px solid rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          display: grid;
          place-items: center;
          color: #ffffff;
          overflow: hidden;
        }
        .ac-quests-e-word {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-family: var(--font-flourish), Georgia, serif;
          font-style: italic;
          font-size: 2.35rem;
          white-space: nowrap;
        }

        /* =========================================================
           04 · JOURNEY (Variants A–E)
           ========================================================= */
        /* A: Moulded Matte Butter-Yellow Cat Silhouette Seal (Reference Cat Charm match) */
        .ac-journey-a {
          width: 172px;
          height: 172px;
          border-radius: 52px;
          background: linear-gradient(155deg, #ffeb55 0%, #ebc41c 100%);
          border: 2px solid #fff8b8;
          box-shadow:
            inset 0 3px 6px rgba(255, 255, 255, 0.82),
            inset 0 -6px 12px rgba(145, 108, 0, 0.28);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #332704;
        }
        .ac-cat-ico {
          width: 68px;
          height: 56px;
        }
        .ac-journey-a-word {
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        /* B: Translucent Tangerine Acrylic Compass Disc */
        .ac-journey-b {
          position: relative;
          width: 176px;
          height: 176px;
          border-radius: 999px;
          background: linear-gradient(145deg, rgba(255, 154, 60, 0.86) 0%, rgba(234, 88, 12, 0.76) 100%);
          border: 2px solid rgba(255, 228, 196, 0.88);
          box-shadow:
            inset 0 2px 5px rgba(255, 255, 255, 0.9),
            inset 0 -6px 14px rgba(124, 45, 18, 0.4);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #ffffff;
        }
        .ac-journey-b-word {
          position: relative;
          z-index: 2;
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }

        /* C: Frosted Ice Lozenge with North-Star Compass */
        .ac-journey-c {
          width: 214px;
          height: 116px;
          border-radius: 999px;
          background: linear-gradient(155deg, rgba(224, 242, 254, 0.65) 0%, rgba(148, 163, 184, 0.45) 100%);
          border: 2px solid rgba(255, 255, 255, 0.85);
          box-shadow: inset 0 2px 4px #ffffff;
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #ffffff;
        }
        .ac-stage[data-deck-theme="light"] .ac-journey-c {
          background: linear-gradient(155deg, rgba(30, 41, 59, 0.88) 0%, rgba(15, 23, 42, 0.92) 100%);
        }
        .ac-journey-c-word {
          font-family: var(--font-flourish), Georgia, serif;
          font-style: italic;
          font-size: 1.95rem;
        }

        /* D: Acid-Gold Translucent Square Token */
        .ac-journey-d {
          position: relative;
          width: 172px;
          height: 172px;
          border-radius: 36px;
          background: linear-gradient(135deg, rgba(253, 224, 71, 0.85) 0%, rgba(202, 138, 4, 0.75) 100%);
          border: 2px solid rgba(254, 249, 195, 0.9);
          box-shadow: inset 0 2px 5px rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          color: #ffffff;
        }
        .ac-journey-d-word {
          position: relative;
          z-index: 2;
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: 0.08em;
        }

        /* E: Sun-Amber Resin Seal with Bali Sunburst */
        .ac-journey-e {
          width: 176px;
          height: 176px;
          border-radius: 56px 24px 56px 24px;
          background: linear-gradient(150deg, rgba(252, 211, 77, 0.92) 0%, rgba(217, 119, 6, 0.86) 100%);
          border: 2px solid #fef3c7;
          box-shadow:
            inset 0 3px 6px rgba(255, 255, 255, 0.85),
            inset 0 -6px 12px rgba(120, 53, 15, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: #291802;
        }
        .ac-journey-e-word {
          font-family: var(--font-flourish), Georgia, serif;
          font-style: italic;
          font-size: 1.75rem;
        }

        /* Footer & Preset Switcher */
        .ac-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          color: var(--muted);
        }
        .ac-sets {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
        }
        .ac-set-chip {
          background: transparent;
          color: var(--muted);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.4rem 0.75rem;
          font: inherit;
          font-size: 0.62rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 140ms ease;
        }
        .ac-set-chip:hover {
          color: var(--fg);
          border-color: rgba(255, 255, 255, 0.35);
        }
        .ac-set-chip[data-selected] {
          background: #e8ff54;
          color: #090a06;
          border-color: #e8ff54;
          font-weight: 800;
        }

        .ac-controls {
          display: flex;
          gap: 0.45rem;
        }
        .ac-pill-btn {
          background: transparent;
          color: var(--fg);
          border: 1px solid var(--border);
          border-radius: 999px;
          padding: 0.4rem 0.85rem;
          font: inherit;
          font-size: 0.64rem;
          letter-spacing: 0.12em;
          cursor: pointer;
        }
        .ac-pill-btn:hover {
          border-color: #e8ff54;
        }

        @media (max-width: 860px) {
          .ac-body {
            grid-template-columns: 1fr;
            justify-items: center;
          }
          .ac-wing {
            display: none;
          }
          .ac-cluster {
            width: 100%;
            transform: scale(0.82);
          }
        }
      `}</style>
    </div>
  );
}
