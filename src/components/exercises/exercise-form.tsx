"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { buttonVariants } from "@/components/ui/button-variants";
import { useAuth } from "@/hooks/use-auth";
import {
  exerciseSchema,
  type ExerciseFormInput,
  type ExerciseFormValues,
} from "@/lib/validations";
import { cn } from "@/lib/utils";
import { exercisesService } from "@/services/exercises.service";
import type { Exercise } from "@/types/exercise";

type ExerciseFormProps = {
  workoutId: string;
  mode: "create" | "edit";
  exercise?: Exercise | null;
  onSuccess: () => Promise<void> | void;
  onCancel?: () => void;
};

export function ExerciseForm({
  workoutId,
  mode,
  exercise,
  onSuccess,
  onCancel,
}: ExerciseFormProps) {
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ExerciseFormInput, unknown, ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      name: exercise?.name ?? "",
      sets: exercise?.sets ?? "",
      reps: exercise?.reps ?? "",
      restSeconds: String(exercise?.restSeconds ?? 60),
      notes: exercise?.notes ?? "",
    },
  });

  function onSubmit(values: ExerciseFormValues) {
    if (!user) {
      setSubmitError("Usuario nao autenticado.");
      return;
    }

    setSubmitError(null);

    startTransition(async () => {
      try {
        if (mode === "create") {
          await exercisesService.create(user.uid, workoutId, values);
        } else {
          if (!exercise) {
            throw new Error("Exercício não encontrado para edição.");
          }
          await exercisesService.update(user.uid, workoutId, exercise.id, values);
        }

        form.reset({
          name: "",
          sets: "",
          reps: "",
          restSeconds: "60",
          notes: "",
        });
        await onSuccess();
      } catch (error) {
        setSubmitError(exercisesService.getExerciseErrorMessage(error));
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Nome"
          placeholder="Ex: Supino reto com barra"
          error={form.formState.errors.name?.message}
          {...form.register("name")}
        />
        <FormField
          label="Descanso (segundos)"
          type="number"
          min={0}
          error={form.formState.errors.restSeconds?.message}
          {...form.register("restSeconds")}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          label="Series"
          placeholder="Ex: 4"
          error={form.formState.errors.sets?.message}
          {...form.register("sets")}
        />
        <FormField
          label="Repeticoes"
          placeholder="Ex: 10-12"
          error={form.formState.errors.reps?.message}
          {...form.register("reps")}
        />
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-foreground">Observacoes</span>
        <textarea
          rows={4}
          placeholder="Técnica, foco muscular ou observações do exercício."
          className="flex w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12"
          {...form.register("notes")}
        />
        {form.formState.errors.notes?.message ? (
          <p className="text-sm text-destructive">{form.formState.errors.notes.message}</p>
        ) : null}
      </label>

      {submitError ? (
        <div className="rounded-2xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {submitError}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            buttonVariants({
              className:
                "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
            }),
          )}
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Salvando
            </>
          ) : mode === "create" ? (
            "Adicionar exercício"
          ) : (
            "Salvar exercício"
          )}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              buttonVariants({
                variant: "outline",
                className:
                  "h-11 rounded-2xl border-border/70 bg-secondary/55 px-5 text-foreground hover:bg-secondary",
              }),
            )}
          >
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
