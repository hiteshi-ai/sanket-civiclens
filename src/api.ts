import type {
  AnalyticsOverview,
  Incident as BackendIncident,
  IncidentDetail,
  MapIncident,
  ReportCreate,
  ReportDetail,
  ScoreExplanation,
  SyncResponse,
} from "./types";

const TOKEN_KEY = "civiclens_access_token";

export type UserRole =
  | "CITIZEN"
  | "FIELD_WORKER"
  | "FIELD_OFFICER"
  | "MUNICIPAL_OFFICER"
  | "COMMAND_ADMIN"
  | "ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  phone?: string | null;
  role: UserRole;
  is_active: boolean;
}

interface LoginResponse {
  access_token: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getStoredToken(): string | null {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  const token = getStoredToken();
  const headers: Record<string, string> = {
    ...(init?.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((init?.headers as Record<string, string>) || {}),
  };

  try {
    response = await fetch(path, {
      ...init,
      headers,
    });
  } catch {
    throw new Error("The backend server is unavailable. Please make sure it is running.");
  }

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("civiclens:unauthorized"));
    }
    const message =
      payload && typeof payload.detail === "string"
        ? payload.detail
        : `The request failed with HTTP ${response.status}.`;
    throw new ApiError(message, response.status);
  }

  if (payload === null) {
    throw new Error("The backend returned an empty response.");
  }

  return payload as T;
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export async function login(email: string, password: string): Promise<AuthUser> {
  const response = await request<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setStoredToken(response.access_token);
  return getCurrentUser();
}

export async function register(input: {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  role?: UserRole;
}): Promise<AuthUser> {
  await request<AuthUser>("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ ...input, role: input.role || "CITIZEN" }),
  });
  return login(input.email, input.password);
}

export function getCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>("/api/v1/auth/me");
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export function submitReport(report: ReportCreate): Promise<SyncResponse> {
  return request<SyncResponse>("/api/v1/sync/report", {
    method: "POST",
    body: JSON.stringify(report),
  });
}

export function getReport(reportId: string): Promise<ReportDetail> {
  return request<ReportDetail>(`/api/v1/reports/${reportId}`);
}

export function getReports(limit = 100): Promise<ReportDetail[]> {
  return request<ReportDetail[]>(`/api/v1/reports?limit=${limit}`);
}

// ---------------------------------------------------------------------------
// Incidents
// ---------------------------------------------------------------------------

export function getIncidents(filters?: {
  category?: string;
  status?: string;
  sector?: string;
}): Promise<BackendIncident[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.sector) params.set("sector", filters.sector);
  const query = params.toString();
  return request<BackendIncident[]>(`/api/v1/incidents${query ? `?${query}` : ""}`).then(
    (incidents) => (Array.isArray(incidents) ? incidents : []),
  );
}

export function getIncident(incidentId: string): Promise<IncidentDetail> {
  return request<IncidentDetail>(`/api/v1/incidents/${incidentId}`);
}

export function getScoreExplanation(incidentId: string): Promise<ScoreExplanation> {
  return request<ScoreExplanation>(`/api/v1/incidents/${incidentId}/why-score`);
}

export function assignIncident(
  incidentId: string,
  assignedToUserId: string,
  notes?: string,
): Promise<{ status: string; incident_id: string; assigned_to: string }> {
  return request(`/api/v1/incidents/${incidentId}/assign`, {
    method: "POST",
    body: JSON.stringify({ assigned_to_user_id: assignedToUserId, notes }),
  });
}

// ---------------------------------------------------------------------------
// GIS Map & Sectors
// ---------------------------------------------------------------------------

export function getMapIncidents(filters?: {
  category?: string;
  status?: string;
}): Promise<MapIncident[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.status) params.set("status", filters.status);
  const query = params.toString();
  return request<MapIncident[]>(`/api/v1/map/incidents${query ? `?${query}` : ""}`).then(
    (incidents) => (Array.isArray(incidents) ? incidents : []),
  );
}

export interface SectorInfo {
  id: string;
  sector_name: string;
  sector_code: string;
  ward_number: number | null;
  center_lat: number;
  center_lon: number;
}

export function getChandigarhSectors(): Promise<SectorInfo[]> {
  return request<SectorInfo[]>("/api/v1/map/sectors").then((secs) =>
    Array.isArray(secs) ? secs : [],
  );
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export function getAnalytics(): Promise<AnalyticsOverview> {
  return request<AnalyticsOverview>("/api/v1/analytics/overview");
}

// ---------------------------------------------------------------------------
// Smart Closures & Field Verification
// ---------------------------------------------------------------------------

export interface ClosureMatchRequest {
  incident_id: string;
  after_photo_base64: string;
  latitude: number;
  longitude: number;
}

export interface ClosureMatchResponse {
  closure_submission_id: string;
  incident_id: string;
  decision: string;
  score: number;
  distance_meters: number;
  status: string;
  summary: string;
}

export function submitClosureMatch(
  payload: ClosureMatchRequest,
): Promise<ClosureMatchResponse> {
  return request<ClosureMatchResponse>("/api/v1/closures/match", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export { ApiError };