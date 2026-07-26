import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { buttonClassName } from "@/components/ui/button";

/**
 * Crisp product preview of the Sign in experience.
 * Uses the real brand logo and live routes — no distorted AI composites.
 */
export function HeroLoginPreview() {
  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-lg ring-1 ring-border/70">
      {/* Window chrome */}
      <div className="flex items-center gap-3 bg-primary px-3 py-2.5 sm:px-4">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-lichen/70" />
          <span className="size-2.5 rounded-full bg-lichen/50" />
          <span className="size-2.5 rounded-full bg-lichen/35" />
        </div>
        <p className="min-w-0 flex-1 truncate rounded-md bg-white/10 px-3 py-1 text-center text-[11px] text-sea-foam/85 sm:text-xs">
          academy.re-quest.app/login
        </p>
      </div>

      {/* App header — matches public auth chrome */}
      <div className="flex h-14 items-center gap-3 bg-primary px-4 sm:h-16 sm:px-5">
        <BrandLogo variant="white" className="h-9 w-36 sm:h-10 sm:w-40" />
        <span className="hidden font-display text-sm font-medium tracking-wide text-sea-foam sm:inline">
          Academy
        </span>
      </div>

      {/* Sign in panel */}
      <div className="bg-sea-foam px-5 py-8 sm:px-8 sm:py-10">
        <div className="mx-auto w-full max-w-sm rounded-lg bg-surface p-6 shadow-sm ring-1 ring-border/70 sm:p-7">
          <h2 className="font-display text-2xl font-medium tracking-tight text-primary sm:text-[1.65rem]">
            Sign in
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Access your professional workspace.
          </p>

          <div className="mt-6 space-y-4" aria-hidden="true">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-primary">Email</p>
              <div className="h-10 rounded-md border border-border bg-surface" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-primary">Password</p>
              <div className="h-10 rounded-md border border-border bg-surface" />
            </div>
            <div
              className={buttonClassName({
                variant: "primary",
                size: "lg",
                className: "w-full cursor-default",
              })}
            >
              Sign in
            </div>
          </div>

          <div className="mt-5 space-y-2 text-center text-sm text-muted">
            <p>Forgot password?</p>
            <p>
              New here?{" "}
              <Link
                href="/register"
                className="font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
