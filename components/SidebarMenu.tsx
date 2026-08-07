"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { recolorSvg } from "@/helper/recolorSvg";
import { useTheme } from "@/components/ThemeProvider";
import type { NavItem } from "@/lib/nav";

interface Props {
    items: NavItem[];
    selected: string;
    onSelect: (label: string) => void;
    /** `rail` is the desktop column; `bar` is the mobile bar fixed to the top. */
    variant?: "rail" | "bar";
}

const CITY = "Bali";
const TIMEZONE = "Asia/Makassar";

const SOCIALS = [
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/nrkahfirhmd",
        path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    },
    {
        label: "GitHub",
        href: "https://github.com/nrkahfirhmd",
        path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    },
];

/** The bar and the panel below it both start at the notch, never under it. */
const BELOW_BAR = "calc(var(--spacing-topbar) + env(safe-area-inset-top))";

/**
 * The marks the header cycles through, each with its own recolour map.
 *
 * Every file ships its own palette, so the maps are written per mark rather
 * than shared: only the accent colours are redirected at the theme, and the
 * greys, whites and outlines that give each drawing its shape are left alone.
 */
const MARKS = [
    {
        src: "/sushi.svg",
        label: "Sushi",
        colors: {
            "#e9885b": "var(--primary)",
            "#cc5e30": "var(--secondary)",
            "#f1bb9b": "var(--tertiary)",
        },
    },
    {
        src: "/controller.svg",
        label: "Game controller",
        colors: {
            "#57C0EB": "var(--primary)",
            "#E776AA": "var(--secondary)",
            "#7AC493": "var(--tertiary)",
            "#CE7FB2": "var(--quaternary)",
        },
    },
    {
        src: "/billiard.svg",
        label: "Billiard ball",
        colors: {
            "#47A544": "var(--primary)",
            "#4A8F37": "var(--secondary)",
            "#3A964F": "var(--tertiary)",
            "#358A48": "var(--quaternary)",
        },
    },
    {
        src: "/shoe.svg",
        label: "Running shoe",
        colors: {
            "#a8d600": "var(--primary)",
            "#5b636b": "var(--secondary)",
            "#69727a": "var(--tertiary)",
        },
    },
] as const;

/** Raw SVG source per mark, kept across mounts — the files never change. */
const markCache = new Map<string, string>();

function SocialLinks({ className = "" }: { className?: string }) {
    return (
        <>
            {SOCIALS.map((social) => (
                <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`transition-colors hover:text-text ${className}`}
                >
                    <svg
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d={social.path} />
                    </svg>
                </a>
            ))}
        </>
    );
}

function Brand() {
    return (
        <div className="flex items-baseline gap-3">
            <span className="font-heading text-glyph font-bold leading-none tracking-wide">
                窟
            </span>
            <h1 className="font-heading text-mark font-medium tracking-widest">
                KAHFI
            </h1>
        </div>
    );
}

