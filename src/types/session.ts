export type WorkoutSessionInput = {
  workoutId: string;
  workoutName: string;
  completedExerciseIds: string[];
  totalExercises: number;
  durationSeconds?: number;
};
