"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { FullScreenLoader } from "@/components/feedback/full-screen-loader";
import { useAuth } from "@/hooks/use-auth";

export function PublicOnlyRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next") || "/dashboard"
          : "/dashboard";
      router.replace(nextPath);
    }
  }, [loading, router, user]);

  if (loading) {
    return <FullScreenLoader label="Verificando sessao" />;
  }

  if (user) {
    return <FullScreenLoader label="Redirecionando para dashboard" />;
  }

  return children;
}
