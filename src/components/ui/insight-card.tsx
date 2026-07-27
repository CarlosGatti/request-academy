import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils/cn";

export function InsightCard({
  title,
  observation,
  recommendation,
  confidence,
  affectedLabel,
  href,
  className,
}: {
  title: string;
  observation?: string;
  recommendation?: string;
  confidence?: string;
  affectedLabel?: string;
  href?: string;
  className?: string;
}) {
  const body = (
    <article
      className={cn(
        "space-y-2 rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70",
        href && "transition-colors hover:bg-sea-foam/50",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="font-medium text-primary">{title}</h3>
        {confidence ? <StatusBadge status={confidence} /> : null}
      </div>
      {observation ? <p className="text-sm text-muted">{observation}</p> : null}
      {recommendation ? (
        <p className="text-sm text-primary/90">{recommendation}</p>
      ) : null}
      {affectedLabel ? (
        <p className="text-xs text-muted">{affectedLabel}</p>
      ) : null}
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
        {body}
      </Link>
    );
  }

  return body;
}