export default function SidebarMenu({
    items,
    selected,
    onSelect,
    variant = "rail",
}: Props) {
    const [svg, setSvg] = useState("");
    const [markIndex, setMarkIndex] = useState(0);
    const [time, setTime] = useState("");
    const [open, setOpen] = useState(false);
    const { cycleTheme } = useTheme();
    const reduce = useReducedMotion();

    useEffect(() => {
        const format = new Intl.DateTimeFormat("en-GB", {
            timeZone: TIMEZONE,
            hour: "2-digit",
            minute: "2-digit",
        });

        // The clock shows HH:MM, so it only has something new to say once a
        // minute — ticking every second re-rendered the whole sidebar 59 times
        // for nothing. Each tick schedules the next one at the coming minute
        // boundary, which also keeps the flip aligned with the real clock
        // rather than drifting from whenever the component mounted.
        let id: ReturnType<typeof setTimeout>;

        const tick = () => {
            const now = new Date();
            setTime(format.format(now));
            id = setTimeout(tick, 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
        };

        tick();
        return () => clearTimeout(id);
    }, []);

    const mark = MARKS[markIndex];

    useEffect(() => {
        // Clicking fast enough outruns the fetches; without this guard a slow
        // earlier response can land last and paint the wrong mark.
        let stale = false;

        async function loadSvg() {
            try {
                // Cycling the theme walks the same four marks over and over, so
                // a mark is only ever fetched once per session; after that the
                // swap costs a recolour instead of a round trip.
                let raw = markCache.get(mark.src);

                if (raw === undefined) {
                    const res = await fetch(mark.src);
                    if (!res.ok) throw new Error(`${mark.src}: ${res.status}`);
                    raw = await res.text();
                    markCache.set(mark.src, raw);
                }

                if (!stale) setSvg(recolorSvg(raw, mark.colors));
            } catch {
                // A missing mark is a missing decoration, not a broken page:
                // leave the previous drawing up rather than throwing an
                // unhandled rejection at the console.
            }
        }

        loadSvg();
        return () => {
            stale = true;
        };
    }, [mark]);

    // The panel covers the page, so the page behind it must not scroll with it.
    useEffect(() => {
        if (!open) return;

        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    const sushi = (
        <button
            type="button"
            onClick={() => {
                cycleTheme();
                setMarkIndex((i) => (i + 1) % MARKS.length);
            }}
            aria-label={`Change theme — ${mark.label} mark`}
            title={`${mark.label} — click to change theme`}
            className={
                variant === "bar"
                    ? // 44×44 tap target around an 8×8 mark, so the sushi keeps
                      // its size while the thing you actually hit grows.
                      "-mr-1 flex h-11 w-11 cursor-pointer items-center justify-center transition-transform hover:scale-110 [&>svg]:h-8 [&>svg]:w-8"
                    : "h-8 w-8 cursor-pointer transition-transform hover:scale-110 [&>svg]:h-full [&>svg]:w-full"
            }
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );

    const nav = (
        <nav className={variant === "bar" ? "flex flex-col" : "mt-12 flex flex-col"}>
            {items.map((item, i) => {
                const isSelected = item.label === selected;

                const button = (
                    <button
                        onClick={() => {
                            onSelect(item.label);
                            // Picking a section is the end of the menu's job —
                            // never leave the panel sitting on top of the
                            // content the tap just navigated to.
                            setOpen(false);
                        }}
                        className={`
                            group relative flex w-full cursor-pointer items-center
                            text-left font-heading tracking-wide
                            transition-colors duration-(--duration-fast)
                            ${variant === "bar" ? "py-3 text-caption" : "py-1 text-nav"}
                            ${isSelected ? "text-text" : "text-text-muted hover:text-text"}
                        `}
                    >
                        {/* Active accent bar */}
                        <span
                            className={`
                                absolute left-0 rounded-full bg-primary
                                transition-opacity duration-(--duration-fast)
                                ${variant === "bar" ? "h-6 w-0.5" : "h-4 w-0.5"}
                                ${isSelected ? "opacity-100" : "opacity-0"}
                            `}
                        />
                        <span className="pl-4">{item.label}</span>
                    </button>
                );

                if (variant !== "bar") {
                    return <div key={item.label}>{button}</div>;
                }

                return (
                    <motion.div
                        key={item.label}
                        initial={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.25,
                            delay: reduce ? 0 : 0.06 + i * 0.04,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        {button}
                    </motion.div>
                );
            })}
        </nav>
    );

    if (variant === "bar") {
        return (
            <>
                {/* The rail's header, laid on its side and pinned to the top. */}
                <motion.header
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                    style={{
                        height: BELOW_BAR,
                        paddingTop: "env(safe-area-inset-top)",
                    }}
                    className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-border bg-background px-gutter"
                >
                    <div className="flex items-baseline gap-3 overflow-hidden">
                        <Brand />
                        <span className="truncate font-heading text-label tracking-wide text-text-muted">
                            / {selected}
                        </span>
                    </div>

                    <div className="flex items-center">
                        {sushi}

                        <button
                            type="button"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls="mobile-nav-panel"
                            aria-label={open ? "Close menu" : "Open menu"}
                            className="-mr-2 flex h-11 w-11 cursor-pointer items-center justify-center"
                        >
                            {/* Three hairlines, same vocabulary as the rules and
                                the active accent bar. They fold into an X. */}
                            <span className="relative block h-[9px] w-5">
                                {[0, 4, 8].map((top, i) => (
                                    <motion.span
                                        key={top}
                                        animate={{
                                            y: open ? (i === 0 ? 4 : i === 2 ? -4 : 0) : 0,
                                            rotate: open ? (i === 0 ? 45 : i === 2 ? -45 : 0) : 0,
                                            opacity: open && i === 1 ? 0 : 1,
                                        }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        style={{ top }}
                                        className="absolute left-0 h-[1.5px] w-full rounded-full bg-text"
                                    />
                                ))}
                            </span>
                        </button>
                    </div>
                </motion.header>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            id="mobile-nav-panel"
                            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            style={{
                                top: BELOW_BAR,
                                // Clears the home indicator; collapses to the
                                // plain 2rem on hardware that has none.
                                paddingBottom:
                                    "max(2rem, env(safe-area-inset-bottom))",
                            }}
                            className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto bg-background px-gutter pt-8"
                        >
                            {nav}

                            {/* Same block as the rail's footer, minus the hover
                                reveal — a finger has no hover to reveal with. */}
                            <div className="mt-auto flex flex-col gap-1 pt-10 text-text-muted">
                                <div className="flex items-center gap-4 pb-2">
                                    <SocialLinks />
                                </div>

                                <span className="font-heading text-label tracking-wide">
                                    @nrkahfirhmd
                                </span>
                                <span className="font-heading text-nav tracking-wide text-text">
                                    {CITY}
                                </span>
                                <time className="font-heading text-label tabular-nums">
                                    {time}
                                </time>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </>
        );
    }

    return (
        <div className="flex h-screen w-full flex-col px-8 pt-12">
            {/* Header: brand mark + name, theme toggle, current section */}
            <header>
                <div className="flex items-center justify-between">
                    <Brand />

                    {/* Sushi = theme toggle */}
                    {sushi}
                </div>
            </header>

            {/* Navigation */}
            {nav}

            {/* Social + location, pinned to the bottom */}
            <div className="mt-auto flex flex-col gap-1 pb-8 text-text-muted">
                {/* Handle swaps to social links on hover */}
                <div className="group relative flex h-6 items-center">
                    <span className="font-heading text-label tracking-wide transition-opacity duration-(--duration-fast) group-hover:opacity-0">
                        @nrkahfirhmd
                    </span>

                    <div className="pointer-events-none absolute inset-0 flex items-center gap-4 opacity-0 transition-opacity duration-(--duration-fast) group-hover:pointer-events-auto group-hover:opacity-100">
                        <SocialLinks />
                    </div>
                </div>

                <span className="font-heading text-nav tracking-wide text-text">
                    {CITY}
                </span>
                <time className="font-heading text-label tabular-nums">{time}</time>
            </div>
        </div>
    );
}
