"use client";

import { useQuery } from "@apollo/client/react";
import Link from "next/link";
import { ContentTypeBadge } from "@/components/academy/content-type-badge";
import { ResourceCard } from "@/components/resources/resource-card";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { DefinedAcademyLessonBySlugDocument } from "@/graphql/generated/graphql";
import { formatDurationSeconds } from "@/lib/academy/labels";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const isYouTube =
    url.includes("youtube.com") || url.includes("youtu.be") || url.includes("vimeo.com");

  if (isYouTube || url.includes("embed")) {
    return (
      <div className="aspect-video overflow-hidden border border-border bg-primary/5">
        <iframe
          src={url}
          title={title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <video controls className="w-full border border-border bg-black" src={url}>
      <track kind="captions" />
    </video>
  );
}

export function LessonPreviewView({
  academySlug,
  courseSlug,
  lessonSlug,
}: {
  academySlug: string;
  courseSlug: string;
  lessonSlug: string;
}) {
  const { isAuthenticated } = useAuth();
  const { data, loading, error } = useQuery(DefinedAcademyLessonBySlugDocument, {
    variables: { academySlug, courseSlug, lessonSlug },
  });

  const lesson = data?.definedAcademyLessonBySlug;

  if (loading && !lesson) {
    return (
      <Container className="py-10">
        <PageLoading rows={4} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load lesson">
          {getGraphQLErrorMessage(error)}
        </Alert>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container className="py-10">
        <EmptyState
          title="Lesson not available"
          description={
            isAuthenticated
              ? "This lesson may be unpublished or restricted."
              : "Sign in if this lesson requires an account, or choose a preview lesson."
          }
          action={
            !isAuthenticated ? (
              <Link
                href={`/login?returnUrl=${encodeURIComponent(`/academy/${academySlug}/courses/${courseSlug}/lessons/${lessonSlug}`)}`}
                className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
              >
                Sign in
              </Link>
            ) : undefined
          }
        />
      </Container>
    );
  }

  const resources = lesson.resources ?? [];
  const duration = formatDurationSeconds(lesson.videoDurationSeconds);

  return (
    <Container className="space-y-8 py-10">
      <div className="space-y-3">
        <Link
          href={`/academy/${academySlug}/courses/${courseSlug}`}
          className="text-sm font-medium text-accent hover:underline"
        >
          Back to program
        </Link>
        <PageHeader
          title={lesson.title}
          description={lesson.summary || undefined}
          actions={<ContentTypeBadge type={lesson.lessonType} />}
        />
        <div className="flex flex-wrap gap-3 text-sm text-muted">
          {lesson.isPreview ? <span className="text-accent">Preview</span> : null}
          {duration ? <span>{duration}</span> : null}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-6">
          {(lesson.lessonType === "VIDEO" || lesson.lessonType === "MIXED") &&
          lesson.videoUrl ? (
            <VideoEmbed url={lesson.videoUrl} title={lesson.title} />
          ) : null}

          {(lesson.lessonType === "ARTICLE" ||
            lesson.lessonType === "MIXED" ||
            lesson.bodyContent) &&
          lesson.bodyContent ? (
            <article className="prose-academy whitespace-pre-wrap border border-border bg-surface p-6">
              {lesson.bodyContent}
            </article>
          ) : null}

          {!lesson.videoUrl && !lesson.bodyContent ? (
            <EmptyState
              title="Structured content"
              description="This lesson focuses on practical materials. Review the resources panel."
            />
          ) : null}

          {!lesson.isPreview && isAuthenticated ? (
            <Alert tone="info">
              Track progress and mark completion from your{" "}
              <Link
                href={`/workspace/programs/${courseSlug}/lessons/${lessonSlug}`}
                className="font-medium underline"
              >
                professional workspace
              </Link>
              .
            </Alert>
          ) : null}
        </div>

        <aside className="space-y-4">
          <h2 className="font-display text-xl font-medium text-primary">
            Practical materials
          </h2>
          {resources.length === 0 ? (
            <p className="text-sm text-muted">No linked resources for this lesson.</p>
          ) : (
            <div className="space-y-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </aside>
      </div>
    </Container>
  );
}
