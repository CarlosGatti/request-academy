import { cn } from "@/lib/utils/cn";

export function Spinner({
  className,
  label = "Loading",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex items-center gap-2 text-muted", className)}
    >
      <span
        className="size-4 animate-spin rounded-full border-2 border-border border-t-accent"
        aria-hidden
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
