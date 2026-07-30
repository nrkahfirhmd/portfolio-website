export interface StickerItem {
    src: string;
    alt: string;
    /**
     * Rendered width, mobile-first: bare value for a phone, `tiny:` for the
     * 320–360px band, `roomy:` for a viewport with width *and* height to spare.
     */
    sizeClassName: string;
    /**
     * Tailwind position classes, in the same three tiers as `sizeClassName`. The
     * bare classes tuck the sticker into a corner, clear of the centre column
     * the numerals and copy occupy in a phone's width; `tiny:` pushes it into
     * the very corner, where the centre column has taken the rest; `roomy:` is
     * the original placement, which assumes room the phone does not have.
     */
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
        sizeClassName: "w-[76px] tiny:w-[62px] roomy:w-[120px]",
        className:
            "left-[4%] bottom-[7%] tiny:left-[1%] tiny:bottom-[3%] roomy:left-[14%] roomy:bottom-[16%]",
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
        // Drawn side-on, so it reads at a smaller box than the others and can
        // hold the corner without crowding the numerals.
        sizeClassName: "w-[82px] tiny:w-[64px] roomy:w-[150px]",
        className:
            "left-[3%] top-[6%] tiny:left-[1%] tiny:top-[2%] roomy:left-[8%] roomy:top-[18%]",
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
        sizeClassName: "w-[80px] tiny:w-[62px] roomy:w-[130px]",
        className:
            "right-[3%] top-[8%] tiny:right-[1%] tiny:top-[3%] roomy:right-[12%] roomy:top-[20%]",
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
        sizeClassName: "w-[72px] tiny:w-[60px] roomy:w-[120px]",
        className:
            "right-[4%] bottom-[9%] tiny:right-[1%] tiny:bottom-[4%] roomy:right-[9%] roomy:bottom-[14%]",
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
