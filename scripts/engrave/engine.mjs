// The burin: noise, line screens, terrain marching and strokes shared by every footer scene.
//
// Each texture is a signed distance field, not a picture: grey = distance to the
// nearest ink edge (128 = edge, brighter = inside the line), alpha = the layer's
// silhouette. app/footer/art.tsx thresholds it, so lines stay sharp at any size.

import { deflateSync } from "node:zlib";

export const W = 2560;
export const H = 960;
/** Distance, in texels, that the grey ramp spans on either side of an ink edge. */
const RANGE = 4;

// --- maths ------------------------------------------------------------------

export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const gauss = (x) => Math.exp(-x * x);

export function makeRandom(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hash(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Value noise, -1..1. */
export function noise(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const u = smooth(0, 1, x - xi);
  const v = smooth(0, 1, y - yi);
  return (
    lerp(
      lerp(hash(xi, yi), hash(xi + 1, yi), u),
      lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), u),
      v,
    ) *
      2 -
    1
  );
}

export function fbm(x, y, octaves = 5) {
  let sum = 0;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise(x, y);
    x = x * 2.03 + 17.3;
    y = y * 2.03 - 9.1;
    amp *= 0.5;
  }
  return sum;
}

export function ridged(x, y, octaves = 5) {
  let sum = 0;
  let amp = 0.5;
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(noise(x, y));
    sum += amp * n * n;
    x = x * 2.07 + 5.2;
    y = y * 2.07 + 1.7;
    amp *= 0.5;
  }
  return sum;
}

// --- layers -----------------------------------------------------------------

export function makeLayer(name) {
  return { name, ink: new Float32Array(W * H).fill(-99), cov: new Float32Array(W * H) };
}

/** Cuts shape `d` (positive inside, texels) plus a paper halo out of the layer, then inks `ink` inside it. */
export function stamp(layer, x0, y0, x1, y1, fn, halo) {
  x0 = Math.max(0, Math.floor(x0));
  y0 = Math.max(0, Math.floor(y0));
  x1 = Math.min(W - 1, Math.ceil(x1));
  y1 = Math.min(H - 1, Math.ceil(y1));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const { d, ink } = fn(x, y);
      const grown = d + halo;
      if (grown < -RANGE && ink < -RANGE) continue;
      const i = y * W + x;
      layer.ink[i] = Math.max(Math.min(layer.ink[i], -grown), ink);
      layer.cov[i] = Math.max(layer.cov[i], clamp(grown + 0.5));
    }
  }
}

/** One burin stroke: a polyline of [x, y, halfWidth], merged with its siblings before stamping. */
export function strokes(layer, lines, halo = 0) {
  let x0 = 1e9;
  let y0 = 1e9;
  let x1 = -1e9;
  let y1 = -1e9;
  const pad = halo + RANGE + 3;
  for (const line of lines)
    for (const [x, y, r] of line) {
      x0 = Math.min(x0, x - r - pad);
      y0 = Math.min(y0, y - r - pad);
      x1 = Math.max(x1, x + r + pad);
      y1 = Math.max(y1, y + r + pad);
    }
  x0 = Math.max(0, Math.floor(x0));
  y0 = Math.max(0, Math.floor(y0));
  x1 = Math.min(W - 1, Math.ceil(x1));
  y1 = Math.min(H - 1, Math.ceil(y1));
  if (x1 < x0 || y1 < y0) return;
  const w = x1 - x0 + 1;
  const buf = new Float32Array(w * (y1 - y0 + 1)).fill(-99);
  for (const line of lines) {
    for (let k = 0; k + 1 < line.length; k++) {
      const [ax, ay, ar] = line[k];
      const [bx, by, br] = line[k + 1];
      const rad = Math.max(ar, br) + pad;
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy || 1e-6;
      const sx0 = Math.max(x0, Math.floor(Math.min(ax, bx) - rad));
      const sx1 = Math.min(x1, Math.ceil(Math.max(ax, bx) + rad));
      const sy0 = Math.max(y0, Math.floor(Math.min(ay, by) - rad));
      const sy1 = Math.min(y1, Math.ceil(Math.max(ay, by) + rad));
      for (let y = sy0; y <= sy1; y++)
        for (let x = sx0; x <= sx1; x++) {
          const t = clamp(((x - ax) * dx + (y - ay) * dy) / len2);
          const v = lerp(ar, br, t) - Math.hypot(x - ax - dx * t, y - ay - dy * t);
          const i = (y - y0) * w + (x - x0);
          if (v > buf[i]) buf[i] = v;
        }
    }
  }
  stamp(layer, x0, y0, x1, y1, (x, y) => {
    const v = buf[(y - y0) * w + (x - x0)];
    return { d: v, ink: v };
  }, halo);
}

