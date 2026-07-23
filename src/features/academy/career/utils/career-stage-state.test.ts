import { describe, expect, it } from "vitest";
import { getStageState } from "@/features/academy/career/utils/career-stage-state";

const stages = [
  { id: 1, sortOrder: 0 },
  { id: 2, sortOrder: 1 },
  { id: 3, sortOrder: 2 },
];

describe("getStageState", () => {
  it("marks completion records as completed", () => {
    expect(
      getStageState({
        stageId: 1,
        currentStageId: 2,
        completedStageIds: [1],
        stages,
      }),
    ).toBe("completed");
  });

  it("marks the current stage", () => {
    expect(
      getStageState({
        stageId: 2,
        currentStageId: 2,
        completedStageIds: [1],
        stages,
      }),
    ).toBe("current");
  });

  it("treats earlier sortOrder as completed when current is set", () => {
    expect(
      getStageState({
        stageId: 1,
        currentStageId: 3,
        completedStageIds: [],
        stages,
      }),
    ).toBe("completed");
  });

  it("marks later stages as upcoming", () => {
    expect(
      getStageState({
        stageId: 3,
        currentStageId: 2,
        completedStageIds: [1],
        stages,
      }),
    ).toBe("upcoming");
  });
});
