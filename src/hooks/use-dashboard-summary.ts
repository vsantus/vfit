"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { dashboardService } from "@/services/dashboard.service";
import type { DashboardSummary } from "@/types/dashboard";

type DashboardSummaryState = {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
};

export function useDashboardSummary(): DashboardSummaryState {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardSummaryState>({
    summary: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    if (!user) {
      return;
    }

    dashboardService
      .getSummary(user.uid)
      .then((summary) => {
        if (!cancelled) {
          setState({
            summary,
            loading: false,
            error: null,
          });
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            summary: null,
            loading: false,
            error: dashboardService.getDashboardErrorMessage(error),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return {
      summary: null,
      loading: false,
      error: null,
    };
  }

  return state;
}
