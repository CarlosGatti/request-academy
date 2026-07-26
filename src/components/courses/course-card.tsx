import { MediaImage } from "@/components/ui/media-image";
import { buttonClassName } from "@/components/ui/button";
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
  const href = `/academy/${academySlug}/courses/${course.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border/70 transition-shadow hover:shadow-lg focus-within:ring-2 focus-within:ring-accent/40",
        className,
      )}
    >
      <Link href={href} className="relative block aspect-[16/10] bg-sea-foam">
        {course.coverImageUrl ? (
          <MediaImage
            src={course.coverImageUrl}
            alt=""
            fill
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-lichen/35 text-sm text-muted">
            Program
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-2">
          <h3 className="font-display text-xl font-medium text-primary">
            <Link
              href={href}
              className="rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
          {duration ? (
            <span className="rounded-md bg-sea-foam px-2.5 py-1 font-medium text-primary">
              {duration}
            </span>
          ) : null}
          {course.moduleCount != null ? (
            <span>
              {course.moduleCount} module{course.moduleCount === 1 ? "" : "s"}
            </span>
          ) : null}
          {course.visibility === "AUTHENTICATED" ? (
            <span className="inline-flex items-center rounded-md bg-accent/15 px-2.5 py-1 text-xs font-medium text-accent">
              Members
            </span>
          ) : null}
        </div>
        <Link href={href} className={buttonClassName({ variant: "primary", size: "lg" })}>
          View program
        </Link>
      </div>
    </article>
  );
}
