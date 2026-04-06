import type { Workout, WorkoutWeekday } from "@/types/workout";

export const workoutWeekdays = [
  "Segunda",
  "Terca",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sabado",
  "Domingo",
] as const satisfies readonly WorkoutWeekday[];

const weekdayOrderMap: Record<WorkoutWeekday, number> = {
  Segunda: 0,
  Terca: 1,
  Quarta: 2,
  Quinta: 3,
  Sexta: 4,
  Sabado: 5,
  Domingo: 6,
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

export function normalizeWorkoutWeekday(value: string | null | undefined): WorkoutWeekday | null {
  if (!value) {
    return null;
  }

  const normalized = normalizeText(value);

  if (normalized.startsWith("segunda")) {
    return "Segunda";
  }

  if (normalized.startsWith("terca")) {
    return "Terca";
  }

  if (normalized.startsWith("quarta")) {
    return "Quarta";
  }

  if (normalized.startsWith("quinta")) {
    return "Quinta";
  }

  if (normalized.startsWith("sexta")) {
    return "Sexta";
  }

  if (normalized.startsWith("sabado")) {
    return "Sabado";
  }

  if (normalized.startsWith("domingo")) {
    return "Domingo";
  }

  return null;
}

export function extractWorkoutWeekday(description: string | null | undefined) {
  if (!description) {
    return null;
  }

  const match = description.match(/dia:\s*([^\n\r]+)/i);
  return normalizeWorkoutWeekday(match?.[1]);
}

function getWorkoutWeekdayOrder(weekday: WorkoutWeekday | null | undefined) {
  if (!weekday) {
    return Number.MAX_SAFE_INTEGER;
  }

  return weekdayOrderMap[weekday];
}

export function compareWorkoutsBySchedule(left: Workout, right: Workout) {
  const weekdayDifference = getWorkoutWeekdayOrder(left.weekday) - getWorkoutWeekdayOrder(right.weekday);

  if (weekdayDifference !== 0) {
    return weekdayDifference;
  }

  const rightUpdatedAt = right.updatedAt?.getTime() ?? 0;
  const leftUpdatedAt = left.updatedAt?.getTime() ?? 0;

  if (rightUpdatedAt !== leftUpdatedAt) {
    return rightUpdatedAt - leftUpdatedAt;
  }

  return left.name.localeCompare(right.name, "pt-BR");
}
