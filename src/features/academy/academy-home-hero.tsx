import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroLoginPreview } from "@/features/academy/hero-login-preview";
import { cn } from "@/lib/utils/cn";

type AcademyHomeHeroProps = {
  academySlug: string;
  className?: string;
};

/**
 * Light editorial hero: brand-led copy on the left, crisp Sign in product preview on the right.
 */
export function AcademyHomeHero({
  academySlug,
  className,
}: AcademyHomeHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-sea-foam text-primary",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,217,212,0.45),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgb(240,245,252),transparent_50%)]"
        aria-hidden
      />

      <Container className="relative z-10 grid items-center gap-10 py-section-mobile sm:py-section-tablet lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12 lg:py-section-desktop xl:gap-16">
        <div
          className={cn(
            "max-w-xl space-y-7",
            "motion-safe:animate-[hero-fade-up_0.65s_ease-out_both]",
          )}
        >
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase sm:text-sm">
            Professional growth
          </p>
          <h1 className="font-display text-[2.15rem] font-medium leading-[1.12] tracking-tight text-primary sm:text-5xl sm:leading-[1.08] lg:text-[3.5rem] lg:leading-[1.06]">
            Your real estate career, every step of the way.
          </h1>
          <p className="max-w-lg font-body text-lg leading-relaxed text-muted sm:text-xl sm:leading-relaxed">
            RE-Quest Academy gives you the programs, resources, and guidance you
            need to grow with confidence—from your first step to long-term
            success.
          </p>
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
            <Link
              href={`/academy/${academySlug}/courses`}
              className={buttonClassName({ variant: "highlight", size: "xl" })}
            >
              Explore programs
            </Link>
            <Link
              href={`/academy/${academySlug}/career`}
              className={buttonClassName({ variant: "outline", size: "xl" })}
            >
              Start your journey
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "mx-auto w-full max-w-md lg:mx-0 lg:max-w-none",
            "motion-safe:animate-[hero-fade-up_0.65s_ease-out_0.1s_both]",
          )}
        >
          <HeroLoginPreview />
        </div>
      </Container>

      <div className="h-8 sm:h-10" aria-hidden />
    </section>
  );
}
