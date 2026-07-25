import { Icon } from "./icon";

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-md border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
    >
      <Icon name="alert" size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
