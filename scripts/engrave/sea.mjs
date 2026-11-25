// The sea: karst islands on the horizon, a lighthouse, and a long swell rolling in.

import { H, W, bush, clamp, engrave, fbm, hash, lerp, lit, makeLayer, makeRandom, march, noise, polygon, ruled, skip, smooth, strokes } from "./engine.mjs";

const HORIZON = 520;

export function far() {
  const layer = makeLayer("far");
  // [x, z, radius, height]
  const islands = [
    [-30, 58, 8, 9.6], [-21, 53, 4.2, 7], [-40, 68, 11, 13.4], [-15.5, 60, 3, 5.4], [-26, 76, 7, 11.5], [-10.5, 72, 1.7, 4.6],
    [23, 60, 5.4, 8], [33, 64, 8.5, 12.6], [17, 70, 2.8, 6], [43, 58, 8, 9.4], [28, 84, 8, 12.4], [12.4, 78, 1.5, 4.2],
  ];
  const near = (x, z) => {
    let best = null;
    let bestH = 0;
    for (const isl of islands) {
      const [ix, iz, r, h] = isl;
      const a = Math.atan2(z - iz, x - ix);
      const wob = 1 + 0.16 * noise(a * 2.2 + ix, iz) + 0.07 * noise(a * 7 + ix, iz);
      const d = Math.hypot(x - ix, (z - iz) * 1.1) / (r * wob);
      if (d >= 1) continue;
      // Undercut karst: sheer walls, a lumpy green crown.
      const height = h * Math.pow(1 - Math.pow(d, 3), 0.5) * (0.84 + 0.2 * noise(x * 0.35, z * 0.35) + 0.1 * noise(x * 0.9, z * 0.9));
      if (height > bestH) {
        bestH = height;
        best = isl;
      }
    }
    return [bestH, best];
  };
  const height = (x, z) => near(x, z)[0];
  const view = { height, horizon: HORIZON, focal: 1500, camera: 3.4, near: 26, far: 420, steps: 3200, plain: (wy) => wy < 0.1 };
  const depth = march(view);
  engrave(layer, view, depth, (p) => {
    const [h, isl] = near(p.wx, p.z);
    if (!isl || h < 0.1) {
      // Open water: ruled, and left bright where the sun lies on it.
      const path = Math.exp(-Math.pow((p.x - 1280) / lerp(70, 300, smooth(HORIZON, 640, p.y)), 2));
      const calm = skip(p.x, p.y * 4.5, 0.012, 0.8);
      return [{ param: (q) => q.y, tone: clamp((0.36 - 0.28 * path) * calm, 0, 0.7), gap: 6.4 }];
    }
    const light = lit(p);
    const dark = smooth(0.85, 0.16, light);
    const brk = skip(p.x, p.y, 0.05, 0.45);
    const steep = smooth(0.9, 2.2, p.slope);
    const out = [
      // Cliff flutes.
      { param: (q) => Math.atan2(q.z - isl[1], q.wx - isl[0]) * isl[2] * 1.5 + fbm(q.wx * 0.4, q.wy * 0.5, 2) * 0.8, tone: clamp((0.1 + 0.72 * dark) * steep * brk, 0, 0.86), gap: 6 },
      // Scrub on the crown.
      { param: (q) => q.y + 5 * noise(q.x * 0.05, q.y * 0.05), tone: clamp((0.22 + 0.5 * dark) * (1 - steep) * skip(p.x * 1.5, p.y * 2, 0.15, 1.5), 0, 0.8), gap: 6 },
    ];
    // Tide notch: a dark band at the waterline.
    if (h < 0.75 && p.wy < 0.75) out.push({ param: (q) => q.y, tone: 0.85, gap: 4 });
    return out;
  });

  // Gulls.
  for (const [x, y, s] of [[820, 330, 1], [872, 306, 0.7], [760, 296, 0.6], [1690, 360, 0.8], [1736, 338, 0.6], [1640, 316, 0.5], [930, 352, 0.55]])
    strokes(layer, [[[x - 26 * s, y - 7 * s, 0.5], [x - 13 * s, y - 13 * s, 1.5], [x, y, 2], [x + 13 * s, y - 14 * s, 1.5], [x + 27 * s, y - 9 * s, 0.5]]], 2.4);
  return layer;
}

