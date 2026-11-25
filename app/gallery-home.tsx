"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { PortraitToggle } from "./portrait-toggle";
import { HomeFooter } from "./site-footer";
import { SiteHeader } from "@/app/site-header";

interface FeaturedLayer {
  src: string;
  width: number;
  height: number;
  left: string;
  top: string;
  w: string;
  z: number;
  r?: string;
  hx: string;
  hy: string;
  hr: string;
  pixelated?: boolean;
}

export interface FeaturedShowcase {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  labelLeft: string;
  labelBottom: string;
  layers: FeaturedLayer[];
}

export interface SocialLinkItem {
  label: string;
  href: string;
  d: string;
}

interface GalleryHomeProps {
  name: string;
  currentRole: { company: string; companyUrl: string } | null;
  openToWork: boolean;
  items: FeaturedShowcase[];
  socials: SocialLinkItem[];
}

export function GalleryHome({
  name,
  currentRole,
  openToWork,
  items,
  socials,
}: GalleryHomeProps) {
  const hoveredRef = useRef(false);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  // Repeat the featured set twice inside each pass so wide viewports never show a gap
  const passItems = items.length > 0 && items.length < 4 ? [...items, ...items] : items;

  // Unified auto-scroll + vertical-wheel-to-horizontal infinite marquee loop (desktop/fine-pointer)
  // On mobile (< 640px) or coarse touch pointers, native horizontal snap-scroll owns swiping.
  useEffect(() => {
    const marquee = marqueeRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!marquee || !track || !group) return;
    // Each half moves on its own: one 4000px+ track at 2x passes Safari's 8192px layer limit and gets drawn in repeats.
    const halves = Array.from(track.children) as HTMLElement[];
    const place = (value: string) => halves.forEach((el) => (el.style.transform = value));

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(max-width: 639px), (hover: none) and (pointer: coarse)");
    let offset = 0;
    let wheelVel = 0;
    let lastTime = performance.now();
    let raf = 0;

    const wrap = (val: number, span: number) => ((val % span) + span) % span;

    const onWheel = (e: WheelEvent) => {
      if (mobileQuery.matches) return;
      const fitsViewport =
        document.documentElement.scrollHeight <= window.innerHeight + 8;
      const overMarquee = marquee.contains(e.target as Node);
      if (!fitsViewport && !overMarquee) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      e.preventDefault();
      wheelVel += delta * 0.42;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (mobileQuery.matches) {
        place("");
        offset = 0;
        wheelVel = 0;
      } else {
        const span = group.offsetWidth;
        if (span > 0) {
          if (!reduceMotion.matches && !hoveredRef.current) {
            offset += 44 * dt;
          }
          if (Math.abs(wheelVel) > 0.05) {
            offset += wheelVel;
            wheelVel *= 0.86;
          } else {
            wheelVel = 0;
          }
          offset = wrap(offset, span);
          place(`translate3d(${-offset.toFixed(2)}px, 0, 0)`);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(raf);
      place("");
    };
  }, []);

  return (
    <div className="home-gallery">
      <SiteHeader />

      <main className="gh-main">
        <section id="about" className="gh-intro" aria-labelledby="gh-headline">
          <div className="gh-intro-left">
            <div className="gh-vignette">
              <PortraitToggle name={name} />
            </div>
            <div className="gh-intro-copy">
              <h1 id="gh-headline" className="gh-headline">
                Hi, I&apos;m Kahfi! I build software that feels like it was made for you.
              </h1>
              <p className="gh-current">
                {currentRole ? (
                  <>
                    Currently building at{" "}
                    <a
                      href={currentRole.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gh-current-org"
                    >
                      {currentRole.company}
                    </a>
                    .
                  </>
                ) : null}
              </p>
              <Link
                href="/story"
                transitionTypes={["nav-forward"]}
                className="gh-cta gh-story-cta"
              >
                Read my story
              </Link>
            </div>
          </div>
        </section>

        <section id="selected-work" className="gh-work-section" aria-label="Selected work">
          <div
            ref={marqueeRef}
            className="gh-marquee"
            onMouseEnter={() => {
              hoveredRef.current = true;
            }}
            onMouseLeave={() => {
              hoveredRef.current = false;
            }}
            onFocus={() => {
              hoveredRef.current = true;
            }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                hoveredRef.current = false;
              }
            }}
          >
            <div ref={trackRef} className="gh-marquee-track">
              {[0, 1].map((pass) => (
                <div
                  key={pass}
                  ref={pass === 0 ? groupRef : undefined}
                  className="gh-marquee-group"
                  aria-hidden={pass === 1 || undefined}
                >
                  {passItems.map((item, idx) => {
                    const isClone = pass === 1 || idx >= items.length;
                    return (
                      <Link
                        key={`${pass}-${idx}-${item.id}`}
                        href={item.href}
                        transitionTypes={["nav-forward"]}
                        tabIndex={isClone ? -1 : undefined}
                        aria-hidden={isClone || undefined}
                        aria-label={`${item.title}, ${item.subtitle}`}
                        data-clone={isClone || undefined}
                        className="gh-diorama-card"
                      >
                        <div className="gh-diorama-stage">
                          {item.layers.map((layer) => (
                            <span
                              key={layer.src}
                              className="gh-diorama-layer"
                              style={
                                {
                                  left: layer.left,
                                  top: layer.top,
                                  width: layer.w,
                                  zIndex: layer.z,
                                  "--r": layer.r,
                                  "--hx": layer.hx,
                                  "--hy": layer.hy,
                                  "--hr": layer.hr,
                                } as React.CSSProperties
                              }
                            >
                              <Image
                                src={layer.src}
                                alt=""
                                width={layer.width}
                                height={layer.height}
                                sizes="(max-width: 640px) 84vw, 520px"
                                className="gh-diorama-img"
                                style={
                                  layer.pixelated
                                    ? { imageRendering: "pixelated" }
                                    : undefined
                                }
                                priority={!isClone}
                              />
                            </span>
                          ))}

                          <span
                            className="gh-diorama-tag"
                            style={{ left: item.labelLeft, bottom: item.labelBottom }}
                          >
                            <span className="gh-diorama-tag-title">{item.title}</span>
                            <span className="gh-diorama-tag-sub">{item.subtitle}</span>
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <HomeFooter name={name} openToWork={openToWork} socials={socials} />
    </div>
  );
}
