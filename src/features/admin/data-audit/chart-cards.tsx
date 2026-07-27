"use client";

import { useMemo, useState, type ReactNode } from "react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils/cn";

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

const AGENT_COLORS: Record<string, string> = {
  agent: "#0F766E",
  lender: "#6366F1",
};

const PIE_PALETTE = [
  "#0F766E",
  "#6366F1",
  "#CA8A04",
  "#EA580C",
  "#2563EB",
  "#64748B",
  "#0D9488",
  "#7C3AED",
  "#D97706",
  "#DC2626",
];

const SEVERITY_FALLBACK: Record<string, string> = {
  CRITICAL: "#B91C1C",
  HIGH: "#EA580C",
  MEDIUM: "#CA8A04",
  LOW: "#2563EB",
  INFO: "#64748B",
};

function humanizeLabel(value: unknown): string {
  if (value == null) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  const acronyms: Record<string, string> = {
    sfr: "SFR",
    va: "VA",
    fha: "FHA",
    usda: "USDA",
  };
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();
      if (acronyms[lower]) return acronyms[lower];
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(" ");
}

function CardShell({
  title,
  caption,
  className,
  children,
}: {
  title: string;
  caption?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        "rounded-xl bg-surface p-4 shadow-card ring-1 ring-border/70",
        className,
      )}
    >
      <h2 className="font-display text-lg text-primary">{title}</h2>
      {caption ? <p className="mt-1 text-xs text-muted">{caption}</p> : null}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function EmptyState({ message = "No data yet." }: { message?: string }) {
  return <p className="text-sm text-muted">{message}</p>;
}

