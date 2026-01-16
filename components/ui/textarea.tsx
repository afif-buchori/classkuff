"use client";

import { cn } from "@/libs/utils";
import * as React from "react";

type TextareaProps = React.ComponentProps<"textarea"> & {
    error?: boolean;
};

function Textarea({ className, error, ...props }: TextareaProps) {
    return (
        <textarea
            data-slot="textarea"
            aria-invalid={error || undefined}
            className={cn(
                "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
                "[&:not(:focus)[aria-invalid='true']]:ring-destructive/20 [&:not(:focus)[aria-invalid='true']]:border-destructive",
                "dark:[&:not(:focus)[aria-invalid='true']]:ring-destructive/40",
                "resize-y",
                // "min-h-80 resize-y", // default tinggi + bisa resize vertikal
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
