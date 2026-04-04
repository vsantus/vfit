export type Exercise = {
  id: string;
  name: string;
  sets: string;
  reps: string;
  restSeconds: number;
  notes: string | null;
  order: number;
  workoutId: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type ExerciseInput = {
  name: string;
  sets: string;
  reps: string;
  restSeconds: number;
  notes?: string;
};
