import type { Incident } from "../types";

interface PriorityQueueProps {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (incident: Incident) => void;
}

const statusLabel = (status: string) => status.replaceAll("_", " ");
const categoryLabel = (category: string) => category.replaceAll("_", " ");

export function PriorityQueue({ incidents, selectedId, onSelect }: PriorityQueueProps) {
  if (incidents.length === 0) {
    return (
      <div className="queue-empty">
        <strong>No verified incidents yet.</strong>
        <p>New reports will appear here after the backend creates an incident.</p>
      </div>
    );
  }

  return (
    <div className="incident-list">
      {incidents.map((incident) => (
        <button
          type="button"
          key={incident.id}
          className={selectedId === incident.id ? "incident-row selected" : "incident-row"}
          onClick={() => onSelect(incident)}
        >
          <span className="incident-priority">{incident.priority_score.toFixed(0)}</span>
          <span className="incident-row-main">
            <strong>{categoryLabel(incident.category)}</strong>
            <span>{incident.sector_name || "Chandigarh jurisdiction"} · {incident.incident_number}</span>
          </span>
          <span className="incident-row-meta">
            <span className={`status status-${incident.status.toLowerCase()}`}>{statusLabel(incident.status)}</span>
            <span>{incident.reports_count} {incident.reports_count === 1 ? "report" : "reports"}</span>
          </span>
        </button>
      ))}
    </div>
  );
}