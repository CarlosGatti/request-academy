"use client";

import { use } from "react";
import { CourseDetailView } from "@/features/academy/course-detail-view";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ academySlug: string; courseSlug: string }>;
}) {
  const { academySlug, courseSlug } = use(params);
  return (
    <CourseDetailView academySlug={academySlug} courseSlug={courseSlug} />
  );
}
