"use client";

import { CareerStageNode } from "@/features/academy/career/components/career-stage-node";
import {
  getStageState,
  sortCareerStages,
  type CareerStageState,
} from "@/features/academy/career/utils/career-stage-state";
import { toGraphQLInt } from "@/lib/graphql/ids";
import { cn } from "@/lib/utils/cn";

export type CareerMapStage = {
  id: number | string;
  title: string;
  summary?: string | null;
  iconKey?: string | null;
  sortOrder: number;
};

export function CareerJourneyMap({
  stages,
  currentStageId,
  completedStageIds = [],
  interactive,
  selectedStageId,
  onSelectStage,
  className,
}: {
  stages: CareerMapStage[];
  currentStageId?: number | null;
  completedStageIds?: number[];
  interactive?: boolean;
  selectedStageId?: number | null;
  onSelectStage?: (stageId: number) => void;
  className?: string;
}) {
  const normalized = sortCareerStages(
    stages.flatMap((stage) => {
      const id = toGraphQLInt(stage.id);
      if (id == null) return [];
      return [{ ...stage, id }];
    }),
  );

  return (
    <ol className={cn("relative space-y-3", className)}>
      {normalized.map((stage, index) => {
        const state: CareerStageState = getStageState({
          stageId: stage.id,
          currentStageId,
          completedStageIds,
          stages: normalized,
        });

        return (
          <li key={stage.id} className="relative">
            {index < normalized.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-12 left-5 h-[calc(100%-0.5rem)] w-px bg-border"
              />
            ) : null}
            <CareerStageNode
              stage={stage}
              state={state}
              index={index}
              interactive={interactive}
              selected={selectedStageId === stage.id}
              onSelect={onSelectStage}
            />
          </li>
        );
      })}
    </ol>
  );
}
