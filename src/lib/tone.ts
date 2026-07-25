import type { Tone } from "./domain";

/** Classes concretas por tom (evita template strings que o Tailwind JIT não gera). */
export const TONE_SOFT: Record<Tone, string> = {
  accent: "bg-accent-soft text-accent",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
  neutral: "bg-surface-2 text-text-secondary",
};

export const TONE_TEXT: Record<Tone, string> = {
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  info: "text-info",
  neutral: "text-text-secondary",
};

export const TONE_SOLID: Record<Tone, string> = {
  accent: "bg-accent text-accent-fg",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  danger: "bg-danger text-white",
  info: "bg-info text-white",
  neutral: "bg-surface-2 text-text-primary",
};
