"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import { FormField } from "@/components/auth/form-field";
import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { SelectField } from "@/components/workouts/workout-select-field";
import { useAuth } from "@/hooks/use-auth";
import { workoutWeekdays } from "@/lib/workouts/schedule";
import { workoutCategories, workoutSchema, type WorkoutFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { workoutsService } from "@/services/workouts.service";
import type { Workout } from "@/types/workout";

type WorkoutFormProps = {
  mode: "create" | "edit";
  workout?: Workout | null;
};

export function WorkoutForm({ mode, workout }: WorkoutFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      name: workout?.name ?? "",
      category: workout?.category ?? "Treino A",
      description: workout?.description ?? "",
      weekday: workout?.weekday ?? "",
    },
  });

  function onSubmit(values: WorkoutFormValues) {
    if (!user) {
      setSubmitError("Usuario nao autenticado.");
      return;
    }

    setSubmitError(null);

    startTransition(async () => {
      try {
        if (mode === "create") {
          const workoutId = await workoutsService.create(user.uid, {
            ...values,
            weekday: values.weekday || null,
          });
          router.replace(`/treinos/${workoutId}`);
          return;
        }

        if (!workout) {
          throw new Error("Treino não encontrado para edição.");
        }

        await workoutsService.update(user.uid, workout.id, {
          ...values,
          weekday: values.weekday || null,
        });
        router.replace(`/treinos/${workout.id}`);
      } catch (error) {
        setSubmitError(workoutsService.getWorkoutErrorMessage(error));
      }
    });
  }

  return (
    <GlassPanel className="p-6 sm:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
            {mode === "create" ? "Novo treino" : "Editar treino"}
          </p>
          <h1 className="text-2xl font-semibold text-foreground">
            {mode === "create" ? "Crie um treino" : "Atualize os dados do treino"}
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Defina nome, categoria e uma descricao opcional para organizar sua rotina.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Nome"
            placeholder="Ex: Treino A - Peito e Triceps"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />

          <SelectField
            label="Categoria"
            error={form.formState.errors.category?.message}
            options={workoutCategories}
            value={form.watch("category")}
            onChange={(value) =>
              form.setValue("category", value as WorkoutFormValues["category"], { shouldValidate: true })
            }
          />

          <SelectField
            label="Dia da semana"
            error={form.formState.errors.weekday?.message}
            options={workoutWeekdays}
            placeholder="Sem dia definido"
            value={form.watch("weekday") ?? ""}
            onChange={(value) =>
              form.setValue("weekday", value as WorkoutFormValues["weekday"], { shouldValidate: true })
            }
          />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Descricao</span>
            <textarea
              rows={5}
              placeholder="Observações, objetivo do treino ou divisão muscular."
              className="flex w-full rounded-2xl border border-border/80 bg-background/80 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition-colors placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/12"
              {...form.register("description")}
            />
            {form.formState.errors.description?.message ? (
              <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
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
                "Criar treino"
              ) : (
                "Salvar alteracoes"
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
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
          </div>
        </form>
      </div>
    </GlassPanel>
  );
}
