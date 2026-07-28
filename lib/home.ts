export interface FloatingItemData {
    icon: string;
    /** Nav section this item opens. Must match a label in `navItems`. */
    label: string;
    /** Scent-of-information line revealed on hover/focus. */
    hint: string;
    /**
     * Absolute placement relative to the avatar, inside the scaled stage.
     * Mobile-first: the bare classes describe the compact portrait collage, the
     * `md:` layer the wide one. Both are measured against the matching design
     * box in HomeStage — moving an offset here means re-measuring that box.
     */
    className: string;
    /** Rendered width, same mobile-first/`md:` split as `className`. */
    widthClassName: string;
    /** Intrinsic width handed to next/image for its `sizes` hint. */
    width: number;
    /** Parallax travel in px across the full viewport. Higher = nearer the eye. */
    depth: number;
    /** Entrance stagger (s). */
    delay: number;
    /** Idle bob cycle (s). Varied so items never bob in lockstep. */
    bob: number;
}

export const floatingItems: FloatingItemData[] = [
    {
        icon: "/home/mac.png",
        label: "Work",
        hint: "Things I shipped",
        className:
            "-left-[110px] top-[150px] md:left-0 md:top-1/2 md:-translate-x-70 md:-translate-y-1/2",
        widthClassName: "w-[90px] md:w-[250px]",
        width: 250,
        depth: 46,
        delay: 0.15,
        bob: 5.2,
    },
    {
        icon: "/home/glasses.png",
        label: "Experience",
        hint: "Where I've been",
        className:
            // top-[20px] on portrait: high enough that the label beneath lands
            // beside the avatar's head, which is narrow, instead of across the
            // shoulder, which is not.
            "left-[160px] top-[20px] md:left-auto md:right-0 md:top-1 md:translate-x-60 md:translate-y-1/4",
        widthClassName: "w-[95px] md:w-[250px]",
        width: 250,
        depth: 34,
        delay: 0.25,
        bob: 6.1,
    },
    {
        icon: "/home/iphone.png",
        label: "Exploration",
        hint: "Side quests",
        className:
            // Narrowest sticker but its label is the longest, and the label is
            // centred under it — so it needs the largest gap of the three, or
            // "Exploration" reaches back across the avatar's shoes.
            "left-[180px] top-[290px] md:left-auto md:right-0 md:top-1/2 md:translate-x-40 md:translate-y-1/4",
        widthClassName: "w-[42px] md:w-[100px]",
        width: 100,
        depth: 62,
        delay: 0.35,
        bob: 4.4,
    },
];

export const intro = {
    role: "Technology Orchestrator in Training",
    hint: "Poke something to begin",
};
