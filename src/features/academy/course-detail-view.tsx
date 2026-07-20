"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ContentTypeBadge } from "@/components/academy/content-type-badge";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/ui/media-image";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import {
  DefinedAcademyBySlugDocument,
  DefinedAcademyCourseBySlugDocument,
  EnrollInDefinedAcademyCourseDocument,
  MyDefinedAcademyEnrollmentsDocument,
} from "@/graphql/generated/graphql";
import { formatDurationMinutes, formatDurationSeconds } from "@/lib/academy/labels";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  getGraphQLErrorMessage,
  isAlreadyEnrolledError,
} from "@/lib/graphql/errors";
import { Lock } from "lucide-react";

export function CourseDetailView({
  academySlug,
  courseSlug,
}: {
  academySlug: string;
  courseSlug: string;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const academyQuery = useQuery(DefinedAcademyBySlugDocument, {
    variables: { slug: academySlug },
  });
  const courseQuery = useQuery(DefinedAcademyCourseBySlugDocument, {
    variables: { academySlug, courseSlug },
  });
  const academyId = academyQuery.data?.definedAcademyBySlug?.id;
  const enrollmentsQuery = useQuery(MyDefinedAcademyEnrollmentsDocument, {
    variables: { academyId },
    skip: !isAuthenticated || !academyId,
  });

  const [enroll, { loading: enrolling }] = useMutation(
    EnrollInDefinedAcademyCourseDocument,
  );

  const course = courseQuery.data?.definedAcademyCourseBySlug;
  const enrollment = useMemo(() => {
    if (!course) return null;
    return (
      enrollmentsQuery.data?.myDefinedAcademyEnrollments.find(
        (item) => item.courseId === course.id,
      ) ?? null
    );
  }, [course, enrollmentsQuery.data]);

  const modules = useMemo(() => {
    const list = [...(course?.modules ?? [])];
    return list.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [course?.modules]);

  const lessonCount = modules.reduce(
    (total, module) => total + (module.lessons?.length ?? 0),
    0,
  );
  const previewLessons = modules.flatMap((module) =>
    (module.lessons ?? []).filter((lesson) => lesson.isPreview),
  );

  const onEnroll = async () => {
    if (!course) return;
    if (!isAuthenticated) {
      router.push(
        `/login?returnUrl=${encodeURIComponent(`/academy/${academySlug}/courses/${courseSlug}`)}`,
      );
      return;
    }

    setEnrollError(null);
    try {
      const result = await enroll({
        variables: { courseId: course.id },
      });
      if (result.data?.enrollInDefinedAcademyCourse) {
        await enrollmentsQuery.refetch();
        router.push(`/workspace/programs/${courseSlug}`);
        return;
      }
      if (result.error && isAlreadyEnrolledError(result.error)) {
        router.push(`/workspace/programs/${courseSlug}`);
        return;
      }
      setEnrollError(getGraphQLErrorMessage(result.error, "Unable to enroll."));
    } catch (err) {
      if (isAlreadyEnrolledError(err)) {
        router.push(`/workspace/programs/${courseSlug}`);
        return;
      }
      setEnrollError(getGraphQLErrorMessage(err, "Unable to enroll."));
    }
  };

  if (courseQuery.loading && !course) {
    return (
      <Container className="py-10">
        <PageLoading rows={5} />
      </Container>
    );
  }

  if (courseQuery.error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load program">
          {getGraphQLErrorMessage(courseQuery.error)}
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container className="py-10">
        <EmptyState
          title="Program not found"
          description="This program may be unpublished or private."
        />
      </Container>
    );
  }

  const duration = formatDurationMinutes(course.estimatedDurationMinutes);

  return (
    <Container className="space-y-10 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-6">
          <PageHeader
            title={course.title}
            description={course.summary || undefined}
          />
          {course.description ? (
            <div className="prose-academy whitespace-pre-wrap text-muted">
              {course.description}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3 text-sm text-muted">
            {duration ? <span>{duration}</span> : null}
            <span>
              {modules.length} module{modules.length === 1 ? "" : "s"}
            </span>
            <span>
              {lessonCount} lesson{lessonCount === 1 ? "" : "s"}
            </span>
            {course.visibility === "AUTHENTICATED" ? (
              <span className="text-accent">Members</span>
            ) : null}
            {course.visibility === "PRIVATE" ? (
              <span className="text-highlight">Invitation required</span>
            ) : null}
          </div>
          {enrollError ? <Alert tone="danger">{enrollError}</Alert> : null}
          <div className="flex flex-wrap gap-3">
            {enrollment ? (
              <Link
                href={`/workspace/programs/${courseSlug}`}
                className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-white"
              >
                Continue in workspace
              </Link>
            ) : course.visibility === "PRIVATE" ? (
              <Alert tone="warning" title="Invitation required">
                This program is private. Contact your academy administrator for access.
              </Alert>
            ) : (
              <Button
                variant="highlight"
                onClick={() => void onEnroll()}
                disabled={enrolling}
              >
                {enrolling
                  ? "Enrolling…"
                  : isAuthenticated
                    ? "Enroll in program"
                    : "Sign in to enroll"}
              </Button>
            )}
            <Link
              href={`/academy/${academySlug}/resources`}
              className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-primary"
            >
              Browse materials
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden border border-border bg-secondary">
          {course.coverImageUrl ? (
            <MediaImage
              src={course.coverImageUrl}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Program cover
            </div>
          )}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-medium text-primary">
          Practical outcomes
        </h2>
        <p className="max-w-3xl text-muted">
          Complete structured lessons and collect reusable guides, templates, and
          checklists you can apply in day-to-day professional work.
        </p>
      </section>

      {previewLessons.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-display text-2xl font-medium text-primary">
            Preview lessons
          </h2>
          <ul className="space-y-2">
            {previewLessons.map((lesson) => (
              <li key={lesson.id}>
                <Link
                  href={`/academy/${academySlug}/courses/${courseSlug}/lessons/${lesson.slug}`}
                  className="flex items-center justify-between gap-3 border border-border bg-surface px-4 py-3 hover:bg-sea-foam"
                >
                  <span className="font-medium text-primary">{lesson.title}</span>
                  <ContentTypeBadge type={lesson.lessonType} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-medium text-primary">
          Program structure
        </h2>
        {modules.length === 0 ? (
          <EmptyState title="No modules yet" description="Syllabus coming soon." />
        ) : (
          <div className="space-y-4">
            {modules.map((module) => {
              const lessons = [...(module.lessons ?? [])].sort(
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
                    {lessons.map((lesson) => {
                      const canOpen = lesson.isPreview || isAuthenticated;
                      const durationLabel = formatDurationSeconds(
                        lesson.videoDurationSeconds,
                      );
                      const content = (
                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                          <div className="min-w-0 space-y-1">
                            <p className="font-medium text-primary">{lesson.title}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                              <ContentTypeBadge type={lesson.lessonType} />
                              {durationLabel ? <span>{durationLabel}</span> : null}
                              {lesson.isPreview ? (
                                <span className="text-accent">Preview</span>
                              ) : null}
                            </div>
                          </div>
                          {!canOpen ? (
                            <Lock className="size-4 text-muted" aria-label="Locked" />
                          ) : null}
                        </div>
                      );

                      return (
                        <li key={lesson.id}>
                          {canOpen ? (
                            <Link
                              href={`/academy/${academySlug}/courses/${courseSlug}/lessons/${lesson.slug}`}
                              className="block hover:bg-sea-foam"
                            >
                              {content}
                            </Link>
                          ) : (
                            content
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </Container>
  );
}
