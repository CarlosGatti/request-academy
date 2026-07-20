"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [sourceType, setSourceType] = useState("OTHER");
  const [error, setError] = useState<string | null>(null);

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

  if (!academyId) {
    return <Alert tone="warning">Select an academy to manage campaigns.</Alert>;
  }

  if (campaignsQuery.loading && !campaigns.length) return <PageLoading />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Referral campaigns"
        description="First-touch attribution codes for partners and outreach."
      />

      <div className="space-y-4 border border-border bg-surface p-5">
        <h2 className="font-display text-lg font-medium text-primary">
          Create campaign
        </h2>
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Code (optional)</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Source type</Label>
            <Select
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
          <Label>Description</Label>
          <Textarea
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
                return campaignsQuery.refetch();
              })
              .catch((err) =>
                setError(getGraphQLErrorMessage(err, "Unable to create campaign.")),
              );
          }}
        >
          {loading ? "Saving…" : "Create campaign"}
        </Button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="flex flex-col gap-3 border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
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
          </div>
        ))}
      </div>
    </div>
  );
}
