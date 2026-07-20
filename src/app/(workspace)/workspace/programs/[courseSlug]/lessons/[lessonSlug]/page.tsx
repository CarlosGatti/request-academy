"use client";

import { use } from "react";
import { WorkspaceLessonView } from "@/features/workspace/workspace-lesson-view";

export default function WorkspaceLessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = use(params);
  return (
    <WorkspaceLessonView courseSlug={courseSlug} lessonSlug={lessonSlug} />
  );
}
