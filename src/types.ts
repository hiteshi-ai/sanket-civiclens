export const CIVIC_CATEGORIES = [
  "POTHOLE_ROAD_DAMAGE",
  "GARBAGE_OVERFLOW",
  "BROKEN_STREETLIGHT",
  "DRAINAGE_WATERLOGGING",
  "OTHER",
] as const;

export type CivicCategory = (typeof CIVIC_CATEGORIES)[number];

export type IncidentStatus =
  | "OPEN"
  | "IN_TRIAGE"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "PENDING_VERIFICATION"
  | "VERIFIED_CLOSED"
  | "REJECTED";

export interface ReportCreate {
  idempotency_key: string;
  category: CivicCategory;
  photo_base64?: string;
  latitude: number;
  longitude: number;
  accuracy_meters?: number;
  location_source: "GPS" | "MANUAL_SELECTION";
  description?: string;
  client_timestamp: string;
}

export interface SyncResponse {
  status: "CREATED" | "ALREADY_SYNCED" | string;
  report_id: string;
  idempotency_key: string;
  incident_id?: string | null;
  incident_number?: string | null;
  sync_status: string;
}

export interface AIPrediction {
  model_name: string;
  model_version: string;
  predicted_category: CivicCategory;
  confidence: number | null;
  provider: string;
  inference_duration_ms: number | null;
  created_at: string;
}

export interface ReportDetail {
  id: string;
  idempotency_key: string;
  category: CivicCategory;
  user_confirmed_category: CivicCategory | null;
  description: string | null;
  photo_url: string;
  latitude: number;
  longitude: number;
  accuracy_meters: number | null;
  location_source: string;
  sector_name: string | null;
  sync_status: string;
  client_timestamp: string;
  server_received_at: string;
  ai_prediction?: AIPrediction | null;
  associated_incident_id?: string | null;
  source_type?: string;
}

export interface Incident {
  id: string;
  incident_number: string;
  category: CivicCategory;
  latitude: number;
  longitude: number;
  sector_name: string | null;
  severity: number;
  confidence_score: number;
  risk_score: number;
  priority_score: number;
  status: IncidentStatus;
  waiting_days: number;
  recurrence_status: string;
  primary_photo_url: string | null;
  assigned_user_id: string | null;
  reports_count: number;
  first_reported_at: string;
  last_reported_at: string;
  created_at: string;
}

export interface IncidentDetail extends Incident {
  fused_reports: Array<{
    report_id: string;
    category: CivicCategory;
    client_timestamp: string;
    photo_url: string;
    location_source: string;
    accuracy_meters: number | null;
  }>;
  latest_score_calculation: {
    formula_version: string;
    score_value: number;
    evidence_breakdown: Record<string, unknown>;
    calculated_at: string;
  } | null;
  recurrence_evidence: {
    historical_records_count: number;
    pattern_description: string;
    detected_at: string;
  } | null;
  closure_submission: Record<string, unknown> | null;
}

export interface ScoreExplanation {
  incident_id: string;
  score_type: string;
  formula_version: string;
  score_value: number;
  calculated_at: string;
  evidence_breakdown: Record<string, unknown>;
  input_record_ids: string[];
  label: string;
}

export interface AnalyticsOverview {
  total_incidents: number;
  total_reports: number;
  open_incidents: number;
  in_progress_incidents: number;
  pending_verification: number;
  verified_closed_incidents: number;
  high_risk_incidents: number;
  average_civic_confidence: number | null;
  average_resolution_hours: number | null;
  resolution_time_status: string;
  category_distribution: Record<string, number>;
}

export interface MapIncident {
  id: string;
  incident_number: string;
  category: CivicCategory;
  latitude: number;
  longitude: number;
  sector_name: string | null;
  severity: number;
  risk_score: number;
  confidence_score: number;
  priority_score: number;
  status: IncidentStatus;
  waiting_days: number;
  primary_photo_url: string | null;
  reports_count: number;
  recurrence_status: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}