"use client";

import { useEffect, useMemo, useState } from "react";

const FALLBACK = { city: "Bali", timeZone: "Asia/Makassar" };

function makeFormatter(timeZone: string) {
  // ponytail: throws on an invalid IANA zone — that's our validation.
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Which of the four window lights is falling across the page. Derived from
 * the clock's own hour rather than the visitor's machine, so the light always
 * agrees with the time actually on screen — retarget the clock to Reykjavik
 * at 2am and the page goes dark with it. */
function daypart(hour: number) {
  if (hour < 5) return "night";
  if (hour < 11) return "morning";
  if (hour < 16) return "noon";
  if (hour < 20) return "afternoon";
  return "night";
}

/** Matches typed text against the IANA timezone city segment
 * (e.g. "tokyo" -> "Asia/Tokyo"). Native Intl.supportedValuesOf, no lookup table. */
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

/** Live city clock, editable by typing a city name. Falls back to Bali when
 * the typed city has no matching IANA timezone. Renders nothing until
 * mounted to avoid a server/client hydration mismatch on the time text. */
export function BaliClock() {
  const [target, setTarget] = useState(FALLBACK);
  const [value, setValue] = useState(FALLBACK.city);
  const [time, setTime] = useState<string | null>(null);

  const fmt = useMemo(() => makeFormatter(target.timeZone), [target.timeZone]);

  useEffect(() => {
    const tick = () => {
      // "HH:MM" in the target zone — the hour is already in there, so the
      // daypart costs a slice rather than a second Intl formatter.
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
