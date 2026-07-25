"use client";

import { useState } from "react";
import { Icon } from "./ui/icon";

/**
 * Botão de exclusão com diálogo de confirmação (prevenção de erro — Nielsen).
 * Envolve uma server action; renderiza um <form> ao confirmar.
 */
export function ConfirmDelete({
  action,
  title = "Confirmar exclusão",
  message = "Esta ação não pode ser desfeita.",
  label = "Excluir",
  compact = false,
}: {
  action: (formData: FormData) => void | Promise<void>;
  title?: string;
  message?: string;
  label?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:bg-danger-soft hover:text-danger"
          aria-label={label}
          title={label}
        >
          <Icon name="trash" size={17} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-danger hover:bg-danger-soft"
        >
          <Icon name="trash" size={17} />
          {label}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            className="relative w-full max-w-md rounded-t-2xl bg-surface p-5 shadow-pop animate-fade-in sm:rounded-2xl"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
                <Icon name="alert" size={22} />
              </span>
              <div className="min-w-0 flex-1">
                <h2 id="confirm-title" className="text-base font-semibold text-text-primary">
                  {title}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">{message}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 rounded-md border border-border px-4 text-sm font-medium text-text-primary hover:bg-surface-2"
              >
                Cancelar
              </button>
              <form action={action}>
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-danger px-5 text-sm font-medium text-white hover:opacity-90 sm:w-auto"
                >
                  <Icon name="trash" size={17} />
                  {label}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
