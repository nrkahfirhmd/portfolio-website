"use client";

import { useEffect, useState } from "react";
import { recolorSvg } from "@/helper/recolorSvg";
import { useTheme } from "@/components/ThemeProvider";
import Image from "next/image";

interface Item {
    label: string;
}

interface Props {
    items: Item[];
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
        <div className="flex flex-row h-screen">
            <div className="relative pt-16 flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                    <h1 className="text-center font-bold font-heading text-mark tracking-wide">KAHFI</h1>

                    <div className="px-4">
                        <Image
                            src={'/photo.jpg'}
                            alt={"Personal Picture"}
                            width={250}
                            height={120}
                            className="ring-4 ring-quaternary"
                        />
                    </div>
                </div>

                <nav className="z-10 overflow-hidden border border-border">
                    {items.map((item) => {
                        const isSelected = item.label === selected;

                        return (
                            <button
                                key={item.label}
                                onClick={() => onSelect(item.label)}
                                className="
                                    group
                                    relative
                                    flex
                                    w-full
                                    items-center
                                    overflow-hidden
                                    border-b
                                    border-border
                                    last:border-b-0
                                    py-2
                                    text-left
                                "
                            >
                                {/* Expanding background */}
                                <div
                                    className={`
                                        absolute
                                        inset-0
                                        origin-left
                                        bg-primary
                                        transition-transform
                                        duration-300
                                        ease-out
                                        ${isSelected ? "scale-x-100" : "scale-x-4"}
                                    `}
                                />

                                {/* Hover tint for unselected items */}
                                {!isSelected && (
                                    <div className="absolute inset-0 bg-secondary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                )}

                                {/* Content */}
                                <div className="relative z-10 flex items-center px-6">
                                    <p
                                        className={`
                                            font-heading
                                            text-nav
                                            tracking-wide
                                            transition-colors
                                            duration-300
                                            ${isSelected
                                                ? "text-white"
                                                : "text-text-muted group-hover:text-text"
                                            }
                                    `}
                                    >
                                        {item.label}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </nav>
                
                <div className="absolute bottom-0 left-0 h-120 w-full bg-gradient-to-b from-background via-tertiary to-primary" />
            </div>

            <span className="w-[1px] bg-border" />

            <div className="flex w-16 flex-col items-center gap-20 py-16 text-center">
                <h1 className="font-bold font-heading text-4xl tracking-wide">窟</h1>

                <h2 className="w-20 rotate-90 whitespace-nowrap text-center text-caption font-heading">
                    {selected}
                </h2>

                <button
                    type="button"
                    onClick={cycleTheme}
                    aria-label="Toggle color theme"
                    className="w-10 h-10 transition-transform hover:scale-110 [&>svg]:w-full [&>svg]:h-full"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            </div>
        </div>
    );
}
