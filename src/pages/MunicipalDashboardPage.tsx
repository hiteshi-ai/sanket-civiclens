import { useCallback, useEffect, useState } from "react";
import {
  getAnalytics,
  getIncident,
  getIncidents,
  getMapIncidents,
  getReport,
  getScoreExplanation,
} from "../api";
import { EmptyState } from "../components/EmptyState";
import { IncidentDetailPanel } from "../components/IncidentDetailPanel";
import { IncidentMap } from "../components/IncidentMap";
import { PriorityQueue } from "../components/PriorityQueue";
import type {
  AnalyticsOverview,
  Incident,
  IncidentDetail,
  MapIncident,
  ReportDetail,
  ScoreExplanation,
} from "../types";

type LoadState = "loading" | "ready" | "error";

export function MunicipalDashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [mapIncidents, setMapIncidents] = useState<MapIncident[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<IncidentDetail | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportDetail | null>(null);
  const [scoreExplanation, setScoreExplanation] = useState<ScoreExplanation | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoadState("loading");
    setLoadError(null);
    try {
      const filters = { category: categoryFilter, status: statusFilter };
      const [overview, incidentList, markers] = await Promise.all([
        getAnalytics(),
        getIncidents(filters),
        getMapIncidents(filters),
      ]);
      setAnalytics(overview);
      setIncidents(incidentList);
      setMapIncidents(markers);
      setLoadState("ready");
    } catch (error) {
      setLoadState("error");
      setLoadError(error instanceof Error ? error.message : "The dashboard could not be loaded.");
    }
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const selectIncident = useCallback(async (incident: Incident | { id: string }) => {
    setSelectedId(incident.id);
    setDetailLoading(true);
    setDetailError(null);
    setSelectedIncident(null);
    setSelectedReport(null);
    setScoreExplanation(null);
    try {
      const detail = await getIncident(incident.id);
      const explanation = await getScoreExplanation(incident.id);
      let report: ReportDetail | null = null;
      const firstReportId = detail.fused_reports[0]?.report_id;
      if (firstReportId) {
        report = await getReport(firstReportId);
      }
      setSelectedIncident(detail);
      setScoreExplanation(explanation);
      setSelectedReport(report);
    } catch (error) {
      setDetailError(error instanceof Error ? error.message : "The incident detail could not be loaded.");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const hasIncidents = incidents.length > 0 || mapIncidents.length > 0;

  return (
    <div className="content-stack dashboard-page">
      <section className="page-intro dashboard-intro">
        <div>
          <p className="eyebrow">Municipal command view</p>
          <h2>Chandigarh civic pulse</h2>
          <p>Review real citizen reports and the incidents SANKET has derived from them.</p>
        </div>
        <button className="secondary-button" onClick={() => void loadDashboard()} disabled={loadState === "loading"}>
          {loadState === "loading" ? "Refreshing…" : "Refresh data"}
          <span aria-hidden="true">↻</span>
        </button>
      </section>

      {loadState === "error" ? (
        <div className="error-banner large-error">
          <strong>Dashboard unavailable</strong>
          <span>{loadError}</span>
          <button className="text-button" onClick={() => void loadDashboard()}>Try again</button>
        </div>
      ) : (
        <>
          <section className="metric-grid" aria-label="Live municipal metrics">
            <MetricCard label="Total reports" value={analytics?.total_reports} />
            <MetricCard label="Active incidents" value={analytics?.open_incidents} />
            <MetricCard label="High-risk incidents" value={analytics?.high_risk_incidents} tone="warm" />
            <MetricCard label="Verified closed" value={analytics?.verified_closed_incidents} tone="dark" />
          </section>

          <section className="dashboard-grid">
            <div className="card queue-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">Operational queue</p>
                  <h3>Priority incidents</h3>
                </div>
                <span className="record-count">{incidents.length} records</span>
              </div>
              <div className="filter-row">
                <label>
                  <span className="sr-only">Filter by category</span>
                  <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                    <option value="">All categories</option>
                    <option value="POTHOLE_ROAD_DAMAGE">Pothole / road damage</option>
                    <option value="GARBAGE_OVERFLOW">Garbage overflow</option>
                    <option value="BROKEN_STREETLIGHT">Broken streetlight</option>
                    <option value="DRAINAGE_WATERLOGGING">Drainage / waterlogging</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
                <label>
                  <span className="sr-only">Filter by status</span>
                  <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="">All statuses</option>
                    <option value="OPEN">Open</option>
                    <option value="IN_TRIAGE">In triage</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In progress</option>
                    <option value="PENDING_VERIFICATION">Pending verification</option>
                    <option value="VERIFIED_CLOSED">Verified closed</option>
                  </select>
                </label>
              </div>
              <PriorityQueue incidents={incidents} selectedId={selectedId} onSelect={(item) => void selectIncident(item)} />
            </div>

            <div className="card map-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">Geospatial view</p>
                  <h3>Chandigarh incidents</h3>
                </div>
                <span className="map-legend"><i /> API coordinates</span>
              </div>
              <IncidentMap incidents={mapIncidents} onSelect={(id) => void selectIncident({ id })} />
            </div>
          </section>

          {!hasIncidents && loadState === "ready" && (
            <EmptyState
              title="No verified incidents yet."
              description="Submit a real citizen report to create the first incident record."
            />
          )}

          <IncidentDetailPanel
            incident={selectedIncident}
            explanation={scoreExplanation}
            report={selectedReport}
            loading={detailLoading}
            error={detailError}
          />
        </>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = "teal",
}: {
  label: string;
  value: number | null | undefined;
  tone?: "teal" | "warm" | "dark";
}) {
  return (
    <div className={`metric-card metric-${tone}`}>
      <span>{label}</span>
      <strong>{value === null || value === undefined ? "Data unavailable" : value}</strong>
      <small>From live database records</small>
    </div>
  );
}