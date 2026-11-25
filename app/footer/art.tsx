"use client";

import { useEffect, useRef } from "react";
import { SCENES, type SceneId } from "./scenes";
import { fragment, MID_RISE, TEX_H, TEX_W, VERTEX } from "./shader";
import { Vehicle } from "./vehicles";

/** Shortest the landscape gets, CSS px: below this phones crop the sides instead of shrinking the scene away. */
const MIN_LAND = 430;
const PLATES = ["far", "mid", "near"] as const;

function compile(gl: WebGL2RenderingContext, scene: SceneId) {
  const program = gl.createProgram();
  for (const [type, source] of [
    [gl.VERTEX_SHADER, VERTEX],
    [gl.FRAGMENT_SHADER, fragment(scene)],
  ] as const) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost())
      console.error(`Footer art (${scene}) failed to compile:`, gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
    gl.deleteShader(shader);
  }
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

/** A hex custom property as 0..1 rgb. */
function readColor(el: HTMLElement, name: string): [number, number, number] {
  const n = parseInt(getComputedStyle(el).getPropertyValue(name).trim().slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const clamp = (x: number) => Math.min(1, Math.max(0, x));

/**
 * The footer's engraving. Draws only when scroll, size, theme or scene changes; with
 * no WebGL2 the footer keeps its CSS gradient. Reduced motion gets the finished print.
 */
export function FooterArt({ scene }: { scene: SceneId }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<SVGSVGElement>(null);
  const { alt, vehicle } = SCENES[scene];

  useEffect(() => {
    const footer = canvasRef.current?.parentElement;
    if (!footer) return;
    // Once the art reaches the sticky header, the header bows out (footer.css).
    const cover = new IntersectionObserver(
      ([entry]) => footer.toggleAttribute("data-cover", entry.isIntersecting),
      { rootMargin: "0px 0px -94% 0px" },
    );
    cover.observe(footer);
    return () => cover.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const rider = riderRef.current;
    const footer = canvas?.parentElement;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
    if (!canvas || !stage || !rider || !footer || !gl) return;
    const { focus, vehicle } = SCENES[scene];
    const program = compile(gl, scene);
    if (!program) return;

    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const corner = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(corner);
    gl.vertexAttribPointer(corner, 2, gl.FLOAT, false, 0, 0);
    const loc = (name: string) => gl.getUniformLocation(program, name);
    const at = {
      size: loc("uSize"),
      dpr: loc("uDpr"),
      sky: loc("uSky"),
      paper: loc("uPaper"),
      fill: loc("uFill"),
      line: loc("uLine"),
      night: loc("uNight"),
      cloud: loc("uCloud"),
      land: loc("uLand"),
      frame: loc("uFrame"),
      ready: loc("uReady"),
      text: loc("uText"),
    };
    gl.uniform1i(loc("uFar"), 0);
    gl.uniform1i(loc("uMid"), 1);
    gl.uniform1i(loc("uNear"), 2);

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const [, , boxW, boxH] = vehicle.viewBox.split(" ").map(Number);
    let raf = 0;
    let near = false;
    let dead = false;
    let lastX = 0;

    const draw = () => {
      raf = 0;
      const { width, height, top, left } = footer.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio, 2);
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);

      const scale = Math.max(width / TEX_W, MIN_LAND / TEX_H);
      const x = -Math.min(Math.max(focus * scale - width / 2, 0), TEX_W * scale - width);
      const y = height - TEX_H * scale;
      const seen = innerHeight - top;
      const still = reduced.matches;
      const cloud = still ? 1 : clamp(seen / (innerHeight * 0.75));
      // Runs from the first ridge showing to the bottom of the page.
      const from = y + TEX_H * scale * 0.2;
      const land = still ? 1 : clamp((seen - from) / (height - from));
      gl.uniform2f(at.size, width, height);
      gl.uniform1f(at.dpr, dpr);
      gl.uniform1f(at.cloud, cloud * cloud * (3 - 2 * cloud));
      gl.uniform1f(at.land, land);
      gl.uniform3f(at.frame, scale, x, y);
      gl.uniform4fv(
        at.text,
        [...footer.querySelectorAll(".sf-letter > *")].flatMap((el) => {
          const r = el.getBoundingClientRect();
          return [r.left - left, r.top - top, r.right - left, r.bottom - top];
        }),
      );
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // Whatever travels enters from the left and stops mid-screen; stage coordinates start at the plate's corner.
      const size = vehicle.width * scale;
      const start = (vehicle.between ? Math.max(-x, vehicle.between[0] * scale) : -x) - size;
      const rideX = start + (width * vehicle.stop - size / 2 - x - start) * land;
      if (vehicle.turns && Math.abs(rideX - lastX) > 0.5) rider.dataset.facing = rideX < lastX ? "left" : "right";
      lastX = rideX;
      const ease = land * land * (3 - 2 * land);
      const sink = vehicle.onMid ? MID_RISE * (1 - ease) * scale : 0;
      const sway = Math.sin(rideX * 0.03);
      const bob = vehicle.rock ? sway * vehicle.rock * 0.8 : Math.sin(rideX * 0.09) * 0.8;
      stage.style.transform = `translate(${x}px, ${y}px)`;
      stage.style.width = `${TEX_W * scale}px`;
      stage.style.height = `${TEX_H * scale}px`;
      stage.style.clipPath = vehicle.between
        ? `inset(-100% ${((1 - vehicle.between[1] / TEX_W) * 100).toFixed(2)}% 0 ${((vehicle.between[0] / TEX_W) * 100).toFixed(2)}%)`
        : "";
      rider.style.width = `${size}px`;
      rider.style.transform = `translate(${rideX.toFixed(1)}px, ${(vehicle.y * scale - (size * boxH) / boxW + sink + bob).toFixed(1)}px) rotate(${(sway * (vehicle.rock ?? 0)).toFixed(2)}deg)`;
      rider.style.setProperty("--roll", `${((rideX / (size * 0.1)) % (Math.PI * 2)).toFixed(3)}rad`);
      rider.style.setProperty("--stroke", sway.toFixed(3));
    };
    const request = () => {
      if (near && !dead && !raf) raf = requestAnimationFrame(draw);
    };

    const paint = () => {
      gl.uniform3f(at.sky, ...readColor(footer, "--sf-ink"));
      gl.uniform3f(at.paper, ...readColor(footer, "--sf-paper"));
      gl.uniform3f(at.fill, ...readColor(footer, "--sf-fill"));
      gl.uniform3f(at.line, ...readColor(footer, "--sf-line"));
      gl.uniform1f(at.night, document.documentElement.dataset.theme === "dark" ? 1 : 0);
      request();
    };
    paint();

    const textures: WebGLTexture[] = [];
    const load = () =>
      Promise.all(
        PLATES.map(async (name) => {
          const img = new Image();
          img.src = `/footer/${scene}/${name}.webp`;
          await img.decode();
          return img;
        }),
      )
        .then((images) => {
          if (dead) return;
          images.forEach((img, unit) => {
            const texture = gl.createTexture();
            textures.push(texture);
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE_ALPHA, gl.LUMINANCE_ALPHA, gl.UNSIGNED_BYTE, img);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          });
          gl.uniform1f(at.ready, 1);
          footer.dataset.art = "ready";
          request();
        })
        .catch((error) => console.error("Footer art failed to load:", error));

    let loading = false;
    const watch = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting;
        if (near && !loading) {
          loading = true;
          footer.dataset.art = "sky";
          void load();
        }
        request();
      },
      { rootMargin: "900px 0px" },
    );
    watch.observe(footer);
    const resize = new ResizeObserver(request);
    resize.observe(footer);
    const theme = new MutationObserver(paint);
    theme.observe(document.documentElement, { attributeFilter: ["data-theme"] });
    const onLost = () => {
      dead = true;
      delete footer.dataset.art;
    };
    canvas.addEventListener("webglcontextlost", onLost);
    addEventListener("scroll", request, { passive: true });
    addEventListener("resize", request);
    reduced.addEventListener("change", request);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      watch.disconnect();
      resize.disconnect();
      theme.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
      reduced.removeEventListener("change", request);
      textures.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [scene]);

  return (
    <>
      <canvas ref={canvasRef} className="sf-canvas" role="img" aria-label={alt} />
      <div
        ref={stageRef}
        className="sf-stage"
        style={
          vehicle.behind
            ? {
                // Everything but the foreground plate, so the vehicle passes behind it.
                mask: `linear-gradient(#000 0 0) exclude, url(/footer/${scene}/near.webp) 0 0 / 100% 100% no-repeat`,
              }
            : undefined
        }
      >
        <svg ref={riderRef} className="sf-rider" viewBox={vehicle.viewBox} aria-hidden="true">
          <g className="sf-rider-turn" strokeLinecap="round" strokeLinejoin="round">
            <Vehicle scene={scene} />
          </g>
        </svg>
      </div>
    </>
  );
}
