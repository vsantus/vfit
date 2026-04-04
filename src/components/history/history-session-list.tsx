import { CalendarDays, CheckCircle2 } from "lucide-react";

import { GlassPanel } from "@/components/layout/glass-panel";
import type { SessionHistoryItem } from "@/types/history";

type HistorySessionListProps = {
  sessions: SessionHistoryItem[];
};

export function HistorySessionList({ sessions }: HistorySessionListProps) {
  return (
    <GlassPanel className="p-6 sm:p-8">
      <div className="space-y-5">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
            Sessoes
          </p>
          <h2 className="text-2xl font-semibold text-foreground">Lista de conclusoes</h2>
        </div>

        <div className="space-y-3">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-3xl border border-white/8 bg-background/40 px-5 py-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <CheckCircle2 className="size-4" />
                    Sessao concluida
                  </div>
                  <p className="text-lg font-semibold text-foreground">{session.workoutName}</p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="size-4 text-primary" />
                  {session.completedAtLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GlassPanel>
  );
}
