import { ExternalLink, FileText, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils/cn";

export type ResourceCardData = {
  id: number;
  title: string;
  type: string;
  description?: string | null;
  fileUrl?: string | null;
  externalUrl?: string | null;
  downloadable?: boolean | null;
  status?: string | null;
  placementLabel: string;
};

export function ResourceCard({
  resource,
  onArchive,
  className,
}: {
  resource: ResourceCardData;
  onArchive?: () => void;
  className?: string;
}) {
  const hasFile = Boolean(resource.fileUrl);
  const hasExternal = Boolean(resource.externalUrl);

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70 sm:flex-row sm:items-start sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-medium text-primary">{resource.title}</h3>
          <StatusBadge status={resource.status ?? "DRAFT"} />
          <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-muted">
            {resource.type}
          </span>
        </div>
        {resource.description ? (
          <p className="line-clamp-2 text-sm text-muted">{resource.description}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Paperclip className="size-3.5" aria-hidden />
            {resource.placementLabel}
          </span>
          {hasFile ? (
            <span className="inline-flex items-center gap-1">
              <FileText className="size-3.5" aria-hidden />
              Uploaded file
            </span>
          ) : null}
          {hasExternal ? (
            <span className="inline-flex items-center gap-1">
              <ExternalLink className="size-3.5" aria-hidden />
              External link
            </span>
          ) : null}
          <span>
            {resource.downloadable ? "Downloadable" : "View only"}
          </span>
        </div>
      </div>
      {resource.status !== "ARCHIVED" && onArchive ? (
        <Button size="sm" variant="outline" onClick={onArchive}>
          Archive
        </Button>
      ) : null}
    </article>
  );
}
