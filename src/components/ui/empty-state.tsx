import { Icon, type IconName } from "./icon";
import { ButtonLink } from "./button";

export function EmptyState({
  icon = "box",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-2 text-text-muted">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {actionLabel && actionHref && (
        <ButtonLink href={actionHref} icon="plus" className="mt-5">
          {actionLabel}
        </ButtonLink>
      )}
    </div>
  );
}
