import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

const tones = {
  info: "border-lichen bg-secondary/50 text-foreground",
  success: "border-accent/40 bg-accent/10 text-foreground",
  warning: "border-highlight/40 bg-highlight/10 text-foreground",
  danger: "border-danger/30 bg-danger/5 text-danger",
} as const;

export function Alert({
  tone = "info",
  title,
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  tone?: keyof typeof tones;
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "rounded-md border px-4 py-3 text-sm",
        tones[tone],
        className,
      )}
      {...props}
    >
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      {children}
    </div>
  );
}
