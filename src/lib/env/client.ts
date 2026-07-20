import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_GRAPHQL_URL: z.url(),
  /** Optional override; defaults to GraphQL origin (strip `/graphql`). */
  NEXT_PUBLIC_API_BASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG: z
    .string()
    .min(1)
    .default("re-quest-academy"),
  NEXT_PUBLIC_APP_NAME: z.string().default("Defined Academy"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema> & {
  /** REST API origin for uploads (e.g. http://localhost:3000) */
  apiBaseUrl: string;
};

function deriveApiBaseUrl(graphqlUrl: string, override?: string): string {
  if (override) return override.replace(/\/$/, "");
  try {
    const url = new URL(graphqlUrl);
    return url.origin;
  } catch {
    return graphqlUrl.replace(/\/graphql\/?$/, "");
  }
}

function readClientEnv(): ClientEnv {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_GRAPHQL_URL: process.env.NEXT_PUBLIC_GRAPHQL_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || undefined,
    NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG:
      process.env.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG ?? "re-quest-academy",
    NEXT_PUBLIC_APP_NAME:
      process.env.NEXT_PUBLIC_APP_NAME ?? "Defined Academy",
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid client environment: ${details}`);
  }

  return {
    ...parsed.data,
    apiBaseUrl: deriveApiBaseUrl(
      parsed.data.NEXT_PUBLIC_GRAPHQL_URL,
      parsed.data.NEXT_PUBLIC_API_BASE_URL,
    ),
  };
}

export const clientEnv = readClientEnv();
