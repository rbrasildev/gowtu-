import Link from "next/link";
import { cn } from "@/lib/utils";
import { Icon, type IconName } from "./icon";

type Variant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "successSoft"
  | "dangerSoft";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:opacity-90 active:opacity-100",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-surface-2 active:bg-surface-2",
  ghost: "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
  danger: "bg-danger text-white hover:opacity-90 active:opacity-100",
  success: "bg-success text-white hover:opacity-90 active:opacity-100",
  // Tonalizados — discretos, combinam com o tema monocromático
  successSoft:
    "bg-success-soft text-success border border-success/20 hover:border-success/40",
  dangerSoft:
    "bg-danger-soft text-danger border border-danger/20 hover:border-danger/40",
};

// Alturas garantem alvo de toque >= 44px (WCAG 2.5.8 / Apple HIG).
const SIZES: Record<Size, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-4 text-sm gap-2",
  lg: "h-12 px-5 text-base gap-2",
};

const base =
  "inline-flex items-center justify-center rounded-md font-medium transition-[filter,background-color,color] disabled:opacity-50 disabled:pointer-events-none select-none whitespace-nowrap";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconRight?: IconName;
  className?: string;
  children?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : 18} />}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  className,
  children,
  href,
  ...props
}: CommonProps & { href: string } & Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    "href"
  >) {
  return (
    <Link
      href={href}
      className={cn(base, VARIANTS[variant], SIZES[size], className)}
      {...props}
    >
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "sm" ? 16 : 18} />}
    </Link>
  );
}
