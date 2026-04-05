import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-[1.2rem] border border-border/80 bg-card/86 px-4 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_8px_24px_rgba(124,58,237,0.05)] transition-all placeholder:text-muted-foreground focus-visible:border-primary/45 focus-visible:bg-background focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/16 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
