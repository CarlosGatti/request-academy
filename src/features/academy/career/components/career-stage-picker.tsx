"use client";

import { CareerJourneyMap } from "@/features/academy/career/components/career-journey-map";
import { Button } from "@/components/ui/button";

type Stage = {
  id: number | string;
  title: string;
  summary?: string | null;
  iconKey?: string | null;
  sortOrder: number;
};

export function CareerStagePicker({
  stages,
  selectedStageId,
  onSelect,
  onConfirm,
  confirmLabel = "Continue",
  loading,
}: {
  stages: Stage[];
  selectedStageId: number | null;
  onSelect: (stageId: number) => void;
  onConfirm: () => void;
  confirmLabel?: string;
  loading?: boolean;
}) {
  return (
    <div className="space-y-5">
      <CareerJourneyMap
        stages={stages}
        interactive
        selectedStageId={selectedStageId}
        onSelectStage={onSelect}
      />
      <Button
        disabled={selectedStageId == null || loading}
        onClick={onConfirm}
        className="w-full sm:w-auto"
      >
        {loading ? "Saving…" : confirmLabel}
      </Button>
    </div>
  );
}
