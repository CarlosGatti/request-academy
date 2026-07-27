"use client";

import { useEffect, useRef } from "react";
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

export function DemographicMapInner({ pins }: { pins: GeoMapPin[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const layer = L.layerGroup().addTo(map);

    if (!pins.length) {
      map.setView([39.0, -105.5], 7);
      return () => {
        map.removeLayer(layer);
      };
    }

    const markers: L.Marker[] = [];
    for (const pin of pins) {
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
      markers.push(marker);
    }

    const bounds = L.latLngBounds(pins.map((pin) => [pin.lat, pin.lng]));
    map.fitBounds(bounds.pad(0.2));

    return () => {
      map.removeLayer(layer);
    };
  }, [pins]);

  if (!pins.length) {
    return (
      <p className="p-4 text-sm text-muted">
        No mappable locations yet. Re-run the audit after the latest geo
        normalizer to place pins from city data.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[420px] w-full overflow-hidden rounded-sm [&_.audit-geo-pin]:border-0 [&_.audit-geo-pin]:bg-transparent"
    />
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
