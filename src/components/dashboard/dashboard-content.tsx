"use client";

import { CalendarDays, Dumbbell, Flame, Plus, Trophy } from "lucide-react";
import Link from "next/link";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { useDashboardSummary } from "@/hooks/use-dashboard-summary";
import { cn } from "@/lib/utils";

const summaryIcons = {
  totalWorkouts: Dumbbell,
  lastCompletedWorkout: Trophy,
  currentStreak: Flame,
};

export function DashboardContent() {
  const { summary, loading, error } = useDashboardSummary();

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <DashboardEmptyState
        title="Não foi possível carregar o dashboard"
        description={error}
        actionLabel="Tente novamente depois"
      />
    );
  }

  if (!summary || summary.totalWorkouts === 0) {
    return (
      <DashboardEmptyState
        title="Seu dashboard ainda está vazio"
        description="Crie o primeiro treino para começar a montar sua rotina e liberar o histórico de sessões."
        actionLabel="Criar primeiro treino"
        actionHref="/treinos/novo"
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
              Dashboard
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Sua visão geral de treino já está ativa.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Acompanhe volume de treinos cadastrados, último treino concluído e constância da sua sequência atual.
              </p>
            </div>
            <Link
              href="/treinos/novo"
              className={cn(
                buttonVariants({ className: "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90" }),
              )}
            >
              <Plus className="size-4" />
              Criar treino
            </Link>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-8">
          <div className="space-y-4">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/75">Última conclusão</p>
            <div className="rounded-3xl border border-primary/20 bg-primary/10 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    {summary.lastCompletedWorkout?.workoutName ?? "Nenhum treino concluído"}
                  </p>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {summary.lastCompletedWorkout
                      ? `Concluído em ${summary.lastCompletedWorkout.completedAtLabel}`
                      : "Finalize um treino para visualizar sua sessão mais recente."}
                  </p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-background/70 text-primary">
                  <CalendarDays className="size-5" />
                </div>
              </div>
            </div>
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          title="Total de treinos"
          value={String(summary.totalWorkouts)}
          description="Treinos cadastrados na sua conta"
          icon={summaryIcons.totalWorkouts}
        />
        <SummaryCard
          title="Último treino concluído"
          value={summary.lastCompletedWorkout?.workoutName ?? "Nenhum"}
          description={summary.lastCompletedWorkout?.completedAtLabel ?? "Ainda não há sessão concluída"}
          icon={summaryIcons.lastCompletedWorkout}
        />
        <SummaryCard
          title="Sequência atual"
          value={`${summary.currentStreak} dia${summary.currentStreak === 1 ? "" : "s"}`}
          description="Dias seguidos com treino concluído"
          icon={summaryIcons.currentStreak}
        />
      </section>
    </div>
  );
}
