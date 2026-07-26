"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";
import { clientEnv } from "@/lib/env/client";
import { useAuth } from "@/lib/auth/AuthProvider";

export function PublicHeader() {
  const academySlug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;
  const { isAuthenticated, hasDefinedAccess } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-primary/55 text-sea-foam backdrop-blur-xl supports-[backdrop-filter]:bg-primary/40">
      <Container className="flex h-16 items-center justify-between gap-4 sm:h-[4.5rem]">
        <Link href={`/academy/${academySlug}`} className="flex shrink-0 items-center gap-3">
          <BrandLogo priority className="h-10 w-40 sm:h-12 sm:w-48" />
          <span className="hidden font-display text-base font-medium tracking-wide text-sea-foam/95 sm:inline">
            Academy
          </span>
        </Link>
        <nav className="flex items-center gap-3 text-sm sm:gap-4">
          <Link
            href={`/academy/${academySlug}/courses`}
            className="text-sea-foam/85 hover:text-sea-foam"
          >
            Programs
          </Link>
          <Link
            href={`/academy/${academySlug}/career`}
            className="rounded-md border border-lichen/35 bg-white/5 px-3 py-1.5 font-medium text-sea-foam hover:bg-white/10"
          >
            Career
          </Link>
          <Link
            href={`/academy/${academySlug}/resources`}
            className="hidden text-sea-foam/85 hover:text-sea-foam sm:inline"
          >
            Resources
          </Link>
          <Link
            href={`/academy/${academySlug}/partners`}
            className="hidden text-sea-foam/85 hover:text-sea-foam md:inline"
          >
            Partners
          </Link>
          {isAuthenticated ? (
            <>
              {hasDefinedAccess ? (
                <Link
                  href="/admin"
                  className="hidden text-sea-foam/85 hover:text-sea-foam sm:inline"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/workspace"
                className="rounded-md bg-accent px-3 py-1.5 font-medium text-white hover:bg-accent/90"
              >
                Workspace
              </Link>
            </>
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
