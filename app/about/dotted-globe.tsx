"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GlobePlace } from "@/content/site";
import { isEarthCoast, isEarthLand } from "./earth-land-mask";

interface SphereDot {
  x: number;
  y: number;
  z: number;
  coast: boolean;
}

interface ProjectedPin {
  place: GlobePlace;
  x: number;
  y: number;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const PERSPECTIVE_D = 3.6;
// Locked viewing tilt (~24°S): frames Australia lower-right, Indonesia upper-center, Eurasia over the top dome.
const FIXED_LAT = -24 * DEG2RAD;

// Right-handed geographic coordinates:
// +y = North Pole, +z = Prime Meridian (lon 0) facing camera, +x = 90°E (East to the right).
function latLonToVec(lat: number, lon: number): Vec3 {
  const phi = lat * DEG2RAD;
  const lam = lon * DEG2RAD;
  const cosPhi = Math.cos(phi);
  return {
    x: cosPhi * Math.sin(lam),
    y: Math.sin(phi),
    z: cosPhi * Math.cos(lam),
  };
}

function wrapAngle(rad: number): number {
  let a = ((rad + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  if (a < -Math.PI) a += Math.PI * 2;
  return a;
}

// High-density Fibonacci sphere sampled against Natural Earth 50m (0.5-deg) land mask.
function buildEarthDots(): SphereDot[] {
  const dots: SphereDot[] = [];
  const total = 14000;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < total; i++) {
    const y = 1 - ((i + 0.5) / total) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = goldenAngle * i;
    const x = Math.sin(theta) * radiusAtY;
    const z = Math.cos(theta) * radiusAtY;

    const lat = Math.asin(y) * RAD2DEG;
    const lon = Math.atan2(x, z) * RAD2DEG;

    if (isEarthLand(lon, lat)) {
      dots.push({ x, y, z, coast: isEarthCoast(lon, lat) });
    }
  }
  return dots;
}

// Precompute subtle cartographic graticule lines (equator, 30° parallels, 30° meridians).
function buildGraticule(): Vec3[][] {
  const lines: Vec3[][] = [];
  const parallels = [-60, -30, 0, 30, 60];
  for (const lat of parallels) {
    const seg: Vec3[] = [];
    for (let lon = -180; lon <= 180; lon += 6) {
      seg.push(latLonToVec(lat, lon));
    }
    lines.push(seg);
  }
  for (let lon = -180; lon < 180; lon += 30) {
    const seg: Vec3[] = [];
    for (let lat = -84; lat <= 84; lat += 6) {
      seg.push(latLonToVec(lat, lon));
    }
    lines.push(seg);
  }
  return lines;
}

// Elevated 3D great-circle arc between two coordinates (slerp + smooth altitude lift).
function buildGeodesicArc(a: GlobePlace, b: GlobePlace, steps = 28): Vec3[] {
  const va = latLonToVec(a.lat, a.lon);
  const vb = latLonToVec(b.lat, b.lon);
  const dot = Math.max(-1, Math.min(1, va.x * vb.x + va.y * vb.y + va.z * vb.z));
  const omega = Math.acos(dot);
  const sinOmega = Math.sin(omega);
  const lift = Math.min(0.11, 0.03 + omega * 0.14);

  const pts: Vec3[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let x: number;
    let y: number;
    let z: number;
    if (sinOmega < 1e-4) {
      x = va.x + (vb.x - va.x) * t;
      y = va.y + (vb.y - va.y) * t;
      z = va.z + (vb.z - va.z) * t;
    } else {
      const s0 = Math.sin((1 - t) * omega) / sinOmega;
      const s1 = Math.sin(t * omega) / sinOmega;
      x = va.x * s0 + vb.x * s1;
      y = va.y * s0 + vb.y * s1;
      z = va.z * s0 + vb.z * s1;
    }
    const alt = 1 + Math.sin(t * Math.PI) * lift;
    pts.push({ x: x * alt, y: y * alt, z: z * alt });
  }
  return pts;
}

const EARTH_DOTS = buildEarthDots();
const GRATICULE = buildGraticule();

function formatLocalTime(timeZone: string, date: Date): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    }).format(date);
  } catch {
    return "--:--";
  }
}

