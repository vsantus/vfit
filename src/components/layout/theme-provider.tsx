"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "vfit-theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "dark";
  }

  const datasetTheme = document.documentElement.dataset.theme;
  if (datasetTheme === "light" || datasetTheme === "dark") {
    return datasetTheme;
  }

  const storedTheme = window.localStorage.getItem(STORAGE_KEY);
  return storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new Event("vfit-theme-change"));
}

function subscribe(onStoreChange: () => void) {
  const handler = () => onStoreChange();

  window.addEventListener("storage", handler);
  window.addEventListener("vfit-theme-change", handler);

  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener("vfit-theme-change", handler);
  };
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const theme = useSyncExternalStore<Theme>(
    subscribe,
    getStoredTheme,
    () => "dark",
  );

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: (nextTheme) => {
        applyTheme(nextTheme);
      },
      toggleTheme: () => {
        applyTheme(theme === "dark" ? "light" : "dark");
      },
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider.");
  }

  return context;
}
