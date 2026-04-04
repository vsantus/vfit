import Link from "next/link";
import { Plus } from "lucide-react";

import { WorkoutList } from "@/components/workouts/workout-list";
import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <GlassPanel className="overflow-hidden p-6 sm:p-8">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <div className="space-y-5">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
            Treinos
          </div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
                Organize seus treinos no Firestore
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Crie, edite, exclua e consulte os detalhes de cada treino em uma interface dark consistente.
              </p>
            </div>
            <Link
              href="/treinos/novo"
              className={cn(
                buttonVariants({
                  className:
                    "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
                }),
              )}
            >
              <Plus className="size-4" />
              Criar treino
            </Link>
          </div>
        </div>
      </GlassPanel>

      <WorkoutList />
    </div>
  );
}
