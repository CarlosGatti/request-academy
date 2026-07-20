import { cn } from "@/lib/utils/cn";
import type { HTMLAttributes } from "react";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-secondary/80", className)}
      {...props}
    />
  );
}
