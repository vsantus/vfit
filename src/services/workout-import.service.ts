import { z } from "zod";

import { normalizeWorkoutWeekday } from "@/lib/workouts/schedule";
import { importedWorkoutPayloadSchema, type ImportedWorkout } from "@/lib/validations/workout-import";
import { exercisesService } from "@/services/exercises.service";
import { workoutsService } from "@/services/workouts.service";
import type { ExerciseInput } from "@/types/exercise";
import type { WorkoutCategory, WorkoutInput } from "@/types/workout";

const emptyValueLabel = "A definir";

function normalizeCategory(category: string): WorkoutCategory {
  const normalized = category
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim()
    .toLowerCase();

  if (["treino a", "a"].includes(normalized)) {
    return "Treino A";
  }

  if (["treino b", "b"].includes(normalized)) {
    return "Treino B";
  }

  if (["treino c", "c"].includes(normalized)) {
    return "Treino C";
  }

  if (["upper", "superior", "upper body", "parte superior"].includes(normalized)) {
    return "Superior";
  }

  if (["lower", "inferior", "lower body", "parte inferior"].includes(normalized)) {
    return "Inferior";
  }

  if (["full body", "fullbody", "full_body", "corpo inteiro"].includes(normalized)) {
    return "Full Body";
  }

  if (["cardio", "aerobico", "aerobio"].includes(normalized)) {
    return "Cardio";
  }

  return "Personalizado";
}

function buildDescription(workout: ImportedWorkout) {
  const details = [
    `Dia: ${workout.day}`,
    workout.variant ? `Variacao: ${workout.variant}` : null,
    workout.optional ? "Treino opcional: sim" : null,
    workout.notes ? workout.notes : null,
  ].filter((value): value is string => Boolean(value));

  return details.join(" | ");
}

function toWorkoutInput(workout: ImportedWorkout): WorkoutInput {
  return {
    name: workout.name,
    category: normalizeCategory(workout.category),
    description: buildDescription(workout),
    weekday: normalizeWorkoutWeekday(workout.day),
  };
}

function toExerciseInput(exercise: ImportedWorkout["exercises"][number]): ExerciseInput {
  return {
    name: exercise.name,
    sets: exercise.sets ?? emptyValueLabel,
    reps: exercise.reps ?? emptyValueLabel,
    restSeconds: exercise.restSeconds ?? 0,
    notes: exercise.notes,
  };
}

function parsePayload(payload: unknown) {
  const parsed = importedWorkoutPayloadSchema.parse(payload);

  return "workouts" in parsed ? parsed.workouts : [parsed];
}

async function importWorkouts(userId: string, payload: unknown) {
  const workouts = parsePayload(payload);
  const createdWorkoutIds: string[] = [];

  for (const workout of workouts) {
    const workoutId = await workoutsService.create(userId, toWorkoutInput(workout));

    for (const exercise of workout.exercises) {
      await exercisesService.create(userId, workoutId, toExerciseInput(exercise));
    }

    createdWorkoutIds.push(workoutId);
  }

  return {
    createdWorkoutIds,
    importedCount: createdWorkoutIds.length,
  };
}

function getImportErrorMessage(error: unknown) {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Nao foi possivel validar o JSON importado.";
  }

  if (error instanceof SyntaxError) {
    return "Nao foi possivel ler o JSON. Verifique a sintaxe do arquivo.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Nao foi possivel importar o treino agora.";
}

export const workoutImportService = {
  importWorkouts,
  getImportErrorMessage,
};
