"use client";

import { use } from "react";
import { LessonPreviewView } from "@/features/academy/lesson-preview-view";

export default function LessonPage({
  params,
}: {
  params: Promise<{
    academySlug: string;
    courseSlug: string;
    lessonSlug: string;
  }>;
}) {
  const { academySlug, courseSlug, lessonSlug } = use(params);
  return (
    <LessonPreviewView
      academySlug={academySlug}
      courseSlug={courseSlug}
      lessonSlug={lessonSlug}
    />
  );
}
