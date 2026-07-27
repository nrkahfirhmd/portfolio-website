"use client";

import { useEffect, useState } from "react";
import { recolorSvg } from "@/helper/recolorSvg";
import { useTheme } from "@/components/ThemeProvider";
import type { NavItem } from "@/lib/nav";

interface Props {
    items: NavItem[];
    selected: string;
    onSelect: (label: string) => void;
}

const CITY = "Bali";
const TIMEZONE = "Asia/Makassar";

export default function SidebarMenu({ items, selected, onSelect }: Props) {
    const [svg, setSvg] = useState("");
    const [time, setTime] = useState("");
    const { cycleTheme } = useTheme();

    useEffect(() => {
        const update = () =>
            setTime(
                new Intl.DateTimeFormat("en-GB", {
                    timeZone: TIMEZONE,
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(new Date())
            );

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        async function loadSvg() {
            const raw = await fetch("/sushi.svg").then((r) => r.text());
            setSvg(
                recolorSvg(raw, {
                    "#e9885b": "var(--primary)",
                    "#cc5e30": "var(--secondary)",
                    "#f1bb9b": "var(--tertiary)",
                })
            );
        }
        loadSvg();
    }, []);

    return (
        <div className="flex h-screen w-full flex-col px-8 pt-12">
            {/* Header: brand mark + name, theme toggle, current section */}
            <header>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-3">
                        <span className="font-heading text-glyph font-bold leading-none tracking-wide">
                            窟
                        </span>
                        <h1 className="font-heading text-mark font-medium tracking-widest">
                            KAHFI
                        </h1>
                    </div>

                    {/* Sushi = theme toggle */}
                    <button
                        type="button"
                        onClick={cycleTheme}
                        aria-label="Toggle color theme"
                        className="h-8 w-8 cursor-pointer transition-transform hover:scale-110 [&>svg]:h-full [&>svg]:w-full"
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                </div>

                {/* Current section */}
                {/* <p className="mt-3 font-heading text-caption leading-none text-text-muted">
                    {selected}
                </p> */}
            </header>

            {/* Navigation */}
            <nav className="mt-12 flex flex-col">
                {items.map((item) => {
                    const isSelected = item.label === selected;

                    return (
                        <button
                            key={item.label}
                            onClick={() => onSelect(item.label)}
                            className={`
                                group relative flex w-full cursor-pointer items-center
                                py-1 text-left font-heading text-nav tracking-wide
                                transition-colors duration-(--duration-fast)
                                ${isSelected ? "text-text" : "text-text-muted hover:text-text"}
                            `}
                        >
                            {/* Active accent bar */}
                            <span
                                className={`
                                    absolute left-0 h-4 w-0.5 rounded-full bg-primary
                                    transition-opacity duration-(--duration-fast)
                                    ${isSelected ? "opacity-100" : "opacity-0"}
                                `}
                            />
                            <span className="pl-4">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Social + location, pinned to the bottom */}
            <div className="mt-auto flex flex-col gap-1 pb-8 text-text-muted">
                {/* Handle swaps to social links on hover */}
                <div className="group relative flex h-6 items-center">
                    <span className="font-heading text-label tracking-wide transition-opacity duration-(--duration-fast) group-hover:opacity-0">
                        @nrkahfirhmd
                    </span>

                    <div className="pointer-events-none absolute inset-0 flex items-center gap-4 opacity-0 transition-opacity duration-(--duration-fast) group-hover:pointer-events-auto group-hover:opacity-100">
                        <a
                            href="https://linkedin.com/in/nrkahfirhmd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="transition-colors hover:text-text"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a
                            href="https://github.com/nrkahfirhmd"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="transition-colors hover:text-text"
                        >
                            <svg
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                            </svg>
                        </a>
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
