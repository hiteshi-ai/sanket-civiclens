/**
 * Citizen navigation: sticky top header (logo, desktop nav, notifications,
 * profile) and mobile bottom navigation with an emphasized Report action.
 * Citizen navigation is intentionally separate from Admin navigation —
 * no Priority Queue, Analytics, Settings, or SANKET entries exist here.
 */
import React from 'react';
import { Bell, ClipboardList, Home, Map, Plus, UserRound } from 'lucide-react';
import { CivicLensLogo } from '../common/CivicLensLogo';
import type { CitizenRoute } from './citizenData';

const NAV_ITEMS: { id: CitizenRoute; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'map', label: 'Map', Icon: Map },
  { id: 'report', label: 'Report', Icon: Plus },
  { id: 'reports', label: 'Reports', Icon: ClipboardList },
  { id: 'profile', label: 'Me', Icon: UserRound },
];

export const CitizenHeader: React.FC<{
  active: CitizenRoute;
  unreadCount: number;
  onNavigate: (route: CitizenRoute) => void;
  onNotifications: () => void;
}> = ({ active, unreadCount, onNavigate, onNotifications }) => (
  <header className="citizen-header">
    <div className="citizen-frame citizen-header-inner">
      <button onClick={() => onNavigate('home')} aria-label="CivicLens citizen home" className="shrink-0">
        <CivicLensLogo compact />
      </button>
      <nav className="citizen-desktop-nav" aria-label="Citizen navigation">
        {(['home', 'map', 'reports'] as CitizenRoute[]).map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={active === item ? 'is-active' : ''}
            aria-current={active === item ? 'page' : undefined}
          >
            {item === 'home' ? 'Home' : item === 'map' ? 'Map' : 'My Reports'}
          </button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        <button className="citizen-icon-button" onClick={onNotifications} aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}>
          <Bell className="w-4 h-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="citizen-badge" aria-hidden="true">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button className="citizen-avatar-button" onClick={() => onNavigate('profile')} aria-label="Open profile">
          AS
        </button>
      </div>
    </div>
  </header>
);

export const CitizenBottomNav: React.FC<{
  active: CitizenRoute;
  onNavigate: (route: CitizenRoute) => void;
}> = ({ active, onNavigate }) => (
  <nav className="citizen-bottom-nav" aria-label="Citizen navigation">
    {NAV_ITEMS.map(({ id, label, Icon }) => (
      <button
        key={id}
        onClick={() => onNavigate(id)}
        className={`${active === id ? 'is-active' : ''} ${id === 'report' ? 'is-report' : ''}`}
        aria-current={active === id ? 'page' : undefined}
      >
        <span aria-hidden="true">
          <Icon className="w-4 h-4" />
        </span>
        <b>{label}</b>
      </button>
    ))}
  </nav>
);