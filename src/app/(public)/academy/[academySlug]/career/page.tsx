"use client";

import { use } from "react";
import { CareerJourneyPage } from "@/features/academy/career/career-journey-page";

export default function AcademyCareerRoute({
  params,
}: {
  params: Promise<{ academySlug: string }>;
}) {
  const { academySlug } = use(params);
  return <CareerJourneyPage academySlug={academySlug} />;
}
