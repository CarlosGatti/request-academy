"use client";

import { useState } from "react";
import {
  initialsFromName,
  resolveAuditAvatarSrc,
} from "@/features/admin/data-audit/resolve-avatar";
import { cn } from "@/lib/utils/cn";

/**
 * Avatar for Data Audit Lab profiles.
 * RE-Quest signed S3 URLs are often unavailable via the public API —
 * always provide initials fallback. Never call re-quest.com/api from the browser.
 */
export function DataAuditAvatar({
  displayName,
  avatarUrl,
  avatarPath,
  sourceProfileId,
  size = 40,
  showName = false,
  className,
}: {
  displayName?: string | null;
  avatarUrl?: string | null;
  avatarPath?: string | null;
  sourceProfileId?: string | null;
  size?: number;
  showName?: boolean;
  className?: string;
}) {
  const { src, pendingCdn } = resolveAuditAvatarSrc({ avatarUrl, avatarPath });
  const [failed, setFailed] = useState(false);
  const initials = initialsFromName(displayName);
  const showImage = Boolean(src) && !failed;
  const profileHref = sourceProfileId
    ? `https://re-quest.com/user/profile/${encodeURIComponent(sourceProfileId)}`
    : null;

  const media = showImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src!}
      alt={displayName ?? "Professional"}
      width={size}
      height={size}
      className="shrink-0 rounded-full object-cover"
      style={{ width: size, height: size }}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  ) : (
    <div
      title={
        pendingCdn || avatarPath
          ? "Avatar on file (signed URL not available via public API)"
          : undefined
      }
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-secondary font-medium text-primary"
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.35) }}
      aria-hidden={showName ? undefined : true}
    >
      {initials || "?"}
    </div>
  );

  return (
    <div className={cn("flex min-w-0 items-center gap-2", className)}>
      {profileHref ? (
        <a
          href={profileHref}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          onClick={(event) => event.stopPropagation()}
          title="Open public RE-Quest profile"
        >
          {media}
          <span className="sr-only">Open public profile for {displayName ?? "professional"}</span>
        </a>
      ) : (
        media
      )}
      {showName ? (
        <span className="truncate text-sm text-primary">
          {displayName ?? "—"}
        </span>
      ) : null}
    </div>
  );
}
