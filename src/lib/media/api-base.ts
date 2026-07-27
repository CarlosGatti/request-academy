/** REST API origin (e.g. https://www.discart.me) — no trailing slash. */
export function getApiBase(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    process.env.NEXT_PUBLIC_GRAPHQL_URL?.replace(/\/graphql\/?$/, "") ??
    "http://localhost:3000";
  return raw.replace(/\/$/, "");
}
