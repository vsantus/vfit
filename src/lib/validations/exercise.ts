import { z } from "zod";

export const exerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(80, "Use no maximo 80 caracteres no nome."),
  sets: z
    .string()
    .trim()
    .min(1, "Informe as series.")
    .max(20, "Use no maximo 20 caracteres nas series."),
  reps: z
    .string()
    .trim()
    .min(1, "Informe as repeticoes.")
    .max(20, "Use no maximo 20 caracteres nas repeticoes."),
  restSeconds: z.coerce
    .number()
    .int("Use apenas numeros inteiros no descanso.")
    .min(0, "O descanso nao pode ser negativo.")
    .max(900, "Use no maximo 900 segundos de descanso."),
  notes: z
    .string()
    .trim()
    .max(300, "Use no maximo 300 caracteres nas observacoes.")
    .optional()
    .or(z.literal("")),
});

export type ExerciseFormInput = z.input<typeof exerciseSchema>;
export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
