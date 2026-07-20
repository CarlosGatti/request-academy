import { cn } from "@/lib/utils/cn";
import { lessonTypeLabel, resourceTypeLabel } from "@/lib/academy/labels";

export function ContentTypeBadge({
  type,
  kind = "lesson",
  className,
}: {
  type: string;
  kind?: "lesson" | "resource";
  className?: string;
}) {
  const label = kind === "resource" ? resourceTypeLabel(type) : lessonTypeLabel(type);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm bg-secondary px-2 py-0.5 text-xs font-medium tracking-wide text-primary",
        className,
      )}
    >
      {label}
    </span>
  );
}
