import React from "react";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} style={{
      padding: "0.5rem 1rem",
      background: "none",
      border: "1px solid currentColor",
      borderRadius: "6px",
      color: "inherit",
      cursor: "pointer"
    }}>
      Switch to {theme === "light" ? "🌙 Dark" : "☀️ Light"} Mode
    </button>
  );
};

export default ThemeToggle;