/** A trochoid-ish swell: broad troughs, narrow crests. */
const swell = (t) => Math.pow(0.5 + 0.5 * Math.sin(t), 2.3);

function seaLayer(name, { wave, horizon, camera, near, far, steps, foam, steepest }) {
  const layer = makeLayer(name);
  const view = { height: wave, horizon, focal: 1500, camera, near, far, steps };
  const depth = march(view);
  engrave(layer, view, depth, (p) => {
    const e = 0.006 * p.z;
    // Faces turned to the viewer hold the dark; backs and crests stay bare.
    const face = smooth(0.02, steepest, (wave(p.wx, p.z + e) - wave(p.wx, p.z)) / e);
    const crest = smooth(foam[0], foam[1], p.wy);
    const brk = skip(p.x, p.y * 1.6, 0.013, 0.55);
    const spray = noise(p.x * 0.16, p.y * 0.16) * 0.5 + noise(p.x * 0.4, p.y * 0.4) * 0.5;
    return [
      // Lines sweep up the face and bend over toward the crest.
      { param: (q) => q.wx * 1.3 - wave(q.wx, q.z) * 1.7 + 0.35 * q.z + 0.5 * fbm(q.wx * 0.4, q.z * 0.4, 2), tone: clamp((0.74 * face - 0.1) * skip(p.x, p.y, 0.03, 0.3) * (1 - crest), 0, 0.62), gap: 7 },
      { param: (q) => wave(q.wx, q.z) * 4 + q.z * 0.6, tone: clamp((0.1 + 0.16 * face) * brk * (1 - crest), 0, 0.6), gap: 8.5 },
      { param: (q) => q.y * 0.7 + q.x * 0.25, tone: clamp((spray - 0.28) * 1.5 * crest, 0, 0.6), gap: 5 },
    ];
  });

  // Lace along every crest: curls of foam spilling down the near side.
  const rnd = makeRandom(name.length * 7 + 1);
  const curls = [];
  for (let x = 4; x < W - 4; x += 5)
    for (let y = 4; y < H - 4; y++) {
      const z = depth[y * W + x];
      const up = depth[(y - 1) * W + x];
      if (!z || (up && up < z * 1.09)) continue;
      const size = clamp(130 / z, 3.2, 15);
      const wx = ((x - W / 2) / 1500) * z;
      if (wave(wx, z) < foam[0] * 0.62 || noise(x * 0.011, z * 2) < -0.25) continue;
      if (rnd() < 5 / (size * 0.8)) curls.push([x, y, size]);
    }
  curls.sort((p, q) => p[2] - q[2]);
  for (const [x, y, r] of curls) {
    const n = 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const cx = x + (rnd() - 0.5) * r * 1.2;
      const cy = y + r * 0.35 + k * r * (0.7 + 0.4 * rnd());
      const q = r * (1 - k * 0.2) * (0.6 + 0.4 * rnd());
      const side = rnd() < 0.5 ? -1 : 1;
      const arc = [];
      for (let i = 0; i <= 8; i++) {
        const a = -0.4 + (i / 8) * 4.4;
        const rr = q * (1 - i * 0.07);
        arc.push([cx + side * Math.cos(a) * rr, cy + Math.sin(a) * rr * 0.72, 0.45 + 0.07 * r * Math.sin((i / 8) * Math.PI)]);
      }
      strokes(layer, [arc], r * 0.22);
    }
  }
  return layer;
}

