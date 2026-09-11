/**
 * Citizen reporting flow: /citizen/report
 *
 * STEP 1 — Capture evidence (photo, voice placeholder, description, area)
 * STEP 2 — CivicLens analyzes (CLEARLY-MARKED PROTOTYPE simulation — no real
 *          AI inference is performed; the label says so on screen)
 * STEP 3 — Citizen confirms detected issue / location / description
 * DONE   — Confirmation with what happens next
 *
 * Includes human-friendly error state if submission fails.
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  ImageUp,
  Info,
  Loader2,
  MapPin,
  Mic,
  Pencil,
  Send,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import type { IssueCategory } from '../../types/civic';
import { useCivic } from '../../context/CivicContext';
import { categoryLabel, REPORT_CATEGORIES, REPORT_SECTORS } from './citizenData';
import { SectionHeading } from './CitizenPrimitives';

type Step = 'capture' | 'analysis' | 'confirm' | 'done';

const STEP_NUMBER: Record<Exclude<Step, 'done'>, number> = {
  capture: 1,
  analysis: 2,
  confirm: 3,
};

export const CitizenReportFlow: React.FC<{
  onComplete: () => void;
  onCancel: () => void;
}> = ({ onComplete, onCancel }) => {
  const { submitCitizenReport, showToast } = useCivic();

  const [step, setStep] = useState<Step>('capture');
  const [photo, setPhoto] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState<string>(REPORT_SECTORS[0]);
  const [detectedCategory, setDetectedCategory] = useState<IssueCategory>('pothole');
  const [submitError, setSubmitError] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const headingRef = useRef<HTMLDivElement>(null);

  // Reveal analysis checks progressively (prototype simulation).
  // checkCount is reset in startAnalysis() so no setState is needed here.
  useEffect(() => {
    if (step !== 'analysis') return;
    const timers = [1, 2, 3].map((n) =>
      window.setTimeout(() => setCheckCount(n), n * 650)
    );
    const done = window.setTimeout(() => setStep('confirm'), 3 * 650 + 750);
    return () => {
      timers.forEach(window.clearTimeout);
      window.clearTimeout(done);
    };
  }, [step]);

  // Move focus to the step heading when the step changes (a11y).
  useEffect(() => {
    if (step !== 'done') headingRef.current?.focus();
  }, [step]);

  const startAnalysis = () => {
    if (!description.trim()) {
      showToast(
        'Add a short description',
        'A sentence or two helps the municipal team understand the problem.',
        'info'
      );
      return;
    }
    setSubmitError(false);
    setCheckCount(0);
    setStep('analysis');
  };

  const submit = () => {
    try {
      submitCitizenReport({
        category: detectedCategory,
        description: description.trim(),
        sector,
        location: `${sector}, Chandigarh`,
        imageDataUrl: photo || undefined,
      });
      setStep('done');
    } catch {
      setSubmitError(true);
    }
  };

  /* ---------------- DONE ---------------- */
  if (step === 'done') {
    return (
      <div className="citizen-page">
        <div className="citizen-complete" role="status">
          <CheckCircle2 className="h-11 w-11" aria-hidden="true" />
          <p className="citizen-eyebrow">REPORT RECEIVED</p>
          <h1>Thank you for speaking up.</h1>
          <p>
            Your report has been received. CivicLens will share updates here as the issue moves
            forward — you'll also get a notification when its status changes.
          </p>
          <button className="citizen-primary-button" onClick={onComplete}>
            View my reports
          </button>
          <button className="citizen-secondary-button" onClick={onCancel}>
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="citizen-page citizen-report-page">
      <button className="citizen-back" onClick={onCancel}>
        ← Back
      </button>

      <div ref={headingRef} tabIndex={-1}>
        <SectionHeading
          eyebrow={`REPORT AN ISSUE · STEP ${STEP_NUMBER[step as Exclude<Step, 'done'>]} OF 3`}
          title={
            step === 'capture'
              ? 'Capture what needs attention'
              : step === 'analysis'
                ? 'Checking your report…'
                : 'Review your report'
          }
        />
      </div>

      {/* ---------------- STEP 1: CAPTURE ---------------- */}
      {step === 'capture' && (
        <>
          <p className="citizen-hint">
            Add a photo or describe the problem. You'll review everything before it is sent.
          </p>

          <label className="citizen-upload-zone">
            {photo ? (
              <img src={photo} alt="Photo you attached as report evidence" />
            ) : (
              <>
                <ImageUp className="h-8 w-8" aria-hidden="true" />
                <b>Add a photo</b>
                <span>Take a photo or upload one from your device</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              aria-label="Attach a photo of the issue"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPhoto(URL.createObjectURL(file));
              }}
            />
          </label>

          <div className="citizen-capture-options">
            <button type="button" onClick={() => document.getElementById('citizen-photo-input')?.click()}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              Take photo
            </button>
            <button type="button" onClick={() => document.getElementById('citizen-photo-input')?.click()}>
              <Upload className="h-4 w-4" aria-hidden="true" />
              Upload photo
            </button>
            <button
              type="button"
              disabled
              title="Voice description is not available in this prototype"
              onClick={() => {
                showToast(
                  'Coming soon',
                  'Voice description is not available in this prototype yet.',
                  'info'
                );
              }}
            >
              <Mic className="h-4 w-4" aria-hidden="true" />
              Describe by voice
            </button>
          </div>
          {/* Hidden input reused by Take/Upload photo buttons */}
          <input
            id="citizen-photo-input"
            type="file"
            accept="image/*"
            className="citizen-sr-only"
            tabIndex={-1}
            aria-hidden="true"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPhoto(URL.createObjectURL(file));
            }}
          />

          <label className="citizen-description-label">
            Describe the issue
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="e.g. Large pothole near the bus stop; two-wheelers are swerving around it."
            />
          </label>

          <div className="citizen-location-row">
            <span>
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Where is it?
            </span>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              aria-label="Choose the area"
            >
              {REPORT_SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="citizen-location-button"
              onClick={() =>
                showToast(
                  'Prototype note',
                  'Automatic GPS detection is simulated in this prototype — pick the area manually.',
                  'info'
                )
              }
            >
              <Loader2 className="h-3.5 w-3.5" aria-hidden="true" />
              Detect automatically
            </button>
          </div>

          <button className="citizen-primary-button mt-5" onClick={startAnalysis}>
            Continue
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </>
      )}

      {/* ---------------- STEP 2: ANALYSIS (PROTOTYPE) ---------------- */}
      {step === 'analysis' && (
        <div className="citizen-analysis" role="status" aria-live="polite">
          <Loader2 className="h-7 w-7 animate-spin" aria-hidden="true" />
          <h2>Analyzing your report…</h2>
          <p>
            Checking the photo, location, and description before you confirm. This usually takes a
            moment.
          </p>
          <div className="citizen-analysis-checks">
            <span style={{ animationDelay: '0.05s', opacity: checkCount >= 1 ? 1 : 0.35 }}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Issue type detected
            </span>
            <span style={{ animationDelay: '0.15s', opacity: checkCount >= 2 ? 1 : 0.35 }}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Location detected
            </span>
            <span style={{ animationDelay: '0.25s', opacity: checkCount >= 3 ? 1 : 0.35 }}>
              <Check className="h-4 w-4" aria-hidden="true" />
              Description generated
            </span>
          </div>
          <p className="citizen-analysis-note">
            Prototype demo — this analysis is simulated and not a real AI result.
          </p>
        </div>
      )}

      {/* ---------------- STEP 3: CONFIRM ---------------- */}
      {step === 'confirm' && (
        <>
          <p className="citizen-hint">
            Please check the details below. Anything look wrong? You can edit before sending.
          </p>

          <div className="citizen-confirm-card">
            <div className="citizen-confirm-head">
              <b>Detected details</b>
              <span>PROTOTYPE SUGGESTION</span>
            </div>

            <dl>
              {photo && (
                <div>
                  <dt>Your photo</dt>
                  <dd>
                    <img className="citizen-confirm-photo" src={photo} alt="Attached report evidence" />
                  </dd>
                </div>
              )}
              <div>
                <dt>Issue</dt>
                <dd>
                  <label className="citizen-sr-only" htmlFor="citizen-confirm-category">
                    Issue type
                  </label>
                  <select
                    id="citizen-confirm-category"
                    value={detectedCategory}
                    onChange={(e) => setDetectedCategory(e.target.value as IssueCategory)}
                  >
                    {REPORT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {categoryLabel(c)}
                      </option>
                    ))}
                  </select>
                </dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {sector}, Chandigarh
                </dd>
              </div>
              <div>
                <dt>Description</dt>
                <dd>{description.trim()}</dd>
              </div>
            </dl>

            {submitError && (
              <div className="citizen-error" role="alert">
                <b>Something went wrong.</b>
                <p>Your report wasn't submitted. Please try again.</p>
              </div>
            )}

            <div className="citizen-confirm-actions">
              <button
                className="citizen-secondary-button"
                onClick={() => setStep('capture')}
                aria-label="Edit your report details"
              >
                <Pencil className="h-4 w-4" aria-hidden="true" />
                Edit
              </button>
              <button className="citizen-primary-button" onClick={submit}>
                <Send className="h-4 w-4" aria-hidden="true" />
                Confirm & submit
              </button>
            </div>

            <p className="citizen-confirm-fineprint">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Your report is shared with the municipal team as public civic information. Your name
              and contact details are never shown publicly.
            </p>
          </div>

          <p className="citizen-confirm-fineprint">
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
            Prototype demo — the detected issue, location, and description above are simulated
            suggestions, not a real AI result.
          </p>
        </>
      )}
    </div>
  );
};