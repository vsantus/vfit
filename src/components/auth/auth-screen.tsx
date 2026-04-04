import type { PropsWithChildren } from "react";
import { Dumbbell, Shield, Sparkles } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { GlassPanel } from "@/components/layout/glass-panel";

type AuthScreenProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
}>;

const bullets = [
  {
    icon: Dumbbell,
    title: "Treinos organizados",
    description: "Base preparada para fichas estruturadas por rotina, bloco e categoria.",
  },
  {
    icon: Sparkles,
    title: "Experiência guiada",
    description: "Fluxo desenhado para execução simples, clara e visualmente forte no mobile.",
  },
  {
    icon: Shield,
    title: "Sessão segura",
    description: "Autenticação com Firebase para controlar acesso e proteger áreas privadas.",
  },
];

export function AuthScreen({ eyebrow, title, description, children }: AuthScreenProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="pointer-events-none absolute inset-0 bg-grid-mask opacity-35" />
      <div className="relative grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <GlassPanel className="hidden overflow-hidden p-8 lg:block">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-10">
              <BrandMark />
              <div className="space-y-4">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
                  {eyebrow}
                </p>
                <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground">
                  {title}
                </h1>
                <p className="max-w-xl text-sm leading-7 text-muted-foreground">{description}</p>
              </div>
            </div>
            <div className="grid gap-4">
              {bullets.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border border-white/8 bg-background/40 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassPanel>

        <div className="flex items-center">
          <div className="w-full space-y-5">
            <div className="lg:hidden">
              <BrandMark />
            </div>
            <GlassPanel className="p-6 sm:p-8">{children}</GlassPanel>
          </div>
        </div>
      </div>
    </main>
  );
}