export function mid() {
  const wave = (x, z) => {
    const w = fbm(x * 0.06, z * 0.06, 3);
    const fade = smooth(64, 34, z);
    return (0.25 + 0.75 * fade) * (0.8 * swell(x * 0.16 + z * 0.62 + w * 4.4) + 0.5 * swell(x * -0.34 + z * 0.9 + 2 + w * 4) + 0.2 * fbm(x * 0.8, z * 0.8, 2)) - 0.1;
  };
  const layer = seaLayer("mid", { wave, horizon: HORIZON, camera: 4.6, near: 13, far: 58, steps: 4200, foam: [0.95, 1.3], steepest: 0.42 });

  // --- lighthouse on its rock ----------------------------------------------------
  const rnd = makeRandom(12);
  const X = 2060;
  const B = 640;
  polygon(layer, [[X - 190, B + 26], [X - 168, B + 2], [X - 120, B - 14], [X - 96, B - 40], [X - 52, B - 46], [X - 40, B - 62], [X + 46, B - 66], [X + 70, B - 44], [X + 118, B - 34], [X + 150, B - 2], [X + 206, B + 26]], {
    outline: 1.8,
    halo: 2.4,
    hatch: (x, y) => {
      const face = smooth(-120, 150, x - X);
      const crag = noise(x * 0.03, y * 0.02) * 22;
      return Math.max(ruled(x + crag, y, 1.25, 6, 0.35 + 1.7 * face), noise(x * 0.04, y * 0.05) > 0.1 ? ruled(x, y, -0.5, 7, 0.9 * face) : -9, (y - B - 14) * 0.5);
    },
  });
  const taper = (t) => lerp(34, 21, t);
  const T = B - 62;
  const HGT = 176;
  polygon(layer, [[X - 34, T], [X - 21, T - HGT], [X + 21, T - HGT], [X + 34, T]], {
    outline: 1.8,
    halo: 2.4,
    hatch: (x, y) => {
      const t = (T - y) / HGT;
      const u = (x - X) / taper(t);
      const band = Math.floor((t * 5 + 0.12 * u * u) % 2) === 1;
      const shade = ruled(x, y, Math.PI / 2, 4.6, 0.2 + 1.5 * smooth(-0.1, 1, u));
      return band ? Math.max(2.6 - 1.4 * smooth(-0.2, -0.9, u) * 2, shade) : u > -0.1 ? shade : -9;
    },
  });
  polygon(layer, [[X - 32, T - HGT], [X - 32, T - HGT - 8], [X + 32, T - HGT - 8], [X + 32, T - HGT]], { halo: 2, hatch: () => 3 });
  polygon(layer, [[X - 15, T - HGT - 8], [X - 15, T - HGT - 38], [X + 15, T - HGT - 38], [X + 15, T - HGT - 8]], { halo: 2, hatch: (x, y) => Math.max(ruled(x, y, Math.PI / 2, 10, 0.9), ruled(x, y, 0, 15, 0.6)) });
  polygon(layer, [[X - 20, T - HGT - 37], [X - 10, T - HGT - 52], [X, T - HGT - 58], [X + 10, T - HGT - 52], [X + 20, T - HGT - 37]], { halo: 2, hatch: () => 3 });
  strokes(layer, [[[X, T - HGT - 56, 1.2], [X, T - HGT - 72, 0.8]]], 1.6);
  strokes(layer, [[[X - 30, T - HGT - 20, 0.9], [X + 30, T - HGT - 20, 0.9]], ...[-30, -20, 20, 30].map((d) => [[X + d, T - HGT - 20, 0.8], [X + d, T - HGT - 7, 0.8]])], 1);
  // Keeper's house.
  polygon(layer, [[X + 44, B - 50], [X + 44, B - 88], [X + 112, B - 88], [X + 112, B - 40]], { hatch: (x, y) => (x > X + 84 ? ruled(x, y, Math.PI / 2, 4.6, 0.8) : -9) });
  polygon(layer, [[X + 36, B - 85], [X + 58, B - 116], [X + 98, B - 116], [X + 120, B - 85]], { hatch: (x, y) => ruled(x, y, 1.2, 5, 1) });
  polygon(layer, [[X + 58, B - 60], [X + 58, B - 76], [X + 72, B - 76], [X + 72, B - 60]], { hatch: () => 4 });
  for (const [x, y, r] of [[X - 70, B - 52, 20], [X - 100, B - 40, 15], [X + 132, B - 34, 17]]) bush(layer, rnd, x, y, r, { lobes: 6 });
  // Surf round the rock.
  for (let i = 0; i < 46; i++) {
    const a = rnd();
    const x = lerp(X - 215, X + 232, a);
    const y = B + 20 + rnd() * 16;
    strokes(layer, [[[x - 12, y + 4, 0.5], [x - 5, y - 3 - rnd() * 6, 1.1], [x + 4, y - 1, 1.1], [x + 12, y + 5, 0.4]]], 2);
  }
  return layer;
}

