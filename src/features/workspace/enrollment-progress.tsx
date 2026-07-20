"use client";

import { useQuery } from "@apollo/client/react";
import { MyDefinedAcademyCourseProgressDocument } from "@/graphql/generated/graphql";
import { ProgressBar } from "@/components/ui/progress-bar";

export function EnrollmentProgress({
  courseId,
  compact = false,
}: {
  courseId: number;
  compact?: boolean;
}) {
  const { data, loading } = useQuery(MyDefinedAcademyCourseProgressDocument, {
    variables: { courseId },
  });

  const progress = data?.myDefinedAcademyCourseProgress;

  if (loading && !progress) {
    return (
      <div className="h-2 w-full animate-pulse rounded-sm bg-secondary" aria-hidden />
    );
  }

  if (!progress) return null;

  return (
    <ProgressBar
      value={progress.progressPercentage}
      label={
        compact
          ? undefined
          : `${progress.completedLessons} of ${progress.totalLessons} lessons`
      }
    />
  );
}
