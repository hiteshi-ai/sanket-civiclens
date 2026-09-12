/**
 * CitizenWorkspace — the main Citizen frame.
 *
 * A separate, simplified workspace within the CivicLens product:
 * REPORT → TRACK → STAY INFORMED. Citizens see outcomes, not internal
 * complexity (no SANKET scores, SLA config, or admin analytics).
 *
 * Routes (wired in App.tsx):
 *   /citizen          → Home
 *   /citizen/map      → Public nearby issues map
 *   /citizen/report   → Reporting flow
 *   /citizen/reports  → My reports
 *   /citizen/profile  → Profile + prototype workspace switcher
 */
import React, { useMemo, useState } from 'react';
import './citizen.css';
import { useCivic } from '../../context/CivicContext';
import type { Incident } from '../../types/civic';
import { CITIZEN_ROUTES, toCitizenIncidents, toMyReports, toNearbyIssues } from './citizenData';
import type { CitizenRoute } from './citizenData';
import { CitizenBottomNav, CitizenHeader } from './CitizenNavigation';
import { CitizenHomePage } from './CitizenHomePage';
import {
  CitizenMapPage,
  CitizenNotifications,
  CitizenProfilePage,
  CitizenReportsPage,
} from './CitizenPages';
import { CitizenReportFlow } from './CitizenReportFlow';

export type { CitizenRoute } from './citizenData';

export const CitizenWorkspace: React.FC<{
  route: CitizenRoute;
  onNavigate: (path: string) => void;
}> = ({ route, onNavigate }) => {
  const { incidents, notifications, unreadNotificationCount } = useCivic();
  const [showNotifications, setShowNotifications] = useState(false);

  const go = (next: CitizenRoute) => onNavigate(CITIZEN_ROUTES[next]);

  // Citizen-visible data: public civic information only, no private data.
  const citizenIncidents = useMemo<Incident[]>(() => toCitizenIncidents(incidents), [incidents]);
  const nearby = useMemo(() => toNearbyIssues(citizenIncidents), [citizenIncidents]);
  const myReports = useMemo(() => toMyReports(citizenIncidents), [citizenIncidents]);

  return (
    <div className="citizen-workspace">
      <a href="#citizen-main" className="citizen-skip-link">
        Skip to main content
      </a>

      <CitizenHeader
        active={route}
        unreadCount={unreadNotificationCount}
        onNavigate={go}
        onNotifications={() => setShowNotifications(true)}
      />

      <main id="citizen-main" className="citizen-frame citizen-main">
        {route === 'home' && (
          <CitizenHomePage nearby={nearby} myReports={myReports} onNavigate={go} />
        )}
        {route === 'map' && (
          <CitizenMapPage incidents={citizenIncidents} onReport={() => go('report')} />
        )}
        {route === 'report' && (
          <CitizenReportFlow onComplete={() => go('reports')} onCancel={() => go('home')} />
        )}
        {route === 'reports' && (
          <CitizenReportsPage myReports={myReports} onReport={() => go('report')} />
        )}
        {route === 'profile' && <CitizenProfilePage onNavigate={onNavigate} />}
      </main>

      <CitizenBottomNav active={route} onNavigate={go} />

      {showNotifications && (
        <CitizenNotifications
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onOpenReport={() => {
            setShowNotifications(false);
            go('reports');
          }}
        />
      )}
    </div>
  );
};