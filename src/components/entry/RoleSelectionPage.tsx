import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Camera,
  ClipboardCheck,
  MapPin,
  Route,
  ScanLine,
  ShieldCheck,
  UsersRound
} from 'lucide-react';
import { CivicLensLogo } from '../common/CivicLensLogo';

type RoleId = 'citizen' | 'field-worker' | 'admin';

type Role = {
  id: RoleId;
  title: string;
  label: string;
  description: string;
  action: string;
  keywords: string[];
  route: string;
  entryTitle: string;
  steps: string[];
  Icon: React.ComponentType<{ className?: string }>;
  AccentIcon: React.ComponentType<{ className?: string }>;
  accent: string;
  accentSoft: string;
};

const roles: Role[] = [
  {
    id: 'citizen', title: 'Citizen', label: 'REPORT & TRACK',
    description: 'Spot a problem? Report it, follow its progress, and help build a clearer picture of your neighbourhood.',
    action: 'Continue as Citizen', keywords: ['Report', 'Track', 'Stay Informed'], route: '/citizen',
    entryTitle: 'Entering Citizen Workspace...', steps: ['REPORT', 'TRACK', 'STAY INFORMED'],
    Icon: UsersRound, AccentIcon: Camera, accent: '#24638F', accentSoft: '#EEF5F9'
  },
  {
    id: 'field-worker', title: 'Field Worker', label: 'EXECUTE & VERIFY',
    description: 'Turn prioritized incidents into action. Navigate to assigned issues, complete work, and submit repair evidence.',
    action: 'Continue as Field Worker', keywords: ['Assigned Work', 'Execute', 'Verify'], route: '/field',
    entryTitle: 'Entering Field Operations...', steps: ['ASSIGNED', 'EXECUTE', 'VERIFY'],
    Icon: Route, AccentIcon: ClipboardCheck, accent: '#B87522', accentSoft: '#FBF4E8'
  },
  {
    id: 'admin', title: 'Municipal Admin', label: 'MONITOR & DECIDE',
    description: "Understand what's happening across the city, prioritize intervention, and manage civic operations.",
    action: 'Open Command Center', keywords: ['Monitor', 'Prioritize', 'Manage'], route: '/admin',
    entryTitle: 'Entering Municipal Command Center...', steps: ['MONITOR', 'PRIORITIZE', 'DECIDE'],
    Icon: Building2, AccentIcon: ScanLine, accent: '#2C5E48', accentSoft: '#EBF3EE'
  }
];

const RoleCard: React.FC<{ role: Role; active: boolean; subdued: boolean; onSelect: (role: Role) => void }> = ({ role, active, subdued, onSelect }) => {
  const { Icon, AccentIcon } = role;
  return (
    <article className={`entry-role-card ${active ? 'is-active' : ''} ${subdued ? 'is-subdued' : ''}`} style={{ '--role-accent': role.accent, '--role-soft': role.accentSoft } as React.CSSProperties}>
      <div className="entry-card-topline" />
      <div className="flex items-start justify-between gap-4">
        <div className="entry-role-icon" aria-hidden="true"><Icon className="w-6 h-6" /></div>
        <AccentIcon className="entry-accent-icon w-4 h-4" aria-hidden="true" />
      </div>
      <div className="mt-7">
        <p className="entry-role-label">{role.label}</p>
        <h2 className="mt-2 text-[1.45rem] leading-tight font-extrabold tracking-[-0.04em] text-[#191B1F]">{role.title}</h2>
        <p className="mt-3 text-sm leading-6 text-[#565C68]">{role.description}</p>
      </div>
      <div className="mt-auto pt-7">
        <div className="entry-keywords" aria-label={`${role.title} capabilities`}>
          {role.keywords.map((word, index) => <React.Fragment key={word}><span>{word}</span>{index < role.keywords.length - 1 && <i>•</i>}</React.Fragment>)}
        </div>
        <button onClick={() => onSelect(role)} className="entry-role-action mt-5" aria-label={role.action}>
          <span>{active ? 'Preparing workspace…' : role.action}</span><ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
};

const WorkspaceTransition: React.FC<{ role: Role }> = ({ role }) => (
  <div className="entry-transition" role="status" aria-live="polite" style={{ '--role-accent': role.accent } as React.CSSProperties}>
    <div className="entry-transition-panel">
      <CivicLensLogo />
      <div className="mt-9 h-px w-10 bg-[#D8D5CC]" />
      <p className="mt-5 text-sm font-semibold text-[#565C68]">{role.entryTitle}</p>
      <div className="mt-7 flex flex-col items-center gap-1.5 text-xs font-bold tracking-[0.18em]" style={{ color: role.accent }}>
        {role.steps.map((step, index) => <React.Fragment key={step}><span>{step}</span>{index < role.steps.length - 1 && <span className="text-[#9BA0A7] leading-3">↓</span>}</React.Fragment>)}
      </div>
    </div>
  </div>
);

export const RoleSelectionPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const [hoveredRole, setHoveredRole] = useState<RoleId | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const selectRole = (role: Role) => {
    if (selectedRole) return;
    setSelectedRole(role);
    window.setTimeout(() => onNavigate(role.route), 680);
  };

  return (
    <main className="entry-page" onMouseLeave={() => setHoveredRole(null)}>
      <div className="entry-grid" aria-hidden="true" />
      <section className="entry-content">
        <div className="entry-brand entry-reveal-brand">
          <CivicLensLogo />
          <p>SEE ISSUES. SOLVE CITIES. TOGETHER.</p>
        </div>
        <div className="entry-intro entry-reveal-intro">
          <span className="entry-eyebrow"><ShieldCheck className="w-3.5 h-3.5" /> Civic intelligence, shared</span>
          <h1>How are you contributing<br className="hidden sm:block" /> to the city?</h1>
          <p>Choose your CivicLens workspace to continue.</p>
        </div>
        <div className="entry-role-grid" aria-label="Choose your CivicLens workspace">
          {roles.map((role, index) => (
            <div key={role.id} className={`entry-card-wrap entry-reveal-card-${index + 1}`} onMouseEnter={() => setHoveredRole(role.id)}>
              <RoleCard role={role} active={selectedRole?.id === role.id} subdued={Boolean((hoveredRole && hoveredRole !== role.id) || (selectedRole && selectedRole.id !== role.id))} onSelect={selectRole} />
            </div>
          ))}
        </div>
      </section>
      <footer className="entry-footer"><span>CivicLens <b>•</b> SANKET Intelligence Layer</span><span>Prototype / Demo Environment</span></footer>
      {selectedRole && <WorkspaceTransition role={selectedRole} />}
    </main>
  );
};
