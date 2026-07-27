import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function QuickActionCard({
  href,
  title,
  description,
  icon: Icon,
  className,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex gap-3 rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70 transition-colors",
        "hover:bg-sea-foam/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        className,
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-accent">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-primary group-hover:text-primary">
          {title}
        </span>
        <span className="mt-0.5 block text-sm text-muted">{description}</span>
      </span>
    </Link>
  );
}
