"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./ui/icon";
import { TONE_SOFT } from "@/lib/tone";
import type { Tone } from "@/lib/domain";
import type { IconName } from "./ui/icon";

/**
 * Modal para intercepting routes. Fecha voltando à rota anterior
 * (router.back), pois chegamos aqui por navegação suave a partir da lista.
 */
export function RouteModal({
  title,
  description,
  icon,
  tone = "accent",
  children,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  tone?: Tone;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);

  function close() {
    router.back();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // foco inicial no primeiro campo
    const first = dialogRef.current?.querySelector<HTMLElement>(
      "input:not([type=hidden]), select, textarea, button",
    );
    first?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={close}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-surface shadow-pop animate-fade-in sm:max-w-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${TONE_SOFT[tone]}`}
              >
                <Icon name={icon} size={20} />
              </span>
            )}
            <div className="min-w-0">
              <h2 id="modal-title" className="text-base font-semibold text-text-primary">
                {title}
              </h2>
              {description && (
                <p className="truncate text-xs text-text-secondary">{description}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-surface-2 hover:text-text-primary"
            aria-label="Fechar"
          >
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
