import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "@/components/ui/activity-feed";
import { MetricCard } from "@/components/ui/metric-card";

describe("MetricCard", () => {
  it("renders real zero values without fabricating trends", () => {
    render(<MetricCard label="Enrollments" value={0} />);
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Enrollments")).toBeInTheDocument();
    expect(screen.queryByText(/trend/i)).not.toBeInTheDocument();
  });

  it("shows loading skeleton", () => {
    render(<MetricCard label="Enrollments" loading />);
    expect(screen.getByLabelText("Loading Enrollments")).toBeInTheDocument();
  });
});

describe("ActivityFeed", () => {
  it("shows empty state when no events exist", () => {
    render(<ActivityFeed items={[]} />);
    expect(screen.getByText("No recent activity yet")).toBeInTheDocument();
  });
});
