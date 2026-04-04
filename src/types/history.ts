export type SessionHistoryItem = {
  id: string;
  workoutId: string;
  workoutName: string;
  completedAt: Date | null;
  completedAtLabel: string;
  completedDayKey: string | null;
};

export type TrainingHistorySummary = {
  sessions: SessionHistoryItem[];
  currentStreak: number;
  lastCompletedWorkout: {
    workoutId: string;
    workoutName: string;
    completedAtLabel: string;
  } | null;
};
