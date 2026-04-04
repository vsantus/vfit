"use client";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { WorkoutForm } from "@/components/workouts/workout-form";
import { useWorkout } from "@/hooks/use-workout";

type WorkoutEditScreenProps = {
  workoutId: string;
};

export function WorkoutEditScreen({ workoutId }: WorkoutEditScreenProps) {
  const { workout, loading, error } = useWorkout(workoutId);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error || !workout) {
    return (
      <DashboardEmptyState
        title="Treino nao encontrado"
        description={error ?? "Não foi possível carregar este treino para edição."}
        actionLabel="Voltar para treinos"
        actionHref="/treinos"
      />
    );
  }

  return <WorkoutForm mode="edit" workout={workout} />;
}
