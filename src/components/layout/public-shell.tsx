"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";
import { buttonClassName } from "@/components/ui/button";
import { clientEnv } from "@/lib/env/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

export function PublicHeader() {
  const academySlug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;
  const { isAuthenticated, hasDefinedAccess } = useAuth();
  const pathname = usePathname();

  const base = `/academy/${academySlug}`;
  const links: Array<{
    href: string;
    label: string;
    match: string;
    hiddenClass?: string;
  }> = [
    { href: `${base}/courses`, label: "Programs", match: `${base}/courses` },
    { href: `${base}/career`, label: "Career", match: `${base}/career` },
    {
      href: `${base}/resources`,
      label: "Resources",
      match: `${base}/resources`,
      hiddenClass: "hidden sm:inline-flex",
    },
    {
      href: `${base}/partners`,
      label: "Partners",
      match: `${base}/partners`,
      hiddenClass: "hidden md:inline-flex",
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-sea-foam/90 text-primary backdrop-blur-xl supports-[backdrop-filter]:bg-sea-foam/80">
      <Container className="flex h-[4.5rem] items-center justify-between gap-4 sm:h-[5.25rem]">
        <Link
          href={base}
          className="flex shrink-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <BrandLogo
            priority
            variant="navy"
            className="h-10 w-40 sm:h-12 sm:w-52"
          />
          <span className="hidden font-display text-base font-medium tracking-wide text-primary sm:inline">
            Academy
          </span>
        </Link>

        <nav
          aria-label="Academy"
          className="flex items-center gap-1 text-sm sm:gap-2"
        >
          {links.map((link) => {
            const active =
              pathname === link.match || pathname.startsWith(`${link.match}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "inline-flex items-center rounded-md px-2.5 py-2 text-primary/75 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-3",
                  active && "bg-lichen/50 font-medium text-primary",
                  link.hiddenClass,
                )}
              >
                {link.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <>
              {hasDefinedAccess ? (
                <Link
                  href="/admin"
                  className="hidden rounded-md px-2.5 py-2 text-primary/75 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:inline sm:px-3"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/workspace"
                className={cn(
                  buttonClassName({ variant: "accent", size: "md" }),
                  "ml-1",
                )}
              >
                Workspace
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonClassName({ variant: "highlight", size: "md" }),
                "ml-1",
              )}
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
  const academySlug = clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG;
  const base = `/academy/${academySlug}`;

  const academyLinks = [
    { href: base, label: "Home" },
    { href: `${base}/courses`, label: "Programs" },
    { href: `${base}/career`, label: "Career" },
    { href: `${base}/resources`, label: "Resources" },
    { href: `${base}/partners`, label: "Partners" },
  ];

  const accountLinks = [
    { href: "/login", label: "Sign in" },
    { href: "/register", label: "Create account" },
    { href: "/workspace", label: "Workspace" },
  ];

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr_1fr]">
          <div className="space-y-3">
            <BrandLogo variant="navy" className="h-10 w-40" />
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              RE-Quest Academy — professional growth for real estate, every step
              of the way.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              Academy
            </p>
            <ul className="mt-3 space-y-2">
              {academyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.14em] text-primary uppercase">
              Account
            </p>
            <ul className="mt-3 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/80 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RE-Quest Academy</p>
          <p>Practical materials for real work</p>
        </div>
      </Container>
    </footer>
  );
}