export function polySdf(pts, x, y) {
  let d = Infinity;
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [ax, ay] = pts[j];
    const [bx, by] = pts[i];
    const dx = bx - ax;
    const dy = by - ay;
    const t = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1e-6));
    d = Math.min(d, Math.hypot(x - ax - dx * t, y - ay - dy * t));
    if (ay > y !== by > y && x < (dx * (y - ay)) / (by - ay) + ax) inside = !inside;
  }
  return inside ? d : -d;
}

/** A paper-filled polygon with an outline and an optional hatch(x, y) => ink distance. */
export function polygon(layer, pts, { outline = 1.6, halo = 1.6, hatch } = {}) {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const pad = halo + RANGE + 2;
  stamp(
    layer,
    Math.min(...xs) - pad,
    Math.min(...ys) - pad,
    Math.max(...xs) + pad,
    Math.max(...ys) + pad,
    (x, y) => {
      const d = polySdf(pts, x, y);
      let ink = outline - Math.abs(d);
      if (hatch) ink = Math.max(ink, Math.min(d, hatch(x, y)));
      return { d, ink };
    },
    halo,
  );
}

/** Distance to a ruled screen of parallel lines at `angle`, half width `hw`. */
export const ruled = (x, y, angle, gap, hw, wobble = 0) => {
  const p = x * Math.sin(angle) + y * Math.cos(angle) + wobble;
  return hw - Math.abs(p - gap * Math.round(p / gap));
};

// --- terrain ----------------------------------------------------------------

/**
 * Marches a heightfield column by column (nearest slice wins) and returns the
 * depth of each pixel, 0 where the ray misses.
 */
export function march({ height, horizon, focal, camera, near, far, steps }) {
  const depth = new Float32Array(W * H);
  const ratio = Math.pow(far / near, 1 / steps);
  for (let sx = 0; sx < W; sx++) {
    const dir = (sx - W / 2) / focal;
    let top = H;
    let zPrev = near;
    let yPrev = horizon - ((height(dir * near, near) - camera) * focal) / near;
    for (let k = 1, z = near * ratio; k <= steps && top > 0; k++, z *= ratio) {
      const sy = horizon - ((height(dir * z, z) - camera) * focal) / z;
      if (sy < top) {
        for (let y = Math.min(top, H) - 1; y >= Math.max(0, Math.ceil(sy)); y--) {
          const t = yPrev > sy ? clamp((yPrev - y) / (yPrev - sy)) : 1;
          depth[y * W + sx] = lerp(zPrev, z, t);
        }
        top = Math.max(0, Math.ceil(sy));
      }
      zPrev = z;
      yPrev = sy;
    }
  }
  return depth;
}

/**
 * Engraves a marched terrain. `shade(point)` returns a list of line screens,
 * each { param, tone, gap }: the lines are the level sets of `param`, kept near
 * `gap` texels apart by halving or doubling their frequency with the surface.
 */
