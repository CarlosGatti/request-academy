"use client";

import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { Alert } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ResolveDefinedAcademyShortLinkDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import Link from "next/link";
import { clientEnv } from "@/lib/env/client";

function isSafeDestination(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

export function ShortLinkResolver({ code }: { code: string }) {
  const { data, loading, error } = useQuery(ResolveDefinedAcademyShortLinkDocument, {
    variables: { code },
  });

  const resolved = data?.resolveDefinedAcademyShortLink;

  useEffect(() => {
    if (!resolved?.destinationUrl) return;
    if (resolved.status !== "ACTIVE") return;
    if (!isSafeDestination(resolved.destinationUrl)) return;
    window.location.replace(resolved.destinationUrl);
  }, [resolved]);

  if (loading) {
    return (
      <Container className="py-10">
        <PageHeader title="Opening link" description="Validating destination…" />
        <div className="mt-8">
          <PageLoading rows={1} />
        </div>
      </Container>
    );
  }

  if (error || !resolved) {
    const message = getGraphQLErrorMessage(error, "").toLowerCase();
    const expired = message.includes("expired");
    const disabled = message.includes("disabled");

    return (
      <Container className="py-10">
        <PageHeader title="Link unavailable" />
        <div className="mt-8 max-w-lg space-y-4">
          <Alert
            tone="warning"
            title={
              expired
                ? "This link has expired"
                : disabled
                  ? "This link is disabled"
                  : "Link not found"
            }
          >
            The short link <code className="font-mono text-sm">{code}</code> could
            not be opened. Destinations are only loaded from the academy API—never
            from unvalidated query parameters.
          </Alert>
          <Link
            href={`/academy/${clientEnv.NEXT_PUBLIC_DEFAULT_ACADEMY_SLUG}`}
            className="inline-flex text-sm font-medium text-accent hover:underline"
          >
            Go to academy home
          </Link>
        </div>
      </Container>
    );
  }

  if (resolved.status === "EXPIRED") {
    return (
      <Container className="py-10">
        <Alert tone="warning" title="This link has expired">
          Ask your referrer for an updated link.
        </Alert>
      </Container>
    );
  }

  if (resolved.status === "DISABLED") {
    return (
      <Container className="py-10">
        <Alert tone="warning" title="This link is disabled">
          It is no longer accepting traffic.
        </Alert>
      </Container>
    );
  }

  if (!isSafeDestination(resolved.destinationUrl)) {
    return (
      <Container className="py-10">
        <Alert tone="danger" title="Unsafe destination blocked">
          The API returned a destination that could not be validated.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <PageHeader title="Redirecting…" description="Taking you to the destination." />
      <p className="mt-4 text-sm text-muted">
        If nothing happens,{" "}
        <a
          href={resolved.destinationUrl}
          className="font-medium text-accent hover:underline"
        >
          continue here
        </a>
        .
      </p>
    </Container>
  );
}
