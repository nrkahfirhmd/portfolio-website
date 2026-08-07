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
    // The inline script in the root layout has already resolved the stored
    // theme onto <html> by the time this runs, so the attribute — not
    // localStorage — is the source of truth. Reading it here keeps state and
    // paint agreeing from the very first render instead of a frame later.
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof document === "undefined") return "green";
        const painted = document.documentElement.getAttribute("data-theme");
        return THEMES.includes(painted as Theme) ? (painted as Theme) : "green";
    });

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
