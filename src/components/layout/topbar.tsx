import { Bell, Search } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { GlassPanel } from "@/components/layout/glass-panel";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Topbar() {
  return (
    <GlassPanel className="sticky top-3 z-10 p-3 sm:top-4 sm:p-4">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        <div className="xl:hidden">
          <BrandMark />
        </div>

        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-[1.2rem] border border-white/8 bg-background/75 px-4 py-3 md:flex">
          <Search className="size-4 text-muted-foreground" />
          <span className="truncate text-sm text-muted-foreground">
            Estrutura ativa: acompanhe treinos, sessões e consistência com uma interface mobile-first.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-[1.2rem] border border-white/8 bg-background/70 text-muted-foreground transition-all hover:border-primary/18 hover:bg-primary/8 hover:text-foreground"
            aria-label="Notificações"
          >
            <Bell className="size-4" />
          </button>
          <div className="flex items-center gap-3 rounded-[1.2rem] border border-white/8 bg-background/72 px-3 py-2.5">
            <div className="flex size-9 items-center justify-center rounded-[0.9rem] border border-primary/16 bg-primary/12 text-sm font-semibold text-primary shadow-[0_8px_18px_rgba(108,145,120,0.14)]">
              VF
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-foreground">VFit</p>
              <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Training mode
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
