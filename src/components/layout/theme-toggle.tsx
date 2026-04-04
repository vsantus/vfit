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
      className="flex h-11 items-center gap-2 rounded-[1.2rem] border border-white/8 bg-background/72 px-3 text-sm font-medium text-muted-foreground transition-all hover:border-primary/18 hover:bg-primary/8 hover:text-foreground"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      title={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
    >
      <span className="flex size-8 items-center justify-center rounded-[0.9rem] border border-primary/16 bg-primary/10 text-primary">
        {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </span>
      <span className="hidden sm:inline">{isDark ? "Modo claro" : "Modo escuro"}</span>
    </button>
  );
}
