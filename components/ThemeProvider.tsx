"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "green" | "blue" | "red";

const THEMES: Theme[] = ["green", "blue", "red"];

interface ThemeContextValue {
    theme: Theme;
    cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("green");

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored && THEMES.includes(stored as Theme)) {
            setTheme(stored as Theme);
        }
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    function cycleTheme() {
        setTheme((prev) => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length]);
    }

    return (
        <ThemeContext.Provider value={{ theme, cycleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
    return ctx;
}
