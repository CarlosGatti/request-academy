/** Resolve public media URLs for Data Audit Lab avatars (never call RE-Quest API). */

export function resolveAuditAvatarSrc(input: {
  avatarUrl?: string | null;
  avatarPath?: string | null;
}): { src: string | null; pendingCdn: boolean } {
  if (input.avatarUrl && /^https?:\/\//i.test(input.avatarUrl)) {
    return { src: input.avatarUrl, pendingCdn: false };
  }
  const mediaBase = process.env.NEXT_PUBLIC_REQUEST_MEDIA_BASE_URL?.replace(
    /\/$/,
    "",
  );
  if (mediaBase && input.avatarPath) {
    return {
      src: `${mediaBase}/${input.avatarPath.replace(/^\/+/, "")}`,
      pendingCdn: false,
    };
  }
  return {
    src: null,
    pendingCdn: Boolean(input.avatarPath) && !mediaBase,
  };
}

export function initialsFromName(name?: string | null): string {
  return (
    (name ?? "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
