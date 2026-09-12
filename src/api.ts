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

const TOKEN_KEY = "civiclens_access_token";
export type UserRole = "COMMAND_ADMIN" | "FIELD_OFFICER" | "CITIZEN";
export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  is_active: boolean;
}
interface LoginResponse { access_token: string; user_id: string; email: string; full_name: string; role: UserRole; }

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.name = "ApiError"; this.status = status; }
}

export function getStoredToken() { return window.localStorage.getItem(TOKEN_KEY); }
export function clearStoredToken() { window.localStorage.removeItem(TOKEN_KEY); }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    const token = getStoredToken();
    response = await fetch(path, {
      ...init,
      headers: { ...(init?.body ? { "Content-Type": "application/json" } : {}), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init?.headers },
    });
  } catch { throw new Error("The backend is unavailable. Please try again."); }
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) window.dispatchEvent(new Event("civiclens:unauthorized"));
    const message = payload && typeof payload.detail === "string" ? payload.detail : `The request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return payload as T;
}

export async function login(email: string, password: string) {
  const response = await request<LoginResponse>("/api/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  window.localStorage.setItem(TOKEN_KEY, response.access_token);
  return getCurrentUser();
}

export async function register(input: { email: string; password: string; full_name: string; phone?: string }) {
  await request<AuthUser>("/api/v1/auth/register", { method: "POST", body: JSON.stringify({ ...input, role: "CITIZEN" }) });
  return login(input.email, input.password);
}

export function getCurrentUser() { return request<AuthUser>("/api/v1/auth/me"); }
export function submitReport(report: ReportCreate) { return request<SyncResponse>("/api/v1/sync/report", { method: "POST", body: JSON.stringify(report) }); }
export function getReport(reportId: string) { return request<ReportDetail>(`/api/v1/reports/${reportId}`); }
export function getIncident(incidentId: string) { return request<IncidentDetail>(`/api/v1/incidents/${incidentId}`); }
export function getScoreExplanation(incidentId: string) { return request<ScoreExplanation>(`/api/v1/incidents/${incidentId}/why-score`); }
export function getAnalytics() { return request<AnalyticsOverview>("/api/v1/analytics/overview"); }
export function getIncidents(filters?: { category?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return request<Incident[]>(`/api/v1/incidents${query ? `?${query}` : ""}`);
}
export function getMapIncidents(filters?: { category?: string; status?: string }) {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return request<MapIncident[]>(`/api/v1/map/incidents${query ? `?${query}` : ""}`);
}
export { ApiError };
