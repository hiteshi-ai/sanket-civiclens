/**
 * Field Worker navigation: sticky header (logo, zone chip, desktop nav,
 * notifications, profile) and mobile bottom navigation with an emphasized
 * Jobs action. Separate from Admin/Citizen navigation.
 */
import React from 'react';
import { Bell, ClipboardList, Home, Map, UserRound } from 'lucide-react';
import { CivicLensLogo } from '../common/CivicLensLogo';
import type { FieldRoute } from './fieldData';

const NAV_ITEMS: {
  id: FieldRoute;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'jobs', label: 'Jobs', Icon: ClipboardList },
  { id: 'map', label: 'Map', Icon: Map },
  { id: 'history', label: 'History', Icon: ClipboardList },
  { id: 'profile', label: 'Me', Icon: UserRound },
];

export const FieldHeader: React.FC<{
  active: FieldRoute;
  unreadCount: number;
  onNavigate: (route: FieldRoute) => void;
  onNotifications: () => void;
}> = ({ active, unreadCount, onNavigate, onNotifications }) => (
  <header className="fw-header">
    <div className="fw-frame fw-header-inner">
      <button
        onClick={() => onNavigate('home')}
        aria-label="CivicLens field operations home"
        className="shrink-0"
      >
        <CivicLensLogo compact />
      </button>
      <span className="fw-zone-chip">PWD · ZONE 1</span>
      <nav className="fw-desktop-nav" aria-label="Field navigation">
        {(['home', 'jobs', 'map', 'history'] as FieldRoute[]).map((item) => (
          <button
            key={item}
            onClick={() => onNavigate(item)}
            className={active === item ? 'is-active' : ''}
            aria-current={active === item ? 'page' : undefined}
          >
            {item === 'home' ? 'Home' : item === 'jobs' ? 'Jobs' : item === 'map' ? 'Map' : 'History'}
          </button>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        <button
          className="fw-icon-button"
          onClick={onNotifications}
          aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="fw-badge" aria-hidden="true">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button className="fw-avatar-button" onClick={() => onNavigate('profile')} aria-label="Open profile">
          RK
        </button>
      </div>
    </div>
  </header>
);

export const FieldBottomNav: React.FC<{
  active: FieldRoute;
  onNavigate: (route: FieldRoute) => void;
}> = ({ active, onNavigate }) => (
  <nav className="fw-bottom-nav" aria-label="Field Worker navigation">
    {NAV_ITEMS.map(({ id, label, Icon }) => (
      <button
        key={id}
        onClick={() => onNavigate(id)}
        className={`${active === id ? 'is-active' : ''} ${id === 'jobs' ? 'is-jobs' : ''}`}
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