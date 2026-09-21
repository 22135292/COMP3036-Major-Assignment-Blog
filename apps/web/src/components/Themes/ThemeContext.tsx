"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children, initialTheme }: { children: React.ReactNode; initialTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme || "light");

  // (optional) lưu theme vào localStorage
  useEffect(() => {
    // Only verify localStorage if no initialTheme was provided (or to sync if needed)
    // But priority is: Server (Cookie) > LocalStorage > Default
    // Since we initialized with Cookie (via initialTheme), we might stick with it.
    // However, if cookie is missing but localStorage exists, we might want to recover.
    if (!initialTheme) {
        const savedTheme = localStorage.getItem("theme") as Theme | null;
        if (savedTheme) setTheme(savedTheme);
    }
  }, [initialTheme]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
    // Sync with cookie for server-side rendering
    document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
}
