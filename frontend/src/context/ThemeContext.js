import React, { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });
function savedTheme() {
  try {
    return localStorage.getItem("menther-theme");
  } catch {
    return null;
  }
}
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = savedTheme();
    return saved === "light" || saved === "dark"
      ? saved
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  });
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#141718" : "#faf5f2");
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const change = () => {
      if (!savedTheme()) setTheme(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("menther-theme", next);
    } catch {}
    setTheme(next);
  }
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
export function useTheme() {
  return useContext(ThemeContext);
}
