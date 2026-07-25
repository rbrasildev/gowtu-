import Link from "next/link";
import { Icon, type IconName } from "./icon";
import { Card, CardBody } from "./card";
import type { Tone } from "@/lib/domain";
import { TONE_SOFT } from "@/lib/tone";

export function FormShell({
  title,
  description,
  icon,
  tone = "accent",
  backHref,
  backLabel = "Voltar",
  children,
}: {
  title: string;
  description?: string;
  icon?: IconName;
  tone?: Tone;
  backHref: string;
  backLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <Icon name="chevronLeft" size={16} />
        {backLabel}
      </Link>

      <div className="mb-5 flex items-center gap-3">
        {icon && (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${TONE_SOFT[tone]}`}
          >
            <Icon name={icon} size={22} />
          </span>
        )}
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
          )}
        </div>
      </div>

      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  );
}
