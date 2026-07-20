import { cn } from "@/lib/utils/cn";

export function ProgressBar({
  value,
  className,
  label,
}: {
  value: number;
  className?: string;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{label}</span>
          <span>{clamped}%</span>
        </div>
      ) : null}
      <div
        className="h-2 w-full overflow-hidden rounded-sm bg-secondary"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full bg-accent transition-[width] duration-300"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
