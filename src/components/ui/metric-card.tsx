import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricCard({
  label,
  value,
  supportingText,
  loading,
  error,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  label: string;
  value?: number | string | null;
  supportingText?: string;
  loading?: boolean;
  error?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70",
        className,
      )}
      {...props}
    >
      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label={`Loading ${label}`}>
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ) : error ? (
        <div className="space-y-1">
          <p className="text-2xl font-medium text-muted">—</p>
          <p className="text-xs text-muted">{label}</p>
          <p className="text-xs text-danger">Unable to load</p>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-2xl font-medium tracking-tight text-primary">
            {value ?? 0}
          </p>
          <p className="text-xs font-medium text-muted">{label}</p>
          {supportingText ? (
            <p className="text-xs text-muted/80">{supportingText}</p>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function MetricCardGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
