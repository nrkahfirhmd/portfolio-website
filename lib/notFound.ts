export interface StickerItem {
    src: string;
    alt: string;
    size: number;
    /** Tailwind position classes. */
    className: string;
    rotation: number;
    /** Parallax intensity — higher drifts further with the cursor. */
    depth: number;
    /** Source hex -> theme CSS variable, applied via recolorSvg. */
    colors: Record<string, string>;
}

export const stickers: StickerItem[] = [
    {
        src: "/sushi.svg",
        alt: "sushi",
        size: 120,
        className: "left-[14%] bottom-[16%]",
        rotation: 8,
        depth: 60,
        colors: {
            "#e9885b": "var(--primary)",
            "#cc5e30": "var(--secondary)",
            "#f1bb9b": "var(--tertiary)",
        },
    },
    {
        src: "/shoe.svg",
        alt: "sneaker",
        size: 150,
        className: "left-[8%] top-[18%]",
        rotation: -14,
        depth: 46,
        colors: {
            "#a8d600": "var(--primary)",
            "#5b636b": "var(--secondary)",
            "#69727a": "var(--tertiary)",
            "#d0d0d0": "var(--quaternary)",
        },
    },
    {
        src: "/controller.svg",
        alt: "game controller",
        size: 130,
        className: "right-[12%] top-[20%]",
        rotation: 12,
        depth: 70,
        colors: {
            "#777778": "var(--primary)",
            "#646363": "var(--secondary)",
            "#5c5c5c": "var(--tertiary)",
            "#949394": "var(--quaternary)",
        },
    },
    {
        src: "/billiard.svg",
        alt: "billiard ball",
        size: 120,
        className: "right-[9%] bottom-[14%]",
        rotation: -10,
        depth: 38,
        colors: {
            "#358a48": "var(--primary)",
            "#3a964f": "var(--secondary)",
            "#47a544": "var(--tertiary)",
            "#4a8f37": "var(--quaternary)",
        },
    },
];
