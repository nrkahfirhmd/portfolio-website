import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
    default: "bg-primary text-background",
    secondary: "bg-secondary text-text",
    tertiary: "bg-tertiary text-text",
    quaternary: "bg-quaternary text-text",
    outline: "bg-surface text-text",
} as const;

type BadgeVariant = keyof typeof badgeVariants;

function Badge({
    className,
    variant = "outline",
    ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
    return (
        <span
            data-slot="badge"
            className={cn(
                "inline-flex items-center border border-border px-2.5 py-0.5 text-xs font-medium tracking-wide",
                badgeVariants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
export type { BadgeVariant };
