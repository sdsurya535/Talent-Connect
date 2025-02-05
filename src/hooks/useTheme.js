import { create } from "zustand";

// Function to get system preference
const getSystemTheme = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

// Function to initialize theme
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const initialTheme = savedTheme || getSystemTheme();

  // Set initial class on document
  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }

  return initialTheme;
};

export const useTheme = create((set) => ({
  theme: initializeTheme(),
  setTheme: (newTheme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.toggle("dark", newTheme === "dark");
      set({ theme: newTheme });
    }
  },
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
      }
      return { theme: newTheme };
    });
  },
}));

// Optional: Listen for system theme changes
if (typeof window !== "undefined") {
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      const currentTheme = localStorage.getItem("theme");
      // Only update if user hasn't manually set a theme
      if (!currentTheme) {
        useTheme.getState().setTheme(e.matches ? "dark" : "light");
      }
    });
}
