import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { Exercise, ExerciseInput } from "@/types/exercise";

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha o arquivo .env.local para usar os exercícios.");
  }
}

function exercisesCollection(userId: string, workoutId: string) {
  return collection(getFirestoreDb(), "users", userId, "workouts", workoutId, "exercises");
}

function exerciseDocument(userId: string, workoutId: string, exerciseId: string) {
  return doc(getFirestoreDb(), "users", userId, "workouts", workoutId, "exercises", exerciseId);
}

function workoutDocument(userId: string, workoutId: string) {
  return doc(getFirestoreDb(), "users", userId, "workouts", workoutId);
}

function getTimestampDate(value: unknown) {
  return value && typeof value === "object" && "toDate" in value
    ? (value as { toDate: () => Date }).toDate()
    : null;
}

function mapExercise(exerciseId: string, data: Record<string, unknown>): Exercise {
  return {
    id: exerciseId,
    name: String(data.name ?? ""),
    sets: String(data.sets ?? ""),
    reps: String(data.reps ?? ""),
    restSeconds: Number(data.restSeconds ?? 0),
    notes: typeof data.notes === "string" && data.notes.length > 0 ? data.notes : null,
    order: Number(data.order ?? 0),
    workoutId: String(data.workoutId ?? ""),
    userId: String(data.userId ?? ""),
    createdAt: getTimestampDate(data.createdAt),
    updatedAt: getTimestampDate(data.updatedAt),
  };
}

async function touchWorkout(userId: string, workoutId: string) {
  await updateDoc(workoutDocument(userId, workoutId), {
    updatedAt: serverTimestamp(),
  });
}

async function list(userId: string, workoutId: string): Promise<Exercise[]> {
  assertFirebaseConfigured();

  const snapshot = await getDocs(
    query(exercisesCollection(userId, workoutId), orderBy("order", "asc"), orderBy("createdAt", "asc")),
  );

  return snapshot.docs.map((item) => mapExercise(item.id, item.data()));
}

async function create(userId: string, workoutId: string, input: ExerciseInput): Promise<string> {
  assertFirebaseConfigured();

  const existingExercises = await list(userId, workoutId);
  const nextOrder = existingExercises.length;
  const snapshot = await addDoc(exercisesCollection(userId, workoutId), {
    name: input.name,
    sets: input.sets,
    reps: input.reps,
    restSeconds: input.restSeconds,
    notes: input.notes?.trim() || null,
    order: nextOrder,
    workoutId,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await touchWorkout(userId, workoutId);

  return snapshot.id;
}

async function update(userId: string, workoutId: string, exerciseId: string, input: ExerciseInput): Promise<void> {
  assertFirebaseConfigured();

  await updateDoc(exerciseDocument(userId, workoutId, exerciseId), {
    name: input.name,
    sets: input.sets,
    reps: input.reps,
    restSeconds: input.restSeconds,
    notes: input.notes?.trim() || null,
    updatedAt: serverTimestamp(),
  });

  await touchWorkout(userId, workoutId);
}

async function remove(userId: string, workoutId: string, exerciseId: string): Promise<void> {
  assertFirebaseConfigured();

  await deleteDoc(exerciseDocument(userId, workoutId, exerciseId));

  const remainingExercises = await list(userId, workoutId);
  await reorder(
    userId,
    workoutId,
    remainingExercises.map((exercise) => exercise.id),
  );
}

async function reorder(userId: string, workoutId: string, orderedExerciseIds: string[]): Promise<void> {
  assertFirebaseConfigured();

  const db = getFirestoreDb();
  const batch = writeBatch(db);

  orderedExerciseIds.forEach((exerciseId, index) => {
    batch.update(exerciseDocument(userId, workoutId, exerciseId), {
      order: index,
      updatedAt: serverTimestamp(),
    });
  });

  batch.update(workoutDocument(userId, workoutId), {
    updatedAt: serverTimestamp(),
  });

  await batch.commit();
}

function getExerciseErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os exercícios.";
}

export const exercisesService = {
  list,
  create,
  update,
  remove,
  reorder,
  getExerciseErrorMessage,
};
