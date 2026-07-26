import Image from "next/image";
import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

/** Workspace crop from the brand hero asset — used as product visual, not full-bleed dark BG. */
const HERO_PRODUCT_VISUAL = "/bg-request.png";

type AcademyHomeHeroProps = {
  academySlug: string;
  className?: string;
};

/**
 * Light editorial hero: brand-led copy on the left, product/workspace visual on the right.
 * Career Journey lives in the dedicated section below — not a tiny timeline here.
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
      {/* Soft brand atmosphere — not a dark full-bleed photo */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,217,212,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgba(240,245,252,1),transparent_50%)]"
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
            "relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none",
            "motion-safe:animate-[hero-fade-up_0.65s_ease-out_0.1s_both]",
          )}
        >
          <div className="relative overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-primary/10">
            <div className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/3]">
              <Image
                src={HERO_PRODUCT_VISUAL}
                alt="RE-Quest Academy workspace on a laptop, with career progress and learning resources"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover object-[78%_42%]"
              />
            </div>
            {/* Soft edge blend so the crop feels editorial, not cinematic */}
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-primary/25 via-transparent to-transparent"
              aria-hidden
            />
          </div>

          {/* Small floating product cue — restrained, not a badge cluster */}
          <div className="absolute -bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-56">
            <div className="rounded-lg border border-border/80 bg-surface/95 px-4 py-3 shadow-md backdrop-blur-sm">
              <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                Career progress
              </p>
              <p className="mt-1 text-sm font-medium text-primary">
                Know where you are — and what comes next
              </p>
              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-lichen">
                <div className="h-full w-[62%] rounded-full bg-accent" />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Space for overlapping value strip */}
      <div className="h-8 sm:h-10" aria-hidden />
    </section>
  );
}
