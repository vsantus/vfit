import type { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";

type ScreenContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function ScreenContainer({ children, className }: ScreenContainerProps) {
  return (
    <main
      className={cn(
        "premium-scrollbar mx-auto flex w-full max-w-7xl flex-1 flex-col px-1 sm:px-2",
        className,
      )}
    >
      {children}
    </main>
  );
}
