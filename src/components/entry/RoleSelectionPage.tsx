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

import { useAuth } from '../../context/AuthContext';

export const RoleSelectionPage: React.FC<{ onNavigate: (route: string) => void }> = ({ onNavigate }) => {
  const { login, register, demoLogin } = useAuth();
  const [hoveredRole, setHoveredRole] = useState<RoleId | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectRole = (role: Role) => {
    if (selectedRole) return;
    setSelectedRole(role);
    window.setTimeout(() => onNavigate(role.route), 680);
  };

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);
    try {
      let authedUser;
      if (isRegisterMode) {
        authedUser = await register({ email, password, full_name: fullName });
      } else {
        authedUser = await login(email, password);
      }
      setShowLoginModal(false);
      if (authedUser.role === 'FIELD_WORKER' || authedUser.role === 'FIELD_OFFICER') {
        onNavigate('/field');
      } else if (authedUser.role === 'MUNICIPAL_OFFICER' || authedUser.role === 'COMMAND_ADMIN' || authedUser.role === 'ADMIN') {
        onNavigate('/admin');
      } else {
        onNavigate('/citizen');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (roleType: 'citizen' | 'field' | 'admin') => {
    setAuthError(null);
    setIsSubmitting(true);
    try {
      const authed = await demoLogin(roleType);
      setShowLoginModal(false);
      if (authed.role === 'FIELD_WORKER' || authed.role === 'FIELD_OFFICER') {
        onNavigate('/field');
      } else if (authed.role === 'MUNICIPAL_OFFICER' || authed.role === 'COMMAND_ADMIN' || authed.role === 'ADMIN') {
        onNavigate('/admin');
      } else {
        onNavigate('/citizen');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Demo sign in failed.');
    } finally {
      setIsSubmitting(false);
    }
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

      <footer className="entry-footer">
        <span>CivicLens <b>•</b> SANKET Intelligence Layer</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-xs font-semibold text-[#2C5E48] hover:underline cursor-pointer"
          >
            Sign in with email &amp; password
          </button>
          <span>Production Verified</span>
        </div>
      </footer>

      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white border border-[#E5E3DC] rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-[#7E8592] hover:text-[#191B1F] text-lg font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#2C5E48]">SANKET × CivicLens</p>
              <h2 className="text-xl font-bold text-[#191B1F] mt-1">
                {isRegisterMode ? 'Create Citizen Account' : 'Sign in to CivicLens'}
              </h2>
              <p className="text-xs text-[#565C68] mt-1">Access is verified by backend role credentials.</p>
            </div>

            <form onSubmit={handleCustomAuth} className="space-y-3">
              {isRegisterMode && (
                <div>
                  <label className="block text-xs font-semibold text-[#565C68] mb-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2C5E48]"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-[#565C68] mb-1">Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. citizen_demo@civiclens.in"
                  className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2C5E48]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#565C68] mb-1">Password</label>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#E5E3DC] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2C5E48]"
                />
              </div>

              {authError && (
                <div className="rounded-lg bg-[#FDF0ED] border border-[#F8D2CA] text-[#C54E38] p-2.5 text-xs font-medium">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-[#2C5E48] hover:bg-[#1E4333] disabled:opacity-50 text-white font-bold py-2 text-sm cursor-pointer transition-colors"
              >
                {isSubmitting ? 'Authenticating…' : isRegisterMode ? 'Register Account' : 'Sign In'}
              </button>
            </form>

            <div className="pt-2 border-t border-[#E5E3DC] flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError(null);
                }}
                className="text-[#2C5E48] font-semibold hover:underline"
              >
                {isRegisterMode ? 'Already have an account? Sign in' : 'Need an account? Register'}
              </button>
            </div>

            <div className="pt-2 border-t border-[#E5E3DC]">
              <p className="text-[11px] font-bold text-[#7E8592] uppercase tracking-wider mb-2">Or quick sign in as:</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('citizen')}
                  className="px-2 py-1.5 rounded-md border border-[#E5E3DC] hover:bg-[#F4F3EF] text-xs font-semibold text-[#191B1F] text-center"
                >
                  Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('field')}
                  className="px-2 py-1.5 rounded-md border border-[#E5E3DC] hover:bg-[#F4F3EF] text-xs font-semibold text-[#191B1F] text-center"
                >
                  Field Worker
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="px-2 py-1.5 rounded-md border border-[#E5E3DC] hover:bg-[#F4F3EF] text-xs font-semibold text-[#191B1F] text-center"
                >
                  Municipal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedRole && <WorkspaceTransition role={selectedRole} />}
    </main>
  );
};
