import { useEffect, useRef } from "react";
import L from "leaflet";
import type { MapIncident } from "../types";
import { EmptyState } from "./EmptyState";

interface IncidentMapProps {
  incidents: MapIncident[];
  onSelect: (incidentId: string) => void;
}

export function IncidentMap({ incidents, onSelect }: IncidentMapProps) {
  const mapElement = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapElement.current || incidents.length === 0) return;

    const first = incidents[0];
    const instance = L.map(mapElement.current, { scrollWheelZoom: false }).setView(
      [first.latitude, first.longitude],
      13,
    );
    map.current = instance;
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(instance);

    incidents.forEach((incident) => {
      const marker = L.circleMarker([incident.latitude, incident.longitude], {
        radius: 9,
        color: "#0f766e",
        weight: 3,
        fillColor: "#f97316",
        fillOpacity: 0.9,
      }).addTo(instance);
      marker.bindTooltip(incident.incident_number);
      marker.on("click", () => onSelect(incident.id));
    });

    const bounds = L.latLngBounds(incidents.map((incident) => [incident.latitude, incident.longitude]));
    if (incidents.length > 1) instance.fitBounds(bounds, { padding: [32, 32] });

    return () => {
      instance.remove();
      map.current = null;
    };
  }, [incidents, onSelect]);

  if (incidents.length === 0) {
    return <EmptyState title="No civic incidents available for mapping." description="Markers appear only for incidents returned by the backend." />;
  }

  return <div ref={mapElement} className="incident-map" aria-label="Chandigarh incident map" />;
}