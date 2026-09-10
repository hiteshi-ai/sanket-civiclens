import type { AIPrediction, IncidentDetail, ReportDetail, ScoreExplanation } from "../types";
import { EmptyState } from "./EmptyState";

interface IncidentDetailPanelProps {
  incident: IncidentDetail | null;
  explanation: ScoreExplanation | null;
  report: ReportDetail | null;
  loading: boolean;
  error: string | null;
}

const display = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === "" ? "Data unavailable" : String(value);

export function IncidentDetailPanel({
  incident,
  explanation,
  report,
  loading,
  error,
}: IncidentDetailPanelProps) {
  if (loading) return <div className="detail-panel"><div className="loading-block">Loading incident record…</div></div>;
  if (error) return <div className="detail-panel"><div className="error-banner">{error}</div></div>;
  if (!incident) {
    return <div className="detail-panel"><EmptyState compact title="Select an incident to inspect its evidence." /></div>;
  }

  const ai: AIPrediction | null | undefined = report?.ai_prediction;
  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div>
          <p className="eyebrow">Incident detail</p>
          <h2>{incident.incident_number}</h2>
        </div>
        <span className={`status status-${incident.status.toLowerCase()}`}>{incident.status.replaceAll("_", " ")}</span>
      </div>
      <div className="detail-category">{incident.category.replaceAll("_", " ")}</div>
      <div className="detail-location">
        <span>Location</span>
        <strong>{incident.latitude.toFixed(6)}, {incident.longitude.toFixed(6)}</strong>
        <small>{incident.sector_name || "Sector unavailable"}</small>
      </div>
      <div className="score-grid">
        <div><span>Confidence</span><strong>{incident.confidence_score}</strong></div>
        <div><span>Risk</span><strong>{incident.risk_score}</strong></div>
        <div><span>Priority</span><strong>{incident.priority_score}</strong></div>
      </div>
      <div className="detail-section">
        <h3>Evidence</h3>
        <dl className="fact-list">
          <div><dt>Associated reports</dt><dd>{incident.reports_count}</dd></div>
          <div><dt>Recurrence</dt><dd>{display(incident.recurrence_status)}</dd></div>
          <div><dt>Primary source</dt><dd>{report?.source_type === "CITIZEN" ? "Citizen report" : "Data unavailable"}</dd></div>
          <div><dt>AI prediction</dt><dd>{ai ? ai.predicted_category.replaceAll("_", " ") : "AI prediction unavailable"}</dd></div>
        </dl>
      </div>
      <div className="detail-section score-explanation">
        <h3>Why this score?</h3>
        {explanation ? (
          <>
            <div className="formula-line"><span>{explanation.formula_version}</span><strong>{explanation.score_value}</strong></div>
            <p>{explanation.label}</p>
            <pre>{JSON.stringify(explanation.evidence_breakdown, null, 2)}</pre>
          </>
        ) : (
          <p>Data unavailable</p>
        )}
      </div>
    </aside>
  );
}