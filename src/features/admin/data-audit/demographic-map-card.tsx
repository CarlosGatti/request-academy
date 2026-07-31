"use client";

import dynamic from "next/dynamic";
import type { GeoMapPin } from "@/features/admin/data-audit/demographic-map-inner";
import { cn } from "@/lib/utils/cn";

const DemographicMapInner = dynamic(
  () =>
    import("@/features/admin/data-audit/demographic-map-inner").then(
      (mod) => mod.DemographicMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center border border-border bg-secondary/40 text-sm text-muted">
        Loading map…
      </div>
    ),
  },
);

export type GeoMapData = {
  pins: GeoMapPin[];
  totalProfiles?: number;
  pinnedProfiles?: number;
  withApiCoords?: number;
  withCityLookup?: number;
  unresolvedCount?: number;
  topCities?: Array<{ city: string; count: number }>;
  note?: string;
};

function normalizeGeoMapData(data: GeoMapData | null | undefined): GeoMapData | null {
  if (!data || typeof data !== "object") return null;
  const pins = Array.isArray(data.pins) ? data.pins : [];
  return {
    ...data,
    pins,
  };
}

export function DemographicMapCard({
  data,
  className,
}: {
  data: GeoMapData | null;
  className?: string;
}) {
  const normalized = normalizeGeoMapData(data);
  const pins = normalized?.pins ?? [];
  const pinned = normalized?.pinnedProfiles ?? pins.length;
  const total = normalized?.totalProfiles ?? pins.length;

  return (
    <section className={cn("border border-border bg-surface p-4", className)}>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="font-medium text-primary">Demographic map</h3>
          <p className="mt-1 max-w-2xl text-xs text-muted">
            {normalized?.note ??
              "Professionals placed by public coordinates or approximate city centers."}
          </p>
        </div>
        <p className="text-sm tabular-nums text-muted">
          <span className="text-lg font-medium text-primary">{pinned}</span>
          {" / "}
          {total} pinned
          {normalized?.withApiCoords
            ? ` · ${normalized.withApiCoords} exact`
            : null}
          {normalized?.withCityLookup
            ? ` · ${normalized.withCityLookup} city approx.`
            : null}
        </p>
      </div>

      <DemographicMapInner pins={pins} />

      {normalized?.topCities?.length ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {normalized.topCities.map((row) => (
            <li
              key={row.city}
              className="rounded-sm bg-secondary px-2 py-1 text-xs text-primary"
            >
              {row.city}{" "}
              <span className="tabular-nums text-muted">({row.count})</span>
            </li>
          ))}
        </ul>
      ) : null}

      {normalized?.unresolvedCount ? (
        <p className="mt-2 text-xs text-muted">
          {normalized.unresolvedCount} profile
          {normalized.unresolvedCount === 1 ? "" : "s"} could not be placed
          (missing city / unknown location).
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#0F766E]" /> Agent
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#6366F1]" /> Lender
        </span>
        <span>Avatar when available · initials fallback</span>
      </div>
    </section>
  );
}
