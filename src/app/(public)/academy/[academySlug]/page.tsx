"use client";

import { use } from "react";
import { AcademyHomeView } from "@/features/academy/academy-home-view";

export default function AcademyHomePage({
  params,
}: {
  params: Promise<{ academySlug: string }>;
}) {
  const { academySlug } = use(params);
  return <AcademyHomeView academySlug={academySlug} />;
}
