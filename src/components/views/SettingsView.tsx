import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import {
  Sliders,
  ShieldCheck,
  Building2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Scale,
  Sparkles,
  MapPin,
  Camera,
  Layers,
  HelpCircle,
  FileCheck,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface SettingsState {
  confidenceThreshold: number;
  clusterRadius: number;
  recurrenceDays: number;
  agingDays: number;
  closureThreshold: number;
  severityWeight: number;
  impactWeight: number;
  exposureWeight: number;
  waitingWeight: number;
  requireGps: boolean;
  requireBeforePhoto: boolean;
  requireAfterPhoto: boolean;
  enableVisualMatch: boolean;
  enableHumanReview: boolean;
  showSourceAttribution: boolean;
  escalationEnabled: boolean;
  officialSourceVerification: boolean;
  demoTelemetry: boolean;
  showSourceMetadata: boolean;
  timestampSignals: boolean;
  allowUnsourcedClaims: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  confidenceThreshold: 85,
  clusterRadius: 100,
  recurrenceDays: 90,
  agingDays: 30,
  closureThreshold: 90,
  severityWeight: 35,
  impactWeight: 30,
  exposureWeight: 20,
  waitingWeight: 15,
  requireGps: true,
  requireBeforePhoto: true,
  requireAfterPhoto: true,
  enableVisualMatch: true,
  enableHumanReview: true,
  showSourceAttribution: true,
  escalationEnabled: true,
  officialSourceVerification: true,
  demoTelemetry: true,
  showSourceMetadata: true,
  timestampSignals: true,
  allowUnsourcedClaims: false
};

export const SettingsView: React.FC = () => {
  const { showToast } = useCivic();
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);

  const handleSliderChange = (field: keyof SettingsState, val: number) => {
    setSettings((prev) => ({ ...prev, [field]: val }));
  };

  const handleToggle = (field: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = () => {
    showToast(
      'Configuration Saved',
      'Rules are active for this session. Municipal thresholds updated.',
      'success'
    );
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    showToast(
      'Defaults Restored',
      'Operational configuration reset to prototype reference defaults.',
      'info'
    );
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-12 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#191B1F] tracking-tight">
              Settings & Rules
            </h1>
            <DemoBadge label="MUNICIPAL CONTROL ROOM" />
          </div>
          <p className="text-xs sm:text-sm text-[#565C68] mt-0.5 leading-relaxed">
            Configure operational rules, intelligence thresholds, SLA behavior, verification requirements, and system controls.
          </p>
        </div>

        {/* Top-Right Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EBF7EF] border border-[#C8EAD4] text-xs font-semibold text-[#1E6B42] self-start sm:self-auto shrink-0 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#1E6B42] animate-pulse"></span>
          <span>Configuration Active</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1 — MUNICIPAL OPERATING CONTEXT                   */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#2C5E48]" />
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Municipal Operating Context
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#7E8592]">
            Configuration version: v1.4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Organization</span>
            <span className="font-semibold text-[#191B1F] mt-0.5 block">Municipal Corporation Chandigarh</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Jurisdiction Zone</span>
            <span className="font-semibold text-[#191B1F] mt-0.5 block">Zone 1 (Sectors 1–30)</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Operational Role</span>
            <span className="font-semibold text-[#191B1F] mt-0.5 block">PWD Ops Lead</span>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Last Configuration Update</span>
            <span className="font-semibold text-[#565C68] mt-0.5 block">Today • 22:35 IST</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2 — SANKET INTELLIGENCE RULES                     */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div>
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              SANKET Intelligence Rules
            </h2>
            <p className="text-[11px] text-[#7E8592] mt-0.5">
              Rules controlling how civic signals are combined, prioritized, aged, and verified.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FAF9F5] text-[#565C68] border border-[#E5E3DC]">
            Prototype decision rules
          </span>
        </div>

        <div className="space-y-4">
          {/* RULE 01 */}
          <div className="p-4 rounded-xl border border-[#E5E3DC] bg-[#FAF9F5]/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#2C5E48] bg-[#EBF3EE] px-1.5 py-0.5 rounded">
                    RULE 01
                  </span>
                  <h3 className="text-xs font-bold text-[#191B1F]">
                    Civic Confidence Threshold
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EBF7EF] text-[#1E6B42]">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#565C68] mt-1 leading-relaxed">
                  Minimum confidence required before independent citizen reports are synthesized into a high-confidence incident cluster.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-[#1E6B42]">
                  {settings.confidenceThreshold}%
                </span>
                <span className="block text-[10px] text-[#7E8592]">Current threshold</span>
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="60"
                max="98"
                value={settings.confidenceThreshold}
                onChange={(e) => handleSliderChange('confidenceThreshold', Number(e.target.value))}
                className="w-full accent-[#1E6B42]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#7E8592]">
                <span>Relaxed (60%)</span>
                <span>Configured: {settings.confidenceThreshold}%</span>
                <span>Strict (98%)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-[#E5E3DC] text-[11px] text-[#565C68] leading-tight flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-[#2C5E48] shrink-0 mt-0.5" />
              <span>
                "Confidence is synthesized from independent reports, spatial agreement, temporal clustering, and visual similarity."
              </span>
            </div>
          </div>

          {/* RULE 02 */}
          <div className="p-4 rounded-xl border border-[#E5E3DC] bg-[#FAF9F5]/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#2C5E48] bg-[#EBF3EE] px-1.5 py-0.5 rounded">
                    RULE 02
                  </span>
                  <h3 className="text-xs font-bold text-[#191B1F]">
                    Incident Cluster Radius
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EBF7EF] text-[#1E6B42]">
                    Active
                  </span>
                </div>
                <p className="text-xs text-[#565C68] mt-1 leading-relaxed">
                  Maximum spatial distance used when evaluating whether multiple reports may refer to the same underlying incident.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-[#191B1F]">
                  {settings.clusterRadius} m
                </span>
                <span className="block text-[10px] text-[#7E8592]">Current radius</span>
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="25"
                max="500"
                step="25"
                value={settings.clusterRadius}
                onChange={(e) => handleSliderChange('clusterRadius', Number(e.target.value))}
                className="w-full accent-[#2C5E48]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#7E8592]">
                <span>Tight (25m)</span>
                <span>Configured: {settings.clusterRadius}m</span>
                <span>Broad (500m)</span>
              </div>
            </div>
          </div>

          {/* RULE 03 */}
          <div className="p-4 rounded-xl border border-[#E5E3DC] bg-[#FAF9F5]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-[#C88427] bg-[#FDF6EC] px-1.5 py-0.5 rounded">
                  RULE 03
                </span>
                <h3 className="text-xs font-bold text-[#191B1F]">
                  Civic Memory Recurrence Window
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#EBF7EF] text-[#1E6B42]">
                  Active
                </span>
              </div>
              <p className="text-xs text-[#565C68] mt-1 leading-relaxed">
                Time window used by Civic Memory to identify repeated infrastructure problems in the same area or category.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={settings.recurrenceDays}
                onChange={(e) => handleSliderChange('recurrenceDays', Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg border border-[#E5E3DC] bg-white font-mono font-bold text-xs text-[#191B1F] focus:outline-none focus:border-[#2C5E48]"
              >
                <option value={30}>30 Days (Fast Cycle)</option>
                <option value={60}>60 Days (Bi-monthly)</option>
                <option value={90}>90 Days (Quarterly / Standard)</option>
                <option value={180}>180 Days (Seasonal)</option>
                <option value={365}>365 Days (Annual)</option>
              </select>
            </div>
          </div>

          {/* RULE 04 */}
          <div className="p-4 rounded-xl border border-[#E5E3DC] bg-[#FAF9F5]/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#C54E38] bg-[#FDF0ED] px-1.5 py-0.5 rounded">
                    RULE 04
                  </span>
                  <h3 className="text-xs font-bold text-[#191B1F]">
                    Priority Aging Threshold
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FDF0ED] text-[#C54E38]">
                    Dynamic SLA escalation
                  </span>
                </div>
                <p className="text-xs text-[#565C68] mt-1 leading-relaxed">
                  Issues exceeding this waiting period receive additional priority-aging weight so that long-waiting issues are not indefinitely deprioritized.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-[#C54E38]">
                  {settings.agingDays} days
                </span>
                <span className="block text-[10px] text-[#7E8592]">Escalation boundary</span>
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="7"
                max="60"
                step="1"
                value={settings.agingDays}
                onChange={(e) => handleSliderChange('agingDays', Number(e.target.value))}
                className="w-full accent-[#C54E38]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#7E8592]">
                <span>7 Days</span>
                <span>Configured: {settings.agingDays} Days</span>
                <span>60 Days</span>
              </div>
            </div>
          </div>

          {/* RULE 05 */}
          <div className="p-4 rounded-xl border border-[#E5E3DC] bg-[#FAF9F5]/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#1E6B42] bg-[#EBF7EF] px-1.5 py-0.5 rounded">
                    RULE 05
                  </span>
                  <h3 className="text-xs font-bold text-[#191B1F]">
                    Smart Closure Match Threshold
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
                    Human review below threshold
                  </span>
                </div>
                <p className="text-xs text-[#565C68] mt-1 leading-relaxed">
                  Minimum combined confidence required before an after-repair submission can be automatically matched to the original incident.
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-lg font-black font-mono text-[#1E6B42]">
                  {settings.closureThreshold}%
                </span>
                <span className="block text-[10px] text-[#7E8592]">Verification match</span>
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="range"
                min="70"
                max="98"
                value={settings.closureThreshold}
                onChange={(e) => handleSliderChange('closureThreshold', Number(e.target.value))}
                className="w-full accent-[#1E6B42]"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#7E8592]">
                <span>70% (Tolerant)</span>
                <span>Configured: {settings.closureThreshold}%</span>
                <span>98% (Strict)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 3 — PRIORITY RULES (PRIORITY & FAIRNESS)          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#2C5E48]" />
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Priority & Fairness Balancing
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
            Prototype configuration
          </span>
        </div>

        <p className="text-xs text-[#565C68] leading-relaxed">
          "Priority is not determined by severity alone. SANKET combines risk, impact, severity, and waiting time to reduce the chance that older unresolved issues are continuously overlooked."
        </p>

        {/* Conceptual Formula Callout */}
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-center text-center">
          <div className="font-mono text-xs font-bold text-[#191B1F]">
            Priority = <span className="text-[#C54E38]">Severity ({settings.severityWeight}%)</span> +{' '}
            <span className="text-[#C88427]">Impact ({settings.impactWeight}%)</span> +{' '}
            <span className="text-[#2C5E48]">Exposure ({settings.exposureWeight}%)</span> +{' '}
            <span className="text-[#565C68]">Waiting Factor ({settings.waitingWeight}%)</span>
          </div>
        </div>

        {/* Weights Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#191B1F]">Physical Severity Weight</span>
              <span className="font-mono font-bold text-[#C54E38]">{settings.severityWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={settings.severityWeight}
              onChange={(e) => handleSliderChange('severityWeight', Number(e.target.value))}
              className="w-full accent-[#C54E38]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#191B1F]">Transit & Public Impact Weight</span>
              <span className="font-mono font-bold text-[#C88427]">{settings.impactWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={settings.impactWeight}
              onChange={(e) => handleSliderChange('impactWeight', Number(e.target.value))}
              className="w-full accent-[#C88427]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#191B1F]">Critical Zone Exposure Weight</span>
              <span className="font-mono font-bold text-[#2C5E48]">{settings.exposureWeight}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={settings.exposureWeight}
              onChange={(e) => handleSliderChange('exposureWeight', Number(e.target.value))}
              className="w-full accent-[#2C5E48]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-[#191B1F]">Priority Aging Penalty Weight</span>
              <span className="font-mono font-bold text-[#565C68]">{settings.waitingWeight}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="35"
              value={settings.waitingWeight}
              onChange={(e) => handleSliderChange('waitingWeight', Number(e.target.value))}
              className="w-full accent-[#565C68]"
            />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 4 — VERIFICATION & TRUST                          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1E6B42]" />
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Verification & Trust Requirements
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#7E8592]">
            Evidence-First Protocols
          </span>
        </div>

        <div className="divide-y divide-[#F4F3EF]">
          {[
            {
              id: 'requireGps',
              label: 'Require GPS location metadata',
              desc: 'Use location metadata when available to strengthen incident and closure matching.',
              val: settings.requireGps
            },
            {
              id: 'requireBeforePhoto',
              label: 'Require before-repair photographic evidence',
              desc: 'Mandate initial citizen or intake imagery before field work dispatch.',
              val: settings.requireBeforePhoto
            },
            {
              id: 'requireAfterPhoto',
              label: 'Require after-repair field verification evidence',
              desc: 'Mandate field officer photographic submission before marking an issue resolved.',
              val: settings.requireAfterPhoto
            },
            {
              id: 'enableVisualMatch',
              label: 'Enable computer vision similarity check',
              desc: 'Run SANKET computer vision comparison between before and after images.',
              val: settings.enableVisualMatch
            },
            {
              id: 'enableHumanReview',
              label: 'Enable human review for low-confidence closure',
              desc: 'Flag repairs with <90% match for supervisory physical audit rather than silent closure.',
              val: settings.enableHumanReview
            },
            {
              id: 'showSourceAttribution',
              label: 'Show evidence source on incident detail',
              desc: 'Expose citizen app, sensor, or traffic camera source attribution on all cards.',
              val: settings.showSourceAttribution
            }
          ].map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-[#191B1F]">{item.label}</h3>
                <p className="text-[11px] text-[#565C68] mt-0.5">{item.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle(item.id as keyof SettingsState)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 cursor-pointer ${
                  item.val ? 'bg-[#1E6B42]' : 'bg-[#DCDAD2]'
                }`}
                aria-label={item.label}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    item.val ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 5 — SLA & ESCALATION RULES                        */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C88427]" />
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              SLA & Escalation Rules
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
            Prototype SLA configuration
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-[#E5E3DC]">
            <thead className="bg-[#FAF9F5] text-[10px] uppercase font-bold text-[#7E8592]">
              <tr>
                <th className="px-3 py-2">Urgency Tier</th>
                <th className="px-3 py-2">Turnaround SLA</th>
                <th className="px-3 py-2">Escalation Action</th>
                <th className="px-3 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F3EF] font-mono">
              <tr>
                <td className="px-3 py-2.5 font-bold text-[#C54E38]">Critical Risk</td>
                <td className="px-3 py-2.5">24 hours</td>
                <td className="px-3 py-2.5 font-sans text-[#191B1F]">Immediate supervisor escalation & SMS alert</td>
                <td className="px-3 py-2.5 text-right font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF0ED] text-[#C54E38]">Enforced</span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-bold text-[#C88427]">High Risk</td>
                <td className="px-3 py-2.5">72 hours</td>
                <td className="px-3 py-2.5 font-sans text-[#191B1F]">Zone lead notification & priority queue top-sort</td>
                <td className="px-3 py-2.5 text-right font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FDF6EC] text-[#C88427]">Enforced</span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-bold text-[#565C68]">Medium Risk</td>
                <td className="px-3 py-2.5">7 days</td>
                <td className="px-3 py-2.5 font-sans text-[#565C68]">Weekly backlog audit reminder</td>
                <td className="px-3 py-2.5 text-right font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F3EF] text-[#565C68]">Standard</span>
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2.5 font-bold text-[#7E8592]">Low Risk</td>
                <td className="px-3 py-2.5">14 days</td>
                <td className="px-3 py-2.5 font-sans text-[#7E8592]">Standard batch assignment</td>
                <td className="px-3 py-2.5 text-right font-sans">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F4F3EF] text-[#7E8592]">Standard</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#F4F3EF]">
          <span className="text-xs text-[#565C68] font-semibold">Automatic Dynamic SLA Escalation Engine</span>
          <button
            type="button"
            onClick={() => handleToggle('escalationEnabled')}
            className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
              settings.escalationEnabled
                ? 'bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4]'
                : 'bg-[#F4F3EF] text-[#7E8592]'
            }`}
          >
            {settings.escalationEnabled ? 'Escalation Enabled ✓' : 'Escalation Paused'}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 6 — DATA TRUST & SOURCES                          */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
            Data Trust & Provenance Controls
          </h2>
          <DemoBadge label="PRODUCT TRUTH LAYER" />
        </div>

        {/* Warning Style Explanation Box */}
        <div className="p-3.5 rounded-xl bg-[#FDF6EC] border border-[#F9E8CE] flex items-start gap-2.5 text-xs text-[#8F5A17] leading-relaxed">
          <AlertTriangle className="w-4 h-4 text-[#C88427] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#191B1F] block mb-0.5">Municipal Data Policy Notice</span>
            Intelligence cards must display source, timestamp, and verification state whenever external or official data is used. Unverified synthetic claims are quarantined from production dispatch.
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { id: 'officialSourceVerification', label: 'Official-source verification badge', val: settings.officialSourceVerification },
            { id: 'demoTelemetry', label: 'Explicit DEMO DATA labels', val: settings.demoTelemetry },
            { id: 'showSourceMetadata', label: 'Show contributing source metadata', val: settings.showSourceMetadata },
            { id: 'timestampSignals', label: 'Timestamp all intelligence signals', val: settings.timestampSignals },
            { id: 'allowUnsourcedClaims', label: 'Allow unsourced external claims', val: settings.allowUnsourcedClaims }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggle(item.id as keyof SettingsState)}
              className="p-3 rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] flex items-center justify-between cursor-pointer hover:bg-white transition-colors"
            >
              <span className="font-semibold text-[#191B1F]">{item.label}</span>
              <span
                className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                  item.val
                    ? 'bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4]'
                    : 'bg-[#F4F3EF] text-[#7E8592] border border-[#E5E3DC]'
                }`}
              >
                {item.val ? 'ON' : 'OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 7 — SAVE / RESET                                  */}
      {/* ========================================================= */}
      <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <span className="text-xs text-[#7E8592] font-mono">
          Session settings will apply across all operational views.
        </span>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#565C68] border border-[#E5E3DC] hover:bg-[#ECEAE3] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#7E8592]" />
            <span>Reset Prototype Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold bg-[#2C5E48] hover:bg-[#1E4333] text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </div>
    </div>
  );
};