/** Active / inactive from public `isAvailable` flag. */
export function AvailabilityStatusCard({
  items,
  className,
}: {
  items: DistItem[];
  className?: string;
}) {
  const map = new Map(
    items.map((item) => [humanizeLabel(item.label), item.count]),
  );
  const rows = [
    {
      label: "Available (active)",
      count:
        map.get("Available (Active)") ??
        map.get("Available (active)") ??
        items.find((i) => /available/i.test(i.label) && !/un/i.test(i.label))
          ?.count ??
        0,
      color: "#0F766E",
    },
    {
      label: "Unavailable (inactive)",
      count:
        map.get("Unavailable (Inactive)") ??
        map.get("Unavailable (inactive)") ??
        items.find((i) => /unavailable|inactive/i.test(i.label))?.count ??
        0,
      color: "#CA8A04",
    },
    {
      label: "Unknown",
      count:
        map.get("Unknown") ??
        items.find((i) => /^unknown$/i.test(i.label))?.count ??
        0,
      color: "#64748B",
    },
  ];
  const total = rows.reduce((sum, row) => sum + row.count, 0);

  if (!total) {
    return (
      <CardShell
        title="Availability status"
        caption="From public isAvailable — not full-database active/inactive."
        className={className}
      >
        <EmptyState message="Re-run the audit to populate availability." />
      </CardShell>
    );
  }

  return (
    <CardShell
      title="Availability status"
      caption="Closest active/inactive signal on the public listing (isAvailable)."
      className={className}
    >
      <ul className="space-y-3">
        {rows.map((row) => (
          <li key={row.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <span className="text-sm text-muted">{row.label}</span>
              <span className="text-xl font-medium tabular-nums text-primary">
                {row.count}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-sm bg-secondary">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${(row.count / total) * 100}%`,
                  backgroundColor: row.color,
                }}
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted">
        Total listed: {total}. Full RE-Quest DB totals are not available via
        this endpoint.
      </p>
    </CardShell>
  );
}

/** Compact donut for ≤3 categories (e.g. Agent / Lender). */
export function AgentTypeDonutCard({
  items,
  className,
}: {
  items: DistItem[];
  className?: string;
}) {
  const data = items
    .map((item) => ({
      label: humanizeLabel(item.label),
      count: item.count,
      color:
        AGENT_COLORS[String(item.label).toLowerCase()] ??
        (String(item.label).toLowerCase().includes("lend")
          ? AGENT_COLORS.lender
          : AGENT_COLORS.agent),
    }))
    .filter((item) => item.count > 0);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  if (!data.length || total === 0) {
    return (
      <CardShell title="Agent type distribution" className={className}>
        <EmptyState />
      </CardShell>
    );
  }

  const radius = 36;
  const stroke = 14;
  const circumference = 2 * Math.PI * radius;
  const slices: Array<{
    label: string;
    count: number;
    color: string;
    length: number;
    offset: number;
  }> = [];
  {
    let offset = 0;
    for (const slice of data) {
      const length = (slice.count / total) * circumference;
      slices.push({ ...slice, length, offset });
      offset += length;
    }
  }

  return (
    <CardShell title="Agent type distribution" className={className}>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="size-28 shrink-0" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="var(--color-secondary, #e5e7eb)"
            strokeWidth={stroke}
          />
          {slices.map((slice) => (
            <circle
              key={slice.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={stroke}
              strokeDasharray={`${slice.length} ${circumference - slice.length}`}
              strokeDashoffset={-slice.offset}
              transform="rotate(-90 50 50)"
            />
          ))}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-primary text-[12px] font-medium"
          >
            {total}
          </text>
        </svg>
        <ul className="min-w-0 flex-1 space-y-2 text-sm">
          {data.map((slice) => (
            <li
              key={slice.label}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2 text-muted">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: slice.color }}
                />
                {slice.label}
              </span>
              <span className="tabular-nums text-primary">
                {slice.count}
                <span className="ml-1 text-xs text-muted">
                  ({Math.round((slice.count / total) * 100)}%)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  );
}

/** KPI stack — no fake progress when one bucket dominates. */
export function CompletenessKpiCard({
  items,
  className,
}: {
  items: DistItem[];
  className?: string;
}) {
  const order = ["Incomplete", "Complete", "Unknown"];
  const map = new Map(
    items.map((item) => [humanizeLabel(item.label), item.count]),
  );
  const rows = order.map((label) => ({
    label,
    count: map.get(label) ?? 0,
  }));
  const nonZero = rows.filter((row) => row.count > 0);
  const primary = nonZero[0];

  if (!items.length) {
    return (
      <CardShell title="Profile completeness" className={className}>
        <EmptyState />
      </CardShell>
    );
  }

  return (
    <CardShell title="Profile completeness" className={className}>
      {nonZero.length === 1 && primary ? (
        <div>
          <p className="text-4xl font-medium tabular-nums text-primary">
            {primary.count}
          </p>
          <p className="text-sm text-muted">{primary.label}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2 last:border-0"
            >
              <span className="text-sm text-muted">{row.label}</span>
              <span className="text-2xl font-medium tabular-nums text-primary">
                {row.count}
              </span>
            </li>
          ))}
        </ul>
      )}
      {nonZero.length > 1 ? (
        <div className="mt-3 flex h-2 overflow-hidden rounded-sm bg-secondary">
          {rows.map((row) => {
            const total = rows.reduce((s, r) => s + r.count, 0) || 1;
            const width = (row.count / total) * 100;
            if (!width) return null;
            const color =
              row.label === "Complete"
                ? "#0F766E"
                : row.label === "Incomplete"
                  ? "#CA8A04"
                  : "#64748B";
            return (
              <div
                key={row.label}
                style={{ width: `${width}%`, backgroundColor: color }}
                title={`${row.label}: ${row.count}`}
              />
            );
          })}
        </div>
      ) : null}
    </CardShell>
  );
}

/** Categorical pie / donut for specializations. */
export function SpecializationsPieCard({
  items,
  className,
}: {
  items: DistItem[];
  className?: string;
}) {
  const data = items.slice(0, 10).map((item, index) => ({
    label: humanizeLabel(item.label),
    count: item.count,
    color: PIE_PALETTE[index % PIE_PALETTE.length],
  }));
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const [hover, setHover] = useState<string | null>(null);

  const arcs = useMemo(() => {
    if (!total) return [];
    let angle = -Math.PI / 2;
    const cx = 50;
    const cy = 50;
    const r = 38;
    const inner = 22;
    return data.map((slice) => {
      const sweep = (slice.count / total) * Math.PI * 2;
      const start = angle;
      const end = angle + sweep;
      angle = end;
      const large = sweep > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const ix1 = cx + inner * Math.cos(end);
      const iy1 = cy + inner * Math.sin(end);
      const ix2 = cx + inner * Math.cos(start);
      const iy2 = cy + inner * Math.sin(start);
      const d = [
        `M ${x1} ${y1}`,
        `A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`,
        `L ${ix1} ${iy1}`,
        `A ${inner} ${inner} 0 ${large} 0 ${ix2} ${iy2}`,
        "Z",
      ].join(" ");
      return { ...slice, d, pct: Math.round((slice.count / total) * 100) };
    });
  }, [data, total]);

  if (!data.length || !total) {
    return (
      <CardShell title="Top client specializations" className={className}>
        <EmptyState />
      </CardShell>
    );
  }

  const active = arcs.find((a) => a.label === hover) ?? null;

  return (
    <CardShell title="Top client specializations" className={className}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <svg viewBox="0 0 100 100" className="mx-auto size-44 shrink-0">
          {arcs.map((arc) => (
            <path
              key={arc.label}
              d={arc.d}
              fill={arc.color}
              opacity={hover && hover !== arc.label ? 0.45 : 1}
              className="cursor-pointer transition-opacity"
              onMouseEnter={() => setHover(arc.label)}
              onMouseLeave={() => setHover(null)}
            >
              <title>
                {arc.label}: {arc.count} ({arc.pct}%)
              </title>
            </path>
          ))}
          <text
            x="50"
            y="48"
            textAnchor="middle"
            className="fill-primary text-[9px] font-medium"
          >
            {active ? active.count : total}
          </text>
          <text
            x="50"
            y="58"
            textAnchor="middle"
            className="fill-muted text-[5px]"
          >
            {active ? active.label.slice(0, 14) : "profiles"}
          </text>
        </svg>
        <ul className="grid max-h-48 flex-1 grid-cols-1 gap-1.5 overflow-y-auto text-xs sm:grid-cols-2">
          {arcs.map((arc) => (
            <li
              key={arc.label}
              className="flex items-center justify-between gap-2"
              onMouseEnter={() => setHover(arc.label)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="flex min-w-0 items-center gap-1.5 text-muted">
                <span
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: arc.color }}
                />
                <span className="truncate">{arc.label}</span>
              </span>
              <span className="tabular-nums text-primary">{arc.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </CardShell>
  );
}

/** Vertical bar chart — intended to span 2 columns. */
export type MonthlyRegistrations = {
  availableYears: number[];
  defaultYear: number;
  byYear: Record<string, Array<{ month: number; label: string; count: number }>>;
  missingCreatedAt?: number;
};

const FALLBACK_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Vertical Jan–Dec bars for new RE-Quest professionals (source createdAt). */
export function NewRegistrationsMonthlyCard({
  data,
  className,
}: {
  data: MonthlyRegistrations | null;
  className?: string;
}) {
  const years = data?.availableYears?.length
    ? data.availableYears
    : [data?.defaultYear ?? new Date().getFullYear()];
  const [yearOverride, setYearOverride] = useState<number | null>(null);
  const year =
    yearOverride != null && years.includes(yearOverride)
      ? yearOverride
      : data?.defaultYear && years.includes(data.defaultYear)
        ? data.defaultYear
        : years[0];

  const months =
    data?.byYear?.[String(year)] ??
    FALLBACK_MONTHS.map((label, index) => ({
      month: index + 1,
      label,
      count: 0,
    }));
  const total = months.reduce((sum, m) => sum + m.count, 0);
  const max = Math.max(...months.map((m) => m.count), 1);

  const chartH = 220;
  const padL = 12;
  const padR = 12;
  const padB = 36;
  const padT = 20;
  const width = 560;
  const plotH = chartH - padB - padT;
  const slot = (width - padL - padR) / 12;
  const barW = Math.min(28, slot * 0.65);

  return (
    <CardShell
      title="New professionals by month"
      caption="Count of RE-Quest profiles created each month (source createdAt). Re-run the audit to refresh."
      className={className}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          <span className="text-2xl font-medium tabular-nums text-primary">
            {total}
          </span>{" "}
          new in {year}
          {data?.missingCreatedAt ? (
            <span className="ml-2 text-xs">
              · {data.missingCreatedAt} without created date
            </span>
          ) : null}
        </p>
        <label className="flex items-center gap-2 text-xs text-muted">
          Year
          <select
            className="rounded-md border border-border bg-surface px-2 py-1 text-sm text-primary"
            value={year}
            onChange={(e) => setYearOverride(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!data || (!total && !data.availableYears?.length) ? (
        <EmptyState message="No creation dates yet. Run a new audit to populate Jan–Dec registrations." />
      ) : (
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${chartH}`}
            className="min-h-[240px] w-full"
            role="img"
            aria-label={`New professionals by month for ${year}`}
          >
            {months.map((item, index) => {
              const h = (item.count / max) * plotH;
              const x = padL + index * slot + (slot - barW) / 2;
              const y = padT + plotH - h;
              return (
                <g key={item.label}>
                  <rect
                    x={x}
                    y={item.count ? y : padT + plotH - 2}
                    width={barW}
                    height={item.count ? Math.max(h, 2) : 2}
                    fill="#0F766E"
                    fillOpacity={item.count ? 0.85 : 0.2}
                    rx={2}
                  >
                    <title>
                      {item.label} {year}: {item.count}
                    </title>
                  </rect>
                  {item.count > 0 ? (
                    <text
                      x={x + barW / 2}
                      y={y - 4}
                      textAnchor="middle"
                      className="fill-primary text-[10px] tabular-nums"
                    >
                      {item.count}
                    </text>
                  ) : null}
                  <text
                    x={x + barW / 2}
                    y={chartH - 10}
                    textAnchor="middle"
                    className="fill-muted text-[11px]"
                  >
                    {item.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </CardShell>
  );
}

export function TopCitiesBarCard({
  items,
  className,
}: {
  items: DistItem[];
  className?: string;
}) {
  const data = items.slice(0, 10).map((item) => ({
    label: humanizeLabel(item.label),
    count: item.count,
  }));
  const max = Math.max(...data.map((d) => d.count), 1);

  if (!data.length) {
    return (
      <CardShell title="Top cities" className={className}>
        <EmptyState />
      </CardShell>
    );
  }

  const chartH = 280;
  const padL = 8;
  const padR = 8;
  const padB = 72;
  const padT = 16;
  const width = Math.max(360, data.length * 56);
  const plotH = chartH - padB - padT;
  const slot = (width - padL - padR) / data.length;
  const barW = Math.min(36, slot * 0.62);

  return (
    <CardShell
      title="Top cities"
      caption="Ranked by profile mentions in the public listing."
      className={className}
    >
      <div className="overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${chartH}`}
          className="min-h-[280px] w-full"
          role="img"
          aria-label="Top cities vertical bar chart"
        >
          {data.map((item, index) => {
            const h = (item.count / max) * plotH;
            const x = padL + index * slot + (slot - barW) / 2;
            const y = padT + plotH - h;
            const opacity =
              0.4 + (0.6 * (data.length - index)) / data.length;
            const labelY = chartH - 8;
            return (
              <g key={item.label}>
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 2)}
                  rx={3}
                  fill="#0F766E"
                  opacity={opacity}
                >
                  <title>
                    {item.label}: {item.count}
                  </title>
                </rect>
                <text
                  x={x + barW / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-primary text-[10px] font-medium"
                >
                  {item.count}
                </text>
                <text
                  x={x + barW / 2}
                  y={labelY}
                  textAnchor="end"
                  transform={`rotate(-40 ${x + barW / 2} ${labelY})`}
                  className="fill-muted text-[9px]"
                >
                  {item.label.length > 16
                    ? `${item.label.slice(0, 14)}…`
                    : item.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </CardShell>
  );
}

export function FindingsSeverityCard({
  items,
  fallback,
  note,
  className,
}: {
  items: SeverityDetail[];
  fallback: DistItem[];
  note: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState<string | null>(null);

  const rows: SeverityDetail[] =
    items.length > 0
      ? items
      : fallback.map((item) => ({
          severity: item.label,
          label: humanizeLabel(item.label),
          color: SEVERITY_FALLBACK[item.label.toUpperCase()],
          count: item.count,
          percentage: 0,
          meaning:
            "Severity buckets group rule findings from discrepancy and public-exposure checks.",
          examples: "",
          topRules: [],
        }));

  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <CardShell
      title="Findings by severity"
      caption={
        note ??
        "Counts are individual rule findings from the latest audit — not unique profiles."
      }
      className={className}
    >
      {!rows.length ? (
        <EmptyState message="No findings yet." />
      ) : (
        <ul className="space-y-3">
          {rows.map((row) => {
            const color =
              row.color ||
              SEVERITY_FALLBACK[row.severity.toUpperCase()] ||
              "#64748B";
            const expanded = open === row.severity;
            return (
              <li key={row.severity} className="space-y-1.5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-2 text-left"
                  onClick={() =>
                    setOpen(expanded ? null : row.severity)
                  }
                >
                  <span className="flex items-center gap-2">
                    <StatusBadge status={row.severity} />
                    <span className="text-sm text-primary">{row.label}</span>
                  </span>
                  <span className="text-sm tabular-nums text-primary">
                    {row.count}
                    {row.percentage ? ` · ${row.percentage}%` : ""}
                  </span>
                </button>
                <div className="h-2.5 rounded-sm bg-secondary">
                  <div
                    className="h-2.5 rounded-sm"
                    style={{
                      width: `${(row.count / max) * 100}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                {expanded ? (
                  <div className="rounded-sm border border-border/70 bg-secondary/30 p-2 text-xs text-muted">
                    <p>{row.meaning}</p>
                    {row.examples ? (
                      <p className="mt-1">Typical rules: {row.examples}</p>
                    ) : null}
                    {row.topRules?.length ? (
                      <ul className="mt-2 space-y-1">
                        {row.topRules.map((rule) => (
                          <li key={rule.code}>
                            <span className="font-mono text-primary">
                              {rule.code}
                            </span>
                            {" · "}
                            {rule.title} ({rule.count})
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </CardShell>
  );
}

/** Simple horizontal bars for remaining distributions (experience, contracts, etc.). */
export function SimpleBarCard({
  title,
  items,
  className,
  emptyHint,
}: {
  title: string;
  items: DistItem[];
  className?: string;
  emptyHint?: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <CardShell title={title} className={className}>
      {!items.length ? (
        <EmptyState message={emptyHint ?? "No data yet."} />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs text-muted">
                <span>{humanizeLabel(item.label)}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 bg-secondary">
                <div
                  className="h-2"
                  style={{
                    width: `${(item.count / max) * 100}%`,
                    backgroundColor: "#0F766E",
                    opacity: 0.85,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardShell>
  );
}
