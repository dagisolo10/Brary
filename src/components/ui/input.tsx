import { cn } from "@/lib/utils";
import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <InputPrimitive
            type={type}
            data-slot="input"
            className={cn(
                "border-input file:text-foreground placeholder:text-muted-foreground",
                "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30",
                "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
                "h-9 w-full min-w-0 rounded-md border bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] duration-500",
                "focus-visible:ring-primary outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-1 md:text-xs",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