/** A leaping dolphin, dark back over a pale belly. */
function dolphin(layer, x, y, s, tilt) {
  const c = Math.cos(tilt);
  const n = Math.sin(tilt);
  const put = ([a, b]) => [x + (a * c - b * n) * s, y + (a * n + b * c) * s];
  // Spine: an arc; girth: full at the chest, pinched at tail and beak.
  const spine = (t) => [lerp(-104, 104, t), -58 * Math.sin(Math.PI * Math.pow(t, 0.85)) + 30];
  const girth = (t) => 27 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.72)), 0.9) * smooth(1.04, 0.8, t) + 3.4;
  const back = [];
  const belly = [];
  for (let i = 0; i <= 28; i++) {
    const t = i / 28;
    const [a, b] = spine(t);
    back.push([a, b - girth(t) * 0.86]);
    belly.unshift([a, b + girth(t)]);
  }
  const fluke = [[-100, 30], [-122, 14], [-140, 16], [-124, 32], [-120, 52], [-104, 44]];
  polygon(layer, fluke.map(put), { outline: 1.4, halo: 2.6, hatch: () => 4 });
  polygon(layer, [[-18, -48], [-15, -64], [-27, -82], [-2, -74], [16, -62], [32, -46]].map(put), { outline: 1.4, halo: 2.6, hatch: () => 4 });
  polygon(layer, [...back, ...belly].map(put), {
    outline: 1.5,
    halo: 2.6,
    hatch: (px, py) => {
      const a = ((px - x) * c + (py - y) * n) / s;
      const b = (-(px - x) * n + (py - y) * c) / s;
      const t = clamp((a + 104) / 208);
      const v = (b - spine(t)[1]) / girth(t);
      if (v < 0.12) return 3 - 2.6 * smooth(-0.95, -0.6, v) * smooth(0.0, -0.4, v) * smooth(0.25, 0.6, t);
      return ruled(px, py, tilt, 4.8, 1.5 * smooth(0.75, 0.15, v));
    },
  });
  polygon(layer, [[32, 12], [26, 30], [8, 50], [10, 30], [14, 12]].map(put), { outline: 1.4, halo: 2, hatch: () => 4 });
  strokes(layer, [[[...put([74, -6]), 1.5 * s], [...put([76, -5]), 1.5 * s]]], 1.4);
}

export function near() {
  const wave = (x, z) => {
    const w = fbm(x * 0.14 + 4, z * 0.12, 3);
    return 1.15 * swell(x * 0.42 + z * 1.0 + w * 4.2) + 0.55 * swell(x * -0.8 + z * 1.5 + 1 + w * 4) + 0.2 * fbm(x * 1.3, z * 1.3, 3) - 0.15;
  };
  const layer = seaLayer("near", { wave, horizon: 560, camera: 3.2, near: 5.2, far: 19, steps: 3600, foam: [1.02, 1.45], steepest: 0.75 });
  const rnd = makeRandom(5);
  dolphin(layer, 500, 706, 0.92, -0.2);
  dolphin(layer, 690, 728, 0.66, 0.1);
  // Splash where they left the water.
  for (let i = 0; i < 60; i++) {
    const [cx, cy] = i % 2 ? [396, 772] : [618, 764];
    const a = -Math.PI * (0.1 + 0.8 * rnd());
    const d = 16 + 62 * rnd();
    const x = cx + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d * 0.75;
    strokes(layer, [[[x, y, 0.8 + 1.6 * rnd()], [x + Math.cos(a) * 4, y + Math.sin(a) * 4 + 2, 0.8]]], 1.6);
  }
  // Flung spray along the nearest crests.
  for (let i = 0; i < 420; i++) {
    const x = rnd() * W;
    const y = 690 + rnd() * (H - 690);
    if (noise(x * 0.006, y * 0.012) < 0.42 || hash(i, 9) > 0.7) continue;
    strokes(layer, [[[x, y, 0.5 + 1.3 * rnd()], [x + 3, y + 0.6, 0.5]]], 0.6);
  }
  return layer;
}
