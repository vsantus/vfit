import { Dumbbell } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-[1.35rem] border border-primary/30 bg-primary/12 text-primary shadow-[0_0_28px_rgba(104,255,182,0.22)]">
        <Dumbbell className="size-5.5" />
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary/90">VFit</p>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Performance training OS
        </p>
      </div>
    </div>
  );
}
