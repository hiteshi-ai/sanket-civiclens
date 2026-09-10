import type { IncidentDetail, ReportDetail } from "../types";

interface ReportResultProps {
  report: ReportDetail;
  incident: IncidentDetail | null;
  incidentNumber?: string | null;
}

function valueOrUnavailable(value: string | number | null | undefined) {
  return value === null || value === undefined || value === "" ? "Data unavailable" : String(value);
}

export function ReportResult({ report, incident, incidentNumber }: ReportResultProps) {
  const ai = report.ai_prediction;
  return (
    <section className="success-panel">
      <div className="success-heading">
        <span className="success-check">✓</span>
        <div>
          <p className="eyebrow">Submission received</p>
          <h2>Your report is in the civic record</h2>
        </div>
      </div>
      <div className="result-grid">
        <div><span>Report ID</span><strong className="mono">{report.id}</strong></div>
        <div><span>Incident</span><strong>{valueOrUnavailable(incidentNumber ?? incident?.incident_number)}</strong></div>
        <div><span>Citizen-selected category</span><strong>{report.category.replaceAll("_", " ")}</strong></div>
        <div><span>AI prediction</span><strong>{ai ? ai.predicted_category.replaceAll("_", " ") : "AI prediction unavailable"}</strong></div>
        <div><span>AI confidence</span><strong>{ai?.confidence != null ? `${(ai.confidence * 100).toFixed(0)}%` : "Data unavailable"}</strong></div>
        <div><span>Civic confidence</span><strong>{valueOrUnavailable(incident?.confidence_score)}</strong></div>
        <div><span>Civic risk</span><strong>{valueOrUnavailable(incident?.risk_score)}</strong></div>
        <div><span>Priority</span><strong>{valueOrUnavailable(incident?.priority_score)}</strong></div>
      </div>
      <p className="provenance-note">AI prediction is shown separately from the category you selected. Scores are returned by the backend decision-support engine.</p>
    </section>
  );
}