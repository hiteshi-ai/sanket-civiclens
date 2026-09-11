import { useEffect, useMemo, useState } from "react";
import {
  getAnalytics,
  getIncidents,
  getMapIncidents,
  getIncident,
  getScoreExplanation,
} from "../api";
import type {
  AnalyticsOverview,
  Incident,
  IncidentDetail,
  MapIncident,
  ScoreExplanation,
} from "../types";
import { IncidentMap } from "../components/IncidentMap";
import { EmptyState } from "../components/EmptyState";

export function MunicipalDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [mapIncidents, setMapIncidents] = useState<MapIncident[]>([]);
  const [selected, setSelected] = useState<IncidentDetail | null>(null);
  const [scoreExplanation, setScoreExplanation] =
    useState<ScoreExplanation | null>(null);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [analyticsData, incidentData, mapData] = await Promise.all([
        getAnalytics(),
        getIncidents({
          category: category || undefined,
          status: status || undefined,
        }),
        getMapIncidents({
          category: category || undefined,
          status: status || undefined,
        }),
      ]);

      setAnalytics(analyticsData);
      setIncidents(incidentData);
      setMapIncidents(mapData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load municipal intelligence.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [category, status]);

  const openIncident = async (incidentId: string) => {
    setDetailLoading(true);
    setScoreExplanation(null);

    try {
      const detail = await getIncident(incidentId);
      setSelected(detail);

      try {
        const explanation = await getScoreExplanation(incidentId);
        setScoreExplanation(explanation);
      } catch {
        setScoreExplanation(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load incident details.",
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const highRisk = useMemo(
    () => incidents.filter((incident) => incident.risk_score >= 70).length,
    [incidents],
  );

  const waitingTooLong = useMemo(
    () => incidents.filter((incident) => incident.waiting_days >= 7).length,
    [incidents],
  );

  return (
    <div className="command-center">
      <section className="dashboard-intro page-intro">
        <div>
          <p className="eyebrow">Municipal intelligence</p>
          <h2>Command Center</h2>
          <p>
            Evidence-backed civic intelligence for Chandigarh. Every metric
            below is loaded from the municipal API.
          </p>
        </div>

        <button
          className="secondary-button"
          onClick={() => void loadDashboard()}
        >
          ↻ Refresh intelligence
        </button>
      </section>

      {error && (
        <div className="error-banner large-error">
          <span>{error}</span>

          <button
            className="secondary-button"
            onClick={() => void loadDashboard()}
          >
            Retry
          </button>
        </div>
      )}

      <section className="metric-grid">
        <MetricCard
          label="Open incidents"
          value={analytics?.open_incidents}
          tone="teal"
          note="Live backend count"
        />

        <MetricCard
          label="High-risk incidents"
          value={loading ? undefined : highRisk}
          tone="warm"
          note="Risk score ≥ 70"
        />

        <MetricCard
          label="Waiting too long"
          value={loading ? undefined : waitingTooLong}
          tone="dark"
          note="Waiting ≥ 7 days"
        />

        <MetricCard
          label="Civic confidence"
          value={
            analytics?.average_civic_confidence != null
              ? `${Math.round(analytics.average_civic_confidence)}%`
              : undefined
          }
          tone="light"
          note={
            analytics?.average_civic_confidence != null
              ? "Evidence-backed average"
              : "Unavailable without evidence"
          }
        />
      </section>

      <section className="dashboard-grid">
        <div className="queue-card dashboard-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Live workload</p>
              <h3>Priority Queue</h3>
            </div>

            <span className="live-badge">● LIVE</span>
          </div>

          <div className="filter-row">
            <label>
              <span className="sr-only">Category</span>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option value="">All categories</option>
                <option value="POTHOLE_ROAD_DAMAGE">Road damage</option>
                <option value="GARBAGE_OVERFLOW">Garbage overflow</option>
                <option value="BROKEN_STREETLIGHT">Streetlight</option>
                <option value="DRAINAGE_WATERLOGGING">
                  Drainage / waterlogging
                </option>
                <option value="OTHER">Other</option>
              </select>
            </label>

            <label>
              <span className="sr-only">Status</span>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="">All statuses</option>
                <option value="OPEN">Open</option>
                <option value="IN_TRIAGE">In triage</option>
                <option value="ASSIGNED">Assigned</option>
                <option value="IN_PROGRESS">In progress</option>
                <option value="PENDING_VERIFICATION">
                  Pending verification
                </option>
                <option value="VERIFIED_CLOSED">Verified closed</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </label>
          </div>

          {loading ? (
            <div className="loading-block">
              Loading live incidents…
            </div>
          ) : incidents.length === 0 ? (
            <EmptyState
              title="No incidents found"
              description="No matching incidents are currently available from the backend."
            />
          ) : (
            <div className="incident-list">
              {incidents.slice(0, 10).map((incident) => (
                <button
                  key={incident.id}
                  className={
                    selected?.id === incident.id
                      ? "incident-row selected"
                      : "incident-row"
                  }
                  onClick={() => void openIncident(incident.id)}
                >
                  <strong className="incident-priority">
                    {incident.priority_score}
                  </strong>

                  <span className="incident-row-main">
                    <strong>{incident.incident_number}</strong>

                    <span>
                      {formatCategory(incident.category)} ·{" "}
                      {incident.sector_name ?? "Location unavailable"}
                    </span>
                  </span>

                  <span className="incident-row-meta">
                    <span
                      className={`status status-${incident.status.toLowerCase()}`}
                    >
                      {formatStatus(incident.status)}
                    </span>

                    <span>
                      Risk {incident.risk_score} ·{" "}
                      {incident.waiting_days}d
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="map-card dashboard-card">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Geospatial intelligence</p>
              <h3>Live Civic Map</h3>
            </div>

            <div className="map-legend">
              <i />
              Backend incidents
            </div>
          </div>

          {mapIncidents.length === 0 && !loading ? (
            <EmptyState
              title="No mapped incidents"
              description="Historical or live map data is unavailable."
            />
          ) : (
            <IncidentMap
              incidents={mapIncidents}
              onSelect={(incidentId) => void openIncident(incidentId)}
            />
          )}
        </div>
      </section>

      {detailLoading && (
        <div className="detail-panel">
          <div className="loading-block">
            Loading incident intelligence…
          </div>
        </div>
      )}

      {selected && !detailLoading && (
        <section className="detail-panel">
          <div className="detail-header">
            <div>
              <p className="eyebrow">Incident intelligence</p>
              <h2>{selected.incident_number}</h2>
            </div>

            <button
              className="secondary-button"
              onClick={() => {
                setSelected(null);
                setScoreExplanation(null);
              }}
            >
              Close
            </button>
          </div>

          <p className="detail-category">
            {formatCategory(selected.category)}
          </p>

          <div className="detail-location">
            <span>Location</span>

            <strong>
              {selected.sector_name ?? "Location unavailable"}
            </strong>

            <small>
              {selected.latitude.toFixed(6)},{" "}
              {selected.longitude.toFixed(6)}
            </small>
          </div>

          <div className="score-grid">
            <Score
              label="Severity"
              value={selected.severity}
            />

            <Score
              label="Confidence"
              value={selected.confidence_score}
            />

            <Score
              label="Risk"
              value={selected.risk_score}
            />
          </div>

          <div className="detail-section">
            <h3>Evidence</h3>

            <dl className="fact-list">
              <div>
                <dt>Reports</dt>
                <dd>{selected.reports_count}</dd>
              </div>

              <div>
                <dt>Waiting</dt>
                <dd>{selected.waiting_days} days</dd>
              </div>

              <div>
                <dt>Recurrence</dt>
                <dd>{selected.recurrence_status}</dd>
              </div>

              <div>
                <dt>Status</dt>
                <dd>{formatStatus(selected.status)}</dd>
              </div>
            </dl>
          </div>

          {scoreExplanation && (
            <div className="detail-section score-explanation">
              <div className="formula-line">
                <span>{scoreExplanation.formula_version}</span>

                <strong>{scoreExplanation.score_value}</strong>
              </div>

              <p>{scoreExplanation.label}</p>

              <pre>
                {JSON.stringify(
                  scoreExplanation.evidence_breakdown,
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone,
  note,
}: {
  label: string;
  value?: number | string;
  tone: "teal" | "warm" | "dark" | "light";
  note: string;
}) {
  return (
    <article className={`metric-card metric-${tone}`}>
      <span>{label}</span>

      <strong>{value ?? "—"}</strong>

      <small>{note}</small>
    </article>
  );
}

function Score({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div>
      <span>{label}</span>

      <strong>
        {value == null ? "—" : value}
      </strong>
    </div>
  );
}

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatStatus(status: string) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}