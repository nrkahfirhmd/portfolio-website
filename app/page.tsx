"use client";

import Image from "next/image";
import { useState } from "react";
import ContentPanel from "@/components/ContentPanel";
import FloatingItem from "@/components/FloatingItem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SidebarMenu from "@/components/SidebarMenu";
import { floatingItems } from "@/lib/home";
import { navItems } from "@/lib/nav";

export default function Home() {
    const [selected, setSelected] = useState<string | null>(null);

    function handleSelect(label: string) {
        setSelected((prev) => (prev === label ? null : label));
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            <div
                className={`fixed left-0 top-0 z-40 h-screen overflow-hidden bg-background transition-[width,border-color] duration-[400ms] delay-[150ms] ease-in-out ${
                    selected ? "w-sidebar border-r border-border" : "w-full border-r border-transparent"
                }`}
            >
                <div
                    className={`transition-all ease-out ${
                        selected
                            ? "pointer-events-none -translate-y-6 opacity-0 duration-[150ms]"
                            : "translate-y-0 opacity-100 duration-[200ms] delay-[400ms]"
                    }`}
                >
                    <Navbar />
                </div>

                <section className="relative h-full">
                    {/* Home layer */}
                    <div
                        className={`absolute inset-0 flex items-center justify-center transition-opacity ease-out ${
                            selected
                                ? "pointer-events-none opacity-0 duration-[150ms]"
                                : "opacity-100 duration-[200ms] delay-[400ms]"
                        }`}
                    >
                        <div className="relative z-10 w-fit">
                            {floatingItems.map((item) => (
                                <FloatingItem
                                    key={item.label}
                                    {...item}
                                    onSelect={() => handleSelect(item.label)}
                                />
                            ))}

                            <Image
                                src="/home/avatar.png"
                                alt="avatar"
                                width={220}
                                height={650}
                                priority
                            />
                        </div>
                    </div>

                    {/* Sidebar layer */}
                    <div
                        className={`absolute inset-0 flex items-center justify-start transition-opacity ease-out ${
                            selected
                                ? "opacity-100 duration-[200ms] delay-[300ms]"
                                : "pointer-events-none opacity-0 duration-[150ms]"
                        }`}
                    >
                        <SidebarMenu
                            items={navItems}
                            selected={selected ?? ""}
                            onSelect={handleSelect}
                        />
                    </div>
                </section>

                <div
                    className={`transition-all ease-out ${
                        selected
                            ? "pointer-events-none translate-y-6 opacity-0 duration-[150ms]"
                            : "translate-y-0 opacity-100 duration-[200ms] delay-[400ms]"
                    }`}
                >
                    <Footer />
                </div>
            </div>

            <div
                className={`min-h-screen transition-all ease-out ${
                    selected
                        ? "ml-sidebar flex-1 opacity-100 duration-[350ms] delay-[300ms]"
                        : "pointer-events-none ml-0 opacity-0 duration-[150ms]"
                }`}
            >
                {selected && (
                    <ContentPanel label={selected} onNavigate={setSelected} />
                )}
            </div>
        </main>
    );
}
