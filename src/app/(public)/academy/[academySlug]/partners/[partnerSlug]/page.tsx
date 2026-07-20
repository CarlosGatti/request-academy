"use client";

import { use } from "react";
import { PartnerDetailView } from "@/features/academy/partner-detail-view";

export default function PartnerDetailPage({
  params,
}: {
  params: Promise<{ academySlug: string; partnerSlug: string }>;
}) {
  const { academySlug, partnerSlug } = use(params);
  return (
    <PartnerDetailView academySlug={academySlug} partnerSlug={partnerSlug} />
  );
}
