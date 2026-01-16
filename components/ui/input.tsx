"use client";

import { cn } from "@/libs/utils";
import * as React from "react";

type InputProps = React.ComponentProps<"input"> & {
    error?: boolean;
};

function Input({ className, type, error, ...props }: InputProps) {
    return (
        <input
            type={type}
            data-slot="input"
            aria-invalid={error || undefined}
            className={cn(
                "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                "focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:border-primary",
                "[&:not(:focus)[aria-invalid='true']]:ring-destructive/20 [&:not(:focus)[aria-invalid='true']]:border-destructive",
                "dark:[&:not(:focus)[aria-invalid='true']]:ring-destructive/40",
                className
            )}
            {...props}
        />
    );
}

export { Input };
