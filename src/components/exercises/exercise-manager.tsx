"use client";

import { Dumbbell, Plus } from "lucide-react";
import { useState, useTransition } from "react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { ExerciseCard } from "@/components/exercises/exercise-card";
import { ExerciseForm } from "@/components/exercises/exercise-form";
import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/hooks/use-auth";
import { useExercises } from "@/hooks/use-exercises";
import { cn } from "@/lib/utils";
import { exercisesService } from "@/services/exercises.service";
import type { Exercise } from "@/types/exercise";

type ExerciseManagerProps = {
  workoutId: string;
};

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, movedItem);
  return nextItems;
}

export function ExerciseManager({ workoutId }: ExerciseManagerProps) {
  const { user } = useAuth();
  const { exercises, loading, error, refresh } = useExercises(workoutId);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(exercise: Exercise) {
    if (!user) {
      setActionError("Usuario nao autenticado.");
      return;
    }

    const confirmed = window.confirm(`Excluir o exercício "${exercise.name}"?`);
    if (!confirmed) {
      return;
    }

    setActionError(null);

    startTransition(async () => {
      try {
        await exercisesService.remove(user.uid, workoutId, exercise.id);
        if (editingExercise?.id === exercise.id) {
          setEditingExercise(null);
        }
        await refresh();
      } catch (removeError) {
        setActionError(exercisesService.getExerciseErrorMessage(removeError));
      }
    });
  }

  function handleReorder(exercise: Exercise, direction: "up" | "down") {
    if (!user) {
      setActionError("Usuario nao autenticado.");
      return;
    }

    const currentIndex = exercises.findIndex((item) => item.id === exercise.id);
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= exercises.length) {
      return;
    }

    const orderedIds = moveItem(
      exercises.map((item) => item.id),
      currentIndex,
      targetIndex,
    );

    setActionError(null);

    startTransition(async () => {
      try {
        await exercisesService.reorder(user.uid, workoutId, orderedIds);
        await refresh();
      } catch (reorderError) {
        setActionError(exercisesService.getExerciseErrorMessage(reorderError));
      }
    });
  }

  if (loading) {
    return <DashboardLoading />;
  }

  return (
    <GlassPanel className="p-6 sm:p-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
              Exercicios
            </p>
            <h2 className="text-2xl font-semibold text-foreground">Estruture cada treino</h2>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
              Adicione exercícios, edite os dados, remova itens e ajuste a ordem da execução.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingExercise(null);
              setShowCreateForm((value) => !value);
            }}
            className={cn(
              buttonVariants({
                className:
                  "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
              }),
            )}
          >
            <Plus className="size-4" />
            {showCreateForm ? "Fechar formulário" : "Adicionar exercício"}
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {actionError ? (
          <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {actionError}
          </div>
        ) : null}

        {isPending ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            Atualizando exercícios...
          </div>
        ) : null}

        {showCreateForm ? (
          <div className="rounded-3xl border border-white/8 bg-background/35 p-5">
            <ExerciseForm
              workoutId={workoutId}
              mode="create"
              onSuccess={async () => {
                setShowCreateForm(false);
                await refresh();
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        ) : null}

        {editingExercise ? (
          <div className="rounded-3xl border border-primary/20 bg-primary/8 p-5">
            <ExerciseForm
              workoutId={workoutId}
              mode="edit"
              exercise={editingExercise}
              onSuccess={async () => {
                setEditingExercise(null);
                await refresh();
              }}
              onCancel={() => setEditingExercise(null)}
            />
          </div>
        ) : null}

        {exercises.length === 0 ? (
          <DashboardEmptyState
            title="Nenhum exercício cadastrado"
            description="Adicione o primeiro exercício deste treino para definir ordem, séries, repetições e descanso."
            actionLabel="Use o botao acima para adicionar"
          />
        ) : (
          <div className="space-y-4">
            {exercises.map((exercise, index) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isFirst={index === 0}
                isLast={index === exercises.length - 1}
                onEdit={(selectedExercise) => {
                  setShowCreateForm(false);
                  setEditingExercise(selectedExercise);
                }}
                onDelete={handleDelete}
                onMoveUp={(selectedExercise) => handleReorder(selectedExercise, "up")}
                onMoveDown={(selectedExercise) => handleReorder(selectedExercise, "down")}
              />
            ))}
          </div>
        )}

        {!showCreateForm && !editingExercise && exercises.length > 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-background/30 px-4 py-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <Dumbbell className="size-4 text-primary" />
              Reordenacao ativa:
            </span>{" "}
            use os botões de subir e descer para ajustar a sequência dos exercícios.
          </div>
        ) : null}
      </div>
    </GlassPanel>
  );
}
