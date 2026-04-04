import { GlassPanel } from "@/components/layout/glass-panel";

export function DashboardLoading() {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel className="p-6 sm:p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-6 w-28 rounded-full bg-secondary" />
            <div className="h-10 w-3/4 rounded-2xl bg-secondary" />
            <div className="h-6 w-full rounded-2xl bg-secondary" />
            <div className="h-6 w-2/3 rounded-2xl bg-secondary" />
            <div className="h-11 w-40 rounded-2xl bg-secondary" />
          </div>
        </GlassPanel>
        <GlassPanel className="p-6 sm:p-8">
          <div className="space-y-4 animate-pulse">
            <div className="h-5 w-32 rounded-full bg-secondary" />
            <div className="h-32 rounded-3xl bg-secondary" />
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <GlassPanel key={index} className="p-5">
            <div className="space-y-4 animate-pulse">
              <div className="size-11 rounded-2xl bg-secondary" />
              <div className="h-5 w-32 rounded-2xl bg-secondary" />
              <div className="h-10 w-24 rounded-2xl bg-secondary" />
              <div className="h-5 w-full rounded-2xl bg-secondary" />
            </div>
          </GlassPanel>
        ))}
      </section>
    </div>
  );
}
