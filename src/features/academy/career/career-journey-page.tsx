"use client";

import Link from "next/link";
import { CareerJourneyMap } from "@/features/academy/career/components/career-journey-map";
import { useCareerJourney } from "@/features/academy/career/hooks/use-career-journey";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoading } from "@/components/ui/page-loading";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function CareerJourneyPage({ academySlug }: { academySlug: string }) {
  const { isAuthenticated } = useAuth();
  const { journey, stages, loading, error } = useCareerJourney(academySlug);

  if (loading && !journey) {
    return (
      <Container className="py-10">
        <PageLoading rows={5} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unable to load career journey">
          {getGraphQLErrorMessage(error)}
        </Alert>
      </Container>
    );
  }

  if (!journey || stages.length === 0) {
    return (
      <Container className="py-10">
        <EmptyState
          title="Career path coming soon"
          description="The RE-Quest career journey map is not available yet for this academy."
        />
      </Container>
    );
  }

  return (
    <>
      <section className="border-b border-border bg-primary text-sea-foam">
        <Container className="space-y-6 py-12">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm font-medium tracking-[0.18em] text-sea-foam/70 uppercase">
              Career companion
            </p>
            <h1 className="font-display text-4xl font-medium tracking-tight text-white md:text-5xl">
              Your Real Estate Career Journey
            </h1>
            <p className="text-lg leading-relaxed text-sea-foam/85">
              {journey.description ||
                "A long-term map from first interest to coaching and instruction—built for real estate professionals."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Where am I today?",
              "What should I focus on next?",
              "How far have I come?",
            ].map((item) => (
              <div
                key={item}
                className="border border-sea-foam/20 bg-primary/40 px-4 py-3 text-sm font-medium text-white"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {isAuthenticated ? (
              <Link
                href="/workspace/career"
                className="inline-flex h-11 items-center rounded-md bg-highlight px-5 text-sm font-medium text-white hover:bg-highlight/90"
              >
                Track my career in workspace
              </Link>
            ) : (
              <>
                <Link
                  href={`/register?returnUrl=${encodeURIComponent(`/workspace/career`)}`}
                  className="inline-flex h-11 items-center rounded-md bg-highlight px-5 text-sm font-medium text-white hover:bg-highlight/90"
                >
                  Sign up to track your career
                </Link>
                <Link
                  href={`/login?returnUrl=${encodeURIComponent(`/workspace/career`)}`}
                  className="inline-flex h-11 items-center rounded-md border border-sea-foam/35 px-5 text-sm font-medium text-sea-foam hover:bg-white/10"
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </Container>
      </section>

      <Container className="space-y-6 py-10">
        <div className="space-y-2">
          <h2 className="font-display text-2xl font-medium text-primary">
            The full path
          </h2>
          <p className="max-w-2xl text-muted">
            {stages.length} stages from curiosity to instruction. Scroll the map
            and pick where you want to grow next.
          </p>
        </div>
        <CareerJourneyMap stages={stages} />
      </Container>
    </>
  );
}
