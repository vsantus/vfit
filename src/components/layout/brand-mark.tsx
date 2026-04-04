import { Dumbbell } from "lucide-react";

export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-12 items-center justify-center rounded-[1.35rem] border border-primary/22 bg-primary/10 text-primary shadow-[0_10px_24px_rgba(108,145,120,0.14)]">
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
