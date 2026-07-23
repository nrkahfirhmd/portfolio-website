"use client";

import { useEffect, useState } from "react";
import { recolorSvg } from "@/helper/recolorSvg";
import { useTheme } from "@/components/ThemeProvider";
import type { NavItem } from "@/lib/nav";
import Image from "next/image";

interface Props {
    items: NavItem[];
    selected: string;
    onSelect: (label: string) => void;
}

export default function SidebarMenu({ items, selected, onSelect }: Props) {
    const [svg, setSvg] = useState("");
    const { cycleTheme } = useTheme();

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
        <div className="flex h-screen flex-row">
            <div className="flex flex-col gap-14 px-6 pt-16">
                {/* Identity */}
                <div className="flex flex-col items-center gap-4">
                    <Image
                        src={"/photo.jpg"}
                        alt={"Personal Picture"}
                        width={128}
                        height={128}
                        className="w-full h-full rounded-full object-cover ring-4 ring-border/15"
                    />
                    <h1 className="font-heading text-mark font-medium tracking-widest">
                        KAHFI
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col">
                    {items.map((item) => {
                        const isSelected = item.label === selected;

                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => onSelect(item.label)}
                                    className={`
                                        group relative flex w-full cursor-pointer items-center
                                        text-left font-heading text-nav tracking-wide
                                        transition-colors duration-200
                                        ${isSelected ? "text-text" : "text-text-muted hover:text-text"}
                                    `}
                                >
                                    {/* Active accent bar */}
                                    <span
                                        className={`
                                            absolute left-0 h-4 w-0.5 rounded-full bg-primary
                                            transition-opacity duration-200
                                            ${isSelected ? "opacity-100" : "opacity-0"}
                                        `}
                                    />
                                    <span className="pl-4">{item.label}</span>
                                </button>
                            </div>
                        );
                    })}
                </nav>
            </div>

            <span className="ml-auto w-px bg-border" />

            <div className="flex w-16 flex-col items-center gap-20 py-16 text-center">
                <h1 className="font-heading text-4xl font-bold tracking-wide">窟</h1>

                <h2 className="w-20 rotate-90 whitespace-nowrap text-center font-heading text-caption">
                    {selected}
                </h2>

                <button
                    type="button"
                    onClick={cycleTheme}
                    aria-label="Toggle color theme"
                    className="h-9 w-9 cursor-pointer transition-transform hover:scale-110 [&>svg]:h-full [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </div>
        </div>
    );
}
