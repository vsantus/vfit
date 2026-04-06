"use client";

import { CalendarDays, Pencil, PlayCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { ExerciseManager } from "@/components/exercises/exercise-manager";
import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/hooks/use-auth";
import { useWorkout } from "@/hooks/use-workout";
import { cn } from "@/lib/utils";
import { workoutsService } from "@/services/workouts.service";

type WorkoutDetailProps = {
  workoutId: string;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "Data indisponivel";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function WorkoutDetail({ workoutId }: WorkoutDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { workout, loading, error } = useWorkout(workoutId);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!user || !workout) {
      return;
    }

    const confirmed = window.confirm(`Excluir o treino "${workout.name}"?`);
    if (!confirmed) {
      return;
    }

    setDeleteError(null);

    startTransition(async () => {
      try {
        await workoutsService.remove(user.uid, workout.id);
        router.replace("/treinos");
        router.refresh();
      } catch (removeError) {
        setDeleteError(workoutsService.getWorkoutErrorMessage(removeError));
      }
    });
  }

  if (loading) {
    return <DashboardLoading />;
  }

  if (error || !workout) {
    return (
      <DashboardEmptyState
        title="Treino nao encontrado"
        description={error ?? "Não foi possível localizar este treino."}
        actionLabel="Voltar para treinos"
        actionHref="/treinos"
      />
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6 sm:p-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
                  {workout.category}
                </div>
                {workout.weekday ? (
                  <div className="inline-flex rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {workout.weekday}
                  </div>
                ) : null}
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-foreground">{workout.name}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
                  {workout.description ?? "Este treino ainda nao possui descricao."}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/treinos/${workout.id}/executar`}
                className={cn(
                  buttonVariants({
                    className:
                      "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
                  }),
                )}
              >
                <PlayCircle className="size-4" />
                Executar treino
              </Link>
              <Link
                href={`/treinos/${workout.id}/editar`}
                className={cn(
                  buttonVariants({
                    variant: "outline",
                    className:
                      "h-11 rounded-2xl border-border/70 bg-secondary/55 px-5 text-foreground hover:bg-secondary",
                  }),
                )}
              >
                <Pencil className="size-4" />
                Editar
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className={cn(
                  buttonVariants({
                    variant: "destructive",
                    className: "h-11 rounded-2xl px-5",
                  }),
                )}
              >
                <Trash2 className="size-4" />
                {isPending ? "Excluindo" : "Excluir"}
              </button>
            </div>
          </div>

          {deleteError ? (
            <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {deleteError}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-border/70 bg-card/72 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Criado em</p>
                  <p className="text-sm text-muted-foreground">{formatDate(workout.createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border/70 bg-card/72 p-5">
              <div className="flex items-center gap-3">
                <CalendarDays className="size-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Atualizado em</p>
                  <p className="text-sm text-muted-foreground">{formatDate(workout.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>

      <ExerciseManager workoutId={workout.id} />
    </div>
  );
}
