import { EmptyState } from "@/components/ui/empty-state";
import type { ReactNode } from "react";

export type ActivityItem = {
  id: string;
  title: string;
  description?: string;
  occurredAt?: string;
};

/**
 * Recent activity feed. Renders a useful empty state when no events exist.
 * Do not fabricate activity — only pass real backend events.
 */
export function ActivityFeed({
  items,
  emptyTitle = "No recent activity yet",
  emptyDescription = "As programs publish, resources upload, and enrollments complete, activity will appear here.",
  emptyAction,
}: {
  items: ActivityItem[];
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <ul className="divide-y divide-border overflow-hidden rounded-xl bg-surface shadow-card ring-1 ring-border/70">
      {items.map((item) => (
        <li key={item.id} className="px-4 py-3">
          <p className="text-sm font-medium text-primary">{item.title}</p>
          {item.description ? (
            <p className="mt-0.5 text-sm text-muted">{item.description}</p>
          ) : null}
          {item.occurredAt ? (
            <p className="mt-1 text-xs text-muted">{item.occurredAt}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
