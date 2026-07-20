"use client";

import { use } from "react";
import { PartnersListView } from "@/features/academy/partners-list-view";

export default function PartnersPage({
  params,
}: {
  params: Promise<{ academySlug: string }>;
}) {
  const { academySlug } = use(params);
  return <PartnersListView academySlug={academySlug} />;
}
