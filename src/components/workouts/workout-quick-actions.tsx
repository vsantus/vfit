"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { WorkoutImportModal } from "@/components/workouts/workout-import-modal";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type WorkoutQuickActionsProps = {
  createHref?: string;
};

export function WorkoutQuickActions({ createHref = "/treinos/novo" }: WorkoutQuickActionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Link
        href={createHref}
        className={cn(
          buttonVariants({
            className: "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90",
          }),
        )}
      >
        <Plus className="size-4" />
        Criar treino
      </Link>
      <WorkoutImportModal />
    </div>
  );
}
