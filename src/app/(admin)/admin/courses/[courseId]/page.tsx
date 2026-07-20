"use client";

import { use } from "react";
import { AdminCourseDetailView } from "@/features/admin/admin-course-detail-view";

export default function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  return <AdminCourseDetailView courseId={Number(courseId)} />;
}
