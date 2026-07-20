import { redirect } from "next/navigation";
import { clientEnv } from "@/lib/env/client";

export default function HomePage() {
  redirect(`/academy/${clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG}`);
}
