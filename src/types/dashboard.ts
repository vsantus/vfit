export type LastCompletedWorkout = {
  workoutId: string;
  workoutName: string;
  completedAtLabel: string;
};

export type DashboardSummary = {
  totalWorkouts: number;
  currentStreak: number;
  lastCompletedWorkout: LastCompletedWorkout | null;
};
