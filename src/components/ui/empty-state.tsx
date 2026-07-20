import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export function EmptyState({
  title,
  description,
  action,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-3 rounded-md border border-dashed border-border bg-surface px-6 py-10",
        className,
      )}
      {...props}
    >
      <h2 className="font-display text-xl font-medium text-primary">{title}</h2>
      {description ? <p className="max-w-md text-sm text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
