"use client";

import { use } from "react";
import { WorkspaceProgramView } from "@/features/workspace/workspace-program-view";

export default function WorkspaceProgramPage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const { courseSlug } = use(params);
  return <WorkspaceProgramView courseSlug={courseSlug} />;
}
