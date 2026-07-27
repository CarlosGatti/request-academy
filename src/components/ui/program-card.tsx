import Link from "next/link";
import { BookOpen } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonClassName, Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { cn } from "@/lib/utils/cn";
import { resolveMediaUrl } from "@/lib/academy/resolve-media-url";

export type ProgramCardData = {
  id: number;
  title: string;
  slug: string;
  summary?: string | null;
  status?: string | null;
  visibility?: string | null;
  coverImageUrl?: string | null;
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
  const coverSrc = resolveMediaUrl(program.coverImageUrl);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70 sm:flex-row sm:items-center sm:justify-between sm:p-5",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3 sm:gap-4">
        <Link
          href={`/admin/courses/${program.id}`}
          className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-border/70 sm:size-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-label={`${program.title} cover`}
        >
          {coverSrc ? (
            <MediaImage
              src={coverSrc}
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-muted">
              <BookOpen className="size-6" aria-hidden />
            </span>
          )}
        </Link>

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
      </div>

      <div className="flex shrink-0 flex-wrap gap-2 sm:pl-2">
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
