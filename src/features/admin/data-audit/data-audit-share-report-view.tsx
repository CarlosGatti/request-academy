"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { FileSpreadsheet } from "lucide-react";
import {
  AgentTypeDonutCard,
  AvailabilityStatusCard,
  CompletenessKpiCard,
  NewRegistrationsMonthlyCard,
  SimpleBarCard,
  SpecializationsPieCard,
  TopCitiesBarCard,
  type DistItem,
  type MonthlyRegistrations,
} from "@/features/admin/data-audit/chart-cards";
import {
  DemographicMapCard,
  type GeoMapData,
} from "@/features/admin/data-audit/demographic-map-card";
import { Alert } from "@/components/ui/alert";
import { Button, buttonClassName } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PageLoading } from "@/components/ui/page-loading";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataAuditSharePublicDocument } from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { cn } from "@/lib/utils/cn";

type ShareTab = "overview" | "profiles" | "exposure" | "discrepancies";

type ShareProfile = {
  displayName?: string | null;
  slug?: string | null;
  agentType?: string | null;
  agencyName?: string | null;
  yearsInBusiness?: number | null;
  yearsInArea?: number | null;
  contractsCompleted?: number | null;
  cities?: string[];
  isVerified?: boolean | null;
  isProfileComplete?: boolean | null;
  hasEmail: boolean;
  hasPhone: boolean;
  hasDocumentReferences?: boolean;
  documentReferenceCount: number;
  findingCount: number;
  highestSeverity?: string | null;
  exposureFindingCount?: number;
};

type ShareFinding = {
  severity: string;
  category: string;
  ruleCode: string;
  title: string;
  description: string;
  recommendation?: string | null;
  fieldPath?: string | null;
  status: string;
  profileName?: string | null;
  profileType?: string | null;
};

type ShareReport = {
  generatedAt?: string;
  auditCompletedAt?: string | null;
  headlineMetrics?: Record<string, number>;
  distributions?: Record<
    string,
    DistItem[] | MonthlyRegistrations | GeoMapData | null
  >;
  findingsSummary?: {
    note?: string;
    bySeverity?: DistItem[];
    byCategory?: DistItem[];
    sourceScopeNote?: string;
  };
  contentInsights?: Array<{
    title?: string;
    recommendation?: string;
    rationale?: string;
    priority?: string;
  }>;
  profiles?: ShareProfile[];
  exposureFindings?: ShareFinding[];
  discrepancyFindings?: ShareFinding[];
};

const TABS: { id: ShareTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "profiles", label: "Profiles" },
  { id: "exposure", label: "Public Exposure" },
  { id: "discrepancies", label: "Discrepancies" },
];

function asReport(value: unknown): ShareReport {
  if (!value || typeof value !== "object") return {};
  return value as ShareReport;
}

function asMonthly(value: unknown): MonthlyRegistrations | null {
  if (!value || typeof value !== "object") return null;
  return value as MonthlyRegistrations;
}

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","),
    ),
  ];
  const blob = new Blob([`\uFEFF${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportProfiles(profiles: ShareProfile[]) {
  downloadCsv(
    `re-quest-audit-profiles-${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "Name",
      "Type",
      "Agency",
      "Cities",
      "Years in business",
      "Years in area",
      "Contracts",
      "Verified",
      "Complete",
      "Email exposed",
      "Phone exposed",
      "Document references",
      "Findings",
      "Exposure findings",
      "Highest severity",
    ],
    profiles.map((row) => [
      row.displayName ?? "",
      row.agentType ?? "",
      row.agencyName ?? "",
      (row.cities ?? []).join("; "),
      String(row.yearsInBusiness ?? ""),
      String(row.yearsInArea ?? ""),
      String(row.contractsCompleted ?? ""),
      row.isVerified ? "Yes" : "No",
      row.isProfileComplete ? "Yes" : "No",
      row.hasEmail ? "Yes" : "No",
      row.hasPhone ? "Yes" : "No",
      String(row.documentReferenceCount ?? 0),
      String(row.findingCount ?? 0),
      String(row.exposureFindingCount ?? 0),
      row.highestSeverity ?? "",
    ]),
  );
}

function exportFindings(kind: "exposure" | "discrepancies", findings: ShareFinding[]) {
  downloadCsv(
    `re-quest-audit-${kind}-${new Date().toISOString().slice(0, 10)}.csv`,
    [
      "Severity",
      "Category",
      "Rule",
      "Title",
      "Profile",
      "Type",
      "Field",
      "Status",
      "Description",
      "Recommendation",
    ],
    findings.map((row) => [
      row.severity,
      row.category,
      row.ruleCode,
      row.title,
      row.profileName ?? "",
      row.profileType ?? "",
      row.fieldPath ?? "",
      row.status,
      row.description,
      row.recommendation ?? "",
    ]),
  );
}

