"use client";

import { ChartNoAxesCombined, Clock3, House, Layers3 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { label: "Home", icon: House, href: "/dashboard" },
  { label: "Treinos", icon: Layers3, href: "/treinos" },
  { label: "Histórico", icon: Clock3, href: "/historico" },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="surface-glow fixed inset-x-3 bottom-3 z-20 rounded-[1.75rem] border border-border/75 bg-card/92 p-2.5 backdrop-blur-2xl sm:inset-x-4 sm:bottom-4 xl:hidden">
      <ul className="grid grid-cols-3 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/treinos" ? pathname.startsWith("/treinos") : pathname === item.href;

          return (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 rounded-[1.2rem] px-2 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] transition-all",
                  active
                    ? "bg-primary/10 text-primary shadow-[0_10px_22px_rgba(24,119,242,0.2)]"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
