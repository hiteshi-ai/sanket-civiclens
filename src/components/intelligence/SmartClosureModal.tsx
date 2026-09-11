import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Camera,
  MapPin,
  Sparkles,
  ShieldCheck,
  Eye,
  Sliders
} from 'lucide-react';

export const SmartClosureModal: React.FC = () => {
  const {
    selectedIncident,
    isSmartClosureOpen,
    setIsSmartClosureOpen,
    resolveFieldIncident
  } = useCivic();

  const [splitRatio, setSplitRatio] = useState<number>(50);

  if (!isSmartClosureOpen || !selectedIncident) return null;

  const inc = selectedIncident;
  const closure = inc.smartClosure || {
    matchConfidence: 96,
    distanceMeters: 8,
    isLikelyMatch: true,
    visualMatchScore: 94,
    explanation: 'Location coordinates match within 8 metres. Structural perimeter landmarks and curbing geometry align with 94% visual confidence.'
  };

  const handleConfirmResolve = () => {
    resolveFieldIncident(
      inc.id,
      inc.afterImageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      'resolved'
    );
    setIsSmartClosureOpen(false);
  };

  const handleFlagReview = () => {
    resolveFieldIncident(
      inc.id,
      inc.afterImageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      'needs_review'
    );
    setIsSmartClosureOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[3000] isolate flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-[#E5E3DC] w-full max-w-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E3DC] bg-[#FAF9F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EBF7EF] border border-[#C8EAD4] text-[#1E6B42] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#191B1F]">
                SANKET Smart Closure Match
              </h3>
              <p className="text-xs text-[#7E8592]">
                Automated field repair verification & spatial validation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSmartClosureOpen(false)}
            className="p-1.5 rounded-lg text-[#7E8592] hover:bg-[#F4F3EF] hover:text-[#191B1F] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Smart Match Result Banner */}
          <div className="p-4 rounded-xl bg-[#EBF7EF] border border-[#C8EAD4] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-[#C8EAD4] flex items-center justify-center text-[#1E6B42] font-black font-mono text-xl shadow-xs">
                {closure.matchConfidence}%
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E6B42] uppercase tracking-wider block">
                  Likely Verified Match
                </span>
                <p className="text-xs text-[#1E6B42]/90 font-medium mt-0.5">
                  Location within <span className="font-bold underline">{closure.distanceMeters} metres</span> of original reported coordinate.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded text-xs font-bold bg-white text-[#1E6B42] border border-[#C8EAD4]">
              High Verification
            </span>
          </div>

          {/* Side-by-Side / Interactive Comparison */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
                Visual Evidence Comparison
              </span>
              <span className="text-[11px] text-[#7E8592] font-mono">
                Visual Alignment: {closure.visualMatchScore}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Before Photo */}
              <div className="border border-[#E5E3DC] rounded-xl overflow-hidden bg-[#F4F3EF]">
                <div className="px-3 py-1.5 bg-[#FAF9F5] border-b border-[#E5E3DC] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#C54E38]">ORIGINAL REPORT</span>
                  <span className="text-[10px] text-[#7E8592] font-mono">32 days ago</span>
                </div>
                <img
                  src={inc.beforeImageUrl}
                  alt="Reported condition"
                  className="w-full h-48 object-cover"
                />
                <div className="p-2.5 text-[11px] text-[#565C68] leading-tight">
                  Citizen photo: Deep crater with water pooling in bus lane.
                </div>
              </div>

              {/* After Photo */}
              <div className="border border-[#C8EAD4] rounded-xl overflow-hidden bg-[#EBF7EF]">
                <div className="px-3 py-1.5 bg-[#EBF7EF] border-b border-[#C8EAD4] flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1E6B42]">AFTER REPAIR PHOTO</span>
                  <span className="text-[10px] text-[#1E6B42] font-mono">Field Officer Upload</span>
                </div>
                <img
                  src={inc.afterImageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'}
                  alt="Repaired condition"
                  className="w-full h-48 object-cover"
                />
                <div className="p-2.5 text-[11px] text-[#1E6B42] leading-tight">
                  Fresh hot-mix asphalt compaction matching street kerb alignment.
                </div>
              </div>
            </div>
          </div>

          {/* SANKET Intelligence Explanation */}
          <div className="p-3.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#191B1F]">
              <Sparkles className="w-3.5 h-3.5 text-[#2C5E48]" />
              <span>SANKET Verification Logic</span>
            </div>
            <p className="text-xs text-[#565C68] leading-relaxed">
              "{closure.explanation}"
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="p-5 border-t border-[#E5E3DC] bg-[#FAF9F5] flex flex-col sm:flex-row items-center justify-between gap-3">
          <DemoBadge label="CLOSURE VERIFICATION PROTOTYPE" />
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleFlagReview}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg text-xs font-bold bg-[#FDF0ED] text-[#C54E38] border border-[#F8D2CA] hover:bg-[#FCE3DD] transition-colors"
            >
              Needs Secondary Review
            </button>
            <button
              onClick={handleConfirmResolve}
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold bg-[#1E6B42] text-white hover:bg-[#185333] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark as Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
