import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";
import type { Tone } from "@/lib/domain";

const TONE_ICON: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-2 text-text-secondary",
};

export function PageHeader({
  title,
  description,
  icon,
  tone = "accent",
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  tone?: Tone;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
              TONE_ICON[tone],
            )}
          >
            <Icon name={icon} size={22} />
          </span>
        )}
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
