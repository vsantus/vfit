import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type GlassPanelProps = PropsWithChildren<{
  className?: string;
}>;

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <section
      className={cn(
        "surface-glow relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-card/82 backdrop-blur-2xl",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      {children}
    </section>
  );
}
