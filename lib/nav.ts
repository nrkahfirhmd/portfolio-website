export interface NavItem {
    label: string;
    children?: { label: string }[];
}

export const navItems: NavItem[] = [
    { label: "Index" },
    {
        label: "Work",
        children: [
            { label: "Software" },
            { label: "AI" },
            { label: "System" },
        ],
    },
    { label: "Experience" },
    { label: "Exploration" },
];
