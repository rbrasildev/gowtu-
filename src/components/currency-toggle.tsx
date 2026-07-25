"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Moeda = "USD" | "BRL";

function lerCookie(): Moeda {
  if (typeof document === "undefined") return "USD";
  const m = document.cookie.match(/(?:^|;\s*)moeda=(BRL|USD)/);
  return m?.[1] === "BRL" ? "BRL" : "USD";
}

export function CurrencyToggle() {
  const router = useRouter();
  const [moeda, setMoeda] = useState<Moeda>("USD");

  useEffect(() => {
    setMoeda(lerCookie());
  }, []);

  function selecionar(nova: Moeda) {
    if (nova === moeda) return;
    setMoeda(nova);
    // 1 ano
    document.cookie = `moeda=${nova}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <div
      className="flex items-center rounded-md border border-border bg-surface-2 p-0.5"
      role="group"
      aria-label="Moeda de exibição"
    >
      {(["USD", "BRL"] as const).map((m) => {
        const ativo = moeda === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => selecionar(m)}
            aria-pressed={ativo}
            className={cn(
              "h-8 rounded px-2.5 text-xs font-semibold transition-colors",
              ativo
                ? "bg-surface text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary",
            )}
          >
            {m === "USD" ? "US$" : "R$"}
          </button>
        );
      })}
    </div>
  );
}
