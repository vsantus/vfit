"use client";

import type { PropsWithChildren } from "react";

import { PublicOnlyRoute } from "@/components/auth/public-only-route";

export default function AuthLayout({ children }: PropsWithChildren) {
  return <PublicOnlyRoute>{children}</PublicOnlyRoute>;
}
