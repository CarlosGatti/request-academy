import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const CAREER_STAGES = [
  "Thinking About Real Estate",
  "Choose a School",
  "Get Licensed",
  "First Brokerage",
  "First Listing",
  "Build Your Brand",
  "Grow Your Business",
  "Lead a Team",
  "Broker / Coach / Instructor",
] as const;

/** Sparse labels keep the path quiet without breaking the vertical axis. */
const DESKTOP_LABEL_INDEXES = new Set([0, 2, 4, 6, 8]);

/** Tablet shows a shorter milestone preview. */
const TABLET_STAGES = [0, 2, 4, 6, 8] as const;

type HomeHeroCareerPathProps = {
  academySlug: string;
  className?: string;
};

function stageDotClass(index: number, total: number) {
  const isLast = index === total - 1;
  if (isLast) {
    return "border-highlight bg-highlight shadow-[0_0_0_3px_rgba(229,134,37,0.2)]";
  }
  if (index % 3 === 0) {
    return "border-lichen bg-sea-foam";
  }
  return "border-sprout-green/70 bg-sprout-green/80";
}

/**
 * Subtle Career Journey visualization for the homepage hero.
 * Decorative support only — Career page remains the primary destination.
 */
export function HomeHeroCareerPath({
  academySlug,
  className,
}: HomeHeroCareerPathProps) {
  const careerHref = `/academy/${academySlug}/career`;

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: compact card */}
      <Link
        href={careerHref}
        className="flex items-center justify-between gap-3 rounded-md border border-lichen/25 bg-primary/55 px-4 py-3 backdrop-blur-sm transition-colors hover:border-lichen/40 hover:bg-primary/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
      >
        <div className="min-w-0 space-y-0.5">
          <p className="text-[11px] font-medium tracking-[0.16em] text-lichen uppercase">
            Career Journey
          </p>
          <p className="truncate text-sm text-sea-foam/90">
            From first interest to coaching — see the full map
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium text-highlight">View</span>
      </Link>

      {/* Tablet: compact horizontal preview */}
      <div className="hidden md:block lg:hidden">
        <p className="mb-3 text-[11px] font-medium tracking-[0.16em] text-lichen/80 uppercase">
          Career path
        </p>
        <ol className="flex items-start" aria-hidden="true">
          {TABLET_STAGES.map((stageIndex, index) => {
            const stage = CAREER_STAGES[stageIndex];
            const isLast = index === TABLET_STAGES.length - 1;
            return (
              <li key={stage} className="flex min-w-0 flex-1 items-start">
                <div className="flex w-full min-w-0 flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full border",
                      stageDotClass(stageIndex, CAREER_STAGES.length),
                    )}
                  />
                  <span className="max-w-[4.75rem] text-center text-[9px] leading-tight text-sea-foam/70">
                    {stage}
                  </span>
                </div>
                {!isLast ? (
                  <span
                    className="mt-[0.3rem] h-px w-full min-w-2 shrink bg-lichen/35"
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
        <Link
          href={careerHref}
          className="mt-3 inline-flex text-xs font-medium text-sea-foam/80 underline-offset-2 hover:text-sea-foam hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Explore Career Journey
        </Link>
      </div>

      {/* Desktop: straight vertical timeline — one shared axis for line + dots */}
      <div className="hidden max-w-[16.5rem] lg:block">
        <p className="mb-4 text-[11px] font-medium tracking-[0.16em] text-lichen/75 uppercase">
          Career path
        </p>

        <ol className="relative" aria-hidden="true">
          {/* Single vertical axis centered on the dots (dot = 10px → center at 5px) */}
          <span
            className="absolute top-1.5 bottom-1.5 left-[4px] w-px bg-gradient-to-b from-lichen/55 via-sprout-green/45 to-highlight/55"
            aria-hidden
          />

          {CAREER_STAGES.map((stage, index) => {
            const showLabel = DESKTOP_LABEL_INDEXES.has(index);

            return (
              <li
                key={stage}
                className="relative grid grid-cols-[10px_1fr] items-center gap-x-3 py-1.5"
              >
                <span
                  className={cn(
                    "relative z-10 size-2.5 justify-self-center rounded-full border",
                    stageDotClass(index, CAREER_STAGES.length),
                  )}
                />
                {showLabel ? (
                  <span className="text-[11px] leading-snug text-sea-foam/75">
                    {stage}
                  </span>
                ) : (
                  <span aria-hidden className="block h-3" />
                )}
              </li>
            );
          })}
        </ol>

        <Link
          href={careerHref}
          className="mt-4 inline-flex text-xs font-medium text-sea-foam/80 underline-offset-2 hover:text-sea-foam hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Explore Career Journey
        </Link>
      </div>
    </div>
  );
}
