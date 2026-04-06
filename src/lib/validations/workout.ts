import { z } from "zod";

import { workoutWeekdays } from "@/lib/workouts/schedule";

export const workoutCategories = [
  "Treino A",
  "Treino B",
  "Treino C",
  "Superior",
  "Inferior",
  "Full Body",
  "Cardio",
  "Personalizado",
] as const;

export const workoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(60, "Use no maximo 60 caracteres no nome."),
  category: z.enum(workoutCategories, {
    message: "Selecione uma categoria valida.",
  }),
  description: z
    .string()
    .trim()
    .max(240, "Use no maximo 240 caracteres na descricao.")
    .optional()
    .or(z.literal("")),
  weekday: z
    .enum(workoutWeekdays)
    .optional()
    .nullable()
    .or(z.literal("")),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;