export function DottedGlobe({ places }: { places: GlobePlace[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const initialPlace = places.find((p) => p.primary) ?? places[0];
  const [activePlaceId, setActivePlaceId] = useState<string>(initialPlace?.id ?? "");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [localTime, setLocalTime] = useState<string>("");

  const activePlaceIdRef = useRef(activePlaceId);
  const placesRef = useRef(places);
  const arcsRef = useRef<Vec3[][]>([]);
  const projectedPinsRef = useRef<ProjectedPin[]>([]);
  const hoveringOverlayRef = useRef(false);

  const currentPlace = places.find((p) => p.id === activePlaceId) ?? places[0];
  const mediaList = currentPlace?.media ?? [];
  const fanItems = mediaList.slice(0, 3);
  const activeLightboxItem =
    lightboxIndex !== null ? mediaList[lightboxIndex] ?? null : null;

  useEffect(() => {
    activePlaceIdRef.current = activePlaceId;
  }, [activePlaceId]);

  useEffect(() => {
    placesRef.current = places;
    const arcs: Vec3[][] = [];
    for (let i = 0; i < places.length - 1; i++) {
      arcs.push(buildGeodesicArc(places[i], places[i + 1]));
    }
    arcsRef.current = arcs;
  }, [places]);

  useEffect(() => {
    if (!currentPlace) return;
    const update = () => setLocalTime(formatLocalTime(currentPlace.timeZone, new Date()));
    update();
    const id = window.setInterval(update, 15000);
    return () => window.clearInterval(id);
  }, [currentPlace]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxIndex(null);
      } else if (e.key === "ArrowRight" && mediaList.length > 1) {
        setMediaError(false);
        setLightboxIndex((i) => (i === null ? null : (i + 1) % mediaList.length));
      } else if (e.key === "ArrowLeft" && mediaList.length > 1) {
        setMediaError(false);
        setLightboxIndex((i) =>
          i === null ? null : (i - 1 + mediaList.length) % mediaList.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, mediaList.length]);

  // Horizontal-only rotation state (locked at FIXED_LAT) kept in refs for 60fps loop.
  const rotRef = useRef({
    lon: (initialPlace?.lon ?? 115.22) * DEG2RAD,
    velLon: 0,
    targetLon: null as number | null,
    dragging: false,
    dragDistance: 0,
    lastX: 0,
  });

  const focusPlace = (place: GlobePlace) => {
    setActivePlaceId(place.id);
    setLightboxIndex(null);
    setMediaError(false);
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetLon = place.lon * DEG2RAD;
    rotRef.current.velLon = 0;
    if (reduceMotion) {
      rotRef.current.lon = targetLon;
      rotRef.current.targetLon = null;
    } else {
      rotRef.current.targetLon = targetLon;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let rafId = 0;

    const syncSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    syncSize();
    const ro = new ResizeObserver(syncSize);
    ro.observe(canvas);

    // Rotate unit vector so (centerLon, centerLat) faces +z (camera).
    const project = (
      vx: number,
      vy: number,
      vz: number,
      cosL: number,
      sinL: number,
      cosP: number,
      sinP: number
    ) => {
      const x1 = vx * cosL - vz * sinL;
      const z1 = vx * sinL + vz * cosL;
      const y2 = vy * cosP - z1 * sinP;
      const z2 = vy * sinP + z1 * cosP;
      const persp = PERSPECTIVE_D / (PERSPECTIVE_D - z2 * 0.65);
      return { x: x1 * persp, y: y2 * persp, z: z2, persp };
    };

    // Normalized studio key light from upper-left front for sculptural depth.
    const lightLen = Math.hypot(-0.42, 0.52, 0.74);
    const lx = -0.42 / lightLen;
    const ly = 0.52 / lightLen;
    const lz = 0.74 / lightLen;

    const cosP = Math.cos(FIXED_LAT);
    const sinP = Math.sin(FIXED_LAT);

    const draw = () => {
      const st = rotRef.current;
      if (!st.dragging) {
        if (st.targetLon !== null) {
          const dLon = wrapAngle(st.targetLon - st.lon);
          st.lon = wrapAngle(st.lon + dLon * 0.09);
          if (Math.abs(dLon) < 0.002) {
            st.lon = st.targetLon;
            st.targetLon = null;
          }
        } else {
          if (Math.abs(st.velLon) > 0.0001) {
            st.lon = wrapAngle(st.lon + st.velLon);
            st.velLon *= 0.92;
          } else if (!reduceMotion && !hoveringOverlayRef.current) {
            // Natural West-to-East Earth rotation (continents drift gently left-to-right).
            st.lon = wrapAngle(st.lon - 0.001);
          }
        }
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Large observatory horizon dome with clear headroom for the floating pin cards.
      const r = Math.min(w * 0.44, h * 0.68);
      const cx = w / 2;
      const cy = h * 0.74;

      const cosL = Math.cos(st.lon);
      const sinL = Math.sin(st.lon);

      const isDark = document.documentElement.dataset.theme === "dark";

      // 1. Sculptural spherical body shading + subtle Fresnel atmospheric rim.
      const sphereGrad = ctx.createRadialGradient(
        cx - r * 0.28,
        cy - r * 0.32,
        r * 0.08,
        cx,
        cy,
        r * 1.04
      );
      if (isDark) {
        sphereGrad.addColorStop(0, "rgba(32, 32, 40, 0.92)");
        sphereGrad.addColorStop(0.68, "rgba(20, 20, 26, 0.56)");
        sphereGrad.addColorStop(0.92, "rgba(14, 14, 18, 0.34)");
        sphereGrad.addColorStop(1, "rgba(12, 12, 14, 0)");
      } else {
        sphereGrad.addColorStop(0, "rgba(255, 255, 255, 0.92)");
        sphereGrad.addColorStop(0.68, "rgba(244, 245, 248, 0.52)");
        sphereGrad.addColorStop(0.92, "rgba(226, 232, 240, 0.34)");
        sphereGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      }
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.04, 0, Math.PI * 2);
      ctx.fill();

      // Subtle crisp atmospheric rim ring (masked softly at the bottom horizon).
      ctx.save();
      const rimGrad = ctx.createLinearGradient(0, cy - r, 0, h);
      if (isDark) {
        rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.14)");
        rimGrad.addColorStop(0.65, "rgba(255, 255, 255, 0.06)");
        rimGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      } else {
        rimGrad.addColorStop(0, "rgba(15, 23, 42, 0.09)");
        rimGrad.addColorStop(0.65, "rgba(15, 23, 42, 0.05)");
        rimGrad.addColorStop(1, "rgba(15, 23, 42, 0)");
      }
      ctx.strokeStyle = rimGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 2. Subtle 3D cartographic graticule (parallels & meridians on front hemisphere).
      ctx.save();
      ctx.lineWidth = 0.75;
      for (const line of GRATICULE) {
        let drawing = false;
        ctx.beginPath();
        for (const pt of line) {
          const p = project(pt.x, pt.y, pt.z, cosL, sinL, cosP, sinP);
          if (p.z > 0.04) {
            const sx = cx + p.x * r;
            const sy = cy - p.y * r;
            if (!drawing) {
              ctx.moveTo(sx, sy);
              drawing = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            drawing = false;
          }
        }
        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(15, 23, 42, 0.042)";
        ctx.stroke();
      }
      ctx.restore();

      // 3. Natural Earth 50m land dots with true spherical foreshortening & key-light shading.
      for (const dot of EARTH_DOTS) {
        const p = project(dot.x, dot.y, dot.z, cosL, sinL, cosP, sinP);
        if (p.z < -0.22) continue;

        const sx = cx + p.x * r;
        const sy = cy - p.y * r;
        if (sy > h + 4 || sy < -4 || sx < -4 || sx > w + 4) continue;

        const bottomFade = Math.max(0, Math.min(1, (h - sy) / (h * 0.24)));
        if (bottomFade <= 0.01) continue;

        // Faint translucent back-hemisphere silhouette for 3D volume
        if (p.z < 0) {
          const backAlpha = (0.045 * (1 + p.z / 0.22)) * bottomFade;
          ctx.fillStyle = isDark
            ? `rgba(161, 161, 170, ${(backAlpha * 1.4).toFixed(3)})`
            : `rgba(113, 113, 122, ${backAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.85, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const limb = Math.sqrt(Math.max(0, p.z));
        // Studio directional lighting on the rotated normal
        const ndotl = Math.max(0, (p.x / p.persp) * lx + (p.y / p.persp) * ly + p.z * lz);
        const shade = 0.76 + 0.24 * ndotl;

        const baseRadius = (dot.coast ? 1.52 : 1.32) * (0.78 + 0.28 * limb) * p.persp;
        const radialAngle = Math.atan2(sy - cy, sx - cx);
        // True tangent-plane foreshortening: minor axis along radial direction shrinks as z -> 0
        const rx = baseRadius * Math.max(0.32, p.z);
        const ry = baseRadius;

        const alpha = (dot.coast ? 0.22 + limb * 0.62 : 0.14 + limb * 0.44) * shade * bottomFade;
        ctx.fillStyle = isDark
          ? dot.coast
            ? `rgba(244, 244, 245, ${alpha.toFixed(3)})`
            : `rgba(161, 161, 170, ${alpha.toFixed(3)})`
          : dot.coast
            ? `rgba(24, 24, 27, ${alpha.toFixed(3)})`
            : `rgba(63, 63, 70, ${alpha.toFixed(3)})`;

        ctx.beginPath();
        ctx.ellipse(sx, sy, rx, ry, radialAngle, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Great-circle geodesic corridor arcs between places.
      ctx.save();
      ctx.lineWidth = 1.25;
      ctx.setLineDash([3, 4]);
      for (const arc of arcsRef.current) {
        let started = false;
        ctx.beginPath();
        for (const pt of arc) {
          const p = project(pt.x, pt.y, pt.z, cosL, sinL, cosP, sinP);
          if (p.z > 0.02) {
            const sx = cx + p.x * r;
            const sy = cy - p.y * r;
            if (!started) {
              ctx.moveTo(sx, sy);
              started = true;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = isDark ? "rgba(79, 193, 127, 0.48)" : "rgba(22, 98, 56, 0.34)";
        ctx.stroke();
      }
      ctx.restore();

      // 5. Location pins + screen-space tracking for the floating fanned card.
      const visiblePins: ProjectedPin[] = [];
      let activeScreenPin: { x: number; y: number; fade: number } | null = null;

      for (const place of placesRef.current) {
        const vec = latLonToVec(place.lat, place.lon);
        const p = project(vec.x, vec.y, vec.z, cosL, sinL, cosP, sinP);
        if (p.z <= 0.08) continue;

        const sx = cx + p.x * r;
        const sy = cy - p.y * r;
        visiblePins.push({ place, x: sx, y: sy });

        const bottomFade = Math.max(0, Math.min(1, (h - sy) / (h * 0.2)));
        const isActive = place.id === activePlaceIdRef.current;

        if (isActive) {
          activeScreenPin = { x: sx, y: sy, fade: bottomFade };
        }

        ctx.save();
        ctx.globalAlpha = bottomFade;

        // Soft outer halo
        ctx.fillStyle = isDark
          ? isActive
            ? "rgba(79, 193, 127, 0.28)"
            : "rgba(255, 255, 255, 0.14)"
          : isActive
            ? "rgba(22, 98, 56, 0.18)"
            : "rgba(15, 23, 42, 0.12)";
        ctx.beginPath();
        ctx.arc(sx, sy, isActive ? 12 : 6.5, 0, Math.PI * 2);
        ctx.fill();

        if (isActive) {
          ctx.fillStyle = isDark ? "#1a1b1f" : "#ffffff";
          ctx.beginPath();
          ctx.arc(sx, sy, 7.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = isDark
          ? isActive
            ? "#4fc17f"
            : "#e4e4e7"
          : isActive
            ? "#166238"
            : "#27272a";
        ctx.beginPath();
        ctx.arc(sx, sy, isActive ? 5.2 : 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
      projectedPinsRef.current = visiblePins;

      // Sync the floating media fan + local-time pill directly above the active pin.
      const overlay = overlayRef.current;
      if (overlay) {
        if (activeScreenPin && activeScreenPin.fade > 0.08) {
          const clampedX = Math.max(115, Math.min(w - 115, activeScreenPin.x));
          overlay.style.transform = `translate3d(${clampedX.toFixed(1)}px, ${(activeScreenPin.y - 16).toFixed(1)}px, 0) translate(-50%, -100%)`;
          overlay.style.opacity = activeScreenPin.fade.toFixed(3);
          overlay.style.visibility = "visible";
        } else {
          overlay.style.opacity = "0";
          overlay.style.visibility = "hidden";
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  const openLightbox = (index: number) => {
    setMediaError(false);
    setLightboxIndex(index);
  };

  return (
    <div className="ab-globe-wrap">
      <div className="ab-globe-stage">
        <canvas
          ref={canvasRef}
          className="ab-globe-canvas"
          aria-label="Interactive 3D dotted Earth globe. Drag horizontally to rotate or choose a location below to inspect its photos and videos."
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            rotRef.current.dragging = true;
            rotRef.current.dragDistance = 0;
            rotRef.current.velLon = 0;
            rotRef.current.targetLon = null;
            rotRef.current.lastX = e.clientX;
          }}
          onPointerMove={(e) => {
            if (!rotRef.current.dragging) return;
            const dx = e.clientX - rotRef.current.lastX;
            rotRef.current.dragDistance += Math.abs(dx);
            rotRef.current.lastX = e.clientX;
            const dLon = -dx * 0.0055;
            rotRef.current.lon = wrapAngle(rotRef.current.lon + dLon);
            rotRef.current.velLon = dLon;
          }}
          onPointerUp={(e) => {
            const wasTap = rotRef.current.dragDistance < 6;
            rotRef.current.dragging = false;
            if (!wasTap) return;

            const rect = e.currentTarget.getBoundingClientRect();
            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;
            let closest: GlobePlace | null = null;
            let bestDist = 28;
            for (const pin of projectedPinsRef.current) {
              const dist = Math.hypot(pin.x - px, pin.y - py);
              if (dist < bestDist) {
                bestDist = dist;
                closest = pin.place;
              }
            }
            if (closest) focusPlace(closest);
          }}
          onPointerCancel={() => {
            rotRef.current.dragging = false;
          }}
        />

        {currentPlace ? (
          <div
            ref={overlayRef}
            className="ab-pin-overlay"
            onPointerEnter={() => {
              hoveringOverlayRef.current = true;
            }}
            onPointerLeave={() => {
              hoveringOverlayRef.current = false;
            }}
          >
            {fanItems.length > 0 ? (
              <div
                className="ab-pin-fan"
                data-count={fanItems.length}
                role="group"
                aria-label={`${currentPlace.label} photos and videos`}
              >
                {fanItems.map((item, idx) => {
                  const slot =
                    fanItems.length === 1
                      ? "center"
                      : fanItems.length === 2
                        ? idx === 0
                          ? "left"
                          : "right"
                        : idx === 0
                          ? "left"
                          : idx === 1
                            ? "center"
                            : "right";
                  const previewSrc = item.type === "video" ? item.poster : item.src;

                  return (
                    <button
                      key={item.src}
                      type="button"
                      className={`ab-fan-card ab-fan-card--${slot}`}
                      aria-label={`Open ${item.type}: ${item.caption ?? item.alt}`}
                      onClick={() => openLightbox(idx)}
                    >
                      {previewSrc ? (
                        <Image
                          src={previewSrc}
                          alt={item.alt}
                          fill
                          sizes="112px"
                          className="ab-fan-img"
                        />
                      ) : (
                        <span className="ab-fan-fallback" aria-hidden="true">
                          VIDEO
                        </span>
                      )}
                      {item.type === "video" ? (
                        <span className="ab-fan-play" aria-hidden="true">
                          <svg width="11" height="11" viewBox="0 0 10 10" fill="currentColor">
                            <path d="M2 1.5L8.5 5L2 8.5V1.5Z" />
                          </svg>
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="ab-pin-card">
              <div className="ab-pin-card-text">
                <span className="ab-pin-card-city">{currentPlace.label}</span>
                <span className="ab-pin-card-sub">Local time</span>
              </div>
              <span className="ab-pin-card-time" aria-label={`Local time in ${currentPlace.label}`}>
                {localTime || "--:--"}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="ab-globe-pins" role="group" aria-label="Focus globe location">
        {places.map((place) => {
          const isActive = activePlaceId === place.id;
          return (
            <button
              key={place.id}
              type="button"
              className="ab-pin-btn"
              aria-pressed={isActive}
              onClick={() => focusPlace(place)}
            >
              <span
                className={isActive ? "ab-pin-dot ab-pin-dot--primary" : "ab-pin-dot"}
                aria-hidden="true"
              />
              <span className="ab-pin-name">{place.label}</span>
              <span className="ab-pin-detail">{place.detail}</span>
            </button>
          );
        })}
      </div>

      {activeLightboxItem && currentPlace ? (
        <div
          className="ab-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${currentPlace.label} media attachment`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIndex(null);
          }}
        >
          <div className="ab-lightbox-panel">
            <div className="ab-lightbox-head">
              <div className="ab-lightbox-title">
                <span>{currentPlace.label}</span>
                <span className="ab-lightbox-count">
                  {String((lightboxIndex ?? 0) + 1).padStart(2, "0")} /{" "}
                  {String(mediaList.length).padStart(2, "0")}
                </span>
              </div>
              <button
                type="button"
                className="ab-lightbox-close"
                aria-label="Close media viewer"
                onClick={() => setLightboxIndex(null)}
              >
                Close
              </button>
            </div>

            <div className="ab-lightbox-stage" data-kind={activeLightboxItem.type}>
              {mediaError ? (
                <div className="ab-media-error" role="alert">
                  <p>Could not load this {activeLightboxItem.type}.</p>
                  <button
                    type="button"
                    className="ab-media-retry"
                    onClick={() => {
                      setMediaError(false);
                      setRetryCount((c) => c + 1);
                    }}
                  >
                    Retry
                  </button>
                </div>
              ) : activeLightboxItem.type === "video" ? (
                <video
                  key={`${activeLightboxItem.src}-${retryCount}`}
                  className="ab-media-video"
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  poster={activeLightboxItem.poster}
                  aria-label={activeLightboxItem.alt}
                  onError={() => setMediaError(true)}
                >
                  <source src={activeLightboxItem.src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  key={`${activeLightboxItem.src}-${retryCount}`}
                  src={activeLightboxItem.src}
                  alt={activeLightboxItem.alt}
                  fill
                  sizes="(max-width: 720px) 94vw, 680px"
                  className="ab-lightbox-img"
                  onError={() => setMediaError(true)}
                />
              )}
            </div>

            <div className="ab-lightbox-foot">
              <p className="ab-media-caption">
                {activeLightboxItem.caption ?? activeLightboxItem.alt}
              </p>
              {mediaList.length > 1 ? (
                <div className="ab-lightbox-nav">
                  <button
                    type="button"
                    className="ab-lightbox-nav-btn"
                    onClick={() => {
                      setMediaError(false);
                      setLightboxIndex((i) =>
                        i === null ? 0 : (i - 1 + mediaList.length) % mediaList.length
                      );
                    }}
                  >
                    Prev
                  </button>
                  <button
                    type="button"
                    className="ab-lightbox-nav-btn"
                    onClick={() => {
                      setMediaError(false);
                      setLightboxIndex((i) =>
                        i === null ? 0 : (i + 1) % mediaList.length
                      );
                    }}
                  >
                    Next
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
