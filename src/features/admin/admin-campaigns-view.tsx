"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { Select, Textarea } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { useAdminAcademy } from "@/features/admin/admin-academy-context";
import {
  CreateDefinedAcademyReferralCampaignDocument,
  DefinedAcademyReferralCampaignsAdminDocument,
  UpdateDefinedAcademyReferralCampaignDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";

export function AdminCampaignsView() {
  const { academyId } = useAdminAcademy();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("OTHER");
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "ARCHIVED">(
    "ALL",
  );

  const campaignsQuery = useQuery(DefinedAcademyReferralCampaignsAdminDocument, {
    variables: { academyId: academyId ?? 0 },
    skip: !academyId,
  });
  const [createCampaign, { loading }] = useMutation(
    CreateDefinedAcademyReferralCampaignDocument,
  );
  const [updateCampaign] = useMutation(
    UpdateDefinedAcademyReferralCampaignDocument,
  );

  const campaigns = campaignsQuery.data?.definedAcademyReferralCampaigns ?? [];
  const filtered = useMemo(() => {
    const source = campaignsQuery.data?.definedAcademyReferralCampaigns ?? [];
    const query = search.trim().toLowerCase();
    return source.filter((campaign) => {
      if (statusFilter !== "ALL" && campaign.status !== statusFilter) {
        return false;
      }
      if (!query) return true;
      return (
        campaign.name.toLowerCase().includes(query) ||
        campaign.code.toLowerCase().includes(query) ||
        campaign.sourceType.toLowerCase().includes(query)
      );
    });
  }, [
    campaignsQuery.data?.definedAcademyReferralCampaigns,
    search,
    statusFilter,
  ]);

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage campaigns.</Alert>;
  }

  if (campaignsQuery.loading && !campaigns.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Growth"
        title="Campaigns"
        description="First-touch attribution codes for partners and outreach."
        actions={
          <Button variant="highlight" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Cancel" : "Create campaign"}
          </Button>
        }
      />

      {showForm ? (
        <div className="space-y-4 rounded-xl bg-surface p-5 shadow-card ring-1 ring-border/70">
          <h2 className="font-display text-lg font-medium text-primary">
            Create campaign
          </h2>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Name</Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-code">Source code (optional)</Label>
              <Input
                id="campaign-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-source">Source type</Label>
              <Select
                id="campaign-source"
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value)}
              >
                {[
                  "SCHOOL",
                  "PARTNER",
                  "PROFESSIONAL",
                  "LINKEDIN",
                  "EMAIL",
                  "EVENT",
                  "SOCIAL",
                  "ORGANIC",
                  "OTHER",
                ].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-description">Description</Label>
            <Textarea
              id="campaign-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button
            disabled={loading || !name}
            onClick={() => {
              setError(null);
              void createCampaign({
                variables: {
                  academyId,
                  input: {
                    name,
                    code: code || undefined,
                    description: description || undefined,
                    sourceType: sourceType as
                      | "SCHOOL"
                      | "PARTNER"
                      | "PROFESSIONAL"
                      | "LINKEDIN"
                      | "EMAIL"
                      | "EVENT"
                      | "SOCIAL"
                      | "ORGANIC"
                      | "OTHER",
                    status: "ACTIVE",
                  },
                },
              })
                .then(() => {
                  setName("");
                  setCode("");
                  setDescription("");
                  setShowForm(false);
                  return campaignsQuery.refetch();
                })
                .catch((err) =>
                  setError(
                    getGraphQLErrorMessage(err, "Unable to create campaign."),
                  ),
                );
            }}
          >
            {loading ? "Saving…" : "Create campaign"}
          </Button>
        </div>
      ) : null}

      {campaigns.length > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border/70 sm:flex-row">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="campaign-search">Search</Label>
            <Input
              id="campaign-search"
              placeholder="Search by name or code"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full space-y-2 sm:w-44">
            <Label htmlFor="campaign-status">Status</Label>
            <Select
              id="campaign-status"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "ARCHIVED")
              }
            >
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
          </div>
        </div>
      ) : null}

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create attribution campaigns to track partner and outreach traffic."
          action={
            <Button variant="highlight" onClick={() => setShowForm(true)}>
              Create campaign
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matching campaigns"
          description="Try a different search or status filter."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((campaign) => (
            <article
              key={campaign.id}
              className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-primary">{campaign.name}</p>
                  <StatusBadge status={campaign.status} />
                </div>
                <p className="text-sm text-muted">
                  Code <code className="font-mono">{campaign.code}</code> ·{" "}
                  {campaign.sourceType}
                </p>
                {campaign.description ? (
                  <p className="line-clamp-2 text-sm text-muted">
                    {campaign.description}
                  </p>
                ) : null}
              </div>
              <div className="flex gap-2">
                {campaign.status !== "ACTIVE" ? (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() =>
                      void updateCampaign({
                        variables: {
                          academyId,
                          campaignId: campaign.id,
                          input: { status: "ACTIVE" },
                        },
                      }).then(() => campaignsQuery.refetch())
                    }
                  >
                    Activate
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void updateCampaign({
                        variables: {
                          academyId,
                          campaignId: campaign.id,
                          input: { status: "ARCHIVED" },
                        },
                      }).then(() => campaignsQuery.refetch())
                    }
                  >
                    Archive
                  </Button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
