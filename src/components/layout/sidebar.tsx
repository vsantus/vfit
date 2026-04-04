"use client";

import { ArrowUpRight, ChartNoAxesCombined, Clock3, Layers3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandMark } from "@/components/layout/brand-mark";
import { GlassPanel } from "@/components/layout/glass-panel";

const navItems = [
  { label: "Dashboard", description: "Resumo e visão geral", icon: ChartNoAxesCombined, href: "/dashboard" },
  { label: "Treinos", description: "Rotinas e exercícios", icon: Layers3, href: "/treinos" },
  { label: "Histórico", description: "Constância e sessões", icon: Clock3, href: "/historico" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <GlassPanel className="hidden h-[calc(100vh-1.5rem)] w-[316px] flex-col p-5 xl:flex">
      <div className="flex h-full flex-col">
        <BrandMark />

        <div className="mt-8 space-y-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/treinos" ? pathname.startsWith("/treinos") : pathname === item.href;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={[
                  "group block rounded-[1.5rem] border px-4 py-4 transition-all duration-200",
                  active
                    ? "border-primary/25 bg-linear-to-br from-primary/14 to-primary/6 text-foreground shadow-[0_16px_40px_rgba(104,255,182,0.08)]"
                    : "border-transparent bg-transparent text-muted-foreground hover:border-white/8 hover:bg-secondary/72 hover:text-foreground",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "mt-0.5 flex size-11 items-center justify-center rounded-[1rem] border bg-background/70 transition-all",
                      active
                        ? "border-primary/20 text-primary shadow-[0_0_24px_rgba(104,255,182,0.16)]"
                        : "border-white/8 text-muted-foreground group-hover:border-primary/12 group-hover:text-foreground",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs leading-5 text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-auto rounded-[1.6rem] border border-primary/20 bg-linear-to-br from-primary/12 to-transparent p-4">
          <div className="flex items-start gap-3">
            <div className="flex size-11 items-center justify-center rounded-[1rem] bg-primary/14 text-primary shadow-[0_0_24px_rgba(104,255,182,0.16)]">
              <ShieldCheck className="size-4" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">Dashboard conectado</p>
              <p className="text-xs leading-5 text-muted-foreground/95">
                As métricas agora leem Firestore para exibir treinos, última conclusão e streak atual.
              </p>
              <div className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Visão ativa
                <ArrowUpRight className="size-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}
