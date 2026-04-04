import { ArrowDown, ArrowUp, Pencil, TimerReset, Trash2 } from "lucide-react";

import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/types/exercise";

type ExerciseCardProps = {
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
  onEdit: (exercise: Exercise) => void;
  onDelete: (exercise: Exercise) => void;
  onMoveUp: (exercise: Exercise) => void;
  onMoveDown: (exercise: Exercise) => void;
};

export function ExerciseCard({
  exercise,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: ExerciseCardProps) {
  return (
    <div className="rounded-3xl border border-white/8 bg-background/40 p-5">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
              #{exercise.order + 1}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{exercise.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {exercise.sets} series · {exercise.reps} reps
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onMoveUp(exercise)}
              disabled={isFirst}
              className={cn(buttonVariants({ variant: "outline", className: "h-10 rounded-2xl px-4" }))}
            >
              <ArrowUp className="size-4" />
              Subir
            </button>
            <button
              type="button"
              onClick={() => onMoveDown(exercise)}
              disabled={isLast}
              className={cn(buttonVariants({ variant: "outline", className: "h-10 rounded-2xl px-4" }))}
            >
              <ArrowDown className="size-4" />
              Descer
            </button>
            <button
              type="button"
              onClick={() => onEdit(exercise)}
              className={cn(buttonVariants({ variant: "outline", className: "h-10 rounded-2xl px-4" }))}
            >
              <Pencil className="size-4" />
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(exercise)}
              className={cn(buttonVariants({ variant: "destructive", className: "h-10 rounded-2xl px-4" }))}
            >
              <Trash2 className="size-4" />
              Excluir
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Series:</span> {exercise.sets}
          </div>
          <div className="rounded-2xl border border-white/8 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Reps:</span> {exercise.reps}
          </div>
          <div className="rounded-2xl border border-white/8 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2 font-medium text-foreground">
              <TimerReset className="size-4 text-primary" />
              Descanso:
            </span>{" "}
            {exercise.restSeconds}s
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-2xl border border-white/8 bg-card/60 px-4 py-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Observacoes:</span>{" "}
            {exercise.notes ?? "Sem observações para este exercício."}
          </div>
        </div>
      </div>
    </div>
  );
}
