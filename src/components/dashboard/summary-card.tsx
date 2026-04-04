import type { LucideIcon } from "lucide-react";

import { GlassPanel } from "@/components/layout/glass-panel";

type SummaryCardProps = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

export function SummaryCard({ title, value, description, icon: Icon }: SummaryCardProps) {
  return (
    <GlassPanel className="p-5 sm:p-6">
      <div className="space-y-4">
        <div className="flex size-12 items-center justify-center rounded-[1.1rem] border border-primary/24 bg-primary/12 text-primary shadow-[0_0_22px_rgba(104,255,182,0.12)]">
          <Icon className="size-5" />
        </div>
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </p>
          <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          <p className="text-sm leading-6 text-muted-foreground/95">{description}</p>
        </div>
      </div>
    </GlassPanel>
  );
}
