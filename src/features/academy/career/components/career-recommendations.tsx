"use client";

import Link from "next/link";
import { MediaImage } from "@/components/ui/media-image";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDurationMinutes, resourceTypeLabel } from "@/lib/academy/labels";

type CourseRec = {
  id: number | string;
  title: string;
  slug: string;
  summary?: string | null;
  coverImageUrl?: string | null;
  estimatedDurationMinutes?: number | null;
};

type ResourceRec = {
  id: number | string;
  title: string;
  type: string;
  fileUrl?: string | null;
  externalUrl?: string | null;
};

export function CareerRecommendations({
  academySlug,
  courses,
  resources,
  loading,
}: {
  academySlug: string;
  courses: CourseRec[];
  resources: ResourceRec[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <p className="text-sm text-muted">Loading recommendations for your stage…</p>
    );
  }

  if (courses.length === 0 && resources.length === 0) {
    return (
      <EmptyState
        title="New resources for this stage are on the way"
        description="Content linked to your current career stage will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      {courses.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {courses.map((course) => {
            const duration = formatDurationMinutes(
              course.estimatedDurationMinutes,
            );
            return (
              <Link
                key={String(course.id)}
                href={`/academy/${academySlug}/courses/${course.slug}`}
                className="flex gap-3 border border-border bg-surface p-3 hover:bg-sea-foam"
              >
                <div className="relative size-14 shrink-0 overflow-hidden bg-secondary">
                  {course.coverImageUrl ? (
                    <MediaImage
                      src={course.coverImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 space-y-1">
                  <p className="font-display text-sm font-medium text-primary line-clamp-2">
                    {course.title}
                  </p>
                  {course.summary ? (
                    <p className="text-xs text-muted line-clamp-2">
                      {course.summary}
                    </p>
                  ) : null}
                  {duration ? (
                    <p className="text-[11px] text-muted">{duration}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      ) : null}

      {resources.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Materials
          </p>
          <ul className="space-y-2">
            {resources.map((resource) => {
              const href = resource.fileUrl || resource.externalUrl;
              return (
                <li key={String(resource.id)}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-3 border border-border bg-surface px-3 py-2 text-sm hover:bg-sea-foam"
                    >
                      <span className="font-medium text-primary">
                        {resource.title}
                      </span>
                      <span className="text-xs text-muted">
                        {resourceTypeLabel(resource.type)}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-3 border border-border bg-surface px-3 py-2 text-sm">
                      <span className="font-medium text-primary">
                        {resource.title}
                      </span>
                      <span className="text-xs text-muted">
                        {resourceTypeLabel(resource.type)}
                      </span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
