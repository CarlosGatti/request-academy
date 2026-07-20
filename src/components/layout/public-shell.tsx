"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";
import { clientEnv } from "@/lib/env/client";
import { useAuth } from "@/lib/auth/AuthProvider";

export function PublicHeader() {
  const academySlug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;
  const { isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-primary text-sea-foam">
      <Container className="flex h-20 items-center justify-between gap-4 sm:h-24">
        <Link href={`/academy/${academySlug}`} className="flex shrink-0 items-center gap-3">
          <BrandLogo priority />
          <span className="hidden font-display text-base font-medium tracking-wide sm:inline">
            Academy
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <Link
            href={`/academy/${academySlug}/courses`}
            className="opacity-90 hover:opacity-100"
          >
            Programs
          </Link>
          <Link
            href={`/academy/${academySlug}/resources`}
            className="hidden opacity-90 hover:opacity-100 sm:inline"
          >
            Resources
          </Link>
          <Link
            href={`/academy/${academySlug}/partners`}
            className="hidden opacity-90 hover:opacity-100 md:inline"
          >
            Partners
          </Link>
          {isAuthenticated ? (
            <Link
              href="/workspace"
              className="rounded-md bg-accent px-3 py-1.5 font-medium text-white hover:bg-accent/90"
            >
              Workspace
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-highlight px-3 py-1.5 font-medium text-white hover:bg-highlight/90"
            >
              Sign in
            </Link>
          )}
        </nav>
      </Container>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="flex flex-col gap-2 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>Defined Academy · Professional growth workspace</p>
        <p>Practical materials for real work</p>
      </Container>
    </footer>
  );
}
