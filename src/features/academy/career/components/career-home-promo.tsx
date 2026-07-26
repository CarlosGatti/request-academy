"use client";

import Link from "next/link";
import { useCareerJourney } from "@/features/academy/career/hooks/use-career-journey";
import { careerStageIcon } from "@/features/academy/career/utils/career-icons";
import { Container } from "@/components/ui/container";

const VALUE_PROPS = [
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

export function CareerHomePromo({ academySlug }: { academySlug: string }) {
  const { stages, journey } = useCareerJourney(academySlug);
  const previewStages = stages.slice(0, 5);

  return (
    <section className="relative z-10 border-b border-border bg-sea-foam">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-14">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium tracking-[0.18em] text-accent uppercase">
              New · Career companion
            </p>
            <h2 className="font-display text-3xl font-medium tracking-tight text-primary md:text-4xl">
              Your Real Estate Career Journey
            </h2>
            <p className="max-w-xl text-base leading-relaxed text-muted">
              {journey?.description ||
                "RE-Quest is more than a course catalog—it is a long-term map of your professional path, with clear next steps at every stage."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {VALUE_PROPS.map((item) => (
              <div
                key={item.title}
                className="space-y-2 border border-border bg-surface p-4 shadow-sm"
              >
                <p className="font-display text-sm font-medium text-primary">
                  {item.title}
                </p>
                <p className="text-xs leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/academy/${academySlug}/career`}
              className="inline-flex h-11 items-center rounded-md bg-highlight px-5 text-sm font-medium text-white hover:bg-highlight/90"
            >
              Explore the journey map
            </Link>
            <Link
              href="/workspace/career"
              className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-primary hover:bg-white"
            >
              Track my career
            </Link>
          </div>
        </div>

        <div className="border border-border bg-surface p-5 shadow-sm">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Path preview
          </p>
          {previewStages.length > 0 ? (
            <ol className="mt-4 space-y-3">
              {previewStages.map((stage, index) => {
                const Icon = careerStageIcon(stage.iconKey);
                return (
                  <li
                    key={stage.id}
                    className="flex items-center gap-3 border border-border bg-sea-foam/60 px-3 py-2.5"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center border border-border bg-surface text-accent">
                      <Icon className="size-3.5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-primary">
                        {stage.title}
                      </p>
                      <p className="text-[11px] text-muted">Stage {index + 1}</p>
                    </div>
                  </li>
                );
              })}
              {stages.length > previewStages.length ? (
                <li className="px-1 text-xs text-muted">
                  + {stages.length - previewStages.length} more stages on the full
                  map
                </li>
              ) : null}
            </ol>
          ) : (
            <p className="mt-4 text-sm text-muted">
              From first interest through brokerage, brand, and coaching—see the
              full map on the Career page.
            </p>
          )}
          <Link
            href={`/academy/${academySlug}/career`}
            className="mt-5 inline-flex text-sm font-medium text-accent hover:underline"
          >
            View full career map
          </Link>
        </div>
      </Container>
    </section>
  );
}
