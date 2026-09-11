/**
 * Citizen Home — the primary citizen screen.
 * Visual priority: 1) CivicLens identity  2) Report an Issue  3) Nearby
 * context (REAL interactive Leaflet map, public layer)  4) My Reports  5)
 * Trust note. No analytics, charts, KPIs or AI scores — citizens see
 * outcomes, not internal complexity.
 */
import React, { useEffect, useState } from 'react';
import { Camera, ChevronRight, MapPin, ShieldCheck } from 'lucide-react';
import { CivicMap } from '../common/CivicMap';
import type { Incident } from '../../types/civic';
import { categoryLabel } from './citizenData';
import { greetingForNow } from './useCitizenLocation';
import {
  EmptyState,
  ErrorState,
  MyReportCard,
  SectionHeading,
  StatusPill,
} from './CitizenPrimitives';

/* ---------------- Hero: the strongest CTA on the page ---------------- */

const ReportIssueCard: React.FC<{ onReport: () => void }> = ({ onReport }) => (
  <section className="citizen-hero" aria-labelledby="citizen-hero-title">
    <p className="citizen-eyebrow">HELP IMPROVE YOUR CITY</p>
    <h2 id="citizen-hero-title">See something that needs attention?</h2>
    <p>
      Take a photo, describe the problem, and CivicLens will help identify it for the municipal
      team.
    </p>
    <button className="citizen-hero-button" onClick={onReport}>
      <Camera className="w-5 h-5" aria-hidden="true" />
      REPORT AN ISSUE
    </button>
  </section>
);

/* ---------------- Nearby issue row ---------------- */

const NearbyIssueCard: React.FC<{ incident: Incident; onClick: () => void }> = ({
  incident,
  onClick,
}) => (
  <button className="citizen-nearby-issue" onClick={onClick}>
    <span className="citizen-category-icon" aria-hidden="true">
      <MapPin className="w-4 h-4" />
    </span>
    <span className="min-w-0 flex-1 text-left">
      <b>{categoryLabel(incident.category)}</b>
      <small>
        {incident.sector} · Approximate area
        {incident.confidenceEvidence.relatedReportsCount > 3 && (
          <em className="citizen-nearby-similar">
            {incident.confidenceEvidence.relatedReportsCount} similar reports
          </em>
        )}
      </small>
      <span className="mt-1.5 block">
        <StatusPill status={incident.status} />
      </span>
    </span>
    <ChevronRight className="w-4 h-4 shrink-0 text-[#8A9099]" aria-hidden="true" />
  </button>
);

/* ---------------- Home page ---------------- */

export const CitizenHomePage: React.FC<{
  nearby: Incident[];
  myReports: Incident[];
  onNavigate: (route: 'map' | 'report' | 'reports') => void;
}> = ({ nearby, myReports, onNavigate }) => {
  // Prototype loading state (no real network calls — data is local mock data).
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 700);
    return () => window.clearTimeout(timer);
  }, []);

  const activeReports = myReports.filter((r) => r.status !== 'resolved').length;

  return (
    <div className="citizen-page citizen-home">
      <section className="citizen-welcome">
        <p className="citizen-eyebrow">CIVICLENS · YOUR NEIGHBOURHOOD</p>
        <h1>{greetingForNow()}, Asha</h1>
        <p>Help improve your city — report what needs attention and follow what happens next.</p>
      </section>

      <ReportIssueCard onReport={() => onNavigate('report')} />

      <div className="citizen-home-grid">
        {/* -------- Around you: real interactive map -------- */}
        <section className="citizen-card citizen-around">
          <SectionHeading
            eyebrow="AROUND YOU"
            title="Issues reported near you"
            action="Open map"
            onAction={() => onNavigate('map')}
          />

          {mapError ? (
            <ErrorState
              title="Map unavailable"
              message="We couldn't load the map right now. You can retry, or browse issues by list instead."
              onRetry={() => setMapError(false)}
              secondaryLabel="Open map page"
              onSecondary={() => onNavigate('map')}
            />
          ) : isLoading ? (
            <div
              className="citizen-skeleton mt-4 citizen-map-preview-skeleton"
              aria-hidden="true"
            />
          ) : nearby.length ? (
            <>
              <div className="citizen-map-wrapper">
                <CivicMap
                  variant="citizen"
                  incidents={nearby}
                  height="100%"
                  className="citizen-map-preview"
                  onIssueClick={() => onNavigate('map')}
                />
              </div>
              <div className="citizen-nearby-list">
                {nearby.slice(0, 3).map((incident) => (
                  <NearbyIssueCard
                    key={incident.id}
                    incident={incident}
                    onClick={() => onNavigate('map')}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="mt-3">
              <EmptyState
                title="No reported issues nearby."
                message="Be the first to help your community."
                actionLabel="Report an issue"
                onAction={() => onNavigate('report')}
              />
            </div>
          )}
        </section>

        {/* -------- My reports -------- */}
        <section className="citizen-card citizen-my-reports">
          <SectionHeading
            eyebrow="MY REPORTS"
            title="What's happening with your reports"
            action="View all"
            onAction={() => onNavigate('reports')}
          />
          <p className="mt-1 text-xs text-[#7E8592]" aria-live="polite">
            {activeReports > 0
              ? `${activeReports} active report${activeReports === 1 ? '' : 's'}`
              : 'All caught up'}
          </p>
          <div className="mt-4 space-y-3">
            {myReports.length ? (
              myReports.map((incident) => (
                <MyReportCard
                  key={incident.id}
                  incident={incident}
                  onOpen={() => onNavigate('reports')}
                />
              ))
            ) : (
              <EmptyState
                title="No reports yet."
                message="You haven't reported anything yet."
                actionLabel="Report an issue"
                onAction={() => onNavigate('report')}
              />
            )}
          </div>
        </section>
      </div>

      {/* -------- Trust / transparency note -------- */}
      <aside className="citizen-trust-note">
        <ShieldCheck className="w-4 h-4" aria-hidden="true" />
        <p>
          Your report helps CivicLens identify patterns and recurring issues. Location and evidence
          may be used to help municipal teams investigate the issue. Prototype demo data — not live
          municipal information.
        </p>
      </aside>
    </div>
  );
};