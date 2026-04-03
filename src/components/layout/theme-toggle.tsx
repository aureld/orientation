"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored === "true") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "");
    localStorage.setItem("darkMode", String(next));
  }

  return (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-xl hover:bg-surface transition-colors"
      title="Toggle theme"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
