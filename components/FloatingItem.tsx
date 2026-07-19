"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
    icon: string;
    label: string;
    className: string;
    rotation: number;
    width: number;
    onSelect?: () => void;
}

export default function FloatingItem({
    icon,
    label,
    className,
    rotation,
    width,
    onSelect,
}: Props) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            className={`absolute group ${className}`}
            onClick={onSelect}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div
                className="transition-transform duration-300"
                style={{
                    transform: `rotate(${hovered ? 0 : rotation}deg)`,
                }}
            >
                <Image
                    src={icon}
                    alt={label}
                    width={width}
                    height={120}
                />
            </div>

            <p className="mt-3 text-center text-lg font-semibold text-text transition-colors group-hover:text-primary">
                {label}
            </p>
        </button>
    );
}
