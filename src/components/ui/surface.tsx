import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

/**
 * Soft product/marketing surface — prefer this over thin-border rectangles.
 */
export function Surface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface shadow-card ring-1 ring-border/70",
        className,
      )}
      {...props}
    />
  );
}
