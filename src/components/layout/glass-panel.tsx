import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type GlassPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <section
      className={cn(
        "surface-glow relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/88 backdrop-blur-2xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
      <div className="pointer-events-none absolute -right-10 top-0 size-28 rounded-full bg-accent/8 blur-3xl" />
      {children}
    </section>
  );
}
