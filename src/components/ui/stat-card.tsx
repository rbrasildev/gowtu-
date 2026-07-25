import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/domain";
import { Icon, type IconName } from "./icon";

const TONE_ICON: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-2 text-text-secondary",
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "accent",
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon: IconName;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface p-4 shadow-card",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {label}
        </p>
        <span
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
            TONE_ICON[tone],
          )}
        >
          <Icon name={icon} size={16} />
        </span>
      </div>
      <p className="mt-2 text-2xl font-bold tracking-tight text-text-primary tabular-nums">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-text-secondary">{sub}</p>}
    </div>
  );
}
