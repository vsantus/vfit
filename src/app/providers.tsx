"use client";

import type { PropsWithChildren } from "react";

import { AuthProvider } from "@/components/auth/auth-provider";

export function Providers({ children }: PropsWithChildren) {
  return <AuthProvider>{children}</AuthProvider>;
}
