import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { getCompletedDayKey } from "@/lib/dates";
import { getFirestoreDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { WorkoutSessionInput } from "@/types/session";

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha o arquivo .env.local para registrar sessões.");
  }
}

async function create(userId: string, input: WorkoutSessionInput): Promise<string> {
  assertFirebaseConfigured();

  const completedAt = new Date();
  const sessionsRef = collection(getFirestoreDb(), "users", userId, "sessions");

  const snapshot = await addDoc(sessionsRef, {
    workoutId: input.workoutId,
    workoutName: input.workoutName,
    completedExerciseIds: input.completedExerciseIds,
    totalExercises: input.totalExercises,
    durationSeconds: input.durationSeconds ?? null,
    completedAt: serverTimestamp(),
    completedDay: getCompletedDayKey(completedAt),
  });

  return snapshot.id;
}

function getSessionErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível concluir o treino.";
}

export const sessionsService = {
  create,
  getSessionErrorMessage,
};
