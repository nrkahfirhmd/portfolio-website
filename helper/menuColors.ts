export const menuColors = [
    "bg-primary",
    "bg-secondary",
    "bg-tertiary",
    "bg-quaternary",
] as const;

export function colorFromIndex(index: number) {
    return menuColors[index % menuColors.length];
}