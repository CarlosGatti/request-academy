export type CareerStageLike = {
  id: number;
  sortOrder: number;
};

export type CareerStageState = "completed" | "current" | "upcoming";

export function getStageState(params: {
  stageId: number;
  currentStageId?: number | null;
  completedStageIds: number[];
  stages: CareerStageLike[];
}): CareerStageState {
  const { stageId, currentStageId, completedStageIds, stages } = params;

  if (completedStageIds.includes(stageId)) return "completed";
  if (currentStageId != null && stageId === currentStageId) return "current";

  if (currentStageId != null) {
    const current = stages.find((stage) => stage.id === currentStageId);
    const stage = stages.find((item) => item.id === stageId);
    if (current && stage && stage.sortOrder < current.sortOrder) {
      return "completed";
    }
  }

  return "upcoming";
}

export function sortCareerStages<T extends CareerStageLike>(stages: T[]): T[] {
  return [...stages].sort((a, b) => a.sortOrder - b.sortOrder);
}