export function engrave(layer, view, depth, shade) {
  const { height, horizon, focal, camera } = view;
  const at = (x, y) => {
    const z = depth[y * W + x];
    const wx = ((x - W / 2) / focal) * z;
    return { x, y, z, wx, wy: camera + ((horizon - y) * z) / focal };
  };
  for (let y = 0; y < H - 1; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const z = depth[i];
      if (!z) continue;
      layer.cov[i] = 1;
      const p = at(x, y);
      const e = Math.max(0.02, z * 0.0022);
      const nx = -(height(p.wx + e, z) - height(p.wx - e, z)) / (2 * e);
      const nz = -(height(p.wx, z + e) - height(p.wx, z - e)) / (2 * e);
      const nl = Math.hypot(nx, 1, nz);
      p.nx = nx / nl;
      p.ny = 1 / nl;
      p.nz = nz / nl;
      p.slope = Math.hypot(nx, nz);

      let ink = -99;
      for (const screen of shade(p)) {
        if (screen.tone <= 0.02) continue;
        // Finite differences, taken on whichever neighbour shares this surface.
        const xn = x < W - 1 && Math.abs(depth[i + 1] - z) < z * 0.05 && depth[i + 1] ? 1 : -1;
        const yn = Math.abs(depth[i + W] - z) < z * 0.05 && depth[i + W] ? 1 : -1;
        const qx = at(clamp(x + xn, 0, W - 1), y);
        const qy = at(x, Math.max(0, y + yn));
        const v = screen.param(p);
        let gx = screen.param(qx) - v;
        let gy = screen.param(qy) - v;
        if (!qx.z) gx = 0;
        if (!qy.z) gy = 0;
        const g = Math.hypot(gx, gy);
        if (g < 1e-9 || g > 1e3) continue;
        const level = Math.log2(1 / (g * screen.gap));
        const base = Math.floor(level);
        const blend = level - base;
        const f = Math.pow(2, base);
        const coarse = Math.abs(v * f - Math.round(v * f)) / (f * g);
        const f2 = f * 2;
        const fine = Math.abs(v * f2 - Math.round(v * f2)) / (f2 * g);
        const gap = 1 / (f * g);
        const hw = screen.tone * screen.gap * 0.5;
        const grow = hw * lerp(1, 0.5 * (gap / screen.gap) + 0.5, 0.35);
        ink = Math.max(ink, grow - coarse);
        // In-between lines fade in as the surface opens up, so spacing never jumps.
        ink = Math.max(ink, lerp(-1.6, hw, smooth(0.15, 0.85, blend)) - fine);
      }
      layer.ink[i] = ink;
    }

  // Contour: ink where this surface stands in front of something further away.
  for (let y = 3; y < H - 3; y++)
    for (let x = 3; x < W - 3; x++) {
      const i = y * W + x;
      const z = depth[i];
      // Flat water recedes fast enough near the horizon to look like an edge; scenes can exempt it.
      if (!z || view.plain?.(camera + ((horizon - y) * z) / focal)) continue;
      let best = 9;
      for (let k = 1; k <= 4; k++) {
        const up = depth[i - W * k];
        if (!up || up > z * 1.09) {
          best = k;
          break;
        }
      }
      if (best < 9) {
        const weight = 1.9 + 0.8 * noise(x * 0.013, y * 0.02);
        layer.ink[i] = Math.max(layer.ink[i], weight - (best - 0.5));
      }
    }
}

export const SUN = (() => {
  const v = [-0.62, 0.52, -0.42];
  const l = Math.hypot(...v);
  return v.map((c) => c / l);
})();
export const lit = (p) => clamp(p.nx * SUN[0] + p.ny * SUN[1] + p.nz * SUN[2]);
/** Breaks a line into dashes and dots along its length, the way a burin skips. */
export const skip = (x, y, scale, amount) => 1 + amount * noise(x * scale, y * scale * 2.2);

// --- vegetation and buildings -----------------------------------------------

/** A grass tuft: blades fanned from one root. */
export function tuft(layer, rnd, x, y, size, blades, halo = 2) {
  const lines = [];
  for (let i = 0; i < blades; i++) {
    const a = lerp(-1.15, 1.15, (i + rnd() * 0.8) / blades) + (rnd() - 0.5) * 0.2;
    const len = size * (0.55 + 0.55 * rnd()) * (1 - 0.28 * Math.abs(a));
    const x0 = x + a * size * 0.22;
    const bend = a * len * 0.45;
    const w = Math.max(0.9, size * 0.034) * (0.75 + 0.5 * rnd());
    const line = [];
    for (let k = 0; k <= 6; k++) {
      const t = k / 6;
      line.push([x0 + Math.sin(a) * len * t * 0.75 + bend * t * t, y - Math.cos(a * 0.8) * len * t + Math.abs(bend) * t * t * 0.35, w * (1 - t * 0.85) + 0.25]);
    }
    lines.push(line);
  }
  // Root shadow: short flat dashes.
  for (let i = 0; i < 4; i++) {
    const sx = x + (rnd() - 0.5) * size * 0.9;
    lines.push([[sx - size * 0.2, y + 2 + i * 2.2, 0.5], [sx, y + 2 + i * 2.2, 1.3], [sx + size * 0.24, y + 2 + i * 2.2, 0.4]]);
  }
  strokes(layer, lines, halo);
}

