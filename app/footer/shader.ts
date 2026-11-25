import { SCENES, type SceneId } from "./scenes";

/** Size of the engraved plates; must match scripts/engrave/engine.mjs. */
export const TEX_W = 2560;
export const TEX_H = 960;
/** How far the middle plate sits below its resting place before the scene rises, texels. */
export const MID_RISE = 62;

export const VERTEX = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

/*
 * How each page melts into its sky. One batik motif per scene, all from Java:
 * every edge() only decides alpha (0 = page shows through) and, for the clouds, colour.
 */
const EDGES: Record<SceneId, string> = {


  // Parang, said to be drawn from waves breaking on the south coast: slanting S-blades between bands.
  sea: `
void edgeOf(vec2 q, float u, float aa, inout vec3 col, inout float alpha) {
  float crest = abs(sin(q.x * 0.0098 + 0.3)) * 46.0 + abs(sin(q.x * 0.0041 + 1.1)) * 34.0;
  float y = q.y - 58.0 + crest;
  float t = y / 236.0 - 0.34 * (1.0 - uCloud);
  float B = 80.0, P = 38.0;
  float a = (q.x + q.y) * 0.7071 + 40.0 * (1.0 - uCloud);
  float b = (q.x - q.y) * 0.7071;
  float band = floor(b / B);
  float v = fract(b / B) - 0.5;
  float flip = mod(band, 2.0) < 0.5 ? 1.0 : -1.0;
  float phase = a / P + flip * 0.36 * sin(v * 4.6) + 0.5 * mod(band, 2.0);
  float tri = abs(fract(phase) - 0.5) * 2.0;
  // Blades swell in the belly and hook at the ends.
  float th = mix(-0.35, 1.3, t) + 0.2 * cos(v * 6.2832) * (1.0 - t);
  float ink = edge((th - tri) * P * 0.5 * u, aa);
  float eye = length(vec2((fract(phase) - 0.5) * P, (abs(v) - 0.3) * B));
  ink = min(ink, 1.0 - edge((5.2 * clamp(1.0 - t, 0.0, 1.0) * smoothstep(0.25, 0.4, t) - eye) * u, aa));
  // Mlinjon: the narrow band of diamonds between.
  float m = (0.5 - abs(v)) * B;
  float rail = edge((mix(-1.0, 9.5, smoothstep(0.0, 0.5, t)) - m) * u, aa);
  float gem = abs(fract(a / 22.0) - 0.5) * 22.0 * 0.55 + m;
  float gems = edge((4.6 * clamp(1.15 - t, 0.0, 1.0) - gem) * u, aa) * step(0.0, 1.1 - t);
  ink = max(ink, rail) * (1.0 - gems * rail);
  ink *= edge((t - 0.02) * 236.0 * u, 1.5);
  // Two lines of foam follow the last crests down.
  float f1 = abs(y - 238.0), f2 = abs(y - 247.0);
  float foam = max(edge((0.9 - f1) * u, aa), edge((0.35 + 0.3 * sin(q.x * 0.05) - f2) * u, aa)) * smoothstep(0.6, 1.0, uCloud);
  alpha = t > 1.0 ? 1.0 : ink;
  if (t > 1.0) alpha *= 1.0 - foam;
}`,

};

/** What stands in each sky. halo() returns paper coverage around the sun or moon; d is distance from it in texels. */
const SKIES: Record<SceneId, string> = {
  sea: `
float halo(vec2 v, float d, float s, float aa) {
  // Ruled dawn: level lines, heaviest at the horizon.
  float row = floor(v.y / 11.0);
  float lift = clamp(-v.y / 250.0, 0.0, 1.0);
  float reach = mix(1180.0, 170.0, pow(lift, 0.55)) * (0.72 + 0.5 * hash(vec2(row, 2.0)));
  float w = 4.2 * pow(1.0 - lift, 1.4) * smoothstep(reach, reach * 0.2, abs(v.x)) * mix(1.0, 0.5, uNight);
  w *= smoothstep(0.1, 0.4, noise(vec2(v.x * 0.012 + row * 7.0, row)) + 0.25);
  return edge((w - abs(fract(v.y / 11.0) - 0.5) * 11.0) * s, aa) * step(0.15, w) * step(138.0, d) * step(v.y, 40.0);
}`,
};

