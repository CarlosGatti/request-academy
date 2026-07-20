import { ContentTypeBadge } from "@/components/academy/content-type-badge";
import { cn } from "@/lib/utils/cn";
import { Download, ExternalLink, FileText } from "lucide-react";

export type ResourceCardData = {
  id: number;
  title: string;
  description?: string | null;
  type: string;
  fileUrl?: string | null;
  externalUrl?: string | null;
  textContent?: string | null;
  downloadable?: boolean | null;
  fileName?: string | null;
};

export function ResourceCard({
  resource,
  className,
}: {
  resource: ResourceCardData;
  className?: string;
}) {
  const href = resource.fileUrl || resource.externalUrl;
  const isDownload = Boolean(resource.downloadable && resource.fileUrl);

  return (
    <article
      className={cn(
        "flex flex-col gap-3 border border-border bg-surface p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <ContentTypeBadge type={resource.type} kind="resource" />
          <h3 className="font-display text-base font-medium text-primary">
            {resource.title}
          </h3>
        </div>
        <FileText className="size-5 shrink-0 text-muted" aria-hidden />
      </div>
      {resource.description ? (
        <p className="text-sm text-muted line-clamp-2">{resource.description}</p>
      ) : null}
      {resource.textContent && !href ? (
        <p className="prose-academy text-sm whitespace-pre-wrap line-clamp-4">
          {resource.textContent}
        </p>
      ) : null}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          download={isDownload || undefined}
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          {isDownload ? (
            <>
              <Download className="size-4" aria-hidden />
              Download
            </>
          ) : (
            <>
              <ExternalLink className="size-4" aria-hidden />
              Open
            </>
          )}
          {resource.fileName ? (
            <span className="text-muted font-normal">({resource.fileName})</span>
          ) : null}
        </a>
      ) : null}
    </article>
  );
}
