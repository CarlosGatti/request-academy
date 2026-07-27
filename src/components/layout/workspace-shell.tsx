"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  AppChromeHeader,
  ChromeSignOutButton,
  ChromeUserLabel,
} from "@/components/layout/app-chrome-header";
import { Container } from "@/components/ui/container";
import { UserAvatar } from "@/components/ui/user-avatar";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/workspace", label: "Home", exact: true },
  { href: "/workspace/career", label: "Career" },
  { href: "/workspace/programs", label: "Programs" },
  { href: "/workspace/resources", label: "Resources" },
  { href: "/workspace/downloads", label: "Downloads" },
  { href: "/workspace/partners", label: "Network" },
  { href: "/workspace/settings", label: "Profile" },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession, isAuthenticated, isLoading, hasDefinedAccess } =
    useAuth();

  const items: Array<{ href: string; label: string; exact?: boolean }> =
    hasDefinedAccess
      ? [...nav, { href: "/admin", label: "Admin" }]
      : [...nav];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-primary text-sea-foam">
          <Container className="flex h-20 items-center sm:h-24">
            <BrandLogo priority />
          </Container>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted">Loading workspace…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-primary text-sea-foam">
          <Container className="flex h-20 items-center sm:h-24">
            <BrandLogo priority />
          </Container>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <h1 className="font-display text-2xl font-medium text-primary">
            Sign in required
          </h1>
          <p className="max-w-md text-center text-muted">
            Your professional workspace is available after you sign in.
          </p>
          <Link
            href={`/login?returnUrl=${encodeURIComponent(pathname)}`}
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
          >
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppChromeHeader
        brand={
          <Link href="/workspace" className="flex items-center gap-3">
            <BrandLogo priority />
            <span className="hidden font-display text-base font-medium tracking-wide sm:inline">
              Workspace
            </span>
          </Link>
        }
      >
        <Link
          href="/workspace/settings"
          className="flex min-w-0 items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea-foam"
          aria-label="Profile settings"
        >
          <UserAvatar
            profilePicture={user?.profilePicture}
            firstName={user?.firstName}
            lastName={user?.lastName}
            email={user?.email}
            size={32}
            className="bg-sea-foam/20 text-sea-foam ring-1 ring-sea-foam/30"
          />
          <ChromeUserLabel>{user?.firstName ?? user?.email}</ChromeUserLabel>
        </Link>
        <ChromeSignOutButton
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
        />
      </AppChromeHeader>
      <div className="flex flex-1 flex-col md:flex-row">
        <aside className="border-b border-border bg-surface md:w-56 md:border-b-0 md:border-r">
          <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm whitespace-nowrap",
                  isActive(pathname, item.href, item.exact)
                    ? "bg-secondary font-medium text-primary"
                    : "text-muted hover:bg-sea-foam hover:text-primary",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 py-8">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}
