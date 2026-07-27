import { describe, expect, it } from "vitest";
import { parseOverviewMetrics } from "@/features/admin/data-audit/types";

describe("parseOverviewMetrics", () => {
  it("returns null for invalid input", () => {
    expect(parseOverviewMetrics(null)).toBeNull();
    expect(parseOverviewMetrics("x")).toBeNull();
  });

  it("parses distribution and severity detail safely", () => {
    const parsed = parseOverviewMetrics({
      totalProfiles: 29,
      agents: 23,
      lenders: 6,
      distributions: {
        agentTypes: [{ label: "Agent", count: 23 }],
        cities: [{ label: "Denver", count: 4 }],
        findingsBySeverityDetail: [
          {
            severity: "HIGH",
            label: "High",
            color: "#EA580C",
            count: 3,
            percentage: 10,
            meaning: "Needs attention",
            examples: "",
            topRules: [],
          },
        ],
        findingsCountingNote: "Counts are findings, not profiles.",
      },
    });

    expect(parsed?.totalProfiles).toBe(29);
    expect(parsed?.distributions.agentTypes[0]?.count).toBe(23);
    expect(parsed?.distributions.findingsBySeverityDetail[0]?.color).toBe(
      "#EA580C",
    );
    expect(parsed?.distributions.findingsCountingNote).toContain("findings");
  });
});
