"use client";

import { ChartNoAxesCombined, Clock3, Layers3 } from "lucide-react";
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
    <GlassPanel className="hidden h-[calc(100vh-1.5rem)] w-79 flex-col p-5 xl:flex">
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
                    ? "border-primary/25 bg-primary/9 text-foreground shadow-[0_14px_28px_rgba(12,18,26,0.18)]"
                    : "border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-secondary/72 hover:text-foreground",
                ].join(" ")}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={[
                      "mt-0.5 flex size-11 items-center justify-center rounded-[1rem] border bg-background/72 transition-all",
                      active
                        ? "border-primary/18 bg-primary/8 text-primary shadow-[0_8px_18px_rgba(24,119,242,0.2)]"
                        : "border-border/70 text-muted-foreground group-hover:border-primary/12 group-hover:text-foreground",
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
      </div>
    </GlassPanel>
  );
}
