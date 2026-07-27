"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  adminNavGroups,
  isAdminNavActive,
} from "@/components/layout/admin-nav";
import {
  AppChromeHeader,
  chromeSelectClassName,
  ChromeSignOutButton,
  ChromeUserLabel,
} from "@/components/layout/app-chrome-header";
import { PublicFooter } from "@/components/layout/public-shell";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Select } from "@/components/ui/select";
import { UserAvatar } from "@/components/ui/user-avatar";
import {
  AdminAcademyProvider,
  useAdminAcademy,
} from "@/features/admin/admin-academy-context";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

function AdminNavLinks({
  pathname,
  onNavigate,
  className,
}: {
  pathname: string;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <nav aria-label="Academy admin" className={cn("space-y-5", className)}>
      {adminNavGroups.map((group) => (
        <div key={group.id}>
          <p className="mb-1.5 px-3 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
            {group.label}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = isAdminNavActive(
                pathname,
                item.href,
                item.exact,
              );
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                      active
                        ? "bg-secondary font-medium text-primary"
                        : "text-muted hover:bg-sea-foam hover:text-primary",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4 shrink-0",
                        active ? "text-accent" : "text-muted",
                      )}
                      aria-hidden
                    />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function GateScreen({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-primary text-sea-foam">
        <Container className="flex h-20 items-center sm:h-24">
          <BrandLogo priority />
        </Container>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-2xl font-medium text-primary">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession, isAuthenticated, isLoading, hasDefinedAccess } =
    useAuth();
  const { academies, academyId, setAcademyId } = useAdminAcademy();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navPathname, setNavPathname] = useState(pathname);
  const drawerTitleId = useId();

  // Close the mobile drawer when the route changes (React-recommended render sync).
  if (pathname !== navPathname) {
    setNavPathname(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  if (isLoading) {
    return (
      <GateScreen title="Loading admin…">
        <p className="text-muted">Preparing Academy Admin</p>
      </GateScreen>
    );
  }

  if (!isAuthenticated) {
    return (
      <GateScreen title="Admin sign in required">
        <Link
          href={`/login?returnUrl=${encodeURIComponent(pathname)}`}
          className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
        >
          Sign in
        </Link>
      </GateScreen>
    );
  }

  if (!hasDefinedAccess) {
    const apps = user?.apps?.length ? user.apps.join(", ") : "none";
    return (
      <GateScreen title="Access restricted">
        <p className="max-w-lg text-center text-muted">
          Admin requires the <strong>DEFINED</strong> application permission.
          Your account ({user?.email}) currently has:{" "}
          <code className="text-sm text-primary">{apps}</code>.
        </p>
        <p className="max-w-lg text-center text-sm text-muted">
          Ask a backend admin to grant DEFINED app access on your user, then
          sign out and sign in again so <code>user.apps</code> refreshes.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/workspace"
            className="inline-flex h-10 items-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-primary"
          >
            Go to workspace
          </Link>
          <Button
            variant="outline"
            onClick={() => {
              clearSession();
              router.push("/login?returnUrl=/admin");
            }}
          >
            Sign out & retry
          </Button>
        </div>
      </GateScreen>
    );
  }

  const displayName =
    user?.firstName?.trim() ||
    user?.email?.split("@")[0] ||
    "Admin";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppChromeHeader
        brand={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 border-sea-foam/40 bg-transparent px-2 text-sea-foam hover:bg-white/10 hover:text-sea-foam md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="admin-mobile-nav"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="size-4" aria-hidden />
              <span className="sr-only">Open navigation</span>
            </Button>
            <Link href="/admin" className="flex items-center gap-3">
              <BrandLogo priority />
              <span className="hidden font-display text-base font-medium tracking-wide sm:inline">
                Academy Admin
              </span>
            </Link>
          </div>
        }
      >
        {academies.length > 0 ? (
          <Select
            aria-label="Select academy workspace"
            className={chromeSelectClassName}
            value={academyId ?? ""}
            onChange={(event) => setAcademyId(Number(event.target.value))}
          >
            {academies.map((academy) => (
              <option key={academy.id} value={String(academy.id)}>
                {academy.name}
              </option>
            ))}
          </Select>
        ) : null}
        <Link
          href="/workspace"
          className="hidden text-sm text-sea-foam/80 hover:text-sea-foam sm:inline"
        >
          Workspace
        </Link>
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
          <ChromeUserLabel>{displayName}</ChromeUserLabel>
        </Link>
        <ChromeSignOutButton
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
        />
      </AppChromeHeader>

      <div className="flex flex-1">
        <aside className="sticky top-0 hidden h-[calc(100vh-5rem)] w-60 shrink-0 overflow-y-auto border-r border-border bg-surface sm:h-[calc(100vh-6rem)] md:block">
          <div className="p-4">
            <AdminNavLinks pathname={pathname} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 py-8">
          <Container className="space-y-8">{children}</Container>
        </main>
      </div>

      <PublicFooter />

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden" id="admin-mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-primary/40"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={drawerTitleId}
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-surface shadow-lg"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <p
                id={drawerTitleId}
                className="font-display text-base font-medium text-primary"
              >
                Academy Admin
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation"
              >
                <X className="size-4" aria-hidden />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <AdminNavLinks
                pathname={pathname}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminAcademyProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminAcademyProvider>
  );
}
