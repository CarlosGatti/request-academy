import { Skeleton } from "@/components/ui/skeleton";

export function PageLoading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="h-4 w-full max-w-xl" />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-28 w-full" />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}
