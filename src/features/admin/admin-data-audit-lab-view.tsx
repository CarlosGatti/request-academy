"use client";

import { useMutation, useQuery } from "@apollo/client/react";
import { FileSpreadsheet } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AgentTypeDonutCard,
  AvailabilityStatusCard,
  CompletenessKpiCard,
  FindingsSeverityCard,
  NewRegistrationsMonthlyCard,
  SimpleBarCard,
  SpecializationsPieCard,
  TopCitiesBarCard,
  type DistItem,
  type MonthlyRegistrations,
  type SeverityDetail,
} from "@/features/admin/data-audit/chart-cards";
import { DataAuditSharePanel } from "@/features/admin/data-audit/data-audit-share-panel";
import { DemographicMapCard, type GeoMapData } from "@/features/admin/data-audit/demographic-map-card";
import {
  initialsFromName,
  resolveAuditAvatarSrc,
} from "@/features/admin/data-audit/resolve-avatar";
import {
  DataAuditFindingsDocument,
  DataAuditOverviewDocument,
  DataAuditProfileDocument,
  DataAuditProfilesDocument,
  DataAuditRunsDocument,
  DataAuditSchemaFieldsDocument,
  StartDataAuditRunDocument,
  UpdateDataAuditFindingStatusDocument,
  UpdateDataAuditSchemaFieldDocument,
} from "@/graphql/generated/graphql";
import { getGraphQLErrorMessage } from "@/lib/graphql/errors";
import { cn } from "@/lib/utils/cn";

type TabId =
  | "overview"
  | "profiles"
  | "schema"
  | "discrepancies"
  | "exposure"
  | "runs";

const tabs: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "profiles", label: "Profiles" },
  { id: "schema", label: "Schema" },
  { id: "discrepancies", label: "Discrepancies" },
  { id: "exposure", label: "Public Exposure" },
  { id: "runs", label: "Audit Runs" },
];

type MetricMap = Record<string, number>;
type Insight = {
  title: string;
  observation: string;
  affectedCount: number;
  percentage: number;
  fieldsUsed: string[];
  recommendation: string;
  confidence: string;
};

const ACRONYMS: Record<string, string> = {
  sfr: "SFR",
  va: "VA",
  fha: "FHA",
  usda: "USDA",
};

function humanizeLabel(value: unknown): string {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (ACRONYMS[lower]) return ACRONYMS[lower];
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function asMetrics(value: unknown): MetricMap {
  if (!value || typeof value !== "object") return {};
  return value as MetricMap;
}

function asDistributions(value: unknown): Record<string, DistItem[]> {
  if (!value || typeof value !== "object") return {};
  const dist = (value as { distributions?: Record<string, DistItem[]> })
    .distributions;
  return dist ?? {};
}

function asSeverityDetails(value: unknown): {
  details: SeverityDetail[];
  note: string | null;
} {
  if (!value || typeof value !== "object") return { details: [], note: null };
  const dist = (value as {
    distributions?: {
      findingsBySeverityDetail?: SeverityDetail[];
      findingsCountingNote?: string;
    };
  }).distributions;
  return {
    details: dist?.findingsBySeverityDetail ?? [],
    note: dist?.findingsCountingNote ?? null,
  };
}

function asMonthlyRegistrations(value: unknown): MonthlyRegistrations | null {
  if (!value || typeof value !== "object") return null;
  const raw = (
    value as {
      distributions?: { newRegistrationsByMonth?: MonthlyRegistrations };
    }
  ).distributions?.newRegistrationsByMonth;
  if (!raw || typeof raw !== "object") return null;
  return {
    availableYears: Array.isArray(raw.availableYears)
      ? raw.availableYears.map(Number).filter((n) => !Number.isNaN(n))
      : [],
    defaultYear: Number(raw.defaultYear) || new Date().getFullYear(),
    byYear: raw.byYear ?? {},
    missingCreatedAt:
      typeof raw.missingCreatedAt === "number" ? raw.missingCreatedAt : 0,
  };
}

function asGeoMap(value: unknown): GeoMapData | null {
  if (!value || typeof value !== "object") return null;
  const raw = (
    value as {
      distributions?: { geoMap?: GeoMapData };
    }
  ).distributions?.geoMap;
  if (!raw || typeof raw !== "object") return null;
  return {
    pins: Array.isArray(raw.pins) ? raw.pins : [],
    totalProfiles: raw.totalProfiles,
    pinnedProfiles: raw.pinnedProfiles,
    withApiCoords: raw.withApiCoords,
    withCityLookup: raw.withCityLookup,
    unresolvedCount: raw.unresolvedCount,
    topCities: raw.topCities,
    note: raw.note,
  };
}

function asInsights(value: unknown): Insight[] {
  return Array.isArray(value) ? (value as Insight[]) : [];
}

function formatDate(value?: string | null | unknown) {
  if (value == null) return "—";
  return new Date(String(value)).toLocaleString();
}

function triState(value: "" | "true" | "false"): boolean | undefined {
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function HeaderTip({
  label,
  tip,
}: {
  label: string;
  tip: string;
}) {
  return (
    <th className="px-3 py-2" title={tip}>
      <span className="inline-flex items-center gap-1 border-b border-dotted border-muted/60">
        {label}
      </span>
    </th>
  );
}

function AvatarCell({
  name,
  avatarUrl,
  avatarPath,
  size = "sm",
}: {
  name?: string | null;
  avatarUrl?: string | null;
  avatarPath?: string | null;
  size?: "sm" | "lg";
}) {
  const { src, pendingCdn } = resolveAuditAvatarSrc({ avatarUrl, avatarPath });
  const initials = initialsFromName(name);
  const sizeClass = size === "lg" ? "size-16 text-base" : "size-8 text-xs";
  return (
    <div
      className={cn("flex items-center gap-2", size === "lg" && "gap-3")}
      title={
        pendingCdn
          ? "Avatar on file — CDN base not configured (NEXT_PUBLIC_REQUEST_MEDIA_BASE_URL)"
          : undefined
      }
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className={cn(sizeClass, "rounded-full object-cover")}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-secondary font-medium text-primary",
            sizeClass,
            pendingCdn && "ring-1 ring-highlight/50",
          )}
        >
          {initials}
        </span>
      )}
      {size === "sm" ? <span>{name ?? "—"}</span> : null}
    </div>
  );
}

function exportProfilesCsv(
  rows: Array<{
    displayName?: string | null;
    agentType?: string | null;
    agencyName?: string | null;
    yearsInBusiness?: number | null;
    yearsInArea?: number | null;
    contractsCompleted?: number | null;
    isVerified?: boolean | null;
    hasEmail: boolean;
    hasPhone: boolean;
    documentReferenceCount: number;
    findingCount: number;
    highestSeverity?: string | null;
  }>,
) {
  const headers = [
    "Name",
    "Type",
    "Agency",
    "Years in business",
    "Years in area",
    "Contracts",
    "Verified",
    "Email exposed",
    "Phone exposed",
    "Document references",
    "Findings",
    "Highest severity",
  ];
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.displayName,
        row.agentType,
        row.agencyName,
        row.yearsInBusiness,
        row.yearsInArea,
        row.contractsCompleted,
        row.isVerified ? "Yes" : "No",
        row.hasEmail ? "Yes" : "No",
        row.hasPhone ? "Yes" : "No",
        row.documentReferenceCount,
        row.findingCount,
        row.highestSeverity,
      ]
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    ),
  ];
  const blob = new Blob([`\uFEFF${lines.join("\n")}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `data-audit-profiles-${new Date().toISOString().slice(0, 10)}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AdminDataAuditLabView() {
  const [tab, setTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [filterPhone, setFilterPhone] = useState<"" | "true" | "false">("");
  const [filterEmail, setFilterEmail] = useState<"" | "true" | "false">("");
  const [filterDocs, setFilterDocs] = useState<"" | "true" | "false">("");
  const [filterVerified, setFilterVerified] = useState<"" | "true" | "false">(
    "",
  );
  const [filterComplete, setFilterComplete] = useState<"" | "true" | "false">(
    "",
  );
  const [profileSkip, setProfileSkip] = useState(0);
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null,
  );
  const [findingStatusFilter, setFindingStatusFilter] = useState("OPEN");

  const overviewQuery = useQuery(DataAuditOverviewDocument, {
    pollInterval: 0,
  });
  const runsQuery = useQuery(DataAuditRunsDocument, {
    variables: { take: 30 },
    skip: tab !== "runs" && tab !== "overview",
  });
  const profilesQuery = useQuery(DataAuditProfilesDocument, {
    variables: {
      filter: {
        search: search || undefined,
        hasPhone: triState(filterPhone),
        hasEmail: triState(filterEmail),
        hasDocumentReferences: triState(filterDocs),
        isVerified: triState(filterVerified),
        isProfileComplete: triState(filterComplete),
        skip: profileSkip,
        take: 25,
      },
    },
    skip: tab !== "profiles",
  });
  const schemaQuery = useQuery(DataAuditSchemaFieldsDocument, {
    skip: tab !== "schema",
  });
  const findingsQuery = useQuery(DataAuditFindingsDocument, {
    variables: {
      filter: {
        status: findingStatusFilter || undefined,
        exposureOnly: false,
        take: 50,
      },
    },
    skip: tab !== "discrepancies",
  });
  const exposureQuery = useQuery(DataAuditFindingsDocument, {
    variables: {
      filter: {
        exposureOnly: true,
        take: 100,
      },
    },
    skip: tab !== "exposure",
  });
  const profileDetailQuery = useQuery(DataAuditProfileDocument, {
    variables: {
      id: selectedProfileId ?? 0,
      includeRaw: true,
    },
    skip: selectedProfileId == null,
  });

  const [startRun, startState] = useMutation(StartDataAuditRunDocument, {
    onCompleted: () => {
      void overviewQuery.refetch();
      void runsQuery.refetch();
    },
  });
  const [updateFinding] = useMutation(UpdateDataAuditFindingStatusDocument, {
    onCompleted: () => {
      void findingsQuery.refetch();
      void exposureQuery.refetch();
    },
  });
  const [updateSchemaField] = useMutation(UpdateDataAuditSchemaFieldDocument, {
    onCompleted: () => {
      void schemaQuery.refetch();
    },
  });

  const currentStatus = overviewQuery.data?.dataAuditOverview?.currentStatus;
  const isRunning =
    currentStatus === "PENDING" || currentStatus === "RUNNING";

  useEffect(() => {
    if (!isRunning) return;
    const id = window.setInterval(() => {
      void overviewQuery.refetch();
    }, 4000);
    return () => window.clearInterval(id);
  }, [isRunning, overviewQuery]);

  const metrics = asMetrics(
    overviewQuery.data?.dataAuditOverview?.overviewMetrics,
  );
  const distributions = asDistributions(
    overviewQuery.data?.dataAuditOverview?.overviewMetrics,
  );
  const severityMeta = asSeverityDetails(
    overviewQuery.data?.dataAuditOverview?.overviewMetrics,
  );
  const monthlyRegistrations = asMonthlyRegistrations(
    overviewQuery.data?.dataAuditOverview?.overviewMetrics,
  );
  const geoMap = asGeoMap(
    overviewQuery.data?.dataAuditOverview?.overviewMetrics,
  );
  const insights = asInsights(
    overviewQuery.data?.dataAuditOverview?.contentInsights,
  );

  const metricCards = useMemo(
    () => [
      { label: "Total (public listing)", value: metrics.totalProfiles },
      { label: "Available (active)", value: metrics.available },
      { label: "Unavailable (inactive)", value: metrics.unavailable },
      { label: "Agents", value: metrics.agents },
      { label: "Lenders", value: metrics.lenders },
      { label: "Verified", value: metrics.verified },
      { label: "Public", value: metrics.publicProfiles },
      { label: "Private (in listing)", value: metrics.privateProfiles },
      { label: "Featured", value: metrics.featured },
      { label: "Incomplete", value: metrics.incomplete },
      { label: "With avatar", value: metrics.profilesWithAvatar },
      { label: "Missing avatar", value: metrics.profilesMissingAvatar },
      { label: "Email exposed", value: metrics.emailExposed },
      { label: "Phone exposed", value: metrics.phoneExposed },
      { label: "Open findings", value: metrics.openFindings },
      { label: "High / critical", value: metrics.highOrCritical },
    ],
    [metrics],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Audit Lab"
        description="Internal workspace for public API analysis, data quality review, exposure auditing, and Academy content insights."
        actions={
          <Button
            disabled={isRunning || startState.loading}
            onClick={() => void startRun()}
          >
            {isRunning || startState.loading ? "Audit running…" : "Run New Audit"}
          </Button>
        }
      />

      <Alert tone="info" title="Public listing only — not the full RE-Quest database">
        This lab reads the public <code>/agents</code> endpoint. Right now that
        listing returns the same ~29 public professionals on every run, so
        totals will not jump after a re-audit unless RE-Quest adds/removes
        public profiles. Private, inactive-only, or admin accounts are not
        exposed here — we cannot count the full database from this API alone.
        <code>isAvailable</code> is the closest active/inactive signal on listed
        profiles.
      </Alert>

      <div className="flex flex-wrap gap-4 text-sm text-muted">
        <p>
          Last successful audit:{" "}
          <span className="text-primary">
            {formatDate(
              overviewQuery.data?.dataAuditOverview?.lastSuccessfulAuditAt,
            )}
          </span>
        </p>
        <p>
          Current status:{" "}
          {currentStatus ? (
            <StatusBadge status={currentStatus} />
          ) : (
            <span className="text-primary">None</span>
          )}
        </p>
      </div>

      {startState.error ? (
        <Alert tone="danger" title="Unable to start audit">
          {getGraphQLErrorMessage(startState.error)}
        </Alert>
      ) : null}
      {overviewQuery.error ? (
        <Alert tone="danger" title="Unable to load overview">
          {getGraphQLErrorMessage(overviewQuery.error)}
        </Alert>
      ) : null}

      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {tabs.map((item) => (
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
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        overviewQuery.loading && !overviewQuery.data ? (
          <PageLoading rows={3} />
        ) : (
          <div className="space-y-8">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className="border border-border bg-surface p-4"
                >
                  <p className="text-2xl font-medium text-primary">
                    {card.value ?? "—"}
                  </p>
                  <p className="text-xs text-muted">{card.label}</p>
                </div>
              ))}
            </div>

            <DataAuditSharePanel />

            <DemographicMapCard
              className="w-full"
              data={geoMap}
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <NewRegistrationsMonthlyCard
                className="col-span-1 md:col-span-2 xl:col-span-4"
                data={monthlyRegistrations}
              />
              <AvailabilityStatusCard
                className="col-span-1 md:col-span-2"
                items={distributions.availability ?? []}
              />
              <SimpleBarCard
                className="col-span-1"
                title="Verification status"
                items={distributions.verificationStatus ?? []}
              />
              <SimpleBarCard
                className="col-span-1"
                title="Subscription status"
                items={distributions.subscriptionStatus ?? []}
              />
              <AgentTypeDonutCard
                className="col-span-1"
                items={distributions.agentTypes ?? []}
              />
              <CompletenessKpiCard
                className="col-span-1"
                items={distributions.completeness ?? []}
              />
              <SpecializationsPieCard
                className="col-span-1 md:col-span-2"
                items={distributions.specializations ?? []}
              />
              <TopCitiesBarCard
                className="col-span-1 md:col-span-2 xl:col-span-2"
                items={distributions.cities ?? []}
              />
              <FindingsSeverityCard
                className="col-span-1 md:col-span-2"
                items={severityMeta.details}
                fallback={distributions.findingsBySeverity ?? []}
                note={severityMeta.note}
              />
              <SimpleBarCard
                className="col-span-1"
                title="Experience distribution"
                items={distributions.experience ?? []}
                emptyHint="Years may be blank until you re-run the audit with the latest normalizer."
              />
              <SimpleBarCard
                className="col-span-1"
                title="Contracts completed"
                items={distributions.contracts ?? []}
              />
              <SimpleBarCard
                className="col-span-1 md:col-span-2"
                title="Top property types"
                items={distributions.propertyTypes ?? []}
              />
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-primary">
                Academy Content Insights
              </h2>
              {insights.length === 0 ? (
                <p className="text-sm text-muted">
                  Run an audit to generate deterministic content recommendations.
                </p>
              ) : (
                <div className="space-y-3">
                  {insights.map((insight) => (
                    <article
                      key={insight.title}
                      className="border border-border bg-surface p-4"
                    >
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-primary">
                          {insight.title}
                        </h3>
                        <StatusBadge status={insight.confidence} />
                        <span className="text-xs text-muted">
                          {insight.affectedCount} ({insight.percentage}%)
                        </span>
                      </div>
                      <p className="text-sm text-muted">{insight.observation}</p>
                      <p className="mt-2 text-sm text-primary">
                        {insight.recommendation}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        Fields: {insight.fieldsUsed?.join(", ")}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        )
      ) : null}

      {tab === "profiles" ? (
        <div className="space-y-4">
          <div className="space-y-3 border border-border bg-surface p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                className="h-10 min-w-0 flex-1 rounded-md border border-border bg-surface px-3 text-sm"
                placeholder="Search name, slug, agency"
                value={search}
                onChange={(event) => {
                  setProfileSkip(0);
                  setSearch(event.target.value);
                }}
              />
              <Button
                variant="outline"
                className="shrink-0"
                disabled={!profilesQuery.data?.dataAuditProfiles.items.length}
                onClick={() =>
                  exportProfilesCsv(
                    profilesQuery.data?.dataAuditProfiles.items ?? [],
                  )
                }
              >
                <FileSpreadsheet className="size-4" aria-hidden />
                Export CSV
              </Button>
            </div>

            <div className="flex flex-wrap items-end gap-2">
              {(
                [
                  {
                    id: "phone",
                    label: "Phone",
                    value: filterPhone,
                    set: setFilterPhone,
                    options: [
                      { value: "", label: "Any" },
                      { value: "true", label: "Has phone" },
                      { value: "false", label: "No phone" },
                    ],
                  },
                  {
                    id: "email",
                    label: "Email",
                    value: filterEmail,
                    set: setFilterEmail,
                    options: [
                      { value: "", label: "Any" },
                      { value: "true", label: "Has email" },
                      { value: "false", label: "No email" },
                    ],
                  },
                  {
                    id: "docs",
                    label: "Docs",
                    value: filterDocs,
                    set: setFilterDocs,
                    options: [
                      { value: "", label: "Any" },
                      { value: "true", label: "Has refs" },
                      { value: "false", label: "No refs" },
                    ],
                  },
                  {
                    id: "verified",
                    label: "Verified",
                    value: filterVerified,
                    set: setFilterVerified,
                    options: [
                      { value: "", label: "Any" },
                      { value: "true", label: "Verified" },
                      { value: "false", label: "Not verified" },
                    ],
                  },
                  {
                    id: "complete",
                    label: "Complete",
                    value: filterComplete,
                    set: setFilterComplete,
                    options: [
                      { value: "", label: "Any" },
                      { value: "true", label: "Complete" },
                      { value: "false", label: "Incomplete" },
                    ],
                  },
                ] as const
              ).map((filter) => (
                <label
                  key={filter.id}
                  className="flex min-w-[7.5rem] flex-col gap-1"
                >
                  <span className="text-[11px] font-medium uppercase tracking-wide text-muted">
                    {filter.label}
                  </span>
                  <Select
                    aria-label={`${filter.label} filter`}
                    className="h-9 w-auto min-w-[7.5rem]"
                    value={filter.value}
                    onChange={(event) => {
                      setProfileSkip(0);
                      filter.set(
                        event.target.value as "" | "true" | "false",
                      );
                    }}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value || "any"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </label>
              ))}

              {(filterPhone ||
                filterEmail ||
                filterDocs ||
                filterVerified ||
                filterComplete ||
                search) && (
                <button
                  type="button"
                  className="mb-0.5 h-9 px-2 text-sm text-muted underline-offset-2 hover:text-primary hover:underline"
                  onClick={() => {
                    setProfileSkip(0);
                    setSearch("");
                    setFilterPhone("");
                    setFilterEmail("");
                    setFilterDocs("");
                    setFilterVerified("");
                    setFilterComplete("");
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
          {profilesQuery.loading && !profilesQuery.data ? (
            <PageLoading />
          ) : profilesQuery.error ? (
            <Alert tone="danger" title="Unable to load profiles">
              {getGraphQLErrorMessage(profilesQuery.error)}
            </Alert>
          ) : (
            <>
              <div className="overflow-x-auto border border-border">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-secondary text-xs text-muted">
                    <tr>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Agency</th>
                      <HeaderTip
                        label="Years"
                        tip="Years in business from the public profile. Blank means the field was missing or could not be parsed from the public API response."
                      />
                      <th className="px-3 py-2">Contracts</th>
                      <th className="px-3 py-2">Verified</th>
                      <th className="px-3 py-2">Email</th>
                      <th className="px-3 py-2">Phone</th>
                      <HeaderTip
                        label="Docs"
                        tip="Count of document references returned in the public API response (for example license or certificate URLs). This tool does not open or download those files."
                      />
                      <HeaderTip
                        label="Findings"
                        tip="Number of discrepancy/exposure rule matches for this profile in the latest audit, plus the highest severity among them."
                      />
                    </tr>
                  </thead>
                  <tbody>
                    {profilesQuery.data?.dataAuditProfiles.items.map((row) => (
                      <tr
                        key={row.id}
                        className="cursor-pointer border-t border-border hover:bg-sea-foam/40"
                        onClick={() => setSelectedProfileId(row.id)}
                      >
                        <td className="px-3 py-2 text-primary">
                          <AvatarCell
                            name={row.displayName}
                            avatarUrl={row.avatarUrl}
                            avatarPath={row.avatarPath}
                          />
                        </td>
                        <td className="px-3 py-2">
                          {humanizeLabel(row.agentType) || "—"}
                        </td>
                        <td className="px-3 py-2">{row.agencyName ?? "—"}</td>
                        <td className="px-3 py-2">
                          {row.yearsInBusiness ?? row.yearsInArea ?? "—"}
                        </td>
                        <td className="px-3 py-2">
                          {row.contractsCompleted ?? "—"}
                        </td>
                        <td className="px-3 py-2">
                          {row.isVerified ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-2">
                          {row.hasEmail ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-2">
                          {row.hasPhone ? "Yes" : "No"}
                        </td>
                        <td className="px-3 py-2">
                          {row.documentReferenceCount}
                        </td>
                        <td className="px-3 py-2">
                          {row.findingCount}
                          {row.highestSeverity
                            ? ` · ${humanizeLabel(row.highestSeverity)}`
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between text-sm">
                <p className="text-muted">
                  {profilesQuery.data?.dataAuditProfiles.total ?? 0} profiles
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    disabled={profileSkip === 0}
                    onClick={() => setProfileSkip(Math.max(0, profileSkip - 25))}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    disabled={
                      profileSkip + 25 >=
                      (profilesQuery.data?.dataAuditProfiles.total ?? 0)
                    }
                    onClick={() => setProfileSkip(profileSkip + 25)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedProfileId != null ? (
            <div className="fixed inset-0 z-40 flex justify-end bg-black/30">
              <div className="h-full w-full max-w-xl overflow-y-auto bg-surface p-6 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    {profileDetailQuery.data?.dataAuditProfile ? (
                      <AvatarCell
                        name={
                          profileDetailQuery.data.dataAuditProfile.displayName
                        }
                        avatarUrl={
                          profileDetailQuery.data.dataAuditProfile.avatarUrl
                        }
                        avatarPath={
                          profileDetailQuery.data.dataAuditProfile.avatarPath
                        }
                        size="lg"
                      />
                    ) : null}
                    <div>
                      <h2 className="font-display text-2xl text-primary">
                        {profileDetailQuery.data?.dataAuditProfile
                          ?.displayName ?? "Profile"}
                      </h2>
                      <p className="text-sm text-muted">
                        Masked raw response by default
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedProfileId(null)}
                  >
                    Close
                  </Button>
                </div>
                {profileDetailQuery.loading ? (
                  <PageLoading />
                ) : profileDetailQuery.data?.dataAuditProfile ? (
                  <div className="space-y-4 text-sm">
                    <section>
                      <h3 className="mb-2 font-medium text-primary">
                        Normalized Data
                      </h3>
                      <pre className="overflow-x-auto border border-border bg-secondary/40 p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(
                          {
                            agencyName:
                              profileDetailQuery.data.dataAuditProfile
                                .agencyName,
                            agentType:
                              profileDetailQuery.data.dataAuditProfile
                                .agentType,
                            yearsInBusiness:
                              profileDetailQuery.data.dataAuditProfile
                                .yearsInBusiness,
                            yearsInArea:
                              profileDetailQuery.data.dataAuditProfile
                                .yearsInArea,
                            contractsCompleted:
                              profileDetailQuery.data.dataAuditProfile
                                .contractsCompleted,
                            states:
                              profileDetailQuery.data.dataAuditProfile.states,
                            cities:
                              profileDetailQuery.data.dataAuditProfile.cities,
                            specializations:
                              profileDetailQuery.data.dataAuditProfile
                                .clientSpecializations,
                            flags: {
                              hasEmail:
                                profileDetailQuery.data.dataAuditProfile
                                  .hasEmail,
                              hasPhone:
                                profileDetailQuery.data.dataAuditProfile
                                  .hasPhone,
                              hasVerificationNote:
                                profileDetailQuery.data.dataAuditProfile
                                  .hasVerificationNote,
                              hasDocumentReferences:
                                profileDetailQuery.data.dataAuditProfile
                                  .hasDocumentReferences,
                              hasTokenLikeFields:
                                profileDetailQuery.data.dataAuditProfile
                                  .hasTokenLikeFields,
                            },
                          },
                          null,
                          2,
                        )}
                      </pre>
                    </section>
                    <section>
                      <h3 className="mb-2 font-medium text-primary">Findings</h3>
                      <ul className="space-y-2">
                        {profileDetailQuery.data.dataAuditProfile.findings.map(
                          (finding) => (
                            <li
                              key={finding.id}
                              className="border border-border p-3"
                            >
                              <p className="font-medium text-primary">
                                {finding.ruleCode}: {finding.title}
                              </p>
                              <p className="text-muted">{finding.description}</p>
                            </li>
                          ),
                        )}
                      </ul>
                    </section>
                    <section>
                      <h3 className="mb-2 font-medium text-primary">
                        Raw Response (masked)
                      </h3>
                      <pre className="overflow-x-auto border border-border bg-secondary/40 p-3 text-xs whitespace-pre-wrap">
                        {JSON.stringify(
                          profileDetailQuery.data.dataAuditProfile.rawMasked,
                          null,
                          2,
                        )}
                      </pre>
                    </section>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === "schema" ? (
        schemaQuery.loading && !schemaQuery.data ? (
          <PageLoading />
        ) : schemaQuery.error ? (
          <Alert tone="danger" title="Unable to load schema">
            {getGraphQLErrorMessage(schemaQuery.error)}
          </Alert>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-secondary text-xs text-muted">
                <tr>
                  <th className="px-3 py-2">Field path</th>
                  <th className="px-3 py-2">Types</th>
                  <th className="px-3 py-2">Coverage</th>
                  <th className="px-3 py-2">Classification</th>
                  <th className="px-3 py-2">Expected public</th>
                  <th className="px-3 py-2">Academy useful</th>
                  <th className="px-3 py-2">Sample</th>
                </tr>
              </thead>
              <tbody>
                {schemaQuery.data?.dataAuditSchemaFields.map((field) => (
                  <tr key={field.id} className="border-t border-border">
                    <td className="px-3 py-2 font-mono text-xs">
                      {field.fieldPath}
                    </td>
                    <td className="px-3 py-2 text-xs">
                      {Array.isArray(field.detectedTypes)
                        ? field.detectedTypes.join(", ")
                        : "—"}
                    </td>
                    <td className="px-3 py-2">{field.profileCoverage}%</td>
                    <td className="px-3 py-2">
                      <Select
                        value={field.classification}
                        onChange={(event) =>
                          void updateSchemaField({
                            variables: {
                              id: field.id,
                              input: {
                                classification: event.target
                                  .value as typeof field.classification,
                              },
                            },
                          })
                        }
                      >
                        {[
                          "PUBLIC",
                          "PERSONAL",
                          "INTERNAL",
                          "SENSITIVE",
                          "SECURITY_RELEVANT",
                          "UNKNOWN",
                        ].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.expectedPublic)}
                        onChange={(event) =>
                          void updateSchemaField({
                            variables: {
                              id: field.id,
                              input: { expectedPublic: event.target.checked },
                            },
                          })
                        }
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        checked={Boolean(field.academyUseful)}
                        onChange={(event) =>
                          void updateSchemaField({
                            variables: {
                              id: field.id,
                              input: { academyUseful: event.target.checked },
                            },
                          })
                        }
                      />
                    </td>
                    <td className="max-w-xs truncate px-3 py-2 text-xs text-muted">
                      {field.sampleValueMasked ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}

      {tab === "discrepancies" || tab === "exposure" ? (
        <FindingsPanel
          exposure={tab === "exposure"}
          loading={
            tab === "exposure" ? exposureQuery.loading : findingsQuery.loading
          }
          error={tab === "exposure" ? exposureQuery.error : findingsQuery.error}
          data={
            tab === "exposure"
              ? exposureQuery.data?.dataAuditFindings
              : findingsQuery.data?.dataAuditFindings
          }
          statusFilter={findingStatusFilter}
          onStatusFilterChange={setFindingStatusFilter}
          showStatusFilter={tab === "discrepancies"}
          onUpdateStatus={(id, status) =>
            void updateFinding({
              variables: { id, input: { status } },
            })
          }
        />
      ) : null}

      {tab === "runs" ? (
        runsQuery.loading && !runsQuery.data ? (
          <PageLoading />
        ) : runsQuery.error ? (
          <Alert tone="danger" title="Unable to load audit runs">
            {getGraphQLErrorMessage(runsQuery.error)}
          </Alert>
        ) : (
          <div className="overflow-x-auto border border-border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-secondary text-xs text-muted">
                <tr>
                  <th className="px-3 py-2">Run</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Requested by</th>
                  <th className="px-3 py-2">Started</th>
                  <th className="px-3 py-2">Requests</th>
                  <th className="px-3 py-2">Profiles</th>
                  <th className="px-3 py-2">Agents</th>
                  <th className="px-3 py-2">Lenders</th>
                  <th className="px-3 py-2">New/Changed/Removed</th>
                  <th className="px-3 py-2">Findings</th>
                </tr>
              </thead>
              <tbody>
                {runsQuery.data?.dataAuditRuns.map((run) => (
                  <tr key={run.id} className="border-t border-border">
                    <td className="px-3 py-2">#{run.id}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={run.status} />
                    </td>
                    <td className="px-3 py-2">
                      <div>
                        <p className="text-primary">
                          {run.requestedByName ?? "—"}
                        </p>
                        {run.requestedByEmail ? (
                          <p className="text-xs text-muted">
                            {run.requestedByEmail}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-3 py-2">{formatDate(run.startedAt)}</td>
                    <td className="px-3 py-2">{run.requestCount}</td>
                    <td className="px-3 py-2">{run.profileCount}</td>
                    <td className="px-3 py-2">{run.agentCount}</td>
                    <td className="px-3 py-2">{run.lenderCount}</td>
                    <td className="px-3 py-2">
                      {run.newProfileCount}/{run.changedProfileCount}/
                      {run.removedProfileCount}
                    </td>
                    <td className="px-3 py-2">
                      D:{run.discrepancyCount} E:{run.exposureFindingCount} S:
                      {run.schemaFieldCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : null}
    </div>
  );
}

function FindingsPanel({
  exposure,
  loading,
  error,
  data,
  statusFilter,
  onStatusFilterChange,
  showStatusFilter,
  onUpdateStatus,
}: {
  exposure: boolean;
  loading: boolean;
  error: unknown;
  data?: {
    total: number;
    items: Array<{
      id: number;
      severity: string;
      ruleCode: string;
      title: string;
      description: string;
      fieldPath?: string | null;
      status: string;
      recommendation?: string | null;
      createdAt: string | unknown;
      profile?: { displayName?: string | null } | null;
    }>;
  };
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  showStatusFilter: boolean;
  onUpdateStatus: (
    id: number,
    status:
      | "OPEN"
      | "REVIEWED"
      | "ACCEPTED_RISK"
      | "FALSE_POSITIVE"
      | "FIXED",
  ) => void;
}) {
  if (loading && !data) return <PageLoading />;
  if (error) {
    return (
      <Alert tone="danger" title="Unable to load findings">
        {getGraphQLErrorMessage(error)}
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {exposure ? (
        <Alert tone="warning" title="Public exposure review">
          Findings indicate data returned by a public endpoint that may require
          review. A finding does not automatically confirm an exploitable
          security vulnerability.
        </Alert>
      ) : null}
      {showStatusFilter ? (
        <Select
          value={statusFilter}
          onChange={(event) => onStatusFilterChange(event.target.value)}
          aria-label="Finding status filter"
        >
          <option value="">All statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="REVIEWED">REVIEWED</option>
          <option value="ACCEPTED_RISK">ACCEPTED_RISK</option>
          <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
          <option value="FIXED">FIXED</option>
        </Select>
      ) : null}
      <p className="text-sm text-muted">{data?.total ?? 0} findings</p>
      <div className="overflow-x-auto border border-border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-secondary text-xs text-muted">
            <tr>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Rule</th>
              <th className="px-3 py-2">Profile</th>
              <th className="px-3 py-2">Field</th>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Detected</th>
            </tr>
          </thead>
          <tbody>
            {data?.items.map((item) => (
              <tr key={item.id} className="border-t border-border align-top">
                <td className="px-3 py-2">
                  <StatusBadge status={item.severity} />
                </td>
                <td className="px-3 py-2 font-mono text-xs">{item.ruleCode}</td>
                <td className="px-3 py-2">
                  {item.profile?.displayName ?? "—"}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {item.fieldPath ?? "—"}
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium text-primary">{item.title}</p>
                  <p className="text-xs text-muted">{item.description}</p>
                  {item.recommendation ? (
                    <p className="mt-1 text-xs text-primary">
                      {item.recommendation}
                    </p>
                  ) : null}
                </td>
                <td className="px-3 py-2">
                  <Select
                    value={item.status}
                    onChange={(event) =>
                      onUpdateStatus(
                        item.id,
                        event.target.value as
                          | "OPEN"
                          | "REVIEWED"
                          | "ACCEPTED_RISK"
                          | "FALSE_POSITIVE"
                          | "FIXED",
                      )
                    }
                  >
                    {[
                      "OPEN",
                      "REVIEWED",
                      "ACCEPTED_RISK",
                      "FALSE_POSITIVE",
                      "FIXED",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </Select>
                </td>
                <td className="px-3 py-2 text-xs">
                  {formatDate(item.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
