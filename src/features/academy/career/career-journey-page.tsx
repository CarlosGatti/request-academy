"use client";

import Link from "next/link";
import { CareerJourneyMap } from "@/features/academy/career/components/career-journey-map";
import { useCareerJourney } from "@/features/academy/career/hooks/use-career-journey";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
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
    <Container className="space-y-8 py-10">
      <PageHeader
        title="Your Real Estate Career Journey"
        description={
          journey.description ||
          "A long-term map from first interest to coaching and instruction—built for real estate professionals."
        }
      />

      <CareerJourneyMap stages={stages} />

      <div className="flex flex-wrap gap-3 border border-border bg-surface p-5">
        {isAuthenticated ? (
          <Link
            href="/workspace/career"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-sea-foam"
          >
            Track my career in workspace
          </Link>
        ) : (
          <>
            <Link
              href={`/register?returnUrl=${encodeURIComponent(`/workspace/career`)}`}
              className="inline-flex h-10 items-center rounded-md bg-highlight px-4 text-sm font-medium text-white"
            >
              Sign up to track your career
            </Link>
            <Link
              href={`/login?returnUrl=${encodeURIComponent(`/workspace/career`)}`}
              className="inline-flex h-10 items-center rounded-md border border-border px-4 text-sm font-medium text-primary"
            >
              Sign in
            </Link>
          </>
        )}
      </div>
    </Container>
  );
}
