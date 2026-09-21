"use client";

import { useTheme } from "@/components/Themes/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center">
      <Button
        onClick={toggleTheme}
        variant="outline"
        className="h-10 rounded-lg border-slate-200 bg-white px-4 font-bold text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      >
        {theme === "light" ? (
          <Moon className="size-4 text-amber-500" />
        ) : (
          <Sun className="size-4 text-amber-400" />
        )}

        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </Button>
    </div>
  );
};

export default ThemeSwitch;