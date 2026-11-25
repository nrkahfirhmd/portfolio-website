// Engraves the footer landscape into public/footer/<scene>/{far,mid,near}.webp.
// Run: node scripts/engrave-footer.mjs [scene] [layer]   (needs `cwebp` on PATH)

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as sea from "./engrave/sea.mjs";
import { png } from "./engrave/engine.mjs";

const scenes = { sea };
const [, , onlyScene, onlyLayer] = process.argv;
const out = new URL("../public/footer/", import.meta.url).pathname;
const tmp = mkdtempSync(join(tmpdir(), "footer-"));

for (const [scene, layers] of Object.entries(scenes)) {
  if (onlyScene && onlyScene !== scene) continue;
  mkdirSync(join(out, scene), { recursive: true });
  for (const name of ["far", "mid", "near"]) {
    if (onlyLayer && onlyLayer !== name) continue;
    const file = join(tmp, `${scene}-${name}.png`);
    writeFileSync(file, png(layers[name]()));
    execFileSync("cwebp", ["-quiet", "-q", "72", "-m", "6", "-alpha_q", "100", "-exact", file, "-o", join(out, scene, `${name}.webp`)]);
    console.log(scene, name);
  }
}
