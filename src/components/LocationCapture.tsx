import type { Location } from "../types";

interface LocationCaptureProps {
  location: Location | null;
  loading: boolean;
  error: string | null;
  onCapture: () => void;
}

export function LocationCapture({
  location,
  loading,
  error,
  onCapture,
}: LocationCaptureProps) {
  return (
    <section className="location-card" aria-live="polite">
      <div className="section-heading-row">
        <div>
          <span className="field-label">Report location <span className="required">*</span></span>
          <p className="helper-text">Use your device GPS to locate the report.</p>
        </div>
        <button type="button" className="secondary-button" onClick={onCapture} disabled={loading}>
          {loading ? "Locating…" : location ? "Refresh GPS" : "Get my location"}
        </button>
      </div>
      {location ? (
        <div className="location-values">
          <div><span>Latitude</span><strong>{location.latitude.toFixed(6)}</strong></div>
          <div><span>Longitude</span><strong>{location.longitude.toFixed(6)}</strong></div>
          <div><span>Accuracy</span><strong>{location.accuracy != null ? `±${location.accuracy.toFixed(1)} m` : "Data unavailable"}</strong></div>
        </div>
      ) : (
        <div className="location-empty">
          <span className="location-pin" aria-hidden="true">⌖</span>
          <span>{error ?? "Location unavailable — please enable location or retry."}</span>
        </div>
      )}
      {error && location && <p className="inline-error">{error}</p>}
    </section>
  );
}