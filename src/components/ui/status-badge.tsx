import { cn } from "@/lib/utils/cn";

const statusStyles: Record<string, string> = {
  ENROLLED: "bg-secondary text-primary",
  IN_PROGRESS: "bg-accent/15 text-accent",
  COMPLETED: "bg-accent text-white",
  CANCELLED: "bg-border text-muted",
  NOT_STARTED: "bg-secondary text-muted",
};

const statusLabels: Record<string, string> = {
  ENROLLED: "Available",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NOT_STARTED: "Not started",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium",
        statusStyles[status] ?? "bg-secondary text-primary",
        className,
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
