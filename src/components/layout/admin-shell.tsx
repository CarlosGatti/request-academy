"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import {
  AppChromeHeader,
  chromeSelectClassName,
  ChromeSignOutButton,
  ChromeUserLabel,
} from "@/components/layout/app-chrome-header";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  AdminAcademyProvider,
  useAdminAcademy,
} from "@/features/admin/admin-academy-context";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils/cn";

const nav = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/courses", label: "Programs" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/partners", label: "Partners" },
  { href: "/admin/short-links", label: "Short links" },
  { href: "/admin/campaigns", label: "Campaigns" },
  { href: "/admin/settings", label: "Settings" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearSession, isAuthenticated, isLoading, hasDefinedAccess } =
    useAuth();
  const { academies, academyId, setAcademyId } = useAdminAcademy();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-primary text-sea-foam">
          <Container className="flex h-20 items-center sm:h-24">
            <BrandLogo priority />
          </Container>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-muted">Loading admin…</p>
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
            Admin sign in required
          </h1>
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

  if (!hasDefinedAccess) {
    const apps = user?.apps?.length ? user.apps.join(", ") : "none";
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <header className="border-b border-border bg-primary text-sea-foam">
          <Container className="flex h-20 items-center sm:h-24">
            <BrandLogo priority />
          </Container>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <h1 className="font-display text-2xl font-medium text-primary">
            Access restricted
          </h1>
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
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppChromeHeader
        brand={
          <Link href="/admin" className="flex items-center gap-3">
            <BrandLogo priority />
            <span className="hidden font-display text-base font-medium tracking-wide sm:inline">
              Admin
            </span>
          </Link>
        }
      >
        {academies.length > 0 ? (
          <Select
            aria-label="Select academy"
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
        <ChromeUserLabel>{user?.email}</ChromeUserLabel>
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
            {nav.map((item) => (
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

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminAcademyProvider>
      <AdminShellInner>{children}</AdminShellInner>
    </AdminAcademyProvider>
  );
}
