import { collection, getDocs } from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { historyService } from "@/services/history.service";
import type { DashboardSummary } from "@/types/dashboard";

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha o arquivo .env.local para usar o dashboard.");
  }
}

async function getSummary(userId: string): Promise<DashboardSummary> {
  assertFirebaseConfigured();

  const db = getFirestoreDb();
  const workoutsRef = collection(db, "users", userId, "workouts");

  const [workoutsSnapshot, historySummary] = await Promise.all([
    getDocs(workoutsRef),
    historyService.getHistorySummary(userId),
  ]);

  return {
    totalWorkouts: workoutsSnapshot.size,
    currentStreak: historySummary.currentStreak,
    lastCompletedWorkout: historySummary.lastCompletedWorkout,
  };
}

function getDashboardErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar os dados do dashboard.";
}

export const dashboardService = {
  getSummary,
  getDashboardErrorMessage,
};