/** Drawn over the middle plate after dark. */
const NIGHT_EXTRAS: Partial<Record<SceneId, string>> = {
  sea: `
  // The lighthouse sweeps as you scroll.
  vec2 lv = (p - uFrame.yz) / s - vec2(2060.0, 379.0);
  float la = mix(3.34, 3.06, uLand);
  float ld = length(lv);
  float off = abs(atan(sin(atan(lv.y, lv.x) - la), cos(atan(lv.y, lv.x) - la)));
  float ruled = abs(fract((lv.y * 0.9 + lv.x * 0.12) / 9.0) - 0.5) * 9.0;
  float beam = edge((2.4 * smoothstep(1250.0, 80.0, ld) * smoothstep(0.1, 0.02, off) - ruled) * s, aa) * step(off, 0.1) * step(12.0, ld);
  col = mix(col, uPaper, beam * 0.9);`,
};

/*
 * Three colours at most: sky, and a fill and line for the land. By day land is
 * paper cut with sky-coloured lines. At night it flips to a dark block cut with
 * paper: the lines that held shadow now hold moonlight from the other side.
 */
export function fragment(scene: SceneId) {
  const { sun, lamps } = SCENES[scene];
  const vec = (v: number[]) => `vec${v.length}(${v.map((n) => n.toFixed(1)).join(", ")})`;
  return `#version 300 es
precision highp float;
uniform vec2 uSize;      // footer, CSS px
uniform float uDpr;
uniform vec3 uSky;
uniform vec3 uPaper;
uniform vec3 uFill;
uniform vec3 uLine;
uniform float uNight;
uniform float uCloud;    // 0..1 edge unfurled
uniform float uLand;     // 0..1 landscape scrolled in
uniform vec3 uFrame;     // land scale, land x, land y (CSS px)
uniform float uReady;
uniform vec4 uText[2];   // text blocks stars stay out of: left, top, right, bottom, CSS px
uniform sampler2D uFar;
uniform sampler2D uMid;
uniform sampler2D uNear;
out vec4 color;

const vec3 SUN = ${vec(sun)};
const vec4 LAMPS[${lamps.length}] = vec4[](${lamps.map(vec).join(", ")});

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float edge(float d, float aa) { return smoothstep(-aa, aa, d); }

/* Lays one plate of the landscape over col. */
void plate(sampler2D tex, vec2 p, float rise, float delay, inout vec3 col) {
  vec2 q = (p - uFrame.yz) / uFrame.x;
  q.y -= rise;
  vec2 uv = q / vec2(${TEX_W}.0, ${TEX_H}.0);
  // Sample before branching: past an early return the mip level is undefined, which drew a stray row along the edge.
  vec2 t = texture(tex, uv).ra;
  if (uv.y < 0.0) return;
  if (uv.y > 1.0) t = vec2(0.0, 1.0);
  float aa = 0.6 / (uFrame.x * uDpr) / 4.0;
  float ink = edge((t.x - 0.502) * 2.0, aa);
  // Cut from the sky: ruled lines start solid and thin out, patch by patch, until only the drawing is left.
  float patchy = noise(q * vec2(0.004, 0.009)) * 0.5 + noise(q * 0.03) * 0.1;
  float cleared = clamp((uLand - delay) * 2.4 - patchy, 0.0, 1.0) * (1.0 + 2.0 * aa);
  float row = (q.y + 4.0 * noise(q * vec2(0.008, 0.03))) / 8.0;
  float veil = edge(abs(fract(row) - 0.5) * 2.0 - cleared, aa);
  col = mix(col, mix(mix(uFill, uLine, ink), uSky, veil), smoothstep(0.3, 0.7, t.y));
}
${EDGES[scene]}
${SKIES[scene]}

void main() {
  vec2 px = vec2(gl_FragCoord.x, uSize.y * uDpr - gl_FragCoord.y);
  vec2 p = px / uDpr;
  float aa = 0.7 / uDpr;

  // Sky: flat ink with a little tooth.
  float grain = hash(floor(px / max(1.0, uDpr * 0.5)));
  vec3 col = mix(uSky, uPaper, 0.055 * step(0.94, grain) + 0.02 * noise(p * 0.7));

  float s = uFrame.x;
  float rise = 1.0 - smoothstep(0.0, 1.0, uLand);

  // Stars. Kept off the text: beside a letter they read as accents.
  if (uNight > 0.5) {
    vec2 cell = floor(p / 44.0);
    float h = hash(cell + 3.0);
    vec2 at = (cell + 0.2 + 0.6 * vec2(hash(cell + 9.0), hash(cell + 21.0))) * 44.0;
    float size = mix(0.5, 1.5, h * h);
    float clear = 1.0;
    for (int i = 0; i < 2; i++) {
      vec2 inside = step(uText[i].xy - 8.0, at) * step(at, uText[i].zw + 8.0);
      clear *= 1.0 - inside.x * inside.y;
    }
    col = mix(col, uPaper, edge(size - length(p - at), aa) * step(0.62, h) * 0.85 * clear);
  }

  // Sun or crescent moon, with its halo, lifting into place.
  vec2 sun = uFrame.yz + s * vec2(SUN.x, SUN.y + 190.0 * rise);
  vec2 v = (p - sun) / s;
  float d = length(v);
  col = mix(col, uPaper, halo(v, d, s, aa) * smoothstep(0.05, 0.6, uLand));
  float disc = edge((SUN.z - d) * s, aa);
  if (uNight > 0.5) {
    float bite = edge((SUN.z * 0.9 - length(v - SUN.z * vec2(-0.42, -0.16))) * s, aa);
    // The dark of the moon keeps a few ruled lines.
    float dim = edge((0.8 - abs(fract(v.y / 8.0) - 0.5) * 8.0) * s, aa) * 0.5;
    col = mix(col, mix(uPaper, mix(uSky, uPaper, dim), bite), disc);
  } else {
    // The lower half is cut with lines, so it sits in the haze.
    float cut = edge((clamp(v.y * 0.045 * 80.0 / SUN.z, 0.0, 3.6) - abs(fract(v.y / 9.0) - 0.5) * 9.0) * s, aa);
    col = mix(col, mix(uPaper, uSky, cut * step(0.0, v.y)), disc);
  }

  if (uReady > 0.5) {
    plate(uFar, p, 120.0 * rise, 0.0, col);
    plate(uMid, p, ${MID_RISE}.0 * rise, 0.1, col);
    if (uNight > 0.5) {
      ${NIGHT_EXTRAS[scene] ?? ""}
    }
    plate(uNear, p, 0.0, 0.18, col);
    if (uNight > 0.5) {
      for (int i = 0; i < ${lamps.length}; i++) {
        vec4 l = LAMPS[i];
        // The smallest are fireflies: they wander with the scroll.
        if (l.z < 2.6) l.xy += vec2(sin(uLand * 9.0 + float(i)), cos(uLand * 7.0 + float(i) * 2.0)) * 16.0;
        float ld2 = length((p - uFrame.yz) / s - vec2(l.x, l.y + l.w * rise));
        if (ld2 > l.z * 7.0) continue;
        col = mix(col, uFill, edge((l.z * 2.0 - ld2) * s, aa));
        float ring = min(abs(ld2 - l.z * 2.9) - 0.9, min(abs(ld2 - l.z * 4.1) - 0.65, abs(ld2 - l.z * 5.4) - 0.4));
        col = mix(col, uPaper, max(edge((l.z * 1.25 - ld2) * s, aa), edge(-ring * s, aa)) * smoothstep(0.35, 0.75, uLand));
      }
    }
  }

  float alpha = 1.0;
  float u = clamp(uSize.x / 1440.0, 0.5, 1.3);
  vec2 q = p / u;
  if (q.y < 340.0) edgeOf(q, u, aa, col, alpha);
  // The very top is page, whatever the edge does.
  alpha *= smoothstep(0.0, 26.0, q.y);

  color = vec4(col * alpha, alpha);
}`;
}
