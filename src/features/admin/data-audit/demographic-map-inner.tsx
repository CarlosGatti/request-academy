"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  initialsFromName,
  resolveAuditAvatarSrc,
} from "@/features/admin/data-audit/resolve-avatar";
import "leaflet/dist/leaflet.css";

export type GeoMapPin = {
  id: string;
  lat: number;
  lng: number;
  city: string;
  displayName?: string | null;
  agentType?: string | null;
  avatarUrl?: string | null;
  avatarPath?: string | null;
  source?: string;
};

function pinIcon(pin: GeoMapPin) {
  const { src } = resolveAuditAvatarSrc({
    avatarUrl: pin.avatarUrl,
    avatarPath: pin.avatarPath,
  });
  const initials = initialsFromName(pin.displayName);
  const isLender = /lend/i.test(pin.agentType ?? "");
  const ring = isLender ? "#6366F1" : "#0F766E";

  const html = src
    ? `<div style="width:36px;height:36px;border-radius:9999px;overflow:hidden;border:2px solid ${ring};box-shadow:0 2px 8px rgba(0,41,61,.25);background:#fff">
        <img src="${src.replace(/"/g, "&quot;")}" alt="" style="width:100%;height:100%;object-fit:cover" />
      </div>`
    : `<div style="width:36px;height:36px;border-radius:9999px;border:2px solid ${ring};box-shadow:0 2px 8px rgba(0,41,61,.25);background:#C4D9D4;color:#00293D;display:flex;align-items:center;justify-content:center;font:600 11px/1 ui-sans-serif,system-ui">${initials}</div>`;

  return L.divIcon({
    className: "audit-geo-pin",
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
}

function normalizePins(pins: GeoMapPin[]): GeoMapPin[] {
  return pins
    .map((pin) => ({
      ...pin,
      id: String(pin.id ?? ""),
      lat: Number(pin.lat),
      lng: Number(pin.lng),
      city: String(pin.city ?? ""),
    }))
    .filter(
      (pin) =>
        Boolean(pin.id) &&
        Number.isFinite(pin.lat) &&
        Number.isFinite(pin.lng) &&
        Math.abs(pin.lat) <= 90 &&
        Math.abs(pin.lng) <= 180,
    );
}

function clearLeafletContainer(el: HTMLElement) {
  // React Strict Mode remounts can leave Leaflet's internal id on the node,
  // which makes the next L.map() throw "Map container is already initialized".
  const leafletEl = el as HTMLElement & { _leaflet_id?: number };
  if (leafletEl._leaflet_id) {
    delete leafletEl._leaflet_id;
  }
  el.innerHTML = "";
}

export function DemographicMapInner({ pins }: { pins: GeoMapPin[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  const pinSignature = pins
    .map((pin) => `${pin.id}:${pin.lat}:${pin.lng}`)
    .join("|");
  const validPins = useMemo(
    () => normalizePins(pins),
    // pinSignature captures identity/coords; pins object may be a new array each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pinSignature],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    clearLeafletContainer(el);

    const map = L.map(el, {
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      },
    ).addTo(map);

    map.setView([39.0, -105.5], 7);
    setMapReady(true);
    const invalidate = () => {
      map.invalidateSize();
    };
    requestAnimationFrame(invalidate);
    const timer = window.setTimeout(invalidate, 150);

    return () => {
      window.clearTimeout(timer);
      setMapReady(false);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      clearLeafletContainer(el);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    if (!validPins.length) {
      map.setView([39.0, -105.5], 7);
      requestAnimationFrame(() => map.invalidateSize());
      return;
    }

    const layer = L.layerGroup().addTo(map);
    layerRef.current = layer;

    for (const pin of validPins) {
      const marker = L.marker([pin.lat, pin.lng], { icon: pinIcon(pin) });
      marker.bindPopup(
        `<div style="min-width:140px">
          <strong>${escapeHtml(pin.displayName ?? "Professional")}</strong><br/>
          <span style="color:#4a6270">${escapeHtml(pin.agentType ?? "—")}</span><br/>
          <span style="color:#4a6270">${escapeHtml(pin.city)}</span>
          ${
            pin.source && pin.source !== "api"
              ? `<br/><span style="color:#4a6270;font-size:11px">Approx. city center</span>`
              : ""
          }
        </div>`,
      );
      marker.addTo(layer);
    }

    const bounds = L.latLngBounds(validPins.map((pin) => [pin.lat, pin.lng]));
    map.fitBounds(bounds.pad(0.2));
    requestAnimationFrame(() => map.invalidateSize());
    const timer = window.setTimeout(() => map.invalidateSize(), 150);

    return () => {
      window.clearTimeout(timer);
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [mapReady, validPins]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[420px] w-full overflow-hidden rounded-sm bg-secondary/30 [&_.audit-geo-pin]:border-0 [&_.audit-geo-pin]:bg-transparent"
      />
      {!validPins.length ? (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-muted">
          No mappable locations yet. Re-run the audit after the latest geo
          normalizer to place pins from city data.
        </p>
      ) : null}
    </div>
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