/** A coconut palm: ringed trunk, drooping fronds cut as individual leaflets. */
export function palm(layer, rnd, bx, by, tx, ty, size) {
  const trunkL = [];
  const trunkR = [];
  const mx = lerp(bx, tx, 0.35) + (bx - tx) * 0.18;
  const my = lerp(by, ty, 0.5);
  const curve = (t) => [
    (1 - t) ** 2 * bx + 2 * t * (1 - t) * mx + t * t * tx,
    (1 - t) ** 2 * by + 2 * t * (1 - t) * my + t * t * ty,
  ];
  const N = 26;
  const wide = (t) => size * (0.052 - 0.024 * t + 0.05 * Math.pow(1 - t, 9));
  for (let i = 0; i <= N; i++) {
    const [x, y] = curve(i / N);
    trunkL.push([x - wide(i / N), y]);
    trunkR.unshift([x + wide(i / N), y]);
  }
  polygon(layer, [...trunkL, ...trunkR], {
    outline: 1.4,
    halo: 2.2,
    hatch: (x, y) => {
      const t = clamp((by - y) / (by - ty));
      const side = (x - curve(t)[0]) / wide(t);
      const ring = 1.2 + 0.9 * side - Math.abs(((y + side * side * 5 + side * 2) % 9) - 4.5);
      return Math.max(ring, (side - 0.45) * 7);
    },
  });

  const count = 10;
  const order = [...Array(count).keys()].sort((a, b) => Math.abs(b - count / 2) - Math.abs(a - count / 2));
  for (const n of order) {
    const a = lerp(-1.95, 1.95, n / (count - 1)) + (rnd() - 0.5) * 0.25;
    const len = size * (0.95 + 0.25 * rnd());
    const droop = size * (0.16 + 0.42 * Math.abs(Math.sin(a * 0.8)) + 0.1 * rnd());
    const spine = [];
    for (let k = 0; k <= 16; k++) {
      const t = k / 16;
      spine.push([tx + Math.sin(a) * len * t, ty - Math.cos(a) * len * t * 0.66 + droop * t * t * 1.15, 2 * (1 - t) + 0.6]);
    }
    const lines = [spine];
    const leaves = 24;
    for (let k = 2; k < leaves; k++) {
      const t = k / leaves;
      const s = t * 16;
      const j = Math.min(15, Math.floor(s));
      const [x0, y0] = [lerp(spine[j][0], spine[j + 1][0], s - j), lerp(spine[j][1], spine[j + 1][1], s - j)];
      const dx = spine[j + 1][0] - spine[j][0];
      const dy = spine[j + 1][1] - spine[j][1];
      const l = Math.hypot(dx, dy);
      const reach = size * 0.21 * Math.pow(Math.sin(Math.PI * (0.1 + 0.84 * t)), 0.7) * (0.85 + 0.3 * rnd());
      for (const side of [-1, 1]) {
        const ex = (dx / l) * 0.78 - (dy / l) * side * 0.62;
        const ey = (dy / l) * 0.78 + (dx / l) * side * 0.62 + 0.2;
        lines.push([
          [x0, y0, 0.9],
          [x0 + ex * reach * 0.5, y0 + ey * reach * 0.46, 1.5],
          [x0 + ex * reach, y0 + ey * reach + reach * 0.12, 0.3],
        ]);
      }
    }
    strokes(layer, lines, 1.35);
  }
  // Nuts.
  for (let i = 0; i < 5; i++) {
    const cx = tx + (i - 2) * size * 0.045;
    const cy = ty + size * (0.05 + 0.03 * (i % 2));
    strokes(layer, [[[cx, cy, size * 0.032], [cx + 0.1, cy + 2, size * 0.032]]], 2);
  }
}

// --- output -----------------------------------------------------------------

