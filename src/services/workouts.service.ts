import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import {
  compareWorkoutsBySchedule,
  extractWorkoutWeekday,
  normalizeWorkoutWeekday,
} from "@/lib/workouts/schedule";
import type { Workout, WorkoutInput } from "@/types/workout";

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha o arquivo .env.local para usar os treinos.");
  }
}

function workoutsCollection(userId: string) {
  return collection(getFirestoreDb(), "users", userId, "workouts");
}

function workoutDocument(userId: string, workoutId: string) {
  return doc(getFirestoreDb(), "users", userId, "workouts", workoutId);
}

function mapWorkout(workoutId: string, data: Record<string, unknown>): Workout {
  const description =
    typeof data.description === "string" && data.description.length > 0 ? data.description : null;
  const weekday =
    normalizeWorkoutWeekday(typeof data.weekday === "string" ? data.weekday : null) ??
    extractWorkoutWeekday(description);

  return {
    id: workoutId,
    name: String(data.name ?? ""),
    category: String(data.category ?? "Personalizado") as Workout["category"],
    description,
    weekday,
    userId: String(data.userId ?? ""),
    createdAt: data.createdAt && typeof data.createdAt === "object" && "toDate" in data.createdAt
      ? (data.createdAt as { toDate: () => Date }).toDate()
      : null,
    updatedAt: data.updatedAt && typeof data.updatedAt === "object" && "toDate" in data.updatedAt
      ? (data.updatedAt as { toDate: () => Date }).toDate()
      : null,
  };
}

async function list(userId: string): Promise<Workout[]> {
  assertFirebaseConfigured();

  const snapshot = await getDocs(query(workoutsCollection(userId), orderBy("updatedAt", "desc")));

  return snapshot.docs.map((item) => mapWorkout(item.id, item.data())).sort(compareWorkoutsBySchedule);
}

async function getById(userId: string, workoutId: string): Promise<Workout | null> {
  assertFirebaseConfigured();

  const snapshot = await getDoc(workoutDocument(userId, workoutId));

  if (!snapshot.exists()) {
    return null;
  }

  return mapWorkout(snapshot.id, snapshot.data());
}

async function create(userId: string, input: WorkoutInput): Promise<string> {
  assertFirebaseConfigured();

  const snapshot = await addDoc(workoutsCollection(userId), {
    name: input.name,
    category: input.category,
    description: input.description?.trim() || null,
    weekday: input.weekday ?? null,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return snapshot.id;
}

async function update(userId: string, workoutId: string, input: WorkoutInput): Promise<void> {
  assertFirebaseConfigured();

  await updateDoc(workoutDocument(userId, workoutId), {
    name: input.name,
    category: input.category,
    description: input.description?.trim() || null,
    weekday: input.weekday ?? null,
    updatedAt: serverTimestamp(),
  });
}

async function remove(userId: string, workoutId: string): Promise<void> {
  assertFirebaseConfigured();

  await deleteDoc(workoutDocument(userId, workoutId));
}

function getWorkoutErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os treinos.";
}

export const workoutsService = {
  list,
  getById,
  create,
  update,
  remove,
  getWorkoutErrorMessage,
};
