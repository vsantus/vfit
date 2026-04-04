"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { historyService } from "@/services/history.service";
import type { TrainingHistorySummary } from "@/types/history";

type TrainingHistoryState = {
  history: TrainingHistorySummary | null;
  loading: boolean;
  error: string | null;
};

export function useTrainingHistory(): TrainingHistoryState {
  const { user } = useAuth();
  const [state, setState] = useState<TrainingHistoryState>({
    history: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      return () => {
        cancelled = true;
      };
    }

    (async () => {
      try {
        const history = await historyService.getHistorySummary(user.uid);

        if (!cancelled) {
          setState({
            history,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setState({
            history: null,
            loading: false,
            error: historyService.getHistoryErrorMessage(error),
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return {
      history: null,
      loading: false,
      error: null,
    };
  }

  return state;
}
