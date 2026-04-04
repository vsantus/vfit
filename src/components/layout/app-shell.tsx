import type { PropsWithChildren } from "react";

import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid-mask opacity-28" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-primary/6 via-transparent to-transparent blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] gap-4 px-3 pb-28 pt-3 sm:px-4 sm:pt-4 xl:pb-4">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-5">
          <Topbar />
          {children}
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
}
