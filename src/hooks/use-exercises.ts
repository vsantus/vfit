"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { exercisesService } from "@/services/exercises.service";
import type { Exercise } from "@/types/exercise";

type UseExercisesState = {
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useExercises(workoutId: string): UseExercisesState {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user || !workoutId) {
      setExercises([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextExercises = await exercisesService.list(user.uid, workoutId);
      setExercises(nextExercises);
    } catch (loadError) {
      setError(exercisesService.getExerciseErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [user, workoutId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    exercises,
    loading,
    error,
    refresh: load,
  };
}
