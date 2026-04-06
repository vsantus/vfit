"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/layout/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-11 items-center gap-2 rounded-[1.2rem] border border-border/70 bg-card/80 px-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/18 hover:bg-primary/8 hover:text-foreground"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <span className="flex size-8 items-center justify-center rounded-[0.9rem] border border-primary/18 bg-primary/12 text-primary shadow-[0_6px_14px_rgba(24,119,242,0.16)]">
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Modo claro" : "Modo escuro"}</span>
    </button>
  );
}
