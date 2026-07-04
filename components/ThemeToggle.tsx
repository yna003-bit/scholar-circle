"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-ink hover:bg-black/5 dark:text-neutral-200 dark:hover:bg-white/5"
    >
      {dark ? (
        <Sun size={17} className="text-ink/60 dark:text-neutral-400" />
      ) : (
        <Moon size={17} className="text-ink/60" />
      )}
      {dark ? "Light mode" : "Dark mode"}
    </button>
  );
}