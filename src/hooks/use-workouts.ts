"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { workoutsService } from "@/services/workouts.service";
import type { Workout } from "@/types/workout";

type UseWorkoutsState = {
  workouts: Workout[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useWorkouts(): UseWorkoutsState {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setWorkouts([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const nextWorkouts = await workoutsService.list(user.uid);
      setWorkouts(nextWorkouts);
    } catch (loadError) {
      setError(workoutsService.getWorkoutErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  return {
    workouts,
    loading,
    error,
    refresh: load,
  };
}
