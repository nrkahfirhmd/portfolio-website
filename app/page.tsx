"use client";

import Image from "next/image";
import { useState } from "react";
import ContentPanel from "@/components/ContentPanel";
import FloatingItem from "@/components/FloatingItem";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SidebarMenu from "@/components/SidebarMenu";
import { floatingItems } from "@/lib/home";

export default function Home() {
    const [selected, setSelected] = useState<string | null>(null);

    function handleSelect(label: string) {
        setSelected((prev) => (prev === label ? null : label));
    }

    return (
        <main className="relative min-h-screen overflow-hidden bg-background">
            <div
                className={`fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-500 ease-in-out ${
                    selected ? "w-sidebar border-r border-border" : "w-full"
                }`}
            >
              <div
                className={`transition-all duration-300 ${selected
                    ? "pointer-events-none -translate-y-6 opacity-0"
                    : "translate-y-0 opacity-100"
                  }`}
              >
                <Navbar />
              </div>

                <section
                    className={`relative flex h-full ${
                        selected ? "items-center justify-start" : "items-center justify-center"
                    }`}
                >
                    {selected ? (
                        <SidebarMenu
                            items={floatingItems}
                            selected={selected}
                            onSelect={handleSelect}
                        />
                    ) : (
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
                    )}
                </section>

                <div
                  className={`transition-all duration-300 ${selected
                      ? "pointer-events-none translate-y-6 opacity-0"
                      : "translate-y-0 opacity-100"
                    }`}
                >
                  <Footer />
                </div>
            </div>

            <div
                className={`min-h-screen transition-all duration-500 ease-in-out ${
                    selected ? "ml-sidebar opacity-100 flex-1" : "pointer-events-none ml-0 opacity-0"
                }`}
            >
                {selected && <ContentPanel label={selected} />}
            </div>
        </main>
    );
}
