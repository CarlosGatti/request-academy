"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { EmptyState } from "@/components/ui/empty-state";
import { MediaImage } from "@/components/ui/media-image";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { EnrollmentProgress } from "@/features/workspace/enrollment-progress";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import {
  DefinedAcademyPublishedCoursesDocument,
  MyDefinedAcademyEnrollmentsDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function WorkspaceProgramsView() {
  const { slug, academyId, loading: academyLoading } = useDefaultAcademy();
  const enrollmentsQuery = useQuery(MyDefinedAcademyEnrollmentsDocument, {
    variables: { academyId },
    skip: !academyId,
  });
  const coursesQuery = useQuery(DefinedAcademyPublishedCoursesDocument, {
    variables: { academySlug: slug },
  });

  const enrollments = enrollmentsQuery.data?.myDefinedAcademyEnrollments ?? [];
  const enrolledIds = new Set(enrollments.map((item) => item.courseId));
  const available = (coursesQuery.data?.definedAcademyPublishedCourses ?? []).filter(
    (course) => !enrolledIds.has(course.id),
  );

  if (academyLoading || (enrollmentsQuery.loading && !enrollmentsQuery.data)) {
    return <PageLoading />;
  }

  if (enrollmentsQuery.error) {
    return (
      <Alert tone="danger" title="Unable to load programs">
        {getGraphQLErrorMessage(enrollmentsQuery.error)}
      </Alert>
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Programs"
        description="Your development paths and available professional programs."
      />

      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-primary">
          Your programs
        </h2>
        {enrollments.length === 0 ? (
          <EmptyState
            title="No enrolled programs"
            description="Browse available pathways and enroll to track progress here."
            action={
              <Link
                href={`/academy/${slug}/courses`}
                className="text-sm font-medium text-accent hover:underline"
              >
                Browse programs
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/workspace/programs/${enrollment.course?.slug ?? enrollment.courseId}`}
                className="flex flex-col gap-4 border border-border bg-surface p-4 hover:bg-sea-foam sm:flex-row sm:items-center"
              >
                <div className="relative size-16 shrink-0 overflow-hidden bg-secondary">
                  {enrollment.course?.coverImageUrl ? (
                    <MediaImage
                      src={enrollment.course.coverImageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-medium text-primary">
                      {enrollment.course?.title ?? `Program ${enrollment.courseId}`}
                    </h3>
                    <StatusBadge status={enrollment.status} />
                  </div>
                  {enrollment.course?.summary ? (
                    <p className="text-sm text-muted line-clamp-2">
                      {enrollment.course.summary}
                    </p>
                  ) : null}
                  <EnrollmentProgress courseId={enrollment.courseId} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {available.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-xl font-medium text-primary">
            Available
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {available.map((course) => (
              <Link
                key={course.id}
                href={`/academy/${slug}/courses/${course.slug}`}
                className="border border-border bg-surface p-4 hover:bg-sea-foam"
              >
                <h3 className="font-display text-base font-medium text-primary">
                  {course.title}
                </h3>
                {course.summary ? (
                  <p className="mt-2 text-sm text-muted line-clamp-2">
                    {course.summary}
                  </p>
                ) : null}
                <span className="mt-3 inline-block text-sm font-medium text-accent">
                  View program
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
