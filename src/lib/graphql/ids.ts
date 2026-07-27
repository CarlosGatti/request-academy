/** Coerce GraphQL/HTML/localStorage/env values to Int for API variables. */

/**
 * Soft coerce — returns null when missing/invalid.
 * Allows `0` for Apollo `skip` placeholders (never send 0 for real IDs).
 */
export function toGraphQLInt(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n) || !Number.isInteger(n)) return null;
  return n;
}

/**
 * Hard coerce for GraphQL `Int!` / REST multipart IDs.
 * Always returns a **positive** integer — never a string.
 */
export function toInt(value: unknown, fieldName = "id"): number {
  const n = toGraphQLInt(value);
  if (n == null || n < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return n;
}

export function toOptionalInt(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  return toInt(value);
}

/** Alias used across Academy mutations — same as `toInt`. */
export function requireGraphQLInt(value: unknown, label = "id"): number {
  return toInt(value, label);
}
