/**
 * FieldWorkspace — the main Field Worker frame.
 *
 * A separate, operational workspace within CivicLens: ASSIGNED → UNDERSTAND →
 * NAVIGATE → EXECUTE → CAPTURE → SUBMIT → VERIFY. Reuses the SAME incident
 * model and the SAME shared Leaflet map as Admin/Citizen.
 *
 * Routes (wired in App.tsx):
 *   /field            → Home
 *   /field/jobs       → Work queue
 *   /field/jobs/:id   → Job detail
 *   /field/map        → Field map
 *   /field/history    → Completed jobs
 *   /field/profile    → Profile + prototype workspace switcher
 */
import React, { useMemo, useState } from 'react';
import './field.css';
import { useCivic } from '../../context/CivicContext';
import type { Incident } from '../../types/civic';
import { toCompletedJobs, toMyJobs } from './fieldData';
import type { FieldRoute } from './fieldData';
import { FieldBottomNav, FieldHeader } from './FieldShell';
import {
  FieldHistoryPage,
  FieldHomePage,
  FieldJobsPage,
  FieldMapPage,
  FieldNotifications,
  FieldProfilePage,
} from './FieldPages';
import { FieldJobDetail } from './FieldJobDetail';

export type { FieldRoute } from './fieldData';

export const FieldWorkspace: React.FC<{
  route: FieldRoute;
  jobId?: string | null;
  onNavigate: (path: string) => void;
}> = ({ route, jobId, onNavigate }) => {
  const { incidents, notifications, unreadNotificationCount } = useCivic();
  const [showNotifications, setShowNotifications] = useState(false);

  const go = (next: FieldRoute) => onNavigate(
    next === 'home'
      ? '/field'
      : next === 'jobs'
        ? '/field/jobs'
        : next === 'map'
          ? '/field/map'
          : next === 'history'
            ? '/field/history'
            : '/field/profile'
  );

  // Prototype: this worker's assigned jobs + completed jobs (shared model).
  const myJobs = useMemo<Incident[]>(() => toMyJobs(incidents), [incidents]);
  const completed = useMemo<Incident[]>(() => toCompletedJobs(incidents), [incidents]);

  const openJob = (id: string) => onNavigate(`/field/jobs/${id}`);

  return (
    <div className="field-workspace">
      <a href="#field-main" className="fw-skip-link">
        Skip to main content
      </a>

      <FieldHeader
        active={route}
        unreadCount={unreadNotificationCount}
        onNavigate={go}
        onNotifications={() => setShowNotifications(true)}
      />

      <main id="field-main" className="fw-frame fw-main">
        {route === 'home' && (
          <FieldHomePage jobs={myJobs} onOpenJob={openJob} onNavigate={go} />
        )}
        {route === 'jobs' && !jobId && <FieldJobsPage jobs={myJobs} onOpenJob={openJob} />}
        {route === 'map' && <FieldMapPage jobs={myJobs} onOpenJob={openJob} />}
        {route === 'history' && <FieldHistoryPage completed={completed} />}
        {route === 'profile' && <FieldProfilePage onNavigate={onNavigate} />}
        {/* Job detail is rendered on the jobs route when an id is present */}
        {jobId && route === 'jobs' && <FieldJobDetail key={jobId} incidentId={jobId} />}
      </main>

      <FieldBottomNav active={route} onNavigate={go} />

      {showNotifications && (
        <FieldNotifications
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};