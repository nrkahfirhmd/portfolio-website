export interface FloatingItemData {
    icon: string;
    /** Nav section this item opens. Must match a label in `navItems`. */
    label: string;
    /** Scent-of-information line revealed on hover/focus. */
    hint: string;
    /** Absolute placement relative to the avatar, inside the scaled stage. */
    className: string;
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
        className: "left-0 top-1/2 -translate-x-70 -translate-y-1/2",
        width: 250,
        depth: 46,
        delay: 0.15,
        bob: 5.2,
    },
    {
        icon: "/home/glasses.png",
        label: "Experience",
        hint: "Where I've been",
        className: "right-0 top-1 translate-x-60 translate-y-1/4",
        width: 250,
        depth: 34,
        delay: 0.25,
        bob: 6.1,
    },
    {
        icon: "/home/iphone.png",
        label: "Exploration",
        hint: "Side quests",
        className: "right-0 top-1/2 translate-x-40 translate-y-1/4",
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
