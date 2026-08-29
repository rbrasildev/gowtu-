"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "./icon";

export function PasswordInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="relative">
      <input
        type={visivel ? "text" : "password"}
        className={cn(
          "h-11 w-full rounded-md border border-border bg-surface pl-3 pr-11 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30",
          className,
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisivel((v) => !v)}
        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-text-muted hover:text-text-primary"
        aria-label={visivel ? "Ocultar senha" : "Mostrar senha"}
        tabIndex={-1}
      >
        <Icon name={visivel ? "eyeOff" : "eye"} size={18} />
      </button>
    </div>
  );
}
