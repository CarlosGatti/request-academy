"use client";

import { useMemo, useState } from "react";
import { CareerJourneyMap } from "@/features/academy/career/components/career-journey-map";
import { CareerOnboardingModal } from "@/features/academy/career/components/career-onboarding-modal";
import { CareerRecommendations } from "@/features/academy/career/components/career-recommendations";
import { CareerStagePicker } from "@/features/academy/career/components/career-stage-picker";
import { useCareerJourney } from "@/features/academy/career/hooks/use-career-journey";
import { useCareerProfile } from "@/features/academy/career/hooks/use-career-profile";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { useToast } from "@/components/ui/toast";
import { useDefaultAcademy } from "@/features/workspace/use-default-academy";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { requireGraphQLInt, toGraphQLInt } from "@/lib/graphql/ids";

const DISMISS_KEY = "defined_academy_career_onboarding_dismissed";

export function WorkspaceCareerSection() {
  const { toast } = useToast();
  const { slug, academyId, loading: academyLoading } = useDefaultAcademy();
  const journeyQuery = useCareerJourney(slug);
  const career = useCareerProfile(academyId);

  const [changeOpen, setChangeOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(DISMISS_KEY) === "true";
  });

  const stages = journeyQuery.stages;
  const completedStageIds = useMemo(
    () =>
      (career.profile?.completions ?? [])
        .map((item) => toGraphQLInt(item.stageId))
        .filter((id): id is number => id != null),
    [career.profile?.completions],
  );
  const currentStageId = toGraphQLInt(career.profile?.currentStageId);

  const showOnboarding =
    career.needsOnboarding && !dismissed && stages.length > 0;

  if (academyLoading || (career.loading && !career.profile)) {
    return <PageLoading rows={4} />;
  }

  if (!academyId) {
    return (
      <Alert tone="warning" title="Academy unavailable">
        We could not resolve your academy context.
      </Alert>
    );
  }

  if (journeyQuery.error) {
    return (
      <Alert tone="danger" title="Unable to load career journey">
        {getGraphQLErrorMessage(journeyQuery.error)}
      </Alert>
    );
  }

  if (!journeyQuery.journey || stages.length === 0) {
    return (
      <EmptyState
        title="Career path coming soon"
        description="An active career journey has not been published for this academy yet."
      />
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Career Journey"
        description="See where you are today, what to focus on next, and how far you have come."
      />

      {actionError ? <Alert tone="danger">{actionError}</Alert> : null}

      {career.profile ? (
        <section className="space-y-4 border border-border bg-surface p-5">
          <div className="space-y-1">
            <p className="text-xs font-medium tracking-wide text-accent uppercase">
              Current stage
            </p>
            <h2 className="font-display text-2xl font-medium text-primary">
              {career.profile.currentStage?.title ?? "Not set"}
            </h2>
            {career.profile.currentStage?.summary ? (
              <p className="max-w-2xl text-sm text-muted">
                {career.profile.currentStage.summary}
              </p>
            ) : null}
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-lg font-medium text-primary">
              Recommended for your stage
            </h3>
            <CareerRecommendations
              academySlug={slug}
              courses={career.recommendations?.courses ?? []}
              resources={career.recommendations?.resources ?? []}
              loading={career.recommendationsLoading}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {currentStageId != null ? (
              <Button
                disabled={career.completeStageLoading}
                onClick={() => {
                  setActionError(null);
                  void career
                    .completeStage({
                      variables: {
                        academyId: requireGraphQLInt(academyId, "academyId"),
                        stageId: currentStageId,
                      },
                    })
                    .then(async (result) => {
                      const next =
                        result.data?.completeMyDefinedAcademyCareerStage
                          ?.currentStage?.title;
                      toast(
                        next
                          ? `Nice work! Your next focus: ${next}`
                          : "Stage marked complete",
                        "success",
                      );
                      await Promise.all([
                        career.refetch(),
                        career.refetchRecommendations(),
                      ]);
                    })
                    .catch((err) =>
                      setActionError(
                        getGraphQLErrorMessage(
                          err,
                          "Unable to complete this stage.",
                        ),
                      ),
                    );
                }}
              >
                {career.completeStageLoading
                  ? "Updating…"
                  : "Mark this stage complete"}
              </Button>
            ) : null}
            <Button
              variant="outline"
              onClick={() => {
                setSelectedStageId(currentStageId);
                setChangeOpen((open) => !open);
              }}
            >
              {changeOpen ? "Cancel" : "Change stage"}
            </Button>
          </div>

          {changeOpen ? (
            <div className="border-t border-border pt-5">
              <CareerStagePicker
                stages={stages}
                selectedStageId={selectedStageId}
                onSelect={setSelectedStageId}
                confirmLabel="Update my stage"
                loading={career.setStageLoading}
                onConfirm={() => {
                  if (selectedStageId == null) return;
                  setActionError(null);
                  void career
                    .setStage({
                      variables: {
                        academyId: requireGraphQLInt(academyId, "academyId"),
                        stageId: selectedStageId,
                      },
                    })
                    .then(async () => {
                      toast("Career stage updated", "success");
                      setChangeOpen(false);
                      await Promise.all([
                        career.refetch(),
                        career.refetchRecommendations(),
                      ]);
                    })
                    .catch((err) =>
                      setActionError(
                        getGraphQLErrorMessage(
                          err,
                          "Unable to update your stage.",
                        ),
                      ),
                    );
                }}
              />
            </div>
          ) : null}
        </section>
      ) : (
        <Alert tone="info" title="Set up your career path">
          Tell us where you are in real estate and we&apos;ll personalize
          recommendations.
          <div className="mt-3">
            <Button
              size="sm"
              onClick={() => {
                window.localStorage.removeItem(DISMISS_KEY);
                setDismissed(false);
              }}
            >
              Choose my stage
            </Button>
          </div>
        </Alert>
      )}

      <section className="space-y-4">
        <h2 className="font-display text-xl font-medium text-primary">
          Full journey map
        </h2>
        <CareerJourneyMap
          stages={stages}
          currentStageId={currentStageId}
          completedStageIds={completedStageIds}
        />
      </section>

      <CareerOnboardingModal
        open={showOnboarding}
        stages={stages}
        loading={career.initializeLoading}
        error={actionError}
        onDismiss={() => {
          window.localStorage.setItem(DISMISS_KEY, "true");
          setDismissed(true);
        }}
        onSubmit={async (stageId) => {
          setActionError(null);
          try {
            await career.initializeProfile({
              variables: {
                academyId: requireGraphQLInt(academyId, "academyId"),
                stageId,
              },
            });
            window.localStorage.setItem(DISMISS_KEY, "true");
            setDismissed(true);
            toast("Career profile ready", "success");
            await Promise.all([
              career.refetch(),
              career.refetchRecommendations(),
            ]);
          } catch (err) {
            setActionError(
              getGraphQLErrorMessage(err, "Unable to save your career stage."),
            );
          }
        }}
      />
    </div>
  );
}
