"use client";

import type { PropsWithChildren } from "react";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AppShell } from "@/components/layout/app-shell";
import { ScreenContainer } from "@/components/layout/screen-container";

export default function ProtectedLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <AppShell>
        <ScreenContainer className="gap-6 py-6 sm:py-8">{children}</ScreenContainer>
      </AppShell>
    </ProtectedRoute>
  );
}
