/**
 * Field Worker — Job Detail (/field/jobs/:id)
 *
 * The actionable job page: WHAT to fix, WHERE, WHY it matters, and the
 * execution flow ASSIGNED → NAVIGATE → START WORK → FIELD CHECK →
 * COMPLETION PHOTO → SMART CLOSURE → SUBMIT FOR VERIFICATION.
 *
 * Uses the SAME shared Leaflet CivicMap as Admin/Citizen. SANKET stays
 * behind the scenes — the worker sees human reasons, not formulas.
 * Smart-closure figures are clearly labelled as prototype/demo results.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Clock,
  HardHat,
  ImageUp,
  Info,
  MapPin,
  Navigation,
  Send,
  ShieldCheck,
  Sparkles,
  WifiOff,
} from 'lucide-react';
import { CivicMap } from '../common/CivicMap';
import { useCivic } from '../../context/CivicContext';
import { useCitizenLocation } from '../citizen/useCitizenLocation';
import { categoryTitle, FIELD_STATUS, jobPriority, navigateTo } from './fieldData';
import { JobStatusPill, SectionHeading } from './FieldPages';

type Phase = 'overview' | 'in_progress' | 'analysis' | 'verification' | 'submitted';

export const FieldJobDetail: React.FC<{ incidentId: string }> = ({ incidentId }) => {
  const { incidents, startFieldWork, resolveFieldIncident, isOffline, showToast } = useCivic();
  const incident = incidents.find((i) => i.id === incidentId) ?? null;
  const { coords, request } = useCitizenLocation();

  // Phase is derived once at mount from the job's status. The component is
  // keyed by job id, so switching jobs remounts and re-initialises cleanly.
  const [phase, setPhase] = useState<Phase>(() => {
    const status = incidents.find((i) => i.id === incidentId)?.status;
    return status === 'resolved' || status === 'needs_review'
      ? 'submitted'
      : status === 'in_progress'
        ? 'in_progress'
        : 'overview';
  });
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [phase]);

  if (!incident) {
    return (
      <div className="fw-page">
        <button className="fw-text-action" onClick={() => navigateTo('/field/jobs')}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to jobs
        </button>
        <p className="mt-4 text-sm text-[#565C68]">
          This job could not be found. It may have been reassigned.
        </p>
      </div>
    );
  }

  const priority = jobPriority(incident);
  const statusInfo = FIELD_STATUS[incident.status];

  /* ---------------- Actions ---------------- */

  const startWork = () => {
    startFieldWork(incident.id);
    setPhase('in_progress');
  };

  const beginAnalysis = () => {
    setPhase('analysis');
    window.setTimeout(() => setPhase('verification'), 1600);
  };

  const submit = () => {
    // Prototype: reuse the shared Smart Closure action (marks resolved + after photo).
    resolveFieldIncident(
      incident.id,
      afterPhoto ?? incident.beforeImageUrl,
      'resolved'
    );
    setPhase('submitted');
  };

  const navigate = () => {
    request();
    if (!('geolocation' in navigator)) {
      showToast(
        'Navigation ready',
        'Route to the incident is highlighted on the map (prototype — no external navigation service connected).',
        'info'
      );
    }
  };

  return (
    <div className="fw-page">
      <button className="fw-text-action mb-2" onClick={() => navigateTo('/field/jobs')}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back to jobs
      </button>

      {/* ---------------- Job header ---------------- */}
      <header className="fw-job-detail-head">
        <span className={`fw-priority-flag tone-${priority.tone}`}>{priority.label}</span>
        <h1 ref={headingRef} tabIndex={-1} className="mt-2 text-xl font-extrabold tracking-[-.03em]">
          {categoryTitle(incident)}
        </h1>
        <p className="mt-1 text-xs font-mono text-[#7E8592]">{incident.ticketNumber}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-[#565C68]">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {incident.sector} · {incident.location}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <JobStatusPill status={incident.status} />
          <span className="fw-text-action" aria-hidden="true">
            Assigned to you
          </span>
        </div>
      </header>

      {isOffline && (
        <div className="citizen-location-note" role="status">
          <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
          Offline — evidence will be queued and sync when connection returns. (Prototype state.)
        </div>
      )}

      {/* ---------------- Issue + Why this job ---------------- */}
      <section className="mt-5">
        <SectionHeading eyebrow="ISSUE" title="What needs fixing" />
        <p className="mt-2 text-sm leading-relaxed text-[#565C68]">{incident.description}</p>
      </section>

      <section className="mt-5">
        <SectionHeading eyebrow="WHY THIS JOB?" title="Operational context" />
        <ul className="fw-check-list mt-3">
          {priority.reasons.map((reason) => (
            <li key={reason}>
              <Check className="h-4 w-4" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- Location (real map) ---------------- */}
      <section className="mt-5">
        <SectionHeading eyebrow="LOCATION" title="Incident site" />
        <div className="citizen-map-wrapper">
          <CivicMap
            variant="citizen"
            incidents={[incident]}
            height="100%"
            selectedIncidentId={incident.id}
            userLocation={coords}
            onIssueClick={() => undefined}
          />
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button className="fw-primary-button" onClick={navigate}>
            <Navigation className="h-4 w-4" aria-hidden="true" />
            NAVIGATE TO INCIDENT
          </button>
        </div>
        <p className="mt-2 text-xs text-[#7E8592]">
          Prototype: highlights the route on the map. No external navigation service is connected.
        </p>
      </section>

      {/* ---------------- Execution phases ---------------- */}
      {phase === 'overview' && (
        <section className="mt-6">
          <button className="fw-primary-button" onClick={startWork}>
            <HardHat className="h-4 w-4" aria-hidden="true" />
            START WORK
          </button>
          <p className="mt-2 text-xs text-[#7E8592]">
            Starting work moves this job to <strong>In Progress</strong> and records a timestamp.
          </p>
        </section>
      )}

      {phase === 'in_progress' && (
        <section className="mt-6">
          <SectionHeading eyebrow="FIELD CHECK" title="Confirm and capture" />
          <ul className="fw-check-list mt-3">
            <li>
              <Check className="h-4 w-4" aria-hidden="true" /> Issue type: {categoryTitle(incident)}
            </li>
            <li>
              <Check className="h-4 w-4" aria-hidden="true" /> Location confirmed on site
            </li>
            <li>
              <Check className="h-4 w-4" aria-hidden="true" /> Current condition: needs repair
            </li>
          </ul>

          <label className="citizen-description-label">
            Field note (optional)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="e.g. Excavated failed sub-base, re-compacted and laid hot-mix."
            />
          </label>

          {/* Completion photo */}
          <SectionHeading eyebrow="COMPLETION EVIDENCE" title="After-repair photo" />
          <label className="fw-upload-zone">
            {afterPhoto ? (
              <img src={afterPhoto} alt="After-repair completion evidence" />
            ) : (
              <>
                <ImageUp className="h-8 w-8" aria-hidden="true" />
                <b>Take completion photo</b>
                <span>Required for Smart Closure verification</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              aria-label="Attach after-repair photo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAfterPhoto(URL.createObjectURL(file));
              }}
            />
          </label>

          <button
            className="fw-primary-button mt-4"
            onClick={beginAnalysis}
            disabled={!afterPhoto}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            SUBMIT COMPLETION
          </button>
          {!afterPhoto && (
            <p className="mt-2 text-xs text-[#7E8592]">
              Add an after-repair photo to run Smart Closure verification.
            </p>
          )}
        </section>
      )}

      {phase === 'analysis' && (
        <section className="citizen-analysis mt-6" role="status" aria-live="polite">
          <Sparkles className="h-7 w-7" aria-hidden="true" />
          <h2>Analyzing completion evidence…</h2>
          <p>Checking the photo, location, and timestamp against the original report.</p>
          <p className="citizen-analysis-note">Prototype demo — results are simulated.</p>
        </section>
      )}

      {phase === 'verification' && (
        <section className="mt-6">
          <SectionHeading eyebrow="SMART CLOSURE" title="Evidence analysis" />
          <div className="fw-closure">
            <div className="fw-closure-score">
              <div className="fw-closure-ring" aria-hidden="true">
                96%
              </div>
              <div>
                <p className="text-sm font-extrabold text-[#1e6b42]">Likely match</p>
                <p className="mt-1 text-xs text-[#565C68]">
                  Prototype verification result — not a scientifically validated score.
                </p>
              </div>
            </div>

            <ul className="fw-check-list mt-4">
              <li>
                <Check className="h-4 w-4" aria-hidden="true" /> Location matches incident
              </li>
              <li>
                <Check className="h-4 w-4" aria-hidden="true" /> Image comparison completed
              </li>
              <li>
                <Check className="h-4 w-4" aria-hidden="true" /> Timestamp captured
              </li>
            </ul>

            <div className="fw-closure-compare">
              <figure className="fw-closure-figure">
                <img src={incident.beforeImageUrl} alt="Before repair" />
                <figcaption>Before</figcaption>
              </figure>
              <figure className="fw-closure-figure">
                <img src={afterPhoto ?? incident.beforeImageUrl} alt="After repair" />
                <figcaption>After</figcaption>
              </figure>
            </div>
          </div>

          <button className="fw-primary-button mt-4" onClick={submit}>
            <Send className="h-4 w-4" aria-hidden="true" />
            SUBMIT FOR VERIFICATION
          </button>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#7E8592]">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Municipal team confirms the final resolution. Workers do not self-close incidents.
          </p>
        </section>
      )}

      {phase === 'submitted' && (
        <section className="mt-6">
          <div className="fw-closeout" role="status">
            <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
            <p className="fw-eyebrow">COMPLETION SUBMITTED</p>
            <h2 className="text-lg font-extrabold">Awaiting municipal verification</h2>
            <div className="fw-verify-steps">
              <span className="is-done">
                <Check className="h-4 w-4" aria-hidden="true" /> Work completed
              </span>
              <span className="is-done">
                <Check className="h-4 w-4" aria-hidden="true" /> Evidence submitted
              </span>
              <span className="is-active">
                <Clock className="h-4 w-4" aria-hidden="true" /> Awaiting municipal verification
              </span>
            </div>
            <p className="mt-3 text-xs text-[#565C68]">
              {statusInfo.explanation}
            </p>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button className="fw-secondary-button" onClick={() => navigateTo('/field/history')}>
              <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
              View job history
            </button>
            <button className="fw-secondary-button" onClick={() => navigateTo('/field/jobs')}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              Back to work queue
            </button>
          </div>
        </section>
      )}

      <p className="citizen-confirm-fineprint mt-6">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
        Reports shown to field workers never include a citizen's private contact details or exact
        personal location.
      </p>
    </div>
  );
};
