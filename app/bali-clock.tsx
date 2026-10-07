"use client";

import { useEffect, useMemo, useState } from "react";

const FALLBACK = { city: "Bali", timeZone: "Asia/Makassar" };

function makeFormatter(timeZone: string) {
  // Throws on an invalid IANA zone: that's the validation.
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** The canopy's light, from the clock's hour (not the visitor's), so it always matches the time shown. */
function daypart(hour: number) {
  if (hour < 5) return "night";
  if (hour < 11) return "morning";
  if (hour < 16) return "noon";
  if (hour < 20) return "afternoon";
  return "night";
}

/** Typed city to IANA zone ("tokyo" -> "Asia/Tokyo") via Intl.supportedValuesOf. */
function findZone(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const zone = Intl.supportedValuesOf("timeZone").find((z) => {
    const city = z.split("/").pop()!.replace(/_/g, " ").toLowerCase();
    return city === q || city.includes(q);
  });
  if (!zone) return null;
  return { city: zone.split("/").pop()!.replace(/_/g, " "), timeZone: zone };
}

/** Live clock for a typed city, falling back to Bali; shows --:-- until mounted to avoid a hydration mismatch. */
export function BaliClock() {
  const [target, setTarget] = useState(FALLBACK);
  const [value, setValue] = useState(FALLBACK.city);
  const [time, setTime] = useState<string | null>(null);

  const fmt = useMemo(() => makeFormatter(target.timeZone), [target.timeZone]);

  useEffect(() => {
    const tick = () => {
      const text = fmt.format(new Date());
      setTime(text);
      document.documentElement.dataset.daypart = daypart(Number(text.slice(0, 2)));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, [fmt]);

  function commit() {
    const resolved = findZone(value) ?? FALLBACK;
    setTarget(resolved);
    setValue(resolved.city);
  }

  return (
    <span className="clock">
      <input
        className="clock-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={(e) => e.target.select()}
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        onBlur={commit}
        title="Type a city, Enter to confirm"
        aria-label="Change displayed city"
      />
      <span>{time ?? "--:--"}</span>
    </span>
  );
}
