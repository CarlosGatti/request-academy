"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { Check, Copy, Link2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  CreateDataAuditShareLinkDocument,
  DataAuditSharesDocument,
  RevokeDataAuditShareLinkDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

const DEFAULT_MESSAGE =
  "Hi Hailee — here's a stakeholder briefing from the Data Audit Lab. It summarizes public RE-Quest professional data quality ahead of Thursday's conversation. Individual contact details are withheld; aggregates and content opportunities are front and center.";

function localShareUrl(token: string, fallbackUrl: string) {
  if (typeof window !== "undefined" && window.location?.origin) {
    return `${window.location.origin}/share/data-audit/${token}`;
  }
  return fallbackUrl;
}

export function DataAuditSharePanel() {
  const sharesQuery = useQuery(DataAuditSharesDocument, {
    variables: { take: 10 },
  });
  const [createShare, createState] = useMutation(CreateDataAuditShareLinkDocument);
  const [revokeShare, revokeState] = useMutation(RevokeDataAuditShareLinkDocument);

  const [recipientName, setRecipientName] = useState("Hailee");
  const [title, setTitle] = useState("RE-Quest Data Quality Briefing");
  const [personalMessage, setPersonalMessage] = useState(DEFAULT_MESSAGE);
  const [expiresInDays, setExpiresInDays] = useState("21");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [latestUrl, setLatestUrl] = useState<string | null>(null);

  async function handleCreate() {
    setError(null);
    try {
      const result = await createShare({
        variables: {
          input: {
            title: title.trim() || undefined,
            recipientName: recipientName.trim() || undefined,
            personalMessage: personalMessage.trim() || undefined,
            expiresInDays: Number(expiresInDays) || 21,
            inviteCtaLabel: "Join RE-Quest Academy",
            invitePath: "/register",
          },
        },
      });
      const created = result.data?.createDataAuditShareLink;
      if (created) {
        const url = localShareUrl(created.token, created.shareUrl);
        setLatestUrl(url);
        await navigator.clipboard.writeText(url);
        setCopiedId(created.id);
      }
      await sharesQuery.refetch();
    } catch (err) {
      setError(getGraphQLErrorMessage(err));
    }
  }

  async function copyUrl(id: number, token: string, fallbackUrl: string) {
    const url = localShareUrl(token, fallbackUrl);
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setLatestUrl(url);
  }

  async function handleRevoke(id: number) {
    setError(null);
    try {
      await revokeShare({ variables: { id } });
      await sharesQuery.refetch();
    } catch (err) {
      setError(getGraphQLErrorMessage(err));
    }
  }

  const shares = sharesQuery.data?.dataAuditShares ?? [];

  return (
    <section className="space-y-4 border border-border bg-surface p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-xl text-primary">
            <Link2 className="size-5" aria-hidden />
            Share briefing link
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Create a private link anyone can open without an account. New links
            include Overview, Profiles, Public Exposure, Discrepancies, and CSV
            export — with raw contact values withheld. Create a fresh link after
            each audit for Hailee.
          </p>
        </div>
      </div>

      {error ? (
        <Alert tone="danger" title="Share action failed">
          {error}
        </Alert>
      ) : null}

      {latestUrl ? (
        <Alert tone="success" title="Link ready — copied to clipboard">
          <a
            href={latestUrl}
            target="_blank"
            rel="noreferrer"
            className="break-all text-primary underline-offset-2 hover:underline"
          >
            {latestUrl}
          </a>
        </Alert>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Recipient name
          </span>
          <input
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Hailee"
          />
        </label>
        <label className="space-y-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Expires in
          </span>
          <Select
            className="w-full"
            value={expiresInDays}
            onChange={(e) => setExpiresInDays(e.target.value)}
          >
            <option value="7">7 days</option>
            <option value="14">14 days</option>
            <option value="21">21 days</option>
            <option value="30">30 days</option>
            <option value="0">No expiry</option>
          </Select>
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Report title
          </span>
          <input
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="space-y-1 text-sm md:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Personal note
          </span>
          <textarea
            className="min-h-24 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm"
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
          />
        </label>
      </div>

      <Button
        disabled={createState.loading}
        onClick={() => void handleCreate()}
      >
        {createState.loading ? "Creating…" : "Create & copy share link"}
      </Button>

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-primary">Recent links</h3>
        {sharesQuery.loading && !shares.length ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : shares.length === 0 ? (
          <p className="text-sm text-muted">No share links yet.</p>
        ) : (
          <ul className="divide-y divide-border border border-border">
            {shares.map((share) => (
              <li
                key={share.id}
                className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium text-primary">
                      {share.title}
                    </p>
                    <StatusBadge
                      status={share.isActive ? "ACTIVE" : "REVOKED"}
                    />
                  </div>
                  <p className="text-xs text-muted">
                    {share.recipientName ? `For ${share.recipientName} · ` : null}
                    Audit #{share.auditRunId} · {share.viewCount} views
                    {share.expiresAt
                      ? ` · expires ${new Date(share.expiresAt).toLocaleDateString()}`
                      : null}
                  </p>
                  <p className="truncate text-xs text-muted">
                    {localShareUrl(share.token, share.shareUrl)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void copyUrl(share.id, share.token, share.shareUrl)
                    }
                  >
                    {copiedId === share.id ? (
                      <Check className="size-4" aria-hidden />
                    ) : (
                      <Copy className="size-4" aria-hidden />
                    )}
                    Copy
                  </Button>
                  {share.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={revokeState.loading}
                      onClick={() => void handleRevoke(share.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                      Revoke
                    </Button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
