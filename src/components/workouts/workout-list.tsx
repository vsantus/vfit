"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { WorkoutCard } from "@/components/workouts/workout-card";
import { useAuth } from "@/hooks/use-auth";
import { useWorkouts } from "@/hooks/use-workouts";
import { workoutsService } from "@/services/workouts.service";
import type { Workout } from "@/types/workout";

export function WorkoutList() {
  const router = useRouter();
  const { user } = useAuth();
  const { workouts, loading, error, refresh } = useWorkouts();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(workout: Workout) {
    if (!user) {
      setDeleteError("Usuario nao autenticado.");
      return;
    }

    const confirmed = window.confirm(`Excluir o treino "${workout.name}"? Esta acao nao pode ser desfeita.`);
    if (!confirmed) {
      return;
    }

    setDeleteError(null);

    startTransition(async () => {
      try {
        await workoutsService.remove(user.uid, workout.id);
        await refresh();
        router.refresh();
      } catch (error) {
        setDeleteError(workoutsService.getWorkoutErrorMessage(error));
      }
    });
  }

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <DashboardEmptyState
        title="Não foi possível carregar seus treinos"
        description={error}
        actionLabel="Tente novamente depois"
      />
    );
  }

  if (workouts.length === 0) {
    return (
      <DashboardEmptyState
        title="Nenhum treino cadastrado"
        description="Crie o primeiro treino para organizar sua rotina e liberar os proximos fluxos do app."
        actionLabel="Criar treino"
        actionHref="/treinos/novo"
      />
    );
  }

  return (
    <div className="space-y-4">
      {deleteError ? (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {deleteError}
        </div>
      ) : null}
      {isPending ? (
        <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          Excluindo treino...
        </div>
      ) : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
