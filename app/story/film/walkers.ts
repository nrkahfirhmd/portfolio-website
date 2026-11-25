export interface Walker {
  /** -1..1 across the crossing. */
  lane: number;
  phase: number;
  speed: number;
  hair: string;
  shirt: string;
  pants: string;
  bag?: string;
  target?: boolean;
}

const WHITE = "#f4f2ee";
const BROWN = "#7a4a26";
const HAIR = ["#1c1a22", WHITE, "#e0407e", "#4a3022", WHITE, "#e8b04a"];
const SHIRT = ["#2f7ff0", "#e2263c", BROWN, "#2fa45c", "#f2f0ec", BROWN, "#f0a22e"];
const PANTS = ["#262b38", "#737b88", "#3b4a7a", "#8a5a34"];
const BAG = [undefined, WHITE, undefined, "#a8642a", WHITE];

// A fixed shuffle (Park-Miller), so server and client draw the same crowd.
let seed = 20260924;
const random = () => (seed = (seed * 48271) % 2147483647) / 2147483647;
const pick = <T>(list: readonly T[]) => list[Math.floor(random() * list.length)];

export const TARGET: Walker = {
  lane: 0.3,
  phase: 0,
  speed: 0.2,
  hair: WHITE,
  shirt: BROWN,
  pants: PANTS[0],
  bag: WHITE,
  target: true,
};

/** Many share one or two of the target's traits; nobody shares all three. */
const crowd: Walker[] = Array.from({ length: 30 }, (_, i) => ({
  lane: ((i * 0.618) % 1) * 2 - 1,
  phase: random() * 1.15,
  speed: 0.14 + random() * 0.24,
  hair: pick(HAIR),
  shirt: pick(SHIRT),
  pants: pick(PANTS),
  bag: pick(BAG),
})).filter((w) => !(w.hair === TARGET.hair && w.shirt === TARGET.shirt && w.bag === TARGET.bag));

export const WALKERS: Walker[] = [...crowd, TARGET];
