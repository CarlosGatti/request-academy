"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Container } from "@/components/ui/container";
import { buttonClassName } from "@/components/ui/button";
import { clientEnv } from "@/lib/env/client";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M6.5 8.5A1.75 1.75 0 1 1 6.5 5a1.75 1.75 0 0 1 0 3.5zM5 10h3v9H5v-9zm5 0h2.9v1.2h.1c.4-.8 1.4-1.5 2.9-1.5 3.1 0 3.6 2 3.6 4.6V19h-3v-4.1c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2V19h-3v-9z" />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.instagram.com/re.quest.official",
    label: "Instagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://www.facebook.com/re.quest.social",
    label: "Facebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://www.linkedin.com/company/re-quest001/",
    label: "LinkedIn",
    Icon: LinkedInIcon,
  },
] as const;

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
            <div className="flex items-center gap-2 pt-1">
              {socialLinks.map(({ href, label, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`RE-Quest on ${label}`}
                  className="inline-flex size-9 items-center justify-center rounded-md border border-border text-primary transition-colors hover:bg-sea-foam hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <Icon className="size-4" aria-hidden />
                </a>
              ))}
            </div>
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
