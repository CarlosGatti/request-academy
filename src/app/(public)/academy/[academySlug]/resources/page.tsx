"use client";

import { use } from "react";
import { ResourcesListView } from "@/features/academy/resources-list-view";

export default function ResourcesPage({
  params,
}: {
  params: Promise<{ academySlug: string }>;
}) {
  const { academySlug } = use(params);
  return <ResourcesListView academySlug={academySlug} />;
}
