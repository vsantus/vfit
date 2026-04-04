"use client";

import { CheckCircle2, Circle, Dumbbell, Flame, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/hooks/use-auth";
import { useExercises } from "@/hooks/use-exercises";
import { useWorkout } from "@/hooks/use-workout";
import { cn } from "@/lib/utils";
import { sessionsService } from "@/services/sessions.service";

type WorkoutExecutionProps = {
  workoutId: string;
};

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}m ${String(remainingSeconds).padStart(2, "0")}s`;
}

export function WorkoutExecution({ workoutId }: WorkoutExecutionProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { workout, loading: workoutLoading, error: workoutError } = useWorkout(workoutId);
  const { exercises, loading: exercisesLoading, error: exercisesError } = useExercises(workoutId);
  const [completedExerciseIds, setCompletedExerciseIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [startedAt] = useState(() => Date.now());

  const loading = workoutLoading || exercisesLoading;
  const error = workoutError ?? exercisesError;
  const totalExercises = exercises.length;
  const completedCount = completedExerciseIds.length;
  const progress = totalExercises > 0 ? Math.round((completedCount / totalExercises) * 100) : 0;
  const allCompleted = totalExercises > 0 && completedCount === totalExercises;

  const orderedExercises = useMemo(
    () => [...exercises].sort((left, right) => left.order - right.order),
    [exercises],
  );

  function toggleExercise(exerciseId: string) {
    setFeedback(null);
    setCompletedExerciseIds((current) =>
      current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : [...current, exerciseId],
    );
  }

  function handleFinishWorkout() {
    if (!user || !workout || !allCompleted) {
      return;
    }

    setFeedback(null);

    startTransition(async () => {
      try {
        const durationSeconds = Math.max(0, Math.round((Date.now() - startedAt) / 1000));

        await sessionsService.create(user.uid, {
          workoutId: workout.id,
          workoutName: workout.name,
          completedExerciseIds,
          totalExercises,
          durationSeconds,
        });

        setFeedback(`Treino concluído com sucesso em ${formatDuration(durationSeconds)}.`);
        router.refresh();
      } catch (error) {
        setFeedback(sessionsService.getSessionErrorMessage(error));
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
        description={error ?? "Não foi possível carregar este treino para execução."}
        actionLabel="Voltar para treinos"
        actionHref="/treinos"
      />
    );
  }

  if (orderedExercises.length === 0) {
    return (
      <DashboardEmptyState
        title="Este treino ainda não tem exercícios"
        description="Adicione exercícios antes de iniciar a execução do treino."
        actionLabel="Voltar para detalhes do treino"
        actionHref={`/treinos/${workout.id}`}
      />
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <div className="space-y-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                <PlayCircle className="size-3.5" />
                Execucao
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  {workout.name}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                  Marque cada exercício ao concluir para registrar a sessão no histórico.
                </p>
              </div>
            </div>

            <Link
              href={`/treinos/${workout.id}`}
              className={cn(
                buttonVariants({
                  variant: "outline",
                  className:
                    "h-11 rounded-2xl border-border/70 bg-secondary/55 px-5 text-foreground hover:bg-secondary",
                }),
              )}
            >
              Voltar ao treino
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/8 bg-background/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Progresso
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">{progress}%</p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-background/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Exercícios concluídos
              </p>
              <p className="mt-2 text-3xl font-semibold text-foreground">
                {completedCount}/{totalExercises}
              </p>
            </div>
            <div className="rounded-3xl border border-white/8 bg-background/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Categoria
              </p>
              <p className="mt-2 text-2xl font-semibold text-foreground">{workout.category}</p>
            </div>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-secondary/80">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary to-primary/70 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </GlassPanel>

      <GlassPanel className={cn("p-6 sm:p-8", allCompleted && "border-primary/30 bg-primary/8")}>
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-[1.1rem] border border-primary/24 bg-primary/12 text-primary shadow-[0_0_22px_rgba(104,255,182,0.12)]">
              {allCompleted ? <Flame className="size-5" /> : <Dumbbell className="size-5" />}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {allCompleted ? "Tudo pronto para finalizar" : "Checklist do treino"}
              </h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {allCompleted
                  ? "Todos os exercícios foram marcados. Finalize para registrar a sessão."
                  : "Marque os exercícios conforme for concluindo."}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {orderedExercises.map((exercise) => {
              const checked = completedExerciseIds.includes(exercise.id);

              return (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => toggleExercise(exercise.id)}
                  className={cn(
                    "flex w-full items-start gap-4 rounded-3xl border px-4 py-4 text-left transition-all",
                    checked
                      ? "border-primary/25 bg-primary/10 shadow-[0_12px_30px_rgba(104,255,182,0.08)]"
                      : "border-white/8 bg-background/40 hover:border-primary/12 hover:bg-background/55",
                  )}
                >
                  <div className="pt-0.5 text-primary">
                    {checked ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-foreground">{exercise.name}</p>
                      <span className="rounded-full border border-white/8 bg-card/70 px-2 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                        #{exercise.order + 1}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} series · {exercise.reps} reps · descanso {exercise.restSeconds}s
                    </p>
                    {exercise.notes ? (
                      <p className="text-sm leading-6 text-muted-foreground/95">{exercise.notes}</p>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>

          {feedback ? (
            <div
              className={cn(
                "rounded-2xl px-4 py-3 text-sm",
                allCompleted
                  ? "border border-primary/25 bg-primary/10 text-primary"
                  : "border border-destructive/25 bg-destructive/10 text-destructive",
              )}
            >
              {feedback}
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleFinishWorkout}
            disabled={!allCompleted || isPending}
            className={cn(
              buttonVariants({
                className:
                  "h-12 w-full rounded-2xl bg-primary px-5 text-base text-primary-foreground hover:bg-primary/90",
              }),
            )}
          >
            {isPending ? "Finalizando treino..." : allCompleted ? "Concluir treino" : "Complete todos os exercícios"}
          </button>
        </div>
      </GlassPanel>
    </div>
  );
}
