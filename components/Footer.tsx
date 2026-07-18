"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const [cityInput, setCityInput] = useState("Bali");
    const [timezone, setTimezone] = useState("Asia/Makassar");
    const [time, setTime] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

    useEffect(() => {
        const update = () =>
            setTime(
                new Intl.DateTimeFormat("en-GB", {
                    timeZone: timezone,
                    hour: "2-digit",
                    minute: "2-digit",
                }).format(new Date())
            );

        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, [timezone]);

    async function handleSearch() {
        const query = cityInput.trim();
        if (!query) return;

        setStatus("loading");
        try {
            const res = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
            );
            const data = await res.json();
            const result = data?.results?.[0];

            if (!result) {
                setStatus("error");
                return;
            }

            setCityInput(result.name);
            setTimezone(result.timezone);
            setStatus("idle");
        } catch {
            setStatus("error");
        }
    }

    return (
        <footer className="fixed inset-x-0 bottom-0 z-50">
            <div className="flex justify-between px-8 py-4">
                <span className="font-bold text-text font-heading text-xl tracking-wide">LAB</span>

                <div className="flex items-center gap-2 text-sm text-text-muted">
                    <input
                        value={cityInput}
                        onChange={(e) => {
                            setCityInput(e.target.value);
                            setStatus("idle");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                                e.currentTarget.blur();
                            }
                        }}
                        placeholder="City"
                        className={`w-20 bg-transparent text-right outline-none placeholder:text-text-muted focus:text-text ${
                            status === "error" ? "text-red-400" : ""
                        } ${status === "loading" ? "opacity-50" : ""}`}
                    />
                    <time>{time}</time>
                </div>
            </div>
        </footer>
    );
}
