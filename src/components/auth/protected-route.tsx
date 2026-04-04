"use client";

import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { FullScreenLoader } from "@/components/feedback/full-screen-loader";
import { useAuth } from "@/hooks/use-auth";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, pathname, router, user]);

  if (loading) {
    return <FullScreenLoader label="Validando acesso" />;
  }

  if (!user) {
    return <FullScreenLoader label="Redirecionando para login" />;
  }

  return children;
}
