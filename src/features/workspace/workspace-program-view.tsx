"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ContentTypeBadge } from "@/components/academy/content-type-badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { flattenCourseLessons } from "@/features/workspace/lesson-utils";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import {
  DefinedAcademyCourseBySlugDocument,
  EnrollInDefinedAcademyCourseDocument,
  MyDefinedAcademyCourseProgressDocument,
  MyDefinedAcademyEnrollmentsDocument,
} from "@/graphql/generated/graphql";
import {
  getGraphQLErrorMessage,
  isAlreadyEnrolledError,
} from "@/lib/graphql/errors";

export function WorkspaceProgramView({ courseSlug }: { courseSlug: string }) {
  const { slug, academyId } = useDefaultAcademy();
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const courseQuery = useQuery(DefinedAcademyCourseBySlugDocument, {
    variables: { academySlug: slug, courseSlug },
  });
  const enrollmentsQuery = useQuery(MyDefinedAcademyEnrollmentsDocument, {
    variables: { academyId },
    skip: !academyId,
  });

  const course = courseQuery.data?.definedAcademyCourseBySlug;
  const enrollment = useMemo(
    () =>
      enrollmentsQuery.data?.myDefinedAcademyEnrollments.find(
        (item) => item.courseId === course?.id,
      ) ?? null,
    [course?.id, enrollmentsQuery.data],
  );

  const progressQuery = useQuery(MyDefinedAcademyCourseProgressDocument, {
    variables: { courseId: course?.id ?? 0 },
    skip: !course?.id || !enrollment,
  });

  const [enroll, { loading: enrolling }] = useMutation(
    EnrollInDefinedAcademyCourseDocument,
  );

  const lessons = useMemo(
    () => flattenCourseLessons(course?.modules),
    [course?.modules],
  );

  const firstIncomplete = lessons[0];
  const progress = progressQuery.data?.myDefinedAcademyCourseProgress;

  const onEnroll = async () => {
    if (!course) return;
    setEnrollError(null);
    try {
      const result = await enroll({ variables: { courseId: course.id } });
      if (result.data?.enrollInDefinedAcademyCourse || isAlreadyEnrolledError(result.error)) {
        await enrollmentsQuery.refetch();
        await progressQuery.refetch();
        return;
      }
      setEnrollError(getGraphQLErrorMessage(result.error, "Unable to enroll."));
    } catch (err) {
      if (isAlreadyEnrolledError(err)) {
        await enrollmentsQuery.refetch();
        return;
      }
      setEnrollError(getGraphQLErrorMessage(err, "Unable to enroll."));
    }
  };

  if (courseQuery.loading && !course) {
    return <PageLoading rows={5} />;
  }

  if (courseQuery.error) {
    return (
      <Alert tone="danger" title="Unable to load program">
        {getGraphQLErrorMessage(courseQuery.error)}
      </Alert>
    );
  }

  if (!course) {
    return (
      <EmptyState
        title="Program not found"
        description="This development path may be unpublished."
        action={
          <Link href="/workspace/programs" className="text-sm font-medium text-accent hover:underline">
            Back to programs
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <Link
          href="/workspace/programs"
          className="text-sm font-medium text-accent hover:underline"
        >
          Back to programs
        </Link>
        <PageHeader
          title={course.title}
          description={course.summary || undefined}
          actions={
            enrollment ? <StatusBadge status={enrollment.status} /> : undefined
          }
        />
      </div>

      {progress ? (
        <ProgressBar
          value={progress.progressPercentage}
          label={`${progress.completedLessons} of ${progress.totalLessons} lessons completed`}
        />
      ) : null}

      {enrollError ? <Alert tone="danger">{enrollError}</Alert> : null}

      <div className="flex flex-wrap gap-3">
        {enrollment && firstIncomplete ? (
          <Link
            href={`/workspace/programs/${courseSlug}/lessons/${firstIncomplete.slug}`}
            className="inline-flex h-10 items-center rounded-md bg-highlight px-4 text-sm font-medium text-white"
          >
            Continue
          </Link>
        ) : null}
        {!enrollment ? (
          <Button variant="highlight" disabled={enrolling} onClick={() => void onEnroll()}>
            {enrolling ? "Enrolling…" : "Enroll in program"}
          </Button>
        ) : null}
        <Link
          href="/workspace/resources"
          className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-primary"
        >
          Toolkit
        </Link>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-primary">
          Development path
        </h2>
        {lessons.length === 0 ? (
          <EmptyState title="No lessons yet" description="Content will appear when published." />
        ) : (
          <div className="space-y-4">
            {[...(course.modules ?? [])]
              .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
              .map((module) => {
                const moduleLessons = [...(module.lessons ?? [])].sort(
                  (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
                );
                return (
                  <div key={module.id} className="border border-border bg-surface">
                    <div className="border-b border-border bg-secondary/50 px-4 py-3">
                      <h3 className="font-display text-lg font-medium text-primary">
                        {module.title}
                      </h3>
                    </div>
                    <ul className="divide-y divide-border">
                      {moduleLessons.map((lesson) => (
                        <li key={lesson.id}>
                          {enrollment ? (
                            <Link
                              href={`/workspace/programs/${courseSlug}/lessons/${lesson.slug}`}
                              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-sea-foam"
                            >
                              <span className="font-medium text-primary">
                                {lesson.title}
                              </span>
                              <ContentTypeBadge type={lesson.lessonType} />
                            </Link>
                          ) : (
                            <div className="flex items-center justify-between gap-3 px-4 py-3 opacity-70">
                              <span className="font-medium text-primary">
                                {lesson.title}
                              </span>
                              <ContentTypeBadge type={lesson.lessonType} />
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </div>
  );
}
