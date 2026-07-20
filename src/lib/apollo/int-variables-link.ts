import { ApolloLink } from "@apollo/client";
import { toGraphQLInt } from "@/lib/graphql/ids";

const INT_VARIABLE_PATTERN =
  /(?:^|_)(?:id|Id)$|^(?:academyId|courseId|moduleId|lessonId|enrollmentId|resourceId|partnerId|shortLinkId|campaignId|parentId)$/;

export function coerceIntVariables(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(coerceIntVariables);
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  const input = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};

  for (const [key, nested] of Object.entries(input)) {
    if (INT_VARIABLE_PATTERN.test(key)) {
      const asInt = toGraphQLInt(nested);
      output[key] = asInt ?? nested;
      continue;
    }
    output[key] = coerceIntVariables(nested);
  }

  return output;
}

/**
 * Nest/Prisma sometimes serializes Int fields as strings in JSON.
 * GraphQL Int variables reject those strings — coerce before the request.
 */
export const intVariablesLink = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    operation.variables = coerceIntVariables(
      operation.variables,
    ) as typeof operation.variables;
  }
  return forward(operation);
});
