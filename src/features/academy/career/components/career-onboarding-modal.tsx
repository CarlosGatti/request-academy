"use client";

import { useState } from "react";
import { CareerStagePicker } from "@/features/academy/career/components/career-stage-picker";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type Stage = {
  id: number | string;
  title: string;
  summary?: string | null;
  iconKey?: string | null;
  sortOrder: number;
};

export function CareerOnboardingModal({
  open,
  stages,
  loading,
  error,
  onSubmit,
  onDismiss,
}: {
  open: boolean;
  stages: Stage[];
  loading?: boolean;
  error?: string | null;
  onSubmit: (stageId: number) => Promise<void> | void;
  onDismiss?: () => void;
}) {
  const [selectedStageId, setSelectedStageId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/40 p-4 sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-onboarding-title"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-border bg-surface p-5 shadow-md sm:p-7"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium tracking-wide text-accent uppercase">
            Welcome to RE-Quest
          </p>
          <h2
            id="career-onboarding-title"
            className="font-display text-2xl font-medium text-primary"
          >
            Where are you in your career?
          </h2>
          <p className="text-sm text-muted">
            We&apos;ll recommend the right programs for your stage.
          </p>
        </div>

        {error ? (
          <div className="mt-4">
            <Alert tone="danger">{error}</Alert>
          </div>
        ) : null}

        <div className="mt-6">
          <CareerStagePicker
            stages={stages}
            selectedStageId={selectedStageId}
            onSelect={setSelectedStageId}
            loading={loading || submitting}
            confirmLabel="Continue"
            onConfirm={() => {
              if (selectedStageId == null) return;
              setSubmitting(true);
              void Promise.resolve(onSubmit(selectedStageId)).finally(() =>
                setSubmitting(false),
              );
            }}
          />
        </div>

        {onDismiss ? (
          <div className="mt-4">
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Ask me later
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
