import { BrandMark } from "@/components/layout/brand-mark";
import { GlassPanel } from "@/components/layout/glass-panel";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Topbar() {
  return (
    <GlassPanel className="sticky top-3 z-10 p-3 sm:top-4 sm:p-4">
      <div className="flex w-full items-center justify-between gap-3 sm:gap-4">
        <div className="xl:hidden">
          <BrandMark />
        </div>

        <div className="flex w-full items-center gap-3">
          <ThemeToggle />

          <div className="ml-auto flex items-center gap-3 rounded-[1.2rem] border border-border/70 bg-card/80 px-3 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-[0.9rem] border border-primary/18 bg-primary/14 text-sm font-semibold text-primary shadow-[0_8px_18px_rgba(124,58,237,0.22)]">
              VF
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-foreground">VFit</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Training
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
