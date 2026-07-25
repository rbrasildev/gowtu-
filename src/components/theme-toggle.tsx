"use client";

import { useEffect, useState } from "react";
import { Icon } from "./ui/icon";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      className="flex h-10 w-10 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
      aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={dark ? "Tema claro" : "Tema escuro"}
    >
      <Icon name={dark ? "sun" : "moon"} size={19} />
    </button>
  );
}
