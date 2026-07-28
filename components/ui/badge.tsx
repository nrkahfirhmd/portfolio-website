import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
    // text-text, not text-background: --background on --primary is 3.3:1 on the
    // green theme and 2.0:1 on the red one, under the 4.5:1 this text needs.
    default: "bg-primary text-text",
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
                "inline-flex items-center rounded-full border border-line px-2.5 py-0.5 text-xs font-medium tracking-wide",
                badgeVariants[variant],
                className
            )}
            {...props}
        />
    );
}

export { Badge, badgeVariants };
export type { BadgeVariant };