export function DataAuditShareReportView({ token }: { token: string }) {
  const [tab, setTab] = useState<ShareTab>("overview");
  const [profileSearch, setProfileSearch] = useState("");
  const { data, loading, error } = useQuery(DataAuditSharePublicDocument, {
    variables: { token },
  });

  const share = data?.dataAuditSharePublic;
  const report = asReport(share?.report);
  const profiles = report.profiles ?? [];
  const exposureFindings = report.exposureFindings ?? [];
  const discrepancyFindings = report.discrepancyFindings ?? [];

  const filteredProfiles = useMemo(() => {
    const q = profileSearch.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter((profile) =>
      [profile.displayName, profile.agencyName, profile.agentType, profile.slug]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [profiles, profileSearch]);

  if (loading && !data) {
    return (
      <div className="py-20">
        <PageLoading rows={4} />
      </div>
    );
  }

  if (error || !share) {
    return (
      <Container className="py-20">
        <div className="mx-auto max-w-lg space-y-4 text-center">
          <p className="font-display text-3xl text-primary">Link unavailable</p>
          <p className="text-muted">
            {error
              ? getGraphQLErrorMessage(error)
              : "This shared report could not be found."}
          </p>
          <Link href="/" className={buttonClassName({ variant: "outline" })}>
            Go to RE-Quest Academy
          </Link>
        </div>
      </Container>
    );
  }

  const metrics = report.headlineMetrics ?? {};
  const dist = report.distributions ?? {};
  const insights = report.contentInsights ?? [];
  const hasLegacySnapshot = profiles.length === 0 && exposureFindings.length === 0;

  const metricCards = [
    { label: "Public profiles", value: metrics.totalProfiles },
    { label: "Agents", value: metrics.agents },
    { label: "Lenders", value: metrics.lenders },
    { label: "Available", value: metrics.available },
    { label: "Verified", value: metrics.verified },
    { label: "Email exposed (flag)", value: metrics.emailExposedFlags },
    { label: "Phone exposed (flag)", value: metrics.phoneExposedFlags },
    { label: "Exposure findings", value: metrics.exposureFindings },
  ];

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgb(196,217,212,0.55),transparent_55%),radial-gradient(ellipse_at_bottom_left,rgb(240,245,252),transparent_50%)]"
          aria-hidden
        />
        <Container className="relative z-10 space-y-6 py-12 sm:py-16">
          <p className="text-xs font-medium tracking-[0.22em] text-accent uppercase">
            RE-Quest Academy · Stakeholder briefing
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-medium tracking-tight text-primary sm:text-5xl">
            {share.title}
          </h1>
          {share.recipientName ? (
            <p className="font-body text-xl text-muted">
              Prepared for{" "}
              <span className="font-medium text-primary">{share.recipientName}</span>
            </p>
          ) : null}
          {share.personalMessage ? (
            <p className="max-w-2xl font-body text-lg leading-relaxed text-muted">
              {share.personalMessage}
            </p>
          ) : (
            <p className="max-w-2xl font-body text-lg leading-relaxed text-muted">
              Executive read-only snapshot of public RE-Quest professional data
              quality — profiles, exposure review, and content opportunities.
            </p>
          )}
          <div className="flex flex-wrap gap-3 pt-2 text-xs text-muted">
            {report.auditCompletedAt ? (
              <span>
                Audit completed{" "}
                {new Date(report.auditCompletedAt).toLocaleString()}
              </span>
            ) : null}
            {share.expiresAt ? (
              <span>
                · Link expires {new Date(share.expiresAt).toLocaleDateString()}
              </span>
            ) : null}
          </div>
        </Container>
      </section>

      <Container className="space-y-6 py-8 sm:py-10">
        {hasLegacySnapshot ? (
          <Alert tone="warning" title="Older share link">
            This link was created before Profiles and Public Exposure were
            included. Ask your RE-Quest contact to create a fresh share link.
          </Alert>
        ) : null}

        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm",
                tab === item.id
                  ? "bg-secondary font-medium text-primary"
                  : "text-muted hover:bg-sea-foam hover:text-primary",
              )}
            >
              {item.label}
              {item.id === "profiles" ? ` (${profiles.length})` : null}
              {item.id === "exposure" ? ` (${exposureFindings.length})` : null}
              {item.id === "discrepancies"
                ? ` (${discrepancyFindings.length})`
                : null}
            </button>
          ))}
        </div>

        {tab === "overview" ? (
          <div className="space-y-10">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className="border border-border bg-surface p-4"
                >
                  <p className="text-3xl font-medium tabular-nums text-primary">
                    {card.value ?? "—"}
                  </p>
                  <p className="text-xs text-muted">{card.label}</p>
                </div>
              ))}
            </div>

            {report.findingsSummary?.sourceScopeNote ? (
              <p className="max-w-3xl text-sm text-muted">
                {report.findingsSummary.sourceScopeNote}
              </p>
            ) : null}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <NewRegistrationsMonthlyCard
                className="col-span-1 md:col-span-2 xl:col-span-4"
                data={asMonthly(dist.newRegistrationsByMonth)}
              />
              <section className="col-span-1 space-y-2 md:col-span-2 xl:col-span-4">
                <div>
                  <h2 className="font-display text-2xl text-primary">
                    Demographic density
                  </h2>
                  <p className="text-sm text-muted">
                    Where public professionals concentrate — avatar pins on the
                    map for a quick geographic read.
                  </p>
                </div>
                <DemographicMapCard
                  className="w-full"
                  data={(dist.geoMap as GeoMapData) ?? null}
                />
              </section>
              <AvailabilityStatusCard
                className="col-span-1 md:col-span-2"
                items={(dist.availability as DistItem[]) ?? []}
              />
              <AgentTypeDonutCard
                className="col-span-1"
                items={(dist.agentTypes as DistItem[]) ?? []}
              />
              <CompletenessKpiCard
                className="col-span-1"
                items={(dist.completeness as DistItem[]) ?? []}
              />
              <SpecializationsPieCard
                className="col-span-1 md:col-span-2"
                items={(dist.specializations as DistItem[]) ?? []}
              />
              <TopCitiesBarCard
                className="col-span-1 md:col-span-2"
                items={(dist.cities as DistItem[]) ?? []}
              />
              <SimpleBarCard
                className="col-span-1"
                title="Findings by severity"
                items={
                  report.findingsSummary?.bySeverity ??
                  ((dist.findingsBySeverity as DistItem[]) ?? [])
                }
              />
              <SimpleBarCard
                className="col-span-1"
                title="Findings by category"
                items={report.findingsSummary?.byCategory ?? []}
              />
              <SimpleBarCard
                className="col-span-1"
                title="Experience"
                items={(dist.experience as DistItem[]) ?? []}
              />
              <SimpleBarCard
                className="col-span-1"
                title="Contracts completed"
                items={(dist.contracts as DistItem[]) ?? []}
              />
            </div>

            <section className="space-y-4">
              <h2 className="font-display text-2xl text-primary">
                Academy content opportunities
              </h2>
              {insights.length === 0 ? (
                <p className="text-sm text-muted">
                  No content insights were captured in this snapshot.
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {insights.map((insight, index) => (
                    <article
                      key={`${insight.title ?? "insight"}-${index}`}
                      className="border border-border bg-surface p-4"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <h3 className="font-medium text-primary">
                          {insight.title ?? "Insight"}
                        </h3>
                        {insight.priority ? (
                          <span className="text-xs uppercase tracking-wide text-accent">
                            {insight.priority}
                          </span>
                        ) : null}
                      </div>
                      {insight.recommendation ? (
                        <p className="text-sm text-primary">
                          {insight.recommendation}
                        </p>
                      ) : null}
                      {insight.rationale ? (
                        <p className="mt-2 text-sm text-muted">
                          {insight.rationale}
                        </p>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : null}

        {tab === "profiles" ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm"
                placeholder="Search name, agency, type…"
                value={profileSearch}
                onChange={(event) => setProfileSearch(event.target.value)}
              />
              <Button
                variant="outline"
                className="shrink-0"
                disabled={!filteredProfiles.length}
                onClick={() => exportProfiles(filteredProfiles)}
              >
                <FileSpreadsheet className="size-4" aria-hidden />
                Export CSV
              </Button>
            </div>
            <p className="text-sm text-muted">
              {filteredProfiles.length} of {profiles.length} profiles · email/phone
              shown as Yes/No flags only
            </p>
            <div className="overflow-x-auto border border-border">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-secondary text-xs text-muted">
                  <tr>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Type</th>
                    <th className="px-3 py-2">Agency</th>
                    <th className="px-3 py-2">Years</th>
                    <th className="px-3 py-2">Contracts</th>
                    <th className="px-3 py-2">Verified</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Phone</th>
                    <th className="px-3 py-2">Findings</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile, index) => (
                    <tr
                      key={`${profile.slug ?? profile.displayName ?? "p"}-${index}`}
                      className="border-t border-border"
                    >
                      <td className="px-3 py-2 font-medium text-primary">
                        {profile.displayName ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-muted">
                        {profile.agentType ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-muted">
                        {profile.agencyName ?? "—"}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {profile.yearsInBusiness ?? "—"}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {profile.contractsCompleted ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        {profile.isVerified ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-2">
                        {profile.hasEmail ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-2">
                        {profile.hasPhone ? "Yes" : "No"}
                      </td>
                      <td className="px-3 py-2">
                        {profile.findingCount}
                        {profile.highestSeverity
                          ? ` · ${profile.highestSeverity}`
                          : ""}
                      </td>
                    </tr>
                  ))}
                  {!filteredProfiles.length ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-3 py-8 text-center text-muted"
                      >
                        No profiles in this shared snapshot.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {tab === "exposure" || tab === "discrepancies" ? (
          <FindingsSharePanel
            kind={tab}
            findings={
              tab === "exposure" ? exposureFindings : discrepancyFindings
            }
            onExport={() =>
              exportFindings(
                tab === "exposure" ? "exposure" : "discrepancies",
                tab === "exposure" ? exposureFindings : discrepancyFindings,
              )
            }
          />
        ) : null}

        {report.findingsSummary?.note ? (
          <p className="text-xs text-muted">{report.findingsSummary.note}</p>
        ) : null}

        <section className="relative overflow-hidden border border-border bg-surface">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgb(196,217,212,0.35),transparent_50%)]"
            aria-hidden
          />
          <div className="relative z-10 grid gap-6 p-6 sm:grid-cols-[1.2fr_0.8fr] sm:items-center sm:p-10">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
                You&apos;re invited
              </p>
              <h2 className="font-display text-3xl text-primary">
                See the Academy side of this work
              </h2>
              <p className="max-w-xl font-body text-muted">
                This briefing lives inside RE-Quest Academy. Create an account
                when you&apos;re ready — no pressure, just a clear door in if you
                want to explore programs and the full workspace.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <a
                href={share.inviteUrl}
                className={buttonClassName({ variant: "highlight", size: "xl" })}
              >
                {share.inviteCtaLabel}
              </a>
              <Link
                href="/"
                className={buttonClassName({ variant: "outline", size: "lg" })}
              >
                Preview the public Academy
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}

function FindingsSharePanel({
  kind,
  findings,
  onExport,
}: {
  kind: "exposure" | "discrepancies";
  findings: ShareFinding[];
  onExport: () => void;
}) {
  return (
    <div className="space-y-4">
      {kind === "exposure" ? (
        <Alert tone="warning" title="Public exposure review">
          These findings flag data returned by the public API that may deserve
          attention. A finding does not automatically confirm an exploitable
          vulnerability. Contact values are withheld from this shared report.
        </Alert>
      ) : (
        <Alert tone="info" title="Data quality discrepancies">
          Conflicts, missing fields, duplicates, and related quality signals from
          the latest public listing audit.
        </Alert>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{findings.length} findings</p>
        <Button
          variant="outline"
          disabled={!findings.length}
          onClick={onExport}
        >
          <FileSpreadsheet className="size-4" aria-hidden />
          Export CSV
        </Button>
      </div>

      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-secondary text-xs text-muted">
            <tr>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Profile</th>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding, index) => (
              <tr
                key={`${finding.ruleCode}-${finding.profileName}-${index}`}
                className="border-t border-border align-top"
              >
                <td className="px-3 py-2">
                  <StatusBadge status={finding.severity} />
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium text-primary">
                    {finding.profileName ?? "—"}
                  </p>
                  <p className="text-xs text-muted">
                    {finding.profileType ?? ""}
                  </p>
                </td>
                <td className="px-3 py-2 font-mono text-xs text-muted">
                  {finding.ruleCode}
                </td>
                <td className="px-3 py-2">
                  <p className="text-primary">{finding.title}</p>
                  <p className="mt-1 max-w-md text-xs text-muted">
                    {finding.description}
                  </p>
                </td>
                <td className="px-3 py-2 text-muted">
                  {finding.recommendation ?? "—"}
                </td>
              </tr>
            ))}
            {!findings.length ? (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-muted">
                  No {kind === "exposure" ? "exposure" : "discrepancy"} findings
                  in this shared snapshot.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
