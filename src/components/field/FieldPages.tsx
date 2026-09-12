/**
 * Field Worker pages: Home, Jobs queue, Map, History, Profile + Notifications.
 *
 * - Home/Queue: actionable assigned work ("What do I need to fix?").
 * - Map: SAME shared Leaflet CivicMap (public layer, no Admin intelligence),
 *   with the worker's own approximate location.
 * - History: completed/verified jobs, lightweight.
 * - Profile: worker identity, workspace switcher.
 */
import React, { useMemo, useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  HardHat,
  Landmark,
  LifeBuoy,
  LogOut,
  Map,
  MapPin,
  Play,
  Repeat,
  ShieldCheck,
  X,
} from 'lucide-react';
import { CivicMap } from '../common/CivicMap';
import type { CivicNotification, Incident } from '../../types/civic';
import { useCivic } from '../../context/CivicContext';
import { useAuth } from '../../context/AuthContext';
import { greetingForNow, useCitizenLocation } from '../citizen/useCitizenLocation';
import { categoryTitle, FIELD_STATUS, jobPriority, navigateTo, sortJobQueue } from './fieldData';
import type { FieldRoute } from './fieldData';

/* ---------------- Shared bits ---------------- */

export const JobStatusPill: React.FC<{ status: Incident['status'] }> = ({ status }) => {
  const info = FIELD_STATUS[status];
  return (
    <span className={`fw-status fw-status-${info.tone}`}>
      <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
      {info.label}
    </span>
  );
};

export const SectionHeading: React.FC<{
  eyebrow?: string;
  title: string;
  action?: string;
  onAction?: () => void;
}> = ({ eyebrow, title, action, onAction }) => (
  <div className="flex items-end justify-between gap-3">
    <div>
      {eyebrow && <p className="fw-eyebrow">{eyebrow}</p>}
      <h2 className="mt-1 text-lg font-extrabold tracking-[-.035em] text-[#191B1F]">{title}</h2>
    </div>
    {action && (
      <button className="fw-text-action" onClick={onAction}>
        {action}
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    )}
  </div>
);

/* ---------------- Job card ---------------- */

export const JobCard: React.FC<{ incident: Incident; onOpen: () => void }> = ({
  incident,
  onOpen,
}) => {
  const priority = jobPriority(incident);
  return (
    <button
      onClick={onOpen}
      className={`fw-job-card fw-priority-${priority.tone}`}
      aria-label={`${priority.label}: ${categoryTitle(incident)} in ${incident.sector}. ${incident.waitingDays} days waiting. View job.`}
    >
      <span className={`fw-priority-flag tone-${priority.tone}`}>{priority.label}</span>
      <span className="fw-job-title">{categoryTitle(incident)}</span>
      <div className="fw-job-meta">
        <span>
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {incident.sector}
        </span>
        <span>
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {incident.waitingDays} days waiting
        </span>
        {incident.isRecurring && (
          <span>
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
            Recurring location
          </span>
        )}
      </div>
      <div className="fw-job-foot">
        <JobStatusPill status={incident.status} />
        <span className="fw-text-action">
          View job <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </button>
  );
};

/* =================================================================
 * HOME
 * ================================================================= */

