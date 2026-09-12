import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import { IssueVolumeByDomain } from './IssueVolumeByDomain';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  PieChart,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Users
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { incidents } = useCivic();

  const total = incidents.length;
  const highRisk = incidents.filter((i) => i.riskScore >= 70).length;
  const recurring = incidents.filter((i) => i.isRecurring).length;
  const resolved = incidents.filter((i) => i.status === 'resolved').length;
  const waitingTooLong = incidents.filter((i) => i.waitingDays >= 30).length;
  const highRiskResolved = incidents.filter((i) => i.riskScore >= 70 && i.status === 'resolved').length;
  const highRiskResolutionRate = highRisk > 0 ? Math.round((highRiskResolved / highRisk) * 100) : null;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E3DC]">
        <div>
          <h1 className="text-2xl font-black text-[#191B1F] tracking-tight">
            Municipal Intelligence Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#565C68] mt-0.5">
            Operational trends, infrastructure recurrence, and verification telemetry across sectors.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge label="BACKEND TELEMETRY" />
        </div>
      </div>

      {/* Top Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#FDF0ED] text-[#C54E38] shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#C54E38] uppercase tracking-wider block">
              Emerging Pattern
            </span>
            <p className="text-xs font-bold text-[#191B1F] mt-0.5">
              {recurring > 0 ? `${recurring} recurring locations identified` : 'No recurring pattern available'}
            </p>
            <p className="text-[11px] text-[#565C68] mt-1 leading-snug">
              {recurring > 0 ? 'Recurring status is derived from backend incident evidence.' : 'Historical recurrence data is unavailable.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#FDF6EC] text-[#C88427] shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#C88427] uppercase tracking-wider block">
              Aging SLA Notice
            </span>
            <p className="text-xs font-bold text-[#191B1F] mt-0.5">
              {waitingTooLong > 0 ? `${waitingTooLong} issues exceeded the 30-day waiting threshold` : 'No issues exceeded the 30-day waiting threshold'}
            </p>
            <p className="text-[11px] text-[#565C68] mt-1 leading-snug">
              Waiting-time figures are calculated from incident timestamps returned by the backend.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#EBF7EF] text-[#1E6B42] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#1E6B42] uppercase tracking-wider block">
              Closure Quality Index
            </span>
            <p className="text-xs font-bold text-[#191B1F] mt-0.5">
              Closure match rate unavailable
            </p>
            <p className="text-[11px] text-[#565C68] mt-1 leading-snug">
              No verified closure-match evidence is currently available from the backend.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
          <span className="text-xs text-[#7E8592] font-semibold uppercase tracking-wider block">
            Avg. Turnaround Time
          </span>
          <div className="text-2xl font-black font-mono text-[#191B1F] mt-1">
            — <span className="text-xs font-medium text-[#7E8592]">Unavailable</span>
          </div>
          <span className="text-[11px] text-[#1E6B42] font-medium flex items-center gap-0.5 mt-1">
            No historical comparison available
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
          <span className="text-xs text-[#7E8592] font-semibold uppercase tracking-wider block">
            Citizen Signal Intake
          </span>
          <div className="text-2xl font-black font-mono text-[#191B1F] mt-1">
            {total} <span className="text-xs font-medium text-[#7E8592]">Loaded</span>
          </div>
          <span className="text-[11px] text-[#2C5E48] font-medium flex items-center gap-0.5 mt-1">
            {total > 0 ? `${Math.round((incidents.filter((i) => i.confidenceScore >= 50).length / total) * 100)}% at or above confidence threshold` : 'Confidence unavailable'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
          <span className="text-xs text-[#7E8592] font-semibold uppercase tracking-wider block">
            Recurrence Frequency
          </span>
          <div className="text-2xl font-black font-mono text-[#C88427] mt-1">
            {recurring} <span className="text-xs font-medium text-[#7E8592]">Hotspots</span>
          </div>
          <span className="text-[11px] text-[#565C68] font-medium block mt-1">
            Backend recurrence records only; budget data unavailable
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
          <span className="text-xs text-[#7E8592] font-semibold uppercase tracking-wider block">
            High-Risk Resolution Rate
          </span>
          <div className="text-2xl font-black font-mono text-[#2C5E48] mt-1">
            {highRiskResolutionRate == null ? '—' : `${highRiskResolutionRate}%`}
          </div>
          <span className="text-[11px] text-[#1E6B42] font-medium block mt-1">
            {highRiskResolutionRate == null ? 'No high-risk resolution data' : 'Backend-derived resolved share'}
          </span>
        </div>
      </div>

      {/* Category Breakdown & Spatial Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Category Distribution (Upgraded Animated SANKET Intelligence Component) */}
        <IssueVolumeByDomain />


        {/* Operational Flow & Trust Attribution */}
        <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <h3 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              SANKET Decision Loop Architecture
            </h3>
            <span className="text-[11px] font-mono text-[#2C5E48] font-bold">Closed Loop</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between">
              <span className="font-semibold text-[#191B1F]">1. Citizen Signal Intake</span>
              <span className="text-[#565C68] font-mono">Vision AI + Geolocation</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between">
              <span className="font-semibold text-[#191B1F]">2. Civic Confidence Synthesis</span>
              <span className="text-[#2C5E48] font-bold font-mono">Backend-derived</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between">
              <span className="font-semibold text-[#191B1F]">3. Priority Aging Triage</span>
              <span className="text-[#C54E38] font-bold font-mono">Dynamic SLA Escalation</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between">
              <span className="font-semibold text-[#191B1F]">4. Field Officer Execution</span>
              <span className="text-[#565C68] font-mono">Mobile GPS Dispatch</span>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between">
              <span className="font-semibold text-[#191B1F]">5. Smart Closure & Memory Log</span>
              <span className="text-[#1E6B42] font-bold font-mono">Verification unavailable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
