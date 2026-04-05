"use client";

import { Flame, History, Trophy } from "lucide-react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { HistorySessionList } from "@/components/history/history-session-list";
import { GlassPanel } from "@/components/layout/glass-panel";
import { useTrainingHistory } from "@/hooks/use-training-history";

export function HistoryContent() {
  const { history, loading, error } = useTrainingHistory();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <DashboardEmptyState
        title="Não foi possível carregar o histórico"
        description={error}
        actionLabel="Tente novamente depois"
      />
    );
  }

  if (!history || history.sessions.length === 0) {
    return (
      <DashboardEmptyState
        title="Nenhuma sessão concluída ainda"
        description="Quando você concluir treinos, as sessões aparecerão aqui junto com sua sequência atual."
        actionLabel="Conclua um treino para gerar histórico"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel className="overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
          <div className="space-y-5">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
              Histórico
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Veja sua consistência por sessões concluídas.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                A streak agora é calculada a partir dos dias únicos com treino, e a lista abaixo mostra suas
                conclusões mais recentes.
              </p>
            </div>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/75">Última sessão</p>
            <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/12 to-accent/8 p-5">
              <p className="text-lg font-semibold text-foreground">
                {history.lastCompletedWorkout?.workoutName ?? "Nenhuma sessão"}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {history.lastCompletedWorkout?.completedAtLabel ?? "Sem conclusões registradas."}
              </p>
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Sessões concluídas"
          value={String(history.sessions.length)}
          description="Total listado no histórico recente"
          icon={History}
        />
        <SummaryCard
          title="Sequência atual"
          value={`${history.currentStreak} dia${history.currentStreak === 1 ? "" : "s"}`}
          description="Dias seguidos com treino concluído"
          icon={Flame}
        />
        <SummaryCard
          title="Último treino"
          value={history.lastCompletedWorkout?.workoutName ?? "Nenhum"}
          description={history.lastCompletedWorkout?.completedAtLabel ?? "Sem sessões ainda"}
          icon={Trophy}
        />
      </section>

      <HistorySessionList sessions={history.sessions} />
    </div>
  );
}
