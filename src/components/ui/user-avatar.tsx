"use client";

import { resolveMediaUrl } from "@/lib/media/resolve-media-url";
import { cn } from "@/lib/utils/cn";

export type UserAvatarProps = {
  profilePicture?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  email?: string | null;
  size?: number;
  className?: string;
  /** Optional cache-bust after upload */
  cacheKey?: string | number | null;
};

function initialsFrom({
  displayName,
  firstName,
  lastName,
  email,
}: {
  displayName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): string {
  const label =
    displayName?.trim() ||
    [firstName, lastName].filter(Boolean).join(" ").trim() ||
    email?.split("@")[0] ||
    "";
  if (!label) return "?";
  return label
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function UserAvatar({
  profilePicture,
  firstName,
  lastName,
  displayName,
  email,
  size = 32,
  className,
  cacheKey,
}: UserAvatarProps) {
  const resolved = resolveMediaUrl(profilePicture);
  const src =
    resolved && cacheKey != null ? `${resolved}?v=${cacheKey}` : resolved;
  const initials = initialsFrom({
    displayName,
    firstName,
    lastName,
    email,
  });

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary",
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden={src ? undefined : true}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote API host; not in next/image remotePatterns
        <img
          src={src}
          alt=""
          className="h-full w-full object-cover"
          width={size}
          height={size}
        />
      ) : (
        <span
          className="font-ui font-semibold text-primary"
          style={{ fontSize: Math.max(10, Math.round(size * 0.35)) }}
        >
          {initials}
        </span>
      )}
    </span>
  );
}
