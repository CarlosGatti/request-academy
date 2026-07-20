"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ContentTypeBadge } from "@/components/academy/content-type-badge";
import { ResourceCard } from "@/components/resources/resource-card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoading } from "@/components/ui/page-loading";
import { ProgressBar } from "@/components/ui/progress-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  findAdjacentLessons,
  flattenCourseLessons,
} from "@/features/workspace/lesson-utils";
import {
  LessonVideoPlayer,
  ManualProgressControls,
} from "@/features/workspace/lesson-video-player";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import {
  CompleteDefinedAcademyLessonDocument,
  DefinedAcademyCourseBySlugDocument,
  DefinedAcademyLessonBySlugDocument,
  MyDefinedAcademyCourseProgressDocument,
  MyDefinedAcademyEnrollmentsDocument,
  MyDefinedAcademyLessonProgressDocument,
  StartDefinedAcademyLessonDocument,
} from "@/graphql/generated/graphql";
import { cn } from "@/lib/utils/cn";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { Check, ChevronLeft, ChevronRight, List } from "lucide-react";

export function WorkspaceLessonView({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  return (
    <WorkspaceLessonSession
      key={`${courseSlug}:${lessonSlug}`}
      courseSlug={courseSlug}
      lessonSlug={lessonSlug}
    />
  );
}

function WorkspaceLessonSession({
  courseSlug,
  lessonSlug,
}: {
  courseSlug: string;
  lessonSlug: string;
}) {
  const router = useRouter();
  const { slug, academyId } = useDefaultAcademy();
  const [navOpen, setNavOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [resumeSeconds, setResumeSeconds] = useState<number | null>(null);
  const startAttemptedRef = useRef(false);

  const courseQuery = useQuery(DefinedAcademyCourseBySlugDocument, {
    variables: { academySlug: slug, courseSlug },
  });
  const lessonQuery = useQuery(DefinedAcademyLessonBySlugDocument, {
    variables: { academySlug: slug, courseSlug, lessonSlug },
  });
  const enrollmentsQuery = useQuery(MyDefinedAcademyEnrollmentsDocument, {
    variables: { academyId },
    skip: !academyId,
  });

  const course = courseQuery.data?.definedAcademyCourseBySlug;
  const lesson = lessonQuery.data?.definedAcademyLessonBySlug;
  const enrollment = useMemo(
    () =>
      enrollmentsQuery.data?.myDefinedAcademyEnrollments.find(
        (item) => item.courseId === course?.id,
      ) ?? null,
    [course?.id, enrollmentsQuery.data],
  );

  const lessons = useMemo(
    () => flattenCourseLessons(course?.modules),
    [course?.modules],
  );
  const { previous, next, current, index } = findAdjacentLessons(
    lessons,
    lessonSlug,
  );

  const progressQuery = useQuery(MyDefinedAcademyCourseProgressDocument, {
    variables: { courseId: course?.id ?? 0 },
    skip: !course?.id || !enrollment,
  });

  const lessonProgressQuery = useQuery(MyDefinedAcademyLessonProgressDocument, {
    variables: {
      enrollmentId: enrollment?.id ?? 0,
      lessonId: lesson?.id ?? 0,
    },
    skip: !enrollment?.id || !lesson?.id || !started,
  });

  const [startLesson] = useMutation(StartDefinedAcademyLessonDocument);
  const [completeLesson, { loading: completing }] = useMutation(
    CompleteDefinedAcademyLessonDocument,
  );

  useEffect(() => {
    if (!enrollment?.id || !lesson?.id || startAttemptedRef.current) return;
    startAttemptedRef.current = true;

    void (async () => {
      try {
        const result = await startLesson({
          variables: {
            enrollmentId: enrollment.id,
            lessonId: lesson.id,
          },
        });
        const progress = result.data?.startDefinedAcademyLesson;
        if (progress?.lastPositionSeconds != null) {
          setResumeSeconds(progress.lastPositionSeconds);
        }
        setStarted(true);
        await progressQuery.refetch();
      } catch (err) {
        setActionError(getGraphQLErrorMessage(err, "Unable to start lesson."));
        setStarted(true);
      }
    })();
  }, [enrollment?.id, lesson?.id, progressQuery, startLesson]);

  const lessonProgress = lessonProgressQuery.data?.myDefinedAcademyLessonProgress;
  const initialPosition =
    resumeSeconds ?? lessonProgress?.lastPositionSeconds ?? null;
  const courseProgress = progressQuery.data?.myDefinedAcademyCourseProgress;
  const resources = lesson?.resources ?? [];
  const isComplete = lessonProgress?.status === "COMPLETED";

  const onComplete = async () => {
    if (!enrollment?.id || !lesson?.id) return;
    setActionError(null);
    try {
      await completeLesson({
        variables: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        },
      });
      await progressQuery.refetch();
      await lessonProgressQuery.refetch();
      if (next) {
        router.push(`/workspace/programs/${courseSlug}/lessons/${next.slug}`);
      }
    } catch (err) {
      setActionError(getGraphQLErrorMessage(err, "Unable to complete lesson."));
    }
  };

  if (
    (courseQuery.loading && !course) ||
    (lessonQuery.loading && !lesson) ||
    (enrollmentsQuery.loading && !enrollmentsQuery.data)
  ) {
    return <PageLoading rows={5} />;
  }

  if (!course || !lesson) {
    return (
      <EmptyState
        title="Lesson not available"
        description="This lesson may be unpublished or you may need to enroll first."
        action={
          <Link
            href={`/workspace/programs/${courseSlug}`}
            className="text-sm font-medium text-accent hover:underline"
          >
            Back to program
          </Link>
        }
      />
    );
  }

  if (!enrollment) {
    return (
      <EmptyState
        title="Enrollment required"
        description="Enroll in this program to open the lesson workspace."
        action={
          <Link
            href={`/workspace/programs/${courseSlug}`}
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
          >
            Go to program
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/workspace/programs/${courseSlug}`}
          className="text-sm font-medium text-accent hover:underline"
        >
          {course.title}
        </Link>
        {courseProgress ? (
          <div className="w-full max-w-xs sm:w-48">
            <ProgressBar
              value={courseProgress.progressPercentage}
              label="Program"
            />
          </div>
        ) : null}
      </div>

      <div className="lg:hidden">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setNavOpen((open) => !open)}
        >
          <List className="size-4" aria-hidden />
          {navOpen ? "Hide structure" : "Program structure"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        <aside
          className={cn(
            "border border-border bg-surface lg:block",
            navOpen ? "block" : "hidden",
          )}
        >
          <div className="border-b border-border px-3 py-2 text-xs font-medium tracking-wide text-muted uppercase">
            Program structure
          </div>
          <nav className="max-h-[50vh] overflow-y-auto p-2 lg:max-h-[70vh]">
            {lessons.map((item) => (
              <Link
                key={item.id}
                href={`/workspace/programs/${courseSlug}/lessons/${item.slug}`}
                className={cn(
                  "block rounded-md px-2 py-2 text-sm",
                  item.slug === lessonSlug
                    ? "bg-secondary font-medium text-primary"
                    : "text-muted hover:bg-sea-foam hover:text-primary",
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <ContentTypeBadge type={lesson.lessonType} />
              {lessonProgress ? (
                <StatusBadge status={lessonProgress.status} />
              ) : null}
              {index >= 0 ? (
                <span className="text-xs text-muted">
                  Lesson {index + 1} of {lessons.length}
                </span>
              ) : null}
            </div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-primary">
              {lesson.title}
            </h1>
            {lesson.summary ? (
              <p className="text-muted">{lesson.summary}</p>
            ) : null}
          </div>

          {actionError ? <Alert tone="danger">{actionError}</Alert> : null}

          {(lesson.lessonType === "VIDEO" || lesson.lessonType === "MIXED") &&
          lesson.videoUrl ? (
            <LessonVideoPlayer
              enrollmentId={enrollment.id}
              lessonId={lesson.id}
              videoUrl={lesson.videoUrl}
              title={lesson.title}
              initialPositionSeconds={initialPosition}
            />
          ) : null}

          {(lesson.lessonType === "ARTICLE" ||
            lesson.lessonType === "MIXED" ||
            lesson.lessonType === "RESOURCE" ||
            lesson.bodyContent) &&
          lesson.bodyContent ? (
            <article className="prose-academy whitespace-pre-wrap border border-border bg-surface p-6">
              {lesson.bodyContent}
            </article>
          ) : null}

          {!lesson.videoUrl && !lesson.bodyContent ? (
            <EmptyState
              title="Practical materials focus"
              description="Use the resources panel for templates, guides, and downloads."
            />
          ) : null}

          {(lesson.lessonType === "ARTICLE" ||
            lesson.lessonType === "RESOURCE" ||
            lesson.lessonType === "MIXED") &&
          !lesson.videoUrl ? (
            <ManualProgressControls
              enrollmentId={enrollment.id}
              lessonId={lesson.id}
            />
          ) : null}

          <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {previous ? (
                <Link
                  href={`/workspace/programs/${courseSlug}/lessons/${previous.slug}`}
                  className="inline-flex h-10 items-center gap-1 rounded-md border border-border bg-surface px-3 text-sm font-medium text-primary"
                >
                  <ChevronLeft className="size-4" aria-hidden />
                  Previous
                </Link>
              ) : null}
              {next ? (
                <Link
                  href={`/workspace/programs/${courseSlug}/lessons/${next.slug}`}
                  className="inline-flex h-10 items-center gap-1 rounded-md border border-border bg-surface px-3 text-sm font-medium text-primary"
                >
                  Next
                  <ChevronRight className="size-4" aria-hidden />
                </Link>
              ) : null}
            </div>
            <Button
              variant={isComplete ? "secondary" : "accent"}
              disabled={completing || isComplete}
              onClick={() => void onComplete()}
            >
              <Check className="size-4" aria-hidden />
              {isComplete
                ? "Completed"
                : completing
                  ? "Saving…"
                  : next
                    ? "Complete & continue"
                    : "Mark complete"}
            </Button>
          </div>
        </section>

        <aside className="space-y-4 border border-border bg-surface p-4 lg:border-0 lg:bg-transparent lg:p-0">
          <h2 className="font-display text-lg font-medium text-primary">
            Practical materials
          </h2>
          {current ? (
            <p className="text-xs text-muted">{current.moduleTitle}</p>
          ) : null}
          {resources.length === 0 ? (
            <p className="text-sm text-muted">
              No linked resources for this lesson.
            </p>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
