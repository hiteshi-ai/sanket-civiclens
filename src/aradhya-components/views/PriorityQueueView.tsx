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
  ListOrdered,
  Flame,
  Clock,
  History,
  AlertTriangle,
  ArrowUpDown,
  Send,
  UserCheck,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  MapPin
} from 'lucide-react';

export const PriorityQueueView: React.FC = () => {
  const {
    incidents,
    selectedIncidentId,
    selectIncident,
    selectedIncident,
    queueFilter,
    setQueueFilter,
    sortBy,
    setSortBy,
    assignTeam,
    setIsDetailOpen
  } = useCivic();

  // Filter queue
  const filteredQueue = incidents.filter((inc) => {
    if (inc.status === 'resolved') return false; // Queue focuses on unresolved
    if (queueFilter === 'high_risk') return inc.riskScore >= 70;
    if (queueFilter === 'waiting_too_long') return inc.waitingDays >= 20;
    if (queueFilter === 'recurring') return inc.isRecurring;
    if (queueFilter === 'unassigned') return !inc.assignedTeam;
    if (queueFilter === 'needs_review') return inc.status === 'needs_review';
    return true;
  });

  // Sort queue
  const sortedQueue = [...filteredQueue].sort((a, b) => {
    if (sortBy === 'risk') return b.riskScore - a.riskScore;
    if (sortBy === 'age') return b.waitingDays - a.waitingDays;
    if (sortBy === 'impact') return b.publicImpact - a.publicImpact;
    if (sortBy === 'severity') return b.severity - a.severity;
    return 0;
  });

  const activeInc = selectedIncident || sortedQueue[0] || null;

  return (
    <div className="space-y-5 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E3DC]">
        <div>
          <h1 className="text-2xl font-black text-[#191B1F] tracking-tight">
            Priority Queue
          </h1>
          <p className="text-xs sm:text-sm text-[#565C68] mt-0.5">
            Decide what needs action first. SANKET aging & hazard triage engine.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge label="REAL-TIME TRIAGE MATRIX" />
        </div>
      </div>

      {/* Triage Tabs & Sorting Bar */}
      <div className="p-3.5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setQueueFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              queueFilter === 'all'
                ? 'bg-[#191B1F] text-white shadow-xs'
                : 'bg-[#F4F3EF] text-[#565C68] hover:bg-[#ECEAE3]'
            }`}
          >
            All Pending ({incidents.filter((i) => i.status !== 'resolved').length})
          </button>
          <button
            onClick={() => setQueueFilter('high_risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              queueFilter === 'high_risk'
                ? 'bg-[#C54E38] text-white shadow-xs'
                : 'bg-[#FDF0ED] text-[#C54E38] hover:bg-[#FCE3DD]'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            High Risk
          </button>
          <button
            onClick={() => setQueueFilter('waiting_too_long')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              queueFilter === 'waiting_too_long'
                ? 'bg-[#C88427] text-white shadow-xs'
                : 'bg-[#FDF6EC] text-[#C88427] hover:bg-[#F9E8CE]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Waiting Too Long
          </button>
          <button
            onClick={() => setQueueFilter('recurring')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              queueFilter === 'recurring'
                ? 'bg-[#2C5E48] text-white shadow-xs'
                : 'bg-[#EBF3EE] text-[#2C5E48] hover:bg-[#DCEAE2]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Recurring
          </button>
          <button
            onClick={() => setQueueFilter('unassigned')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              queueFilter === 'unassigned'
                ? 'bg-[#191B1F] text-white shadow-xs'
                : 'bg-[#F4F3EF] text-[#565C68] hover:bg-[#ECEAE3]'
            }`}
          >
            Unassigned
          </button>
          <button
            onClick={() => setQueueFilter('needs_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              queueFilter === 'needs_review'
                ? 'bg-[#191B1F] text-white shadow-xs'
                : 'bg-[#F4F3EF] text-[#565C68] hover:bg-[#ECEAE3]'
            }`}
          >
            Needs Review
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2 self-end md:self-auto text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#7E8592]" />
          <span className="text-[#7E8592] font-semibold">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg border border-[#E5E3DC] bg-[#FBFBF9] font-bold text-[#191B1F] focus:outline-none focus:border-[#2C5E48]"
          >
            <option value="risk">Civic Risk Score (Highest)</option>
            <option value="age">Priority Aging (Oldest First)</option>
            <option value="impact">Public Impact Telemetry</option>
            <option value="severity">Physical Severity</option>
          </select>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SPLIT SCREEN TRIAGE: Left Queue + Right "Why Prioritized" */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#7E8592]">
            <span>Sorted Queue: {sortedQueue.length} items</span>
            <span>Click to inspect triage reasoning</span>
          </div>

          <div className="space-y-2.5">
            {sortedQueue.map((inc, index) => {
              const isSelected = inc.id === activeInc?.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => selectIncident(inc.id, false)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left bg-white ${
                    isSelected
                      ? 'border-[#191B1F] ring-1 ring-[#191B1F] shadow-md bg-[#FAF9F5]'
                      : 'border-[#E5E3DC] hover:border-[#191B1F]/30 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-[#F4F3EF] border border-[#E5E3DC] text-[11px] font-mono font-bold flex items-center justify-center shrink-0 text-[#565C68]">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CategoryBadge category={inc.category} />
                          {inc.isRecurring && (
                            <span className="text-[10px] font-bold text-[#C88427] bg-[#FDF6EC] px-1.5 py-0.2 rounded border border-[#F9E8CE]">
                              {inc.recurrenceCount}x Recur
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold text-[#191B1F] leading-tight">
                          {inc.title}
                        </h3>
                        <p className="text-xs text-[#565C68] mt-0.5">
                          {inc.sector} • {inc.location}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <RiskBadge score={inc.riskScore} size="sm" showLabel={false} />
                      <div className="text-[11px] font-mono text-[#7E8592] mt-1">
                        <span className={inc.waitingDays >= 30 ? 'font-bold text-[#C54E38]' : ''}>
                          {inc.waitingDays} days
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#F4F3EF] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={inc.status} />
                      {inc.assignedTeam ? (
                        <span className="text-[11px] text-[#565C68] truncate max-w-xs">
                          {inc.assignedTeam}
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#C54E38] font-bold bg-[#FDF0ED] px-2 py-0.5 rounded">
                          Unassigned
                        </span>
                      )}
                    </div>
                    <span className="text-[#2C5E48] font-bold flex items-center gap-0.5">
                      View Logic <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: "WHY PRIORITIZED?" Triage Decision Panel (5 Cols) */}
        <div className="lg:col-span-5">
          {activeInc ? (
            <div className="bg-white rounded-xl border border-[#E5E3DC] shadow-sm p-5 space-y-5 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
                <div>
                  <span className="text-[10px] font-mono text-[#7E8592] uppercase tracking-wider block">
                    SANKET Triage Reasoner
                  </span>
                  <h3 className="text-sm font-bold text-[#191B1F]">
                    WHY PRIORITIZED?
                  </h3>
                </div>
                <RiskBadge score={activeInc.riskScore} size="md" />
              </div>

              {/* Focus Incident Headline */}
              <div>
                <h4 className="text-base font-bold text-[#191B1F] leading-snug">
                  {activeInc.title}
                </h4>
                <div className="flex items-center gap-1.5 text-xs text-[#565C68] mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2C5E48]" />
                  <span>{activeInc.sector}, Chandigarh</span>
                </div>
              </div>

              {/* 4 Prioritization Vectors */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                  <span className="font-semibold text-[#565C68]">Civic Risk Level</span>
                  <span className="font-bold font-mono text-[#C54E38]">
                    {activeInc.riskScore} / 100 ({activeInc.riskLevel.toUpperCase()})
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                  <span className="font-semibold text-[#565C68]">Public Impact Exposure</span>
                  <span className="font-bold font-mono text-[#191B1F]">
                    {activeInc.publicImpact} / 10 (High Transit Corridor)
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                  <span className="font-semibold text-[#565C68]">Physical Severity</span>
                  <span className="font-bold font-mono text-[#191B1F]">
                    {activeInc.severity} / 10
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#FDF0ED] border border-[#F8D2CA]">
                  <span className="font-semibold text-[#C54E38] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Priority Aging Penalty
                  </span>
                  <span className="font-bold font-mono text-[#C54E38]">
                    {activeInc.waitingDays} days pending
                  </span>
                </div>
              </div>

              {/* Priority Aging Curve Note */}
              <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] text-xs text-[#565C68] leading-relaxed">
                <span className="font-bold text-[#191B1F] block mb-0.5">
                  Priority Aging Dynamics
                </span>
                "Priority increases automatically as unresolved civic issues languish. At Day {activeInc.waitingDays}, this ticket has accumulated additional urgency weight to prevent municipal oversight."
              </div>

              {/* Quick Action Dispatch */}
              <div className="pt-3 border-t border-[#E5E3DC] space-y-2">
                <button
                  onClick={() => assignTeam(activeInc.id, 'PWD Fast Response Division', 'Officer Sen')}
                  className="w-full py-2.5 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Priority Repair Unit</span>
                </button>

                <button
                  onClick={() => setIsDetailOpen(true)}
                  className="w-full py-2 rounded-xl bg-[#F4F3EF] hover:bg-[#ECEAE3] text-[#191B1F] font-bold text-xs border border-[#E5E3DC] transition-colors"
                >
                  Full Investigation Details →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-[#E5E3DC] text-xs text-[#7E8592]">
              Select an incident from the queue to inspect its prioritization breakdown.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
