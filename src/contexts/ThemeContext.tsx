"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // تحميل Theme المحفوظ من localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("water-guard-theme") as Theme;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(savedTheme || systemTheme);
    setMounted(true);
  }, []);

  // تطبيق Theme على document
  useEffect(() => {
    if (mounted) {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("water-guard-theme", theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  // منع flash أثناء التحميل
  if (!mounted) {
    return <div className="min-h-screen bg-white dark:bg-gray-900" />;
  }

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark"
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
