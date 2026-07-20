import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: HTMLAttributes<HTMLElement> & {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
      {...props}
    >
      <div className="space-y-2">
        <h1 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-base text-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
