import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

const variants = {
  primary: "bg-primary text-sea-foam hover:bg-primary/90",
  secondary: "bg-secondary text-primary hover:bg-lichen/80",
  accent: "bg-accent text-white hover:bg-accent/90",
  highlight: "bg-highlight text-white hover:bg-highlight/90",
  outline: "border border-border bg-surface text-primary hover:bg-sea-foam",
  ghost: "text-primary hover:bg-secondary/60",
} as const;

const sizes = {
  sm: "h-8 px-3 rounded-sm text-sm",
  md: "h-10 px-4 rounded-md text-sm",
  lg: "h-11 px-5 rounded-md text-base",
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

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
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
