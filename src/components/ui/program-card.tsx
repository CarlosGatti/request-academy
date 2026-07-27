import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClassName, Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export type ProgramCardData = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  status?: string | null;
  visibility?: string | null;
  moduleCount: number;
  lessonCount: number;
  publishedAt?: unknown;
};

function formatDate(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ProgramCard({
  program,
  onPublish,
  onArchive,
  className,
}: {
  program: ProgramCardData;
  onPublish?: () => void;
  onArchive?: () => void;
  className?: string;
}) {
  const publishedLabel = formatDate(program.publishedAt);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-surface p-5 shadow-card ring-1 ring-border/70 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/courses/${program.id}`}
            className="font-display text-lg font-medium text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {program.title}
          </Link>
          <StatusBadge status={program.status ?? "DRAFT"} />
        </div>
        {program.summary ? (
          <p className="line-clamp-2 text-sm text-muted">{program.summary}</p>
        ) : null}
        <p className="text-xs text-muted">
          {program.moduleCount} module{program.moduleCount === 1 ? "" : "s"} ·{" "}
          {program.lessonCount} lesson{program.lessonCount === 1 ? "" : "s"}
          {program.visibility ? ` · ${program.visibility.toLowerCase()}` : null}
          {publishedLabel ? ` · Published ${publishedLabel}` : null}
        </p>
        <p className="text-xs text-muted/80">{program.slug}</p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        <Link
          href={`/admin/courses/${program.id}`}
          className={buttonClassName({ variant: "outline", size: "sm" })}
        >
          Edit
        </Link>
        {program.status !== "PUBLISHED" && onPublish ? (
          <Button size="sm" variant="accent" onClick={onPublish}>
            Publish
          </Button>
        ) : null}
        {program.status !== "ARCHIVED" && onArchive ? (
          <Button size="sm" variant="outline" onClick={onArchive}>
            Archive
          </Button>
        ) : null}
      </div>
    </article>
  );
}
