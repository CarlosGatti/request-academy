export function getGraphQLErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (!error) return fallback;

  if (typeof error === "object" && error !== null) {
    if ("errors" in error && Array.isArray((error as { errors: unknown[] }).errors)) {
      const first = (error as { errors: Array<{ message?: string }> }).errors[0];
      if (first?.message) return first.message;
    }

    if (
      "graphQLErrors" in error &&
      Array.isArray((error as { graphQLErrors: unknown[] }).graphQLErrors)
    ) {
      const first = (error as { graphQLErrors: Array<{ message?: string }> })
        .graphQLErrors[0];
      if (first?.message) return first.message;
    }

    if (
      "message" in error &&
      typeof (error as { message: unknown }).message === "string"
    ) {
      return (error as { message: string }).message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function isAlreadyEnrolledError(error: unknown): boolean {
  const message = getGraphQLErrorMessage(error, "").toLowerCase();
  return message.includes("already enrolled") || message.includes("already exists");
}

export function isUnauthorizedError(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "errors" in error) {
    const errors = (error as { errors: Array<{ extensions?: { code?: string | number } }> })
      .errors;
    const first = errors?.[0];
    const code = first?.extensions?.code;
    if (code === "UNAUTHENTICATED" || code === 401 || code === "401") return true;
  }
  return getGraphQLErrorMessage(error, "").toLowerCase().includes("unauthorized");
}
