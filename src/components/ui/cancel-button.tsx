"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Botão Cancelar que volta à tela anterior (router.back).
 * Funciona tanto em modal (fecha o modal) quanto em página cheia
 * (volta para a listagem de onde veio) — ao contrário de um link fixo,
 * que não fecha o modal quando a URL de destino é a página atual.
 */
export function CancelButton({
  children = "Cancelar",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text-primary transition-colors hover:bg-surface-2",
        className,
      )}
    >
      {children}
    </button>
  );
}
