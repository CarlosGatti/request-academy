"use client";

import { use } from "react";
import { ShortLinkResolver } from "@/features/academy/short-link-resolver";

export default function ShortLinkPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  return <ShortLinkResolver code={code} />;
}
