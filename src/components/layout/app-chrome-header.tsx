"use client";

import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

/**
 * Shared dark chrome header for Admin / Workspace.
 * Keeps brand left, tools right — no word-wrap on actions.
 */
export function AppChromeHeader({
  brand,
  children,
  className,
}: {
  brand: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className="border-b border-border bg-primary text-sea-foam">
      <Container
        className={cn(
          "flex h-20 items-center justify-between gap-4 sm:h-24",
          className,
        )}
      >
        <div className="min-w-0 shrink-0">{brand}</div>
        <div className="flex min-w-0 shrink items-center justify-end gap-2 sm:gap-3">
          {children}
        </div>
      </Container>
    </header>
  );
}

export const chromeSelectClassName =
  "h-9 w-auto max-w-[11rem] shrink border-sea-foam/35 bg-primary/80 text-sm text-sea-foam sm:max-w-[14rem]";

export function ChromeSignOutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="h-9 shrink-0 whitespace-nowrap border-sea-foam/40 bg-transparent px-3 text-sea-foam hover:bg-white/10 hover:text-sea-foam"
    >
      <LogOut className="size-3.5 shrink-0" aria-hidden />
      <span>Sign out</span>
    </Button>
  );
}

export function ChromeUserLabel({ children }: { children: ReactNode }) {
  return (
    <span className="hidden max-w-[12rem] truncate text-sm text-sea-foam/75 xl:inline">
      {children}
    </span>
  );
}
