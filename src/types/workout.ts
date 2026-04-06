export type WorkoutCategory =
  | "Treino A"
  | "Treino B"
  | "Treino C"
  | "Superior"
  | "Inferior"
  | "Full Body"
  | "Cardio"
  | "Personalizado";

export type WorkoutWeekday =
  | "Segunda"
  | "Terca"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sabado"
  | "Domingo";

export type Workout = {
  id: string;
  name: string;
  category: WorkoutCategory;
  description: string | null;
  weekday: WorkoutWeekday | null;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type WorkoutInput = {
  name: string;
  category: WorkoutCategory;
  description?: string;
  weekday?: WorkoutWeekday | null;
};
