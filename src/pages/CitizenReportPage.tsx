import { FormEvent, useEffect, useState } from "react";
import { getIncident, getReport, submitReport } from "../api";
import { LocationCapture } from "../components/LocationCapture";
import { PhotoCapture } from "../components/PhotoCapture";
import { ReportResult } from "../components/ReportResult";
import type { IncidentDetail, Location, ReportDetail } from "../types";

type SubmissionState = "ready" | "submitting" | "success" | "error";

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The photo could not be read."));
    reader.readAsDataURL(file);
  });
}

export function CitizenReportPage() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [category, setCategory] = useState("POTHOLE_ROAD_DAMAGE");
  const [description, setDescription] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("ready");
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [incident, setIncident] = useState<IncidentDetail | null>(null);
  const [incidentNumber, setIncidentNumber] = useState<string | null>(null);

  useEffect(() => {
    if (!photo) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationError("Location unavailable — this browser does not support GPS.");
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Number.isFinite(position.coords.accuracy)
            ? position.coords.accuracy
            : null,
        });
        setLocationLoading(false);
      },
      () => {
        setLocationError("Location unavailable — please enable location or retry.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!photo || !location) {
      setSubmissionState("error");
      setSubmissionError("Add a photo and capture your GPS location before submitting.");
      return;
    }

    setSubmissionState("submitting");
    setSubmissionError(null);
    try {
      const response = await submitReport({
        idempotency_key: crypto.randomUUID(),
        category: category as ReportDetail["category"],
        photo_base64: await fileToDataUrl(photo),
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy_meters: location.accuracy ?? undefined,
        location_source: "GPS",
        description: description.trim() || undefined,
        client_timestamp: new Date().toISOString(),
      });
      setIncidentNumber(response.incident_number ?? null);
      const savedReport = await getReport(response.report_id);
      setReport(savedReport);
      const incidentId = response.incident_id ?? savedReport.associated_incident_id;
      setIncident(incidentId ? await getIncident(incidentId) : null);
      setSubmissionState("success");
    } catch (error) {
      setSubmissionState("error");
      setSubmissionError(error instanceof Error ? error.message : "The report could not be submitted.");
    }
  }

  function resetForm() {
    setPhoto(null);
    setLocation(null);
    setLocationError(null);
    setCategory("POTHOLE_ROAD_DAMAGE");
    setDescription("");
    setReport(null);
    setIncident(null);
    setIncidentNumber(null);
    setSubmissionError(null);
    setSubmissionState("ready");
  }

  if (submissionState === "success" && report) {
    return (
      <div className="content-stack">
        <section className="page-intro">
          <div>
            <p className="eyebrow">Citizen report</p>
            <h2>Thank you for reporting an issue</h2>
            <p>The report and its resulting incident are now available to the municipal dashboard.</p>
          </div>
          <button className="secondary-button" onClick={resetForm}>Create another report</button>
        </section>
        <ReportResult report={report} incident={incident} incidentNumber={incidentNumber} />
      </div>
    );
  }

  return (
    <div className="content-stack">
      <section className="page-intro intro-with-index">
        <div className="intro-index">01</div>
        <div>
          <p className="eyebrow">Citizen report</p>
          <h2>Make your street visible</h2>
          <p>Share a real issue from Chandigarh with photo evidence and precise location.</p>
        </div>
      </section>

      <form className="report-layout" onSubmit={handleSubmit}>
        <div className="form-column">
          <div className="card form-card">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Evidence</p>
                <h3>What did you see?</h3>
              </div>
              <span className="step-label">1 / 2</span>
            </div>
            <PhotoCapture file={photo} previewUrl={previewUrl} onChange={setPhoto} />
            <div className="field-group">
              <label className="field-label" htmlFor="category">Issue category <span className="required">*</span></label>
              <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="POTHOLE_ROAD_DAMAGE">Pothole / road damage</option>
                <option value="GARBAGE_OVERFLOW">Garbage overflow</option>
                <option value="BROKEN_STREETLIGHT">Broken streetlight</option>
                <option value="DRAINAGE_WATERLOGGING">Drainage / waterlogging</option>
                <option value="OTHER">Other</option>
              </select>
              <p className="helper-text">This is your category selection. Any AI prediction is shown separately after submission.</p>
            </div>
            <div className="field-group">
              <label className="field-label" htmlFor="description">Description <span className="optional">(optional)</span></label>
              <textarea
                id="description"
                rows={4}
                maxLength={1000}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a short description to help the municipal team."
              />
              <span className="character-count">{description.length}/1000</span>
            </div>
          </div>
        </div>

        <div className="form-column">
          <div className="card form-card location-form-card">
            <div className="card-heading">
              <div>
                <p className="eyebrow">Location</p>
                <h3>Where is it?</h3>
              </div>
              <span className="step-label">2 / 2</span>
            </div>
            <LocationCapture
              location={location}
              loading={locationLoading}
              error={locationError}
              onCapture={captureLocation}
            />
            <div className="privacy-note">
              <span aria-hidden="true">◉</span>
              <p>Your location is attached to this report so the municipal team can find the issue.</p>
            </div>
            {submissionError && <div className="error-banner">{submissionError}</div>}
            <button className="primary-button submit-button" type="submit" disabled={submissionState === "submitting"}>
              {submissionState === "submitting" ? "Submitting report…" : "Submit civic report"}
              <span aria-hidden="true">→</span>
            </button>
            <p className="form-footnote">Your report will be processed by the SANKET intelligence layer.</p>
          </div>
        </div>
      </form>
    </div>
  );
}