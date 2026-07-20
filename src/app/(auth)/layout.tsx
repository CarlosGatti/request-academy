import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";
import { clientEnv } from "@/lib/env/client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const academySlug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-primary text-sea-foam">
        <Container className="flex h-20 items-center sm:h-24">
          <Link
            href={`/academy/${academySlug}`}
            className="flex shrink-0 items-center gap-3"
          >
            <BrandLogo priority />
            <span className="hidden font-display text-base font-medium tracking-wide sm:inline">
              Academy
            </span>
          </Link>
        </Container>
      </header>
      <Container className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">{children}</div>
      </Container>
    </div>
  );
}
