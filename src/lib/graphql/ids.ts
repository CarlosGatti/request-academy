/** Coerce GraphQL/HTML/localStorage values to a positive Int for API variables. */
export function toGraphQLInt(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

/** Same as toGraphQLInt but throws if missing — use right before mutations. */
export function requireGraphQLInt(value: unknown, label = "id"): number {
  const n = toGraphQLInt(value);
  if (n == null) {
    throw new Error(`Expected integer ${label}, got ${String(value)}`);
  }
  return n;
}
