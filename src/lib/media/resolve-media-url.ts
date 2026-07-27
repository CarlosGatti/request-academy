import { getApiBase } from "@/lib/media/api-base";

/** Turn `/uploads/...` or absolute URL into a display-ready href. */
export function resolveMediaUrl(url?: string | null): string | null {
  if (!url?.trim()) return null;
  const value = url.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("/")) return `${getApiBase()}${value}`;
  return `${getApiBase()}/${value.replace(/^\/+/, "")}`;
}