export function png(layer) {
  const h = H;
  const raw = Buffer.alloc((W * 2 + 1) * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      const o = y * (W * 2 + 1) + 1 + x * 2;
      raw[o] = Math.round(clamp(0.5 + layer.ink[i] / (2 * RANGE)) * 255);
      raw[o + 1] = Math.round(layer.cov[i] * 255);
    }
  const table = Array.from({ length: 256 }, (_, n) => {
    for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
    return n >>> 0;
  });
  const chunk = (type, data) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    let c = 0xffffffff;
    for (const b of body) c = table[(c ^ b) & 255] ^ (c >>> 8);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE((c ^ 0xffffffff) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const head = Buffer.alloc(13);
  head.writeUInt32BE(W, 0);
  head.writeUInt32BE(h, 4);
  head.set([8, 4, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", head),
    chunk("IDAT", deflateSync(raw, { level: 6 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}


/** A leafy clump: scalloped outline, looped leaf marks gathering on the side away from the sun. */
export function bush(layer, rnd, cx, cy, r, { flat = 0.85, shade = 1, halo = 2, lobes = 9 } = {}) {
  const pts = [];
  const spin = rnd() * 6.28;
  const n = lobes * 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 0.86 + 0.14 * Math.abs(Math.sin((a * lobes) / 2 + spin)) + 0.06 * noise(a * 3 + spin, cx);
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k * flat]);
  }
  polygon(layer, pts, { outline: 0.95, halo });
  // Each lobe is its own little dome, dark underneath, so the clump reads as volume.
  const domes = [];
  for (let i = 0; i < lobes + 4; i++) {
    const a = rnd() * 6.28;
    const d = Math.sqrt(rnd()) * 0.66;
    domes.push([Math.cos(a) * d, Math.sin(a) * d, 0.3 + 0.16 * rnd()]);
  }
  const leaf = clamp(r * 0.15, 3.8, 8);
  const marks = [];
  const count = Math.round(((r * r * flat) / (leaf * leaf)) * 3.4);
  for (let i = 0; i < count; i++) {
    const a = rnd() * 6.28;
    const d = Math.sqrt(rnd()) * 0.9;
    const dx = Math.cos(a) * d;
    const dy = Math.sin(a) * d;
    let local = 0.75;
    for (const [ux, uy, ur] of domes) {
      const lx = (dx - ux) / ur;
      const ly = (dy - uy) / ur;
      if (lx * lx + ly * ly < 1) local = Math.min(local, 0.46 + 0.34 * lx + 0.56 * ly);
    }
    const dark = clamp(0.62 * local + 0.38 * (0.62 + dx * 0.45 + dy * 0.55)) * shade;
    if (rnd() > dark * 1.35) continue;
    const x = cx + dx * r;
    const y = cy + dy * r * flat;
    const w = 0.45 + 1.15 * dark;
    const l = leaf * (0.5 + 0.35 * rnd());
    marks.push([[x - l, y - l * 0.3, 0.35], [x - l * 0.4, y + l * 0.38, w], [x + l * 0.4, y + l * 0.38, w], [x + l, y - l * 0.3, 0.35]]);
  }
  if (marks.length) strokes(layer, marks, 0);
}

/** One almond leaf pointing along `a`: outline, midrib, and a shaded half. */
export function leaf(layer, x, y, a, l, w, dark = 0) {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const at = (t, o) => [x + c * l * t - s * w * o, y + s * l * t + c * w * o];
  const side = [];
  const back = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const o = Math.sin(Math.PI * Math.pow(t, 0.8)) * 0.5;
    side.push(at(t, o));
    back.unshift(at(t, -o));
  }
  // Shade the half that faces down the page.
  const under = c >= 0 ? 1 : -1;
  polygon(layer, [...side, ...back.slice(1, -1)], {
    outline: Math.min(1.2, 0.5 + l * 0.02),
    halo: 0.8,
    hatch: (px, py) => {
      const t = (px - x) * c + (py - y) * s;
      const o = (-(px - x) * s + (py - y) * c) * under;
      const rib = 0.55 - Math.abs(o);
      const vein = o > 0 && dark > 0.28 ? dark * 1.7 - Math.abs(((t - o * 0.8 + 400) % 4.4) - 2.2) : -9;
      return Math.max(rib, vein, dark > 0.85 ? 3 : -9);
    },
  });
}

/** A clipped hedge bush: dark inside, lit leaves crowding the top. */
export function hedge(layer, rnd, cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2;
    const k = 0.95 + 0.07 * noise(i * 1.7, cx);
    const up = Math.sin(a) < 0 ? 0.62 : 0.5;
    pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k * up]);
  }
  polygon(layer, pts, { outline: 1, halo: 1.6, hatch: () => 3 });
  const l = clamp(r * 0.42, 9, 27);
  const leaves = [];
  const n = Math.round(30 + r * 0.5);
  for (let i = 0; i < n; i++) {
    const a = rnd() * 6.28;
    const d = Math.sqrt(rnd()) * 0.96;
    leaves.push([Math.cos(a) * d, Math.sin(a) * d]);
  }
  leaves.sort((p, q) => p[1] - q[1]);
  for (const [dx, dy] of leaves) {
    const dark = clamp(0.1 + 0.5 * dx + 0.75 * dy + (rnd() - 0.5) * 0.3);
    if (dark > 0.7 && rnd() > 0.3) continue;
    leaf(layer, cx + dx * r * 0.9, cy + dy * r * 0.56 - r * 0.04, -Math.PI / 2 + dx * 1.1 + (rnd() - 0.5) * 1.5, l * (0.75 + 0.4 * rnd()), l * 0.56, dark * 0.8);
  }
}