export const FieldHomePage: React.FC<{
  jobs: Incident[];
  onOpenJob: (id: string) => void;
  onNavigate: (route: FieldRoute) => void;
}> = ({ jobs, onOpenJob }) => {
  const sorted = useMemo(() => sortJobQueue(jobs), [jobs]);
  const inProgress = jobs.filter((j) => j.status === 'in_progress').length;
  const pending = jobs.filter((j) => j.status === 'assigned').length;

  return (
    <div className="fw-page">
      <section className="fw-welcome">
        <p className="fw-eyebrow">
          TODAY'S WORK ·{' '}
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'short',
          })}
        </p>
        <h1>{greetingForNow()}, Raj</h1>
        <p>
          {jobs.length
            ? `You have ${jobs.length} assigned incident${jobs.length === 1 ? '' : 's'}. Highest priority first.`
            : 'No jobs assigned right now — new assignments will appear here.'}
        </p>
      </section>

      <div className="fw-summary-row" role="list" aria-label="Work summary">
        <div className="fw-summary-card" role="listitem">
          <b>{jobs.length}</b>
          <span>Assigned</span>
        </div>
        <div className="fw-summary-card is-rust" role="listitem">
          <b>{sorted.filter((j) => jobPriority(j).label === 'High Priority').length}</b>
          <span>High Priority</span>
        </div>
        <div className="fw-summary-card is-teal" role="listitem">
          <b>{inProgress}</b>
          <span>In Progress</span>
        </div>
        <div className="fw-summary-card is-slate" role="listitem">
          <b>{pending}</b>
          <span>Pending Start</span>
        </div>
      </div>

      {/* -------- Quick actions -------- */}
      <div className="fw-quick-actions">
        <button onClick={() => sorted[0] && onOpenJob(sorted[0].id)}>
          <HardHat className="h-4 w-4" aria-hidden="true" />
          Priority job
        </button>
        <button onClick={() => navigateTo('/field/map')}>
          <Map className="h-4 w-4" aria-hidden="true" />
          Open map
        </button>
        <button
          onClick={() => {
            const active = jobs.find((j) => j.status === 'in_progress');
            if (active) onOpenJob(active.id);
          }}
          disabled={!jobs.some((j) => j.status === 'in_progress')}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Continue job
        </button>
      </div>

      {/* -------- Queue -------- */}
      <section className="mt-6">
        <SectionHeading eyebrow="TODAY'S ASSIGNMENTS" title="Your work queue" />
        {sorted.length ? (
          <div className="mt-4 space-y-3">
            {sorted.map((incident) => (
              <JobCard
                key={incident.id}
                incident={incident}
                onOpen={() => onOpenJob(incident.id)}
              />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[#565C68]">
            All assigned work is complete. New assignments will appear here.
          </p>
        )}
      </section>
    </div>
  );
};

/* ---------------- Jobs list ---------------- */

export const FieldJobsPage: React.FC<{
  jobs: Incident[];
  onOpenJob: (id: string) => void;
}> = ({ jobs, onOpenJob }) => {
  const sorted = useMemo(() => sortJobQueue(jobs), [jobs]);
  return (
    <div className="fw-page">
      <SectionHeading eyebrow="WORK QUEUE" title="Assigned jobs" />
      <p className="mt-1 text-sm text-[#565C68]">
        {sorted.length} job{sorted.length === 1 ? '' : 's'} in your queue, ordered by priority.
      </p>
      <div className="mt-4 space-y-3">
        {sorted.map((incident) => (
          <JobCard key={incident.id} incident={incident} onOpen={() => onOpenJob(incident.id)} />
        ))}
      </div>
    </div>
  );
};

/* =================================================================
 * MAP
 * ================================================================= */

export const FieldMapPage: React.FC<{
  jobs: Incident[];
  onOpenJob: (id: string) => void;
}> = ({ jobs, onOpenJob }) => {
  const [selectedId, setSelectedId] = useState<string | null>(jobs[0]?.id ?? null);
  const { coords } = useCitizenLocation();
  const selected = jobs.find((j) => j.id === selectedId) ?? null;

  return (
    <div className="fw-page">
      <SectionHeading eyebrow="FIELD MAP" title="Your job locations" />
      <p className="citizen-hint">
        Pan, zoom, and tap markers — the same interactive map used across CivicLens.
      </p>

      <div className="citizen-map-wrapper citizen-map-page-wrapper">
        <CivicMap
          variant="citizen"
          incidents={jobs}
          height="100%"
          selectedIncidentId={selectedId}
          onSelectIncident={(id) => setSelectedId(id)}
          onIssueClick={(id) => onOpenJob(id)}
          userLocation={coords}
          focusTarget={selected ? [selected.latitude, selected.longitude] : null}
        />
      </div>

      <p className="citizen-location-note">
        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
        Your approximate location appears when location permission is granted. Reporters' private
        locations are never shown.
      </p>
    </div>
  );
};

/* =================================================================
 * HISTORY
 * ================================================================= */

export const FieldHistoryPage: React.FC<{ completed: Incident[] }> = ({ completed }) => (
  <div className="fw-page">
    <SectionHeading eyebrow="COMPLETED" title="Your completed jobs" />
    <p className="mt-1 text-sm text-[#565C68]">
      Verified completions from the municipal team appear here.
    </p>
    <div className="mt-4 space-y-3">
      {completed.length ? (
        completed.map((incident) => (
          <article key={incident.id} className="fw-job-card" style={{ cursor: 'default' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="fw-job-title">{categoryTitle(incident)}</span>
                <div className="fw-job-meta">
                  <span>
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {incident.sector}
                  </span>
                  <span>
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    Completed{' '}
                    {new Date(incident.lastUpdated).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <JobStatusPill status={incident.status} />
            </div>
            <p className="mt-2 text-xs text-[#565C68]">
              {FIELD_STATUS[incident.status].explanation}
            </p>
          </article>
        ))
      ) : (
        <p className="text-sm text-[#565C68]">Completed jobs will appear here once verified.</p>
      )}
    </div>
  </div>
);

/* =================================================================
 * PROFILE
 * ================================================================= */

export const FieldProfilePage: React.FC<{
  onNavigate: (path: string) => void;
}> = ({ onNavigate }) => {
  const { showToast } = useCivic();
  const { user, logout } = useAuth();
  const [available, setAvailable] = useState(true);

  const name = user?.full_name || 'Officer Vikramaditya Sen';
  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'VS';
  const email = user?.email || 'field_demo@civiclens.in';

  return (
    <div className="fw-page">
      <SectionHeading eyebrow="PROFILE" title="Your field account" />

      <section className="citizen-profile-card">
        <div className="citizen-profile-avatar" aria-hidden="true">
          {initials}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-[#191B1F]">{name}</h2>
          <p className="text-xs text-[#565C68]">Field Operations · {email}</p>
          <p className="text-xs text-[#565C68]">PWD Engineering & Infrastructure · Zone 1</p>
        </div>
        <span className="fw-status fw-status-green ml-auto">
          <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
          Available
        </span>
      </section>

      <section className="citizen-settings-list" aria-label="Field Worker settings">
        <div className="citizen-settings-row">
          <span>
            <HardHat className="h-4 w-4" aria-hidden="true" />
            Available for assignments
          </span>
          <span className="citizen-switch">
            <input
              type="checkbox"
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
              aria-label="Available for assignments"
            />
            <em aria-hidden="true" />
          </span>
        </div>
        <button
          className="citizen-settings-row"
          onClick={() =>
            showToast('Help & support', 'Support is not part of this prototype yet.', 'info')
          }
        >
          <span>
            <LifeBuoy className="h-4 w-4" aria-hidden="true" />
            Help & support
          </span>
          <b>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </b>
        </button>
        <button
          className="citizen-settings-row"
          onClick={() => {
            logout();
            onNavigate('/');
          }}
          aria-label="Sign out and return to the workspace selection screen"
        >
          <span>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </span>
          <b>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </b>
        </button>
      </section>

      {/* -------- Prototype workspace switcher (demo only) -------- */}
      <section className="citizen-switcher" aria-labelledby="fw-switcher-title">
        <p className="fw-eyebrow" id="fw-switcher-title">
          PROTOTYPE WORKSPACE SWITCHER
        </p>
        <p className="mt-1 text-sm text-[#565C68]">
          Demo-only access to the other CivicLens workspaces. A real field account would not see
          this.
        </p>
        <div className="citizen-switcher-grid">
          <button onClick={() => onNavigate('/')}>
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Role selection
          </button>
          <button onClick={() => onNavigate('/citizen')}>
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            Citizen
          </button>
          <button onClick={() => onNavigate('/admin')}>
            <Landmark className="h-4 w-4" aria-hidden="true" />
            Municipal Admin
          </button>
        </div>
      </section>
    </div>
  );
};

/* =================================================================
 * NOTIFICATIONS PANEL
 * ================================================================= */

export const FieldNotifications: React.FC<{
  notifications: CivicNotification[];
  onClose: () => void;
}> = ({ notifications, onClose }) => {
  const { markNotificationRead, clearAllNotifications } = useCivic();

  return (
    <div
      className="citizen-notification-layer"
      role="dialog"
      aria-modal="true"
      aria-label="Field notifications"
    >
      <button className="absolute inset-0" onClick={onClose} aria-label="Close notifications" />
      <section>
        <div className="flex items-center justify-between">
          <div>
            <p className="fw-eyebrow">FIELD UPDATES</p>
            <h2 className="text-lg font-extrabold tracking-[-.03em]">Notifications</h2>
          </div>
          <button className="fw-icon-button" onClick={onClose} aria-label="Close notifications">
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {notifications.length ? (
          <>
            {notifications.slice(0, 6).map((n) => (
              <button
                key={n.id}
                className={`citizen-notification ${n.read ? '' : 'is-unread'}`}
                onClick={() => markNotificationRead(n.id)}
              >
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                <span>
                  <b>{n.title}</b>
                  <small>
                    {n.message} ·{' '}
                    {new Date(n.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </small>
                </span>
              </button>
            ))}
            <button className="fw-text-action mt-3 self-center" onClick={clearAllNotifications}>
              Mark all as read
            </button>
          </>
        ) : (
          <div className="citizen-notification-empty" role="status">
            <Bell className="mx-auto h-5 w-5" aria-hidden="true" />
            <p className="mt-2">You're all caught up.</p>
            <p className="text-xs text-[#7E8592]">
              Assignment and verification updates will appear here.
            </p>
          </div>
        )}

        <p className="citizen-confirm-fineprint mt-auto">
          <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
          Tap a notification to mark it as read.
        </p>
      </section>
    </div>
  );
};