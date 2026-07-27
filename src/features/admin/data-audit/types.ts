/** Typed helpers for Data Audit Lab overviewMetrics JSON (never trust raw shape). */

export type DistItem = { label: string; count: number };

export type SeverityDetail = {
  severity: string;
  label: string;
  color?: string;
  count: number;
  percentage: number;
  meaning: string;
  examples: string;
  topRules: Array<{ code: string; title: string; count: number }>;
};

export type OverviewMetrics = {
  totalProfiles: number;
  agents: number;
  lenders: number;
  profilesWithAvatar: number;
  profilesMissingAvatar: number;
  verified: number;
  incomplete: number;
  openFindings: number;
  distributions: {
    agentTypes: DistItem[];
    completeness: DistItem[];
    specializations: DistItem[];
    cities: DistItem[];
    experience: DistItem[];
    contracts: DistItem[];
    propertyTypes: DistItem[];
    findingsBySeverity: DistItem[];
    findingsBySeverityDetail: SeverityDetail[];
    findingsCountingNote: string;
    availability?: DistItem[];
    verificationStatus?: DistItem[];
    subscriptionStatus?: DistItem[];
    geoMap?: { pins?: unknown[]; bounds?: unknown };
    newRegistrationsByMonth?: unknown;
    [key: string]: unknown;
  };
};

function asDistItems(value: unknown): DistItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const label = row.label;
      const count = row.count;
      if (label == null || typeof count !== "number") return null;
      return { label: String(label), count };
    })
    .filter((item): item is DistItem => item != null);
}

function asSeverityDetails(value: unknown): SeverityDetail[] {
  if (!Array.isArray(value)) return [];
  const rows: SeverityDetail[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (typeof row.count !== "number") continue;
    rows.push({
      severity: String(row.severity ?? row.label ?? "INFO"),
      label: String(row.label ?? row.severity ?? "Info"),
      color: typeof row.color === "string" ? row.color : undefined,
      count: row.count,
      percentage: typeof row.percentage === "number" ? row.percentage : 0,
      meaning: typeof row.meaning === "string" ? row.meaning : "",
      examples: typeof row.examples === "string" ? row.examples : "",
      topRules: Array.isArray(row.topRules)
        ? (row.topRules as SeverityDetail["topRules"])
        : [],
    });
  }
  return rows;
}

export function parseOverviewMetrics(raw: unknown): OverviewMetrics | null {
  if (!raw || typeof raw !== "object") return null;
  const root = raw as Record<string, unknown>;
  const distRaw =
    root.distributions && typeof root.distributions === "object"
      ? (root.distributions as Record<string, unknown>)
      : {};

  return {
    totalProfiles: Number(root.totalProfiles ?? 0),
    agents: Number(root.agents ?? 0),
    lenders: Number(root.lenders ?? 0),
    profilesWithAvatar: Number(root.profilesWithAvatar ?? 0),
    profilesMissingAvatar: Number(root.profilesMissingAvatar ?? 0),
    verified: Number(root.verified ?? 0),
    incomplete: Number(root.incomplete ?? 0),
    openFindings: Number(root.openFindings ?? 0),
    distributions: {
      agentTypes: asDistItems(distRaw.agentTypes),
      completeness: asDistItems(distRaw.completeness),
      specializations: asDistItems(distRaw.specializations),
      cities: asDistItems(distRaw.cities),
      experience: asDistItems(distRaw.experience),
      contracts: asDistItems(distRaw.contracts),
      propertyTypes: asDistItems(distRaw.propertyTypes),
      findingsBySeverity: asDistItems(distRaw.findingsBySeverity),
      findingsBySeverityDetail: asSeverityDetails(
        distRaw.findingsBySeverityDetail,
      ),
      findingsCountingNote:
        typeof distRaw.findingsCountingNote === "string"
          ? distRaw.findingsCountingNote
          : "",
      availability: asDistItems(distRaw.availability),
      verificationStatus: asDistItems(distRaw.verificationStatus),
      subscriptionStatus: asDistItems(distRaw.subscriptionStatus),
      geoMap:
        distRaw.geoMap && typeof distRaw.geoMap === "object"
          ? (distRaw.geoMap as OverviewMetrics["distributions"]["geoMap"])
          : undefined,
      newRegistrationsByMonth: distRaw.newRegistrationsByMonth,
      ...distRaw,
    },
  };
}

export const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "#B91C1C",
  HIGH: "#EA580C",
  MEDIUM: "#CA8A04",
  LOW: "#2563EB",
  INFO: "#64748B",
};
