"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

export function SubmitButton({
  children,
  icon,
  variant = "primary",
  className,
  pendingLabel,
}: {
  children: React.ReactNode;
  icon?: IconName;
  variant?: "primary" | "success" | "danger";
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const styles = {
    primary: "bg-accent text-accent-fg",
    success: "bg-success text-white",
    danger: "bg-danger text-white",
  }[variant];

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-60 disabled:pointer-events-none",
        styles,
        className,
      )}
    >
      {pending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        icon && <Icon name={icon} size={18} />
      )}
      {pending ? (pendingLabel ?? "Salvando…") : children}
    </button>
  );
}
