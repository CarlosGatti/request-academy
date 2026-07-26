import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

export const buttonVariants = {
  primary: "bg-primary text-sea-foam hover:bg-primary/90",
  secondary: "bg-secondary text-primary hover:bg-lichen/80",
  accent: "bg-accent text-white hover:bg-accent/90",
  highlight: "bg-highlight text-white hover:bg-highlight/90",
  outline: "border border-border bg-surface text-primary hover:bg-sea-foam",
  ghost: "text-primary hover:bg-secondary/60",
  /** Secondary action on dark (Tidal Blue) bands */
  "outline-on-dark":
    "border border-sea-foam/35 text-sea-foam hover:bg-white/10",
} as const;

export const buttonSizes = {
  sm: "h-8 px-3 rounded-sm text-sm",
  md: "h-10 px-4 rounded-md text-sm",
  lg: "h-11 min-h-11 px-5 rounded-md text-sm",
  /** Primary marketing CTAs (~48px) */
  xl: "h-12 min-h-12 px-6 rounded-md text-sm",
} as const;

const buttonBase =
  "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** Shared class builder for `<button>` and Next.js `<Link>` CTAs. */
export function buttonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  );
}
