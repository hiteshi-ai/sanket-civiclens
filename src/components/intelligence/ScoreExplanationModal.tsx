import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import { X, ShieldAlert, Cpu, AlertCircle, Scale, Clock, Info } from 'lucide-react';

export const ScoreExplanationModal: React.FC = () => {
  const { selectedIncident, isWhyScoreOpen, setIsWhyScoreOpen } = useCivic();

  if (!isWhyScoreOpen || !selectedIncident) return null;

  const inc = selectedIncident;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E3DC] w-full max-w-lg overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E3DC] flex items-center justify-between bg-[#FAF9F5]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FDF0ED] border border-[#F8D2CA] text-[#C54E38] flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191B1F]">
                SANKET Civic Risk Scoring Model
              </h3>
              <p className="text-xs text-[#7E8592]">
                Explainable AI telemetry & prioritization breakdown
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsWhyScoreOpen(false)}
            className="p-1.5 rounded-lg text-[#7E8592] hover:bg-[#F4F3EF] hover:text-[#191B1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Target Score Summary */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#F4F3EF] border border-[#E5E3DC]">
            <div>
              <span className="text-xs font-semibold text-[#565C68] uppercase tracking-wider block">
                Calculated Civic Risk
              </span>
              <span className="text-2xl font-black font-mono text-[#C54E38]">
                {inc.riskScore} <span className="text-sm font-medium text-[#7E8592]">/ 100</span>
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded text-xs font-bold bg-[#FDF0ED] text-[#C54E38] border border-[#F8D2CA]">
                {inc.riskLevel.toUpperCase()} PRIORITY
              </span>
              <span className="block text-[11px] text-[#7E8592] mt-1 font-mono">
                Formula: Weighted Hazard Index
              </span>
            </div>
          </div>

          {/* Component Factors */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Component Weights & Factors
            </h4>

            {/* Severity */}
            <div className="p-3 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-[#191B1F] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C54E38]"></span>
                  Physical Hazard Severity (35% weight)
                </span>
                <span className="font-mono font-bold text-[#191B1F]">{inc.severity} / 10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAE8E1] overflow-hidden">
                <div
                  className="h-full bg-[#C54E38] rounded-full"
                  style={{ width: `${inc.severity * 10}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#7E8592] mt-1">
                Measured by crater depth, active drainage overflow volume, or structural instability.
              </p>
            </div>

            {/* Public Impact */}
            <div className="p-3 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-[#191B1F] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C88427]"></span>
                  Public Transit Exposure (30% weight)
                </span>
                <span className="font-mono font-bold text-[#191B1F]">{inc.publicImpact} / 10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAE8E1] overflow-hidden">
                <div
                  className="h-full bg-[#C88427] rounded-full"
                  style={{ width: `${inc.publicImpact * 10}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#7E8592] mt-1">
                Derived from transit telemetry: 34,000 daily vehicles & pedestrian density corridors.
              </p>
            </div>

            {/* Location Exposure */}
            <div className="p-3 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-[#191B1F] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#2C5E48]"></span>
                  Critical Zone Sensitivity (20% weight)
                </span>
                <span className="font-mono font-bold text-[#191B1F]">{inc.locationExposure} / 10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAE8E1] overflow-hidden">
                <div
                  className="h-full bg-[#2C5E48] rounded-full"
                  style={{ width: `${inc.locationExposure * 10}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#7E8592] mt-1">
                Proximity to hospitals, primary arterial junctions, and public transport hubs.
              </p>
            </div>

            {/* Waiting Time */}
            <div className="p-3 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-[#191B1F] flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#565C68]" />
                  Priority Aging Penalty (15% weight)
                </span>
                <span className="font-mono font-bold text-[#191B1F]">
                  {inc.waitingDays} days ({inc.waitingScore}/10)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#EAE8E1] overflow-hidden">
                <div
                  className="h-full bg-[#565C68] rounded-full"
                  style={{ width: `${inc.waitingScore * 10}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-[#7E8592] mt-1">
                {inc.waitingDays > 21
                  ? 'Exceeded 21-day municipal hazard tolerance. Automatic aging escalation active.'
                  : 'Within standard SLA turnaround window.'}
              </p>
            </div>
          </div>

          {/* Reasoning Narrative */}
          <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[11px] font-bold text-[#565C68] uppercase tracking-wider block mb-1">
              Automated Synthesis
            </span>
            <p className="text-xs text-[#191B1F] leading-relaxed">
              {inc.riskReasoning}
            </p>
          </div>

          {/* Prototype / Demo Transparency Notice */}
          <div className="p-3 rounded-lg bg-[#F4F3EF] border border-[#E5E3DC] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#7E8592] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#565C68] leading-tight">
              <span className="font-semibold text-[#191B1F] block">Prototype Calculation Note</span>
              This score is calculated on demo telemetry. Municipal deployments calibrate factor weights against local statutory standards.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E3DC] flex items-center justify-between bg-[#FAF9F5]">
          <span className="text-[11px] text-[#7E8592] font-mono">
            Updated: {new Date(inc.lastUpdated).toLocaleTimeString()}
          </span>
          <button
            onClick={() => setIsWhyScoreOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#191B1F] text-white hover:bg-[#2C2F35] transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
