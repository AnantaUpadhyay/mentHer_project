import { useTheme } from "../context/ThemeContext";
import React from "react";
import { Link } from "react-router-dom";
export function Icon({ name = "arrow", size = 20, ...props }) {
  const paths = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    diagonal: "M5 19 19 5M5 5h14v14",
    spark: "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z",
    grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
    people:
      "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    book: "M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v16h-6a3 3 0 0 0-2 1 3 3 0 0 0-2-1H4zM12 5v16",
    chat: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-1 1v-9.5a9 9 0 1 1 18 0ZM7 10h10M7 14h6",
    user: "M20 21v-2a7 7 0 0 0-14 0v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
    check: "m5 12 4 4L19 6",
    search: "M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
    bookmark: "M6 3h12v18l-6-4-6 4Z",
    logout: "M9 21H4V3h5M10 12h11m-4-4 4 4-4 4",
    close: "m6 6 12 12M6 18 18 6",
    leaf: "M5 19C-2 6 13 2 21 3c1 9-3 20-16 16ZM5 19 16 8",
    menu: "M4 6h16M4 12h16M4 18h16",
    moon: "M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z",
    sun: "M12 2v2M12 20v2M2 12h2M20 12h2m-15-7 1 1m12-1-1 1M5 19l1-1m13 1-1-1M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.arrow} />
    </svg>
  );
}
export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="mentHer home">
      <span className="brand-mark">
        <svg viewBox="0 0 40 44" fill="none" aria-hidden="true">
          <path
            d="M5 35V17c0-9 10-9 10 0v18-18c0-9 10-9 10 0v18M25 25h10M35 14v21"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
          <path
            d="M29 10c0-5 5-7 8-6 0 5-3 8-8 6Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </span>
      ment<span>Her</span>
    </Link>
  );
}
export function Avatar({ name = "", large = false }) {
  return (
    <span className={`avatar ${large ? "large" : ""}`} aria-hidden="true">
      {name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function Empty({ icon = "leaf", title, children, action }) {
  return (
    <div className="empty">
      <span className="empty-symbol">
        <Icon name={icon} size={30} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}
export function Notice({ error, children }) {
  return children ? (
    <div
      className={`notice ${error ? "error" : "success"}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  ) : null;
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <Icon name={theme === "dark" ? "sun" : "moon"} />
    </button>
  );
}
