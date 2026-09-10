import type {
  AnalyticsOverview,
  Incident,
  IncidentDetail,
  MapIncident,
  ReportCreate,
  ReportDetail,
  ScoreExplanation,
  SyncResponse,
} from "./types";

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      ...init,
      headers: {
        ...(init?.body ? { "Content-Type": "application/json" } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error("The backend is unavailable. Please try again.");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload.detail === "string"
        ? payload.detail
        : `The request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export function submitReport(report: ReportCreate) {
  return request<SyncResponse>("/api/v1/sync/report", {
    method: "POST",
    body: JSON.stringify(report),
  });
}

export function getReport(reportId: string) {
  return request<ReportDetail>(`/api/v1/reports/${reportId}`);
}

export function getIncident(incidentId: string) {
  return request<IncidentDetail>(`/api/v1/incidents/${incidentId}`);
}

export function getScoreExplanation(incidentId: string) {
  return request<ScoreExplanation>(
    `/api/v1/incidents/${incidentId}/why-score`,
  );
}

export function getAnalytics() {
  return request<AnalyticsOverview>("/api/v1/analytics/overview");
}

export function getIncidents(filters?: {
  category?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return request<Incident[]>(`/api/v1/incidents${query ? `?${query}` : ""}`);
}

export function getMapIncidents(filters?: {
  category?: string;
  status?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return request<MapIncident[]>(
    `/api/v1/map/incidents${query ? `?${query}` : ""}`,
  );
}

export { ApiError };