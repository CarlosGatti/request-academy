"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  CreateDefinedAcademyShortLinkDocument,
  DefinedAcademyShortLinksAdminDocument,
  DisableDefinedAcademyShortLinkDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function AdminShortLinksView() {
  const { academyId } = useAdminAcademy();
  const [destinationUrl, setDestinationUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  const linksQuery = useQuery(DefinedAcademyShortLinksAdminDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const [createLink, { loading }] = useMutation(
    CreateDefinedAcademyShortLinkDocument,
  );
  const [disableLink] = useMutation(DisableDefinedAcademyShortLinkDocument);

  const links = linksQuery.data?.definedAcademyShortLinks ?? [];

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage short links.</Alert>;
  }

  if (linksQuery.loading && !links.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Short links"
        description="Tracked redirects resolved only via the academy API."
      />

      <div className="space-y-4 border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium text-primary">
          Create short link
        </h2>
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Destination URL</Label>
            <Input
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          <div className="space-y-2">
            <Label>Custom code (optional)</Label>
            <Input
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
            />
          </div>
        </div>
        <Button
          disabled={loading || !destinationUrl}
          onClick={() => {
            setError(null);
            void createLink({
              variables: {
                academyId,
                input: {
                  destinationUrl,
                  customCode: customCode || undefined,
                },
              },
            })
              .then(() => {
                setDestinationUrl("");
                setCustomCode("");
                return linksQuery.refetch();
              })
              .catch((err) =>
                setError(getGraphQLErrorMessage(err, "Unable to create short link.")),
              );
          }}
        >
          {loading ? "Creating…" : "Create link"}
        </Button>
      </div>

      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-sm text-primary">/l/{link.code}</code>
                <StatusBadge status={link.status} />
                <span className="text-xs text-muted">{link.visitCount} visits</span>
              </div>
              <p className="truncate text-sm text-muted">{link.destinationUrl}</p>
            </div>
            {link.status === "ACTIVE" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  void disableLink({
                    variables: { academyId, shortLinkId: link.id },
                  }).then(() => linksQuery.refetch())
                }
              >
                Disable
              </Button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
