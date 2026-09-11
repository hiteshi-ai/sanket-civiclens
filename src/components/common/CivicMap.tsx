import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Incident } from '../../types/civic';
import { useCivic } from '../../context/CivicContext';

interface CivicMapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onSelectIncident?: (id: string) => void;
  height?: string;
  className?: string;
  showFilters?: boolean;
}

export const CivicMap: React.FC<CivicMapProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  height = '480px',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const { selectIncident, setIsDetailOpen } = useCivic();

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize map centered on Chandigarh
      const map = L.map(mapContainerRef.current, {
        center: [30.736, 76.782],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        dragging: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        touchZoom: true,
        boxZoom: true,
        keyboard: true
      });

      // A focused incident opens with its popup visible. As soon as an operator
      // explores the area, remove that popup so it cannot pull the map back.
      map.on('dragstart', () => map.closePopup());
      map.getContainer().style.touchAction = 'none';

      // CartoDB Voyager tiles for warm, calm civic palette
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix: '© OpenStreetMap contributors, CartoDB'
        })
        .addTo(map);

      // Custom Zoom control
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;

    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // Render incident markers
    incidents.forEach((inc) => {
      const isSelected = inc.id === selectedIncidentId;
      const isCritical = inc.riskScore >= 80;
      const isHigh = inc.riskScore >= 70 && inc.riskScore < 80;
      const isMedium = inc.riskScore >= 50 && inc.riskScore < 70;

      let color = '#565C68';
      let border = '#191B1F';

      if (isCritical || isHigh) {
        color = '#C54E38'; // Terracotta
        border = '#902C18';
      } else if (isMedium) {
        color = '#C88427'; // Amber
        border = '#93580F';
      } else {
        color = '#2C5E48'; // Sage
        border = '#1E4333';
      }

      // Create custom SVG Icon
      const iconHtml = `
        <div class="relative group cursor-pointer" style="transform: translate(-50%, -50%);">
          ${
            inc.isRecurring
              ? `<div class="absolute -inset-1.5 rounded-full border border-dashed border-[#C88427] opacity-80 animate-spin-slow"></div>`
              : ''
          }
          ${
            isCritical
              ? `<div class="absolute -inset-2 rounded-full bg-[#C54E38] opacity-25 marker-pulse"></div>`
              : ''
          }
          <div style="
            background-color: ${color};
            border: ${isSelected ? '2.5px solid #191B1F' : '1.5px solid #FFFFFF'};
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.25);
            transition: all 0.2s ease;
          ">
            <span style="color: white; font-family: monospace; font-weight: 800; font-size: 11px;">
              ${inc.riskScore}
            </span>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-civic-marker',
        iconSize: [28, 28]
      });

      const marker = L.marker([inc.latitude, inc.longitude], { icon: customIcon }).addTo(map);

      // Compact popup
      const popupHtml = `
        <div style="padding: 12px 14px; min-width: 210px; font-family: -apple-system, sans-serif; text-align: left;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <span style="font-size: 10px; font-weight: 700; color: ${color}; text-transform: uppercase; letter-spacing: 0.5px;">
              ${inc.category.replace('_', ' ')}
            </span>
            ${
              inc.isRecurring
                ? `<span style="font-size: 9px; background: #FDF6EC; color: #C88427; border: 1px solid #F9E8CE; padding: 1px 4px; border-radius: 3px; font-weight: 700;">RECURRING</span>`
                : ''
            }
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #191B1F; margin-bottom: 4px; line-height: 1.3;">
            ${inc.sector}
          </div>
          <div style="font-size: 11px; color: #565C68; margin-bottom: 8px;">
            ${inc.location}
          </div>
          <div style="display: flex; gap: 8px; font-size: 11px; margin-bottom: 10px; font-family: monospace; background: #F4F3EF; padding: 4px 6px; border-radius: 6px;">
            <div>Risk: <b>${inc.riskScore}</b></div>
            <div>•</div>
            <div>Conf: <b>${inc.confidenceScore}%</b></div>
            <div>•</div>
            <div>${inc.waitingDays}d</div>
          </div>
          <button
            id="view-btn-${inc.id}"
            style="
              width: 100%;
              background: #191B1F;
              color: white;
              font-size: 11px;
              font-weight: 700;
              padding: 6px 10px;
              border-radius: 6px;
              border: none;
              cursor: pointer;
            "
          >
            Investigate Incident →
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { autoPan: true, autoPanPadding: [28, 56], keepInView: false });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-btn-${inc.id}`);
        if (btn) {
          btn.onclick = () => {
            selectIncident(inc.id, true);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectIncident) {
          onSelectIncident(inc.id);
        } else {
          selectIncident(inc.id, false);
        }
      });

      markersRef.current[inc.id] = marker;
    });

    // If an incident is selected, fly to it
    if (selectedIncidentId && markersRef.current[selectedIncidentId]) {
      const selected = incidents.find((i) => i.id === selectedIncidentId);
      if (selected) {
        map.flyTo([selected.latitude, selected.longitude], Math.max(map.getZoom(), 14), { animate: true, duration: 0.45 });
        markersRef.current[selectedIncidentId].openPopup();
      }
    }
  }, [incidents, selectedIncidentId]);

  // Leaflet measures its canvas at creation time. Keep that canvas aligned with
  // any grid, drawer, sidebar, or viewport change without reloading tiles.
  useEffect(() => {
    const element = mapContainerRef.current;
    const map = mapInstanceRef.current;
    if (!element || !map) return;
    const observer = new ResizeObserver(() => map.invalidateSize({ animate: false }));
    observer.observe(element);
    requestAnimationFrame(() => map.invalidateSize({ animate: false }));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`relative w-full min-w-0 min-h-0 rounded-xl overflow-hidden border border-[#E5E3DC] shadow-xs ${className}`}
      style={{ height }}
    >
      {/* Map Element */}
      <div ref={mapContainerRef} className="absolute inset-0" style={{ width: '100%' }} />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-lg border border-[#E5E3DC] shadow-md text-left text-xs flex flex-wrap items-center gap-3">
        <span className="font-bold text-[10px] text-[#7E8592] uppercase tracking-wider">
          Signal Legend:
        </span>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C54E38]"></span>
          <span>Critical / High Risk (&ge;70)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C88427]"></span>
          <span>Medium Risk (50-69)</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#C88427]"></span>
          <span>Recurring Hotspot</span>
        </div>
      </div>
    </div>
  );
};
