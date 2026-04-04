import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import { getCompletedDayKey, calculateCurrentStreak } from "@/lib/dates";
import { getFirestoreDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import type { SessionHistoryItem, TrainingHistorySummary } from "@/types/history";

function assertFirebaseConfigured() {
  if (!isFirebaseConfigured()) {
    throw new Error("Firebase não configurado. Preencha o arquivo .env.local para usar o histórico.");
  }
}

function formatCompletedAt(value: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function mapSession(sessionId: string, data: Record<string, unknown>): SessionHistoryItem {
  const completedAt =
    data.completedAt && typeof data.completedAt === "object" && "toDate" in data.completedAt
      ? (data.completedAt as { toDate: () => Date }).toDate()
      : null;

  return {
    id: sessionId,
    workoutId: String(data.workoutId ?? sessionId),
    workoutName: String(data.workoutName ?? "Treino"),
    completedAt,
    completedAtLabel: completedAt ? formatCompletedAt(completedAt) : "Data indisponivel",
    completedDayKey: getCompletedDayKey(completedAt),
  };
}

async function listSessions(userId: string, maxItems = 50): Promise<SessionHistoryItem[]> {
  assertFirebaseConfigured();

  const sessionsRef = collection(getFirestoreDb(), "users", userId, "sessions");
  const snapshot = await getDocs(query(sessionsRef, orderBy("completedAt", "desc"), limit(maxItems)));

  return snapshot.docs.map((item) => mapSession(item.id, item.data()));
}

async function getHistorySummary(userId: string): Promise<TrainingHistorySummary> {
  const sessions = await listSessions(userId);
  const streak = calculateCurrentStreak(
    sessions
      .map((session) => session.completedDayKey)
      .filter((dayKey): dayKey is string => Boolean(dayKey)),
  );

  return {
    sessions,
    currentStreak: streak,
    lastCompletedWorkout: sessions[0]
      ? {
          workoutId: sessions[0].workoutId,
          workoutName: sessions[0].workoutName,
          completedAtLabel: sessions[0].completedAtLabel,
        }
      : null,
  };
}

function getHistoryErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Não foi possível carregar o histórico.";
}

export const historyService = {
  listSessions,
  getHistorySummary,
  getHistoryErrorMessage,
};
