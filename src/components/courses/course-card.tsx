import { MediaImage } from "@/components/ui/media-image";
import Link from "next/link";
import { formatDurationMinutes } from "@/lib/academy/labels";
import { cn } from "@/lib/utils/cn";

export type CourseCardData = {
  slug: string;
  title: string;
  summary?: string | null;
  coverImageUrl?: string | null;
  visibility?: string | null;
  estimatedDurationMinutes?: number | null;
  moduleCount?: number;
  lessonCount?: number;
};

export function CourseCard({
  academySlug,
  course,
  className,
}: {
  academySlug: string;
  course: CourseCardData;
  className?: string;
}) {
  const duration = formatDurationMinutes(course.estimatedDurationMinutes);

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden border border-border bg-surface",
        className,
      )}
    >
      <div className="relative aspect-[16/9] bg-secondary">
        {course.coverImageUrl ? (
          <MediaImage
            src={course.coverImageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-lichen/40 text-sm text-muted">
            Program
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="space-y-2">
          <h3 className="font-display text-xl font-medium text-primary">
            <Link
              href={`/academy/${academySlug}/courses/${course.slug}`}
              className="hover:underline"
            >
              {course.title}
            </Link>
          </h3>
          {course.summary ? (
            <p className="text-sm leading-relaxed text-muted line-clamp-3">
              {course.summary}
            </p>
          ) : null}
        </div>
        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-muted">
          {duration ? <span>{duration}</span> : null}
          {course.moduleCount != null ? (
            <span>
              {course.moduleCount} module{course.moduleCount === 1 ? "" : "s"}
            </span>
          ) : null}
          {course.visibility === "AUTHENTICATED" ? (
            <span className="inline-flex items-center rounded-sm bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
              Members
            </span>
          ) : null}
        </div>
        <Link
          href={`/academy/${academySlug}/courses/${course.slug}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam hover:bg-primary/90"
        >
          View program
        </Link>
      </div>
    </article>
  );
}
