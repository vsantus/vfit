import { z } from "zod";

const importedExerciseFieldSchema = z
  .union([z.string(), z.number()])
  .nullable()
  .optional()
  .transform((value) => {
    if (value === null || value === undefined) {
      return null;
    }

    const normalized = String(value).trim();
    return normalized.length > 0 ? normalized : null;
  });

export const importedExerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Cada exercicio precisa de um nome com pelo menos 2 caracteres.")
    .max(80, "Use no maximo 80 caracteres no nome do exercicio."),
  sets: importedExerciseFieldSchema,
  reps: importedExerciseFieldSchema,
  restSeconds: z
    .union([z.number(), z.string()])
    .nullable()
    .optional()
    .transform((value, ctx) => {
      if (value === null || value === undefined || value === "") {
        return null;
      }

      const parsed = Number(value);

      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 900) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Use um descanso entre 0 e 900 segundos.",
        });
        return z.NEVER;
      }

      return Math.trunc(parsed);
    }),
  notes: z
    .string()
    .trim()
    .max(300, "Use no maximo 300 caracteres nas observacoes do exercicio.")
    .optional()
    .default(""),
});

export const importedWorkoutSchema = z.object({
  day: z
    .string()
    .trim()
    .min(2, "Informe o dia do treino.")
    .max(20, "Use no maximo 20 caracteres no dia."),
  category: z
    .string()
    .trim()
    .min(2, "Informe a categoria do treino.")
    .max(30, "Use no maximo 30 caracteres na categoria."),
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome com pelo menos 2 caracteres.")
    .max(60, "Use no maximo 60 caracteres no nome do treino."),
  variant: z
    .string()
    .trim()
    .max(60, "Use no maximo 60 caracteres na variacao.")
    .optional()
    .default(""),
  notes: z
    .string()
    .trim()
    .max(240, "Use no maximo 240 caracteres nas observacoes.")
    .optional()
    .default(""),
  optional: z.boolean().optional().default(false),
  exercises: z
    .array(importedExerciseSchema)
    .min(1, "Importe ao menos um exercicio.")
    .max(40, "Use no maximo 40 exercicios por treino."),
});

export const importedWorkoutPayloadSchema = z.union([
  importedWorkoutSchema,
  z.object({
    workouts: z
      .array(importedWorkoutSchema)
      .min(1, "Envie pelo menos um treino.")
      .max(12, "Use no maximo 12 treinos por importacao."),
  }),
]);

export type ImportedExercise = z.infer<typeof importedExerciseSchema>;
export type ImportedWorkout = z.infer<typeof importedWorkoutSchema>;
export type ImportedWorkoutPayload = z.infer<typeof importedWorkoutPayloadSchema>;
