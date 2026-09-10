import React from 'react';
import { useCivic } from '../../context/CivicContext';
import {
  RiskBadge,
  ConfidenceBadge,
  StatusBadge,
  CategoryBadge,
  DemoBadge
} from '../common/Badges';
import {
  X,
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  ShieldCheck,
  History,
  Layers,
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Send,
  HardHat,
  Eye,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { CivicMap } from '../common/CivicMap';

export const IncidentDetailDrawer: React.FC = () => {
  const {
    selectedIncident,
    incidents,
    isDetailOpen,
    setIsDetailOpen,
    setIsWhyScoreOpen,
    setIsEvidenceOpen,
    setIsSmartClosureOpen,
    assignTeam,
    setActiveTab
  } = useCivic();

  if (!isDetailOpen || !selectedIncident) return null;

  const inc = selectedIncident;
  const openSmartClosure = () => {
    setIsDetailOpen(false);
    setIsSmartClosureOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[2000] isolate bg-black/40 backdrop-blur-xs animate-fade-in p-0 lg:p-3">
      <section className="grid h-[100dvh] w-full min-w-0 min-h-0 grid-rows-[minmax(17rem,38dvh)_minmax(0,1fr)] overflow-hidden bg-[#FBFBF9] shadow-2xl lg:h-[calc(100dvh-1.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)] lg:grid-rows-1 lg:rounded-2xl" aria-label="Incident investigation workspace">
        <div className="min-w-0 min-h-0 border-b border-[#E5E3DC] bg-[#F4F3EF] p-3 lg:border-b-0 lg:border-r lg:p-4">
          <CivicMap
            incidents={incidents}
            selectedIncidentId={inc.id}
            height="100%"
            className="h-full"
          />
        </div>
        <div className="min-w-0 min-h-0 bg-[#FBFBF9] flex flex-col justify-between text-left overflow-hidden">
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-[#E5E3DC] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-xs font-mono font-bold text-[#565C68] bg-[#F4F3EF] px-2 py-0.5 rounded border border-[#E5E3DC]">
              {inc.ticketNumber}
            </span>
            <CategoryBadge category={inc.category} />
            <StatusBadge status={inc.status} />
            {inc.isRecurring && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-[#FDF6EC] text-[#C88427] border border-[#F9E8CE]">
                <History className="w-3 h-3" />
                Recurring ({inc.recurrenceCount}x)
              </span>
            )}
          </div>
          <button
            onClick={() => setIsDetailOpen(false)}
            className="p-1.5 rounded-lg text-[#7E8592] hover:bg-[#F4F3EF] hover:text-[#191B1F] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main Title & Spatial Context */}
          <div>
            <h2 className="text-xl font-bold text-[#191B1F] leading-snug">
              {inc.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#565C68] mt-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2C5E48] shrink-0" />
              <span className="font-semibold text-[#191B1F]">{inc.sector}, Chandigarh</span>
              <span>•</span>
              <span className="truncate">{inc.location}</span>
            </div>
          </div>

          {/* Citizen Report Evidence Card */}
          <div className="bg-white rounded-xl border border-[#E5E3DC] overflow-hidden">
            <div className="p-3.5 bg-[#FAF9F5] border-b border-[#E5E3DC] flex items-center justify-between text-xs">
              <span className="font-bold text-[#191B1F] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#2C5E48]" />
                Original Citizen Signal
              </span>
              <span className="text-[11px] text-[#7E8592] font-mono">
                Reported {inc.waitingDays} days ago ({new Date(inc.reportedAt).toLocaleDateString()})
              </span>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1 rounded-lg overflow-hidden border border-[#E5E3DC] h-32 sm:h-full">
                <img
                  src={inc.beforeImageUrl}
                  alt={inc.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="sm:col-span-2 space-y-2.5">
                <p className="text-xs text-[#191B1F] leading-relaxed">
                  "{inc.description}"
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#F4F3EF] text-[11px] text-[#565C68]">
                  <span className="bg-[#F4F3EF] px-2 py-0.5 rounded font-mono">
                    Related signals: <b>{inc.confidenceEvidence.relatedReportsCount}</b>
                  </span>
                  <span className="bg-[#F4F3EF] px-2 py-0.5 rounded">
                    Source: {inc.sourceAttribution}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* SANKET INTELLIGENCE SECTION                              */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#2C5E48]"></div>
                <h3 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
                  SANKET Municipal Intelligence
                </h3>
              </div>
              <DemoBadge label="OPERATIONAL AI SYNTHESIS" />
            </div>

            {/* 1. CIVIC RISK */}
            <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#565C68] uppercase tracking-wider block">
                    Civic Risk
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono text-[#C54E38]">
                      {inc.riskScore}
                    </span>
                    <span className="text-xs font-bold text-[#7E8592]">/ 100</span>
                    <span className="text-xs font-bold uppercase text-[#C54E38] bg-[#FDF0ED] px-2 py-0.5 rounded border border-[#F8D2CA]">
                      {inc.riskLevel} Priority
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsWhyScoreOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#2C5E48] hover:text-[#1E4333] hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why this score?</span>
                </button>
              </div>

              <p className="text-xs text-[#565C68] mt-2 leading-relaxed">
                {inc.riskReasoning}
              </p>

              {/* Compact 4-factor breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#F4F3EF] text-center">
                <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#7E8592] uppercase font-semibold block">Severity</span>
                  <span className="font-mono font-bold text-xs text-[#191B1F]">{inc.severity} / 10</span>
                </div>
                <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#7E8592] uppercase font-semibold block">Public Impact</span>
                  <span className="font-mono font-bold text-xs text-[#191B1F]">{inc.publicImpact} / 10</span>
                </div>
                <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#7E8592] uppercase font-semibold block">Location Exposure</span>
                  <span className="font-mono font-bold text-xs text-[#191B1F]">{inc.locationExposure} / 10</span>
                </div>
                <div className="bg-[#FAF9F5] p-2 rounded-lg border border-[#E5E3DC]">
                  <span className="text-[10px] text-[#7E8592] uppercase font-semibold block">Waiting Penalty</span>
                  <span className="font-mono font-bold text-xs text-[#191B1F]">{inc.waitingScore} / 10</span>
                </div>
              </div>
            </div>

            {/* 2. CIVIC CONFIDENCE */}
            <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#565C68] uppercase tracking-wider block">
                    Civic Confidence
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono text-[#1E6B42]">
                      {inc.confidenceScore}%
                    </span>
                    <span className="text-xs font-bold text-[#1E6B42] bg-[#EBF7EF] px-2 py-0.5 rounded border border-[#C8EAD4]">
                      HIGH CONFIDENCE
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEvidenceOpen(true)}
                  className="flex items-center gap-1 text-xs font-bold text-[#2C5E48] hover:text-[#1E4333] hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Evidence</span>
                </button>
              </div>

              {/* Why? Compact list */}
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-[#EBF7EF]/50 border border-[#C8EAD4] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B42] shrink-0" />
                  <span><b>{inc.confidenceEvidence.relatedReportsCount}</b> related reports</span>
                </div>
                <div className="p-2 rounded-lg bg-[#EBF7EF]/50 border border-[#C8EAD4] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B42] shrink-0" />
                  <span><b>{inc.confidenceEvidence.locationMatchRadiusMeters}m</b> GPS radius</span>
                </div>
                <div className="p-2 rounded-lg bg-[#EBF7EF]/50 border border-[#C8EAD4] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B42] shrink-0" />
                  <span><b>{inc.confidenceEvidence.visualSimilarityPercentage}%</b> visual match</span>
                </div>
                <div className="p-2 rounded-lg bg-[#EBF7EF]/50 border border-[#C8EAD4] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#1E6B42] shrink-0" />
                  <span>Strong time cluster</span>
                </div>
              </div>
            </div>

            {/* 3. CIVIC MEMORY (If recurring) */}
            {inc.isRecurring && (
              <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-[#C88427]" />
                    <span className="text-xs font-bold text-[#191B1F]">
                      Civic Memory: Recurring Infrastructure Hotspot
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('civic_memory');
                      setIsDetailOpen(false);
                    }}
                    className="text-xs font-bold text-[#2C5E48] hover:underline flex items-center gap-1"
                  >
                    <span>View History</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#565C68] mt-1.5 leading-relaxed">
                  {inc.rootCauseHypothesis ||
                    'Persistent subgrade degradation and repeated surface failures recorded at this location.'}
                </p>

                {/* Recurrence timeline: JAN -> APR -> AUG */}
                <div className="mt-3 p-3 bg-white rounded-lg border border-[#E5E3DC]">
                  <span className="text-[10px] font-bold text-[#7E8592] uppercase tracking-wider block mb-2">
                    Failure Sequence at this Coordinate
                  </span>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="text-center">
                      <span className="text-[10px] text-[#7E8592] block">JAN</span>
                      <span className="font-bold text-[#191B1F]">Pothole</span>
                      <span className="text-[9px] text-[#7E8592] block">Cold Mix</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C88427]" />
                    <div className="text-center">
                      <span className="text-[10px] text-[#7E8592] block">APR</span>
                      <span className="font-bold text-[#191B1F]">Road Crack</span>
                      <span className="text-[9px] text-[#7E8592] block">Slurry Seal</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-[#C88427]" />
                    <div className="text-center">
                      <span className="text-[10px] text-[#C54E38] font-bold block">AUG</span>
                      <span className="font-bold text-[#C54E38]">Pothole Cluster</span>
                      <span className="text-[9px] text-[#C54E38] block">Current</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRIORITY AGING */}
            <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#565C68] uppercase tracking-wider block">
                    Priority Aging
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-xl font-bold font-mono text-[#191B1F]">
                      Waiting {inc.waitingDays} Days
                    </span>
                    {inc.waitingDays >= 30 && (
                      <span className="text-xs font-bold text-[#C54E38] bg-[#FDF0ED] px-2 py-0.5 rounded border border-[#F8D2CA]">
                        SLA Threshold Crossed
                      </span>
                    )}
                  </div>
                </div>
                <Clock className="w-5 h-5 text-[#7E8592]" />
              </div>

              {/* Aging Timeline Steps */}
              <div className="mt-3 pt-3 border-t border-[#F4F3EF]">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {inc.agingCurve.map((step) => (
                    <div
                      key={step.day}
                      className={`p-2 rounded-lg border ${
                        step.isCurrent
                          ? 'bg-[#FDF0ED] border-[#F8D2CA] text-[#C54E38]'
                          : step.isPast
                          ? 'bg-[#FAF9F5] border-[#E5E3DC] text-[#191B1F]'
                          : 'bg-white border-[#E5E3DC] text-[#7E8592]'
                      }`}
                    >
                      <span className="text-[10px] font-mono block">Day {step.day}</span>
                      <span className="font-bold text-[11px] block">{step.riskBoost > 0 ? `+${step.riskBoost}` : 'Base'}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-[#7E8592] mt-2 italic text-center">
                  "Priority automatically escalates when an unresolved issue continues waiting."
                </p>
              </div>
            </div>

            {/* 5. SMART CLOSURE MATCH (If completed or available) */}
            {inc.afterImageUrl && (
              <div className="p-4 rounded-xl bg-[#EBF7EF] border border-[#C8EAD4] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#1E6B42] uppercase tracking-wider block">
                    SANKET Smart Closure Match
                  </span>
                  <p className="text-xs text-[#1E6B42] mt-0.5">
                    {inc.smartClosure?.matchConfidence || 96}% Likely Match • {inc.smartClosure?.distanceMeters || 8}m away
                  </p>
                </div>
                <button
                  onClick={openSmartClosure}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1E6B42] text-white hover:bg-[#185333] transition-colors shadow-xs"
                >
                  Verify Closure
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions Sticky Bar */}
        <div className="p-4 sm:p-5 border-t border-[#E5E3DC] bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#7E8592] flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-[#2C5E48]" />
            <span>Assigned: <b>{inc.assignedTeam || 'Unassigned'}</b></span>
          </div>

          <div className="flex items-center gap-2">
            {!inc.assignedTeam && (
              <button
                onClick={() => assignTeam(inc.id, 'PWD Fast Response Unit #4', 'Officer V. Sen')}
                className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#2C5E48] text-white hover:bg-[#1E4333] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Assign Team</span>
              </button>
            )}

            <button
              onClick={openSmartClosure}
              className="px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-[#191B1F] border border-[#E5E3DC] hover:bg-[#F4F3EF] transition-colors flex items-center gap-1.5"
            >
              <HardHat className="w-3.5 h-3.5 text-[#C88427]" />
              <span>Smart Closure Match</span>
            </button>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
};
