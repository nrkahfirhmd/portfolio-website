/** The footer landscape. Art coordinates are texels of the 2560 x 960 plates (scripts/engrave). */

export type SceneId = "sea";

export interface Scene {
  alt: string;
  /** Texel x kept centred when narrow screens crop the sides. */
  focus: number;
  /** Sun by day, moon by night: x, y, radius. */
  sun: [number, number, number];
  /** Lamps lit after dark: x, y, radius, and the rise of the plate they hang on (near 0, mid 62, far 120). */
  lamps: [number, number, number, number][];
  vehicle: {
    viewBox: string;
    /** Width in texels, and the texel y its viewBox bottom rests on. */
    width: number;
    y: number;
    /** Where its middle ends up, as a fraction of the screen. */
    stop: number;
    /** Rides the middle plate, which sits lower until the scene has risen. */
    onMid?: boolean;
    /** Passes behind the foreground plate. */
    behind?: boolean;
    /** Only visible between these texels (tunnel mouths). */
    between?: [number, number];
    /** Turns to face the way it travels. */
    turns?: boolean;
    /** Pitch on the water, degrees. */
    rock?: number;
  };
}

export const SCENES: Record<SceneId, Scene> = {
  sea: {
    alt: "Engraving of the open sea: karst islands, a lighthouse, two dolphins, and a phinisi under full sail",
    focus: 1480,
    sun: [1296, 506, 128],
    lamps: [[2060, 379, 9, 62], [2125, 572, 4, 62], [1010, 600, 3, 120], [1488, 596, 3, 120]],
    vehicle: { viewBox: "-12 0 348 284", width: 330, y: 748, stop: 0.5, onMid: true, behind: true, turns: true, rock: 2.6 },
  },
};
