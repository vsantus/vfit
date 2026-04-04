"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { workoutsService } from "@/services/workouts.service";
import type { Workout } from "@/types/workout";

type UseWorkoutState = {
  workout: Workout | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useWorkout(workoutId: string): UseWorkoutState {
  const { user } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user || !workoutId) {
      setWorkout(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextWorkout = await workoutsService.getById(user.uid, workoutId);
      setWorkout(nextWorkout);
      if (!nextWorkout) {
        setError("Treino nao encontrado.");
      }
    } catch (loadError) {
      setError(workoutsService.getWorkoutErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [user, workoutId]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    workout,
    loading,
    error,
    refresh: load,
  };
}
