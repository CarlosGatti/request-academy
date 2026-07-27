/**
 * Resolve academy media URLs for display.
 * Absolute https URLs pass through; relative `/uploads/...` get API origin.
 */
export function resolveMediaUrl(
  url?: string | null,
  apiBaseOverride?: string,
): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const fromEnv =
    apiBaseOverride ||
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace(/\/graphql\/?$/, "") ||
    "";

  const base = fromEnv.replace(/\/$/, "");
  if (!base) return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${base}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}
