import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";
import type { Workout } from "@/types/workout";

type WorkoutCardProps = {
  workout: Workout;
  onDelete: (workout: Workout) => void;
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

export function WorkoutCard({ workout, onDelete }: WorkoutCardProps) {
  return (
    <GlassPanel className="p-5">
      <div className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
              {workout.category}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{workout.name}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {workout.description ?? "Sem descrição. Use a tela de edição para adicionar contexto ao treino."}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>Atualizado em {formatDate(workout.updatedAt)}</span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/treinos/${workout.id}`}
            className={cn(
              buttonVariants({
                className:
                  "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
              }),
            )}
          >
            Ver detalhes
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
            onClick={() => onDelete(workout)}
            className={cn(
              buttonVariants({
                variant: "destructive",
                className: "h-11 rounded-2xl px-5",
              }),
            )}
          >
            <Trash2 className="size-4" />
            Excluir
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}
