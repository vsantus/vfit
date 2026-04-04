import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";

import { GlassPanel } from "@/components/layout/glass-panel";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

type DashboardEmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
};

export function DashboardEmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: DashboardEmptyStateProps) {
  return (
    <GlassPanel className="p-6 sm:p-8">
      <div className="flex flex-col items-start gap-5">
        <div className="flex size-14 items-center justify-center rounded-3xl border border-primary/20 bg-primary/10 text-primary">
          <Plus className="size-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>
        </div>
        {actionHref ? (
          <Link
            href={actionHref}
            className={cn(
              buttonVariants({ className: "h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90" }),
            )}
          >
            {actionLabel}
            <ArrowRight className="size-4" />
          </Link>
        ) : (
          <div className="rounded-2xl border border-white/8 bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            {actionLabel}
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
