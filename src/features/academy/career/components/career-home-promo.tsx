"use client";

import Link from "next/link";
import { useCareerJourney } from "@/features/academy/career/hooks/use-career-journey";
import { buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

const CORE_QUESTIONS = [
  {
    title: "Where am I today?",
    body: "Pin your current career stage—from first interest to coaching.",
  },
  {
    title: "What should I focus on next?",
    body: "Get programs and materials matched to the stage you are in.",
  },
  {
    title: "How far have I come?",
    body: "See completed milestones and the road ahead on one map.",
  },
] as const;

const FALLBACK_STAGES = [
  "Thinking About Real Estate",
  "Choose a School",
  "Get Licensed",
  "First Brokerage",
  "First Listing",
  "Build Your Brand",
  "Grow Your Business",
] as const;

export function CareerHomePromo({ academySlug }: { academySlug: string }) {
  const { stages, journey } = useCareerJourney(academySlug);
  const previewCount = 6;
  const previewStages = stages.slice(0, previewCount);
  const mobilePreview = stages.slice(0, 4);
  const hasLiveStages = previewStages.length > 0;
  /** Highlight the middle stage as “current” for the product demo. */
  const currentIndex = hasLiveStages
    ? Math.min(2, previewStages.length - 1)
    : 2;

  return (
    <section className="border-b border-border/60 bg-surface">
      <Container className="grid gap-12 py-section-mobile sm:py-section-tablet lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-section-desktop">
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
              Career companion
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Your Real Estate Career Journey
            </h2>
            <p className="max-w-xl text-lg leading-relaxed text-muted">
              {journey?.description ||
                "A long-term path from exploring real estate to teaching and leading others."}
            </p>
          </div>

          <ul className="space-y-4">
            {CORE_QUESTIONS.map((item) => (
              <li key={item.title} className="flex gap-3">
                <span
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                  aria-hidden
                />
                <div>
                  <p className="font-display text-base font-medium text-primary">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/academy/${academySlug}/career`}
              className={buttonClassName({ variant: "highlight", size: "xl" })}
            >
              Explore the journey map
            </Link>
            <Link
              href="/workspace/career"
              className={buttonClassName({ variant: "outline", size: "xl" })}
            >
              Track my career
            </Link>
          </div>
        </div>

        {/* Product preview — large interface card */}
        <div className="relative">
          <div className="overflow-hidden rounded-xl border border-border/80 bg-sea-foam shadow-lg">
            <div className="flex items-center gap-2 border-b border-border/70 bg-surface/80 px-4 py-3">
              <span className="size-2.5 rounded-full bg-lichen" aria-hidden />
              <span className="size-2.5 rounded-full bg-lichen" aria-hidden />
              <span className="size-2.5 rounded-full bg-lichen" aria-hidden />
              <p className="ml-2 truncate text-xs font-medium text-muted">
                RE-Quest Academy · Career Journey
              </p>
            </div>

            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_0.9fr]">
              <div>
                <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                  Your path
                </p>
                <p className="mt-1 font-display text-lg font-medium text-primary">
                  Stage map
                </p>

                {/* Mobile: fewer stages */}
                <ol className="mt-4 space-y-2.5 md:hidden">
                  {(hasLiveStages ? mobilePreview : FALLBACK_STAGES.slice(0, 4)).map(
                    (stage, index) => {
                      const title =
                        typeof stage === "string" ? stage : stage.title;
                      const id =
                        typeof stage === "string" ? stage : String(stage.id);
                      return (
                        <StageRow
                          key={id}
                          title={title}
                          index={index}
                          currentIndex={Math.min(1, 3)}
                        />
                      );
                    },
                  )}
                </ol>

                {/* Desktop / tablet preview */}
                <ol className="mt-4 hidden space-y-2.5 md:block">
                  {(hasLiveStages
                    ? previewStages
                    : FALLBACK_STAGES.slice(0, previewCount)
                  ).map((stage, index) => {
                    const title =
                      typeof stage === "string" ? stage : stage.title;
                    const id =
                      typeof stage === "string" ? stage : String(stage.id);
                    return (
                      <StageRow
                        key={id}
                        title={title}
                        index={index}
                        currentIndex={currentIndex}
                      />
                    );
                  })}
                </ol>

                {hasLiveStages && stages.length > previewCount ? (
                  <p className="mt-3 text-xs text-muted">
                    + {stages.length - previewCount} more on the full map
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-lg bg-surface p-4 ring-1 ring-border/70">
                <div>
                  <p className="text-[11px] font-medium tracking-wide text-muted uppercase">
                    Next step
                  </p>
                  <p className="mt-2 font-display text-base font-medium text-primary">
                    {hasLiveStages
                      ? previewStages[currentIndex]?.title ??
                        "Choose your stage"
                      : FALLBACK_STAGES[currentIndex]}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    Focus on programs and resources matched to this moment in
                    your career.
                  </p>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs text-muted">
                    <span>Progress</span>
                    <span className="font-medium text-accent">
                      {Math.round(((currentIndex + 1) / (hasLiveStages ? previewStages.length || 6 : 6)) * 100)}
                      %
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-lichen/70">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-500"
                      style={{
                        width: `${((currentIndex + 1) / (hasLiveStages ? previewStages.length || 6 : 6)) * 100}%`,
                      }}
                    />
                  </div>
                  <Link
                    href={`/academy/${academySlug}/career`}
                    className="mt-4 inline-flex text-sm font-medium text-highlight hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    View full career map
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function StageRow({
  title,
  index,
  currentIndex,
}: {
  title: string;
  index: number;
  currentIndex: number;
}) {
  const done = index < currentIndex;
  const current = index === currentIndex;

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-md px-2.5 py-2",
        current && "bg-surface ring-1 ring-highlight/35",
        done && "opacity-90",
      )}
    >
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md",
          done && "bg-accent/15",
          current && "bg-highlight/15",
          !done && !current && "bg-lichen/50",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "size-2 rounded-full",
            done && "bg-accent",
            current && "bg-highlight",
            !done && !current && "bg-primary/30",
          )}
        />
      </span>
      <div className="min-w-0">
        <p
          className={cn(
            "truncate text-sm font-medium",
            current ? "text-primary" : "text-primary/85",
          )}
        >
          {title}
        </p>
        <p className="text-[11px] text-muted">
          {done ? "Completed" : current ? "Current focus" : "Upcoming"}
        </p>
      </div>
    </li>
  );
}
