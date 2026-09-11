import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Users,
  MapPin,
  Eye,
  Clock,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const EvidenceDrawer: React.FC = () => {
  const { selectedIncident, isEvidenceOpen, setIsEvidenceOpen } = useCivic();

  if (!isEvidenceOpen || !selectedIncident) return null;

  const inc = selectedIncident;
  const ev = inc.confidenceEvidence;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E5E3DC] text-left animate-slide-left">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E3DC] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7EF] border border-[#C8EAD4] text-[#1E6B42] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Civic Confidence Evidence
              </h3>
              <p className="text-xs text-[#7E8592]">
                Measurable multi-source corroboration signals
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEvidenceOpen(false)}
            className="p-1.5 rounded-lg text-[#7E8592] hover:bg-[#F4F3EF] hover:text-[#191B1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Main Confidence Banner */}
          <div className="p-4 rounded-xl bg-[#EBF7EF] border border-[#C8EAD4] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#1E6B42] uppercase tracking-wider block">
                Corroborated Confidence
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black font-mono text-[#1E6B42]">
                  {inc.confidenceScore}%
                </span>
                <span className="text-xs font-semibold text-[#1E6B42]">High Certainty</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-[#565C68] block">
                Calculated {ev.lastCalculatedAgo}
              </span>
              <span className="text-[10px] text-[#7E8592] block mt-0.5">
                Engine: SANKET Multi-Signal Fusion
              </span>
            </div>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Civic Confidence is not an arbitrary metric. It represents mathematically verified convergence across independent citizen observations, spatial GPS clustering, and photographic telemetry.
          </p>

          {/* 4 Measurable Signals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Measurable Signal Vectors
            </h4>

            {/* Signal 1: Related Reports */}
            <div className="p-3.5 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-[#F4F3EF] text-[#2C5E48] flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#191B1F]">
                      Independent Citizen Reports
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2C5E48]">
                      {ev.relatedReportsCount} Verified Signals
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7E8592] mt-1">
                    Multiple distinct citizens and verified transit operators submitted independent reports for this coordinate.
                  </p>
                </div>
              </div>
            </div>

            {/* Signal 2: Spatial Clustering */}
            <div className="p-3.5 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-[#F4F3EF] text-[#2C5E48] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#191B1F]">
                      Spatial Proximity Cluster
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2C5E48]">
                      {ev.locationMatchRadiusMeters}m Radius Match
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7E8592] mt-1">
                    GPS coordinates from incoming reports cluster tightly within a {ev.locationMatchRadiusMeters}-meter centroid bounding circle.
                  </p>
                </div>
              </div>
            </div>

            {/* Signal 3: Visual Similarity */}
            <div className="p-3.5 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-[#F4F3EF] text-[#2C5E48] flex items-center justify-center shrink-0 mt-0.5">
                  <Eye className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#191B1F]">
                      Computer Vision Correlation
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2C5E48]">
                      {ev.visualSimilarityPercentage}% Visual Match
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7E8592] mt-1">
                    Edge feature maps and asphalt texture embeddings across user uploads confirm the identical defect geometry.
                  </p>
                </div>
              </div>
            </div>

            {/* Signal 4: Temporal Clustering */}
            <div className="p-3.5 rounded-lg border border-[#E5E3DC] bg-white">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-md bg-[#F4F3EF] text-[#2C5E48] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#191B1F]">
                      Temporal Influx Cluster
                    </span>
                    <span className="text-xs font-mono font-bold text-[#2C5E48]">
                      {ev.timeClusteringScore} / 100 Index
                    </span>
                  </div>
                  <p className="text-[11px] text-[#7E8592] mt-1">
                    Reports surged concurrently over recent operational shifts rather than sporadic historic noise.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Source Breakdown */}
          <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] space-y-2">
            <span className="text-[11px] font-bold text-[#565C68] uppercase tracking-wider block">
              Contributing Telemetry Feeds
            </span>
            <ul className="space-y-1.5">
              {ev.citizenSignalSources.map((source, idx) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-[#191B1F]">
                  <Radio className="w-3.5 h-3.5 text-[#2C5E48]" />
                  <span>{source}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E3DC] bg-[#FAF9F5] flex items-center justify-between">
          <DemoBadge label="DEMO TELEMETRY" />
          <button
            onClick={() => setIsEvidenceOpen(false)}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#191B1F] text-white hover:bg-[#2C2F35] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
