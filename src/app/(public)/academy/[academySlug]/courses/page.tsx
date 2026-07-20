"use client";

import { use } from "react";
import { CoursesListView } from "@/features/academy/courses-list-view";

export default function CoursesPage({
  params,
}: {
  params: Promise<{ academySlug: string }>;
}) {
  const { academySlug } = use(params);
  return <CoursesListView academySlug={academySlug} />;
}
