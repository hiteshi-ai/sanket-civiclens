import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import {
  Navigation,
  CheckCircle2,
  Camera,
  Upload,
  AlertTriangle,
  Clock,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Truck,
  RotateCcw
} from 'lucide-react';

export const FieldOfficerView: React.FC = () => {
  const {
    incidents,
    resolveFieldIncident,
    showToast,
    isOffline
  } = useCivic();

  // Pick assigned incident or first available incident
  const assigned =
    incidents.find((i) => i.status === 'assigned') ||
    incidents.find((i) => i.status === 'in_progress') ||
    incidents[0];

  const [step, setStep] = useState<'dispatch' | 'repair_camera' | 'verification_match' | 'completed'>('dispatch');
  const [isNavigating, setIsNavigating] = useState(false);
  const [isOnTheWay, setIsOnTheWay] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleStartNav = () => {
    setIsNavigating(true);
    showToast(
      'Turn-by-Turn Navigation Started',
      `Routing via Madhya Marg to ${assigned.sector}. Distance: 2.8 km (8 mins).`,
      'info'
    );
  };

  const handleMarkOnTheWay = () => {
    setIsOnTheWay(true);
    showToast(
      'Status Updated: In Transit',
      'Municipal dispatch board updated: Officer Sen is on-site bound.',
      'info'
    );
  };

  const handleSimulateCameraCapture = () => {
    // Simulate captured repaired photo
    const repairUrl =
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
    setCapturedPhoto(repairUrl);
    setStep('verification_match');
  };

  const handleConfirmResolution = () => {
    resolveFieldIncident(
      assigned.id,
      capturedPhoto || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      'resolved'
    );
    setStep('completed');
  };

  const handleFlagReview = () => {
    resolveFieldIncident(
      assigned.id,
      capturedPhoto || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
      'needs_review'
    );
    setStep('completed');
  };

  const handleReset = () => {
    setStep('dispatch');
    setIsNavigating(false);
    setIsOnTheWay(false);
    setCapturedPhoto(null);
  };

  if (!assigned) {
    return (
      <div className="max-w-md mx-auto space-y-4 text-left animate-fade-in pb-12">
        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#EBF3EE] border border-[#C5DDD0] text-[#2C5E48] font-black text-sm flex items-center justify-center">
              VS
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#191B1F]">
                Officer Vikramaditya Sen
              </h2>
              <span className="text-[11px] text-[#7E8592] block">
                PWD Rapid Response • Sector 17 Beat
              </span>
            </div>
          </div>
          <DemoBadge label="FIELD DISPATCH" />
        </div>
        <div className="p-8 text-center bg-white rounded-2xl border border-[#E5E3DC] shadow-xs space-y-2">
          <Truck className="w-8 h-8 text-[#7E8592] mx-auto" />
          <h3 className="text-sm font-bold text-[#191B1F]">No Active Dispatches</h3>
          <p className="text-xs text-[#565C68]">All assigned field repairs have been resolved or verified.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4 text-left animate-fade-in pb-12">
      {/* Officer Header Card */}
      <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-[#EBF3EE] border border-[#C5DDD0] text-[#2C5E48] font-black text-sm flex items-center justify-center">
            VS
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#191B1F]">
              Officer Vikramaditya Sen
            </h2>
            <span className="text-[11px] text-[#7E8592] block">
              PWD Rapid Response • Sector 17 Beat
            </span>
          </div>
        </div>
        <DemoBadge label="FIELD DISPATCH" />
      </div>

      {/* STEP 1: ACTIVE DISPATCH ASSIGNMENT */}
      {step === 'dispatch' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md overflow-hidden text-left">
          {/* Header Banner */}
          <div className="p-4 bg-[#FAF9F5] border-b border-[#E5E3DC] flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#C54E38] bg-[#FDF0ED] px-2.5 py-0.5 rounded border border-[#F8D2CA]">
              ASSIGNMENT #{assigned.ticketNumber}
            </span>
            <span className="text-xs font-mono text-[#7E8592]">
              {assigned.waitingDays} days pending
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Title and location */}
            <div>
              <span className="text-[10px] font-bold text-[#7E8592] uppercase tracking-wider block">
                Target Issue
              </span>
              <h3 className="text-base font-bold text-[#191B1F] mt-0.5">
                {assigned.title}
              </h3>
              <p className="text-xs text-[#565C68] flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#2C5E48] shrink-0" />
                <span>{assigned.location} ({assigned.sector})</span>
              </p>
            </div>

            {/* Photo preview */}
            <div className="rounded-xl overflow-hidden border border-[#E5E3DC] h-44 relative group">
              <img
                src={assigned.beforeImageUrl}
                alt="Reported condition"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded">
                Reported by 17 Citizens
              </div>
            </div>

            {/* SANKET Score Snapshot */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                <span className="text-[10px] text-[#7E8592] uppercase block">Risk</span>
                <span className="font-bold font-mono text-[#C54E38]">{assigned.riskScore}/100</span>
              </div>
              <div className="p-2 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                <span className="text-[10px] text-[#7E8592] uppercase block">Confidence</span>
                <span className="font-bold font-mono text-[#1E6B42]">{assigned.confidenceScore}%</span>
              </div>
              <div className="p-2 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                <span className="text-[10px] text-[#7E8592] uppercase block">Recurrence</span>
                <span className="font-bold font-mono text-[#C88427]">
                  {assigned.isRecurring ? '4th Failure' : 'New'}
                </span>
              </div>
            </div>

            {/* Navigation & Dispatch Controls */}
            <div className="space-y-2 pt-2 border-t border-[#F4F3EF]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleStartNav}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isNavigating
                      ? 'bg-[#1E6B42] text-white shadow-xs'
                      : 'bg-[#F4F3EF] hover:bg-[#ECEAE3] text-[#191B1F] border border-[#E5E3DC]'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-[#2C5E48]" />
                  <span>{isNavigating ? 'Navigating (2.8 km)' : 'Start Navigation'}</span>
                </button>

                <button
                  onClick={handleMarkOnTheWay}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isOnTheWay
                      ? 'bg-[#2C5E48] text-white shadow-xs'
                      : 'bg-[#F4F3EF] hover:bg-[#ECEAE3] text-[#191B1F] border border-[#E5E3DC]'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>{isOnTheWay ? 'On My Way ✓' : 'Mark On My Way'}</span>
                </button>
              </div>

              <button
                onClick={() => setStep('repair_camera')}
                className="w-full py-3 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm mt-3"
              >
                <Camera className="w-4 h-4" />
                <span>Begin Repair & Capture Evidence</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: CAMERA-FIRST REPAIR CAPTURE */}
      {step === 'repair_camera' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md p-5 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
            <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Step 2: Photographic Evidence
            </span>
            <span className="text-[11px] font-mono text-[#7E8592]">GPS: Active (±3m)</span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Position camera at the completed work zone. SANKET will perform spatial matching against the original citizen report coordinates.
          </p>

          {/* Camera Viewfinder Interface */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-[#2C5E48] bg-[#191B1F] h-64 flex flex-col items-center justify-center text-white p-4">
            <div className="absolute inset-4 border border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-8 h-8 border-t-2 border-l-2 border-emerald-400 absolute top-2 left-2"></div>
              <div className="w-8 h-8 border-t-2 border-r-2 border-emerald-400 absolute top-2 right-2"></div>
              <div className="w-8 h-8 border-b-2 border-l-2 border-emerald-400 absolute bottom-2 left-2"></div>
              <div className="w-8 h-8 border-b-2 border-r-2 border-emerald-400 absolute bottom-2 right-2"></div>
            </div>

            <Camera className="w-12 h-12 text-emerald-400/80 mb-2 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wide">
              Align Repair with Road Markings
            </span>
            <span className="text-[10px] text-white/70 font-mono mt-0.5">
              30.7415° N, 76.7794° E • Sector 17
            </span>
          </div>

          {/* Capture Trigger Button */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleSimulateCameraCapture}
              className="w-full py-3 rounded-xl bg-[#191B1F] hover:bg-[#2C2F35] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Capture After-Repair Photo</span>
            </button>

            <button
              onClick={() => setStep('dispatch')}
              className="w-full py-2 text-center text-xs text-[#7E8592] hover:underline"
            >
              ← Back to Dispatch Details
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SANKET SMART CLOSURE MATCH VERIFICATION */}
      {step === 'verification_match' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md p-5 space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E3DC]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2C5E48]" />
              <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
                SANKET Smart Closure Match
              </span>
            </div>
            <DemoBadge label="AI COMPARATOR" />
          </div>

          {/* Result Gauge Banner */}
          <div className="p-4 rounded-xl bg-[#EBF7EF] border border-[#C8EAD4] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#1E6B42] uppercase tracking-wider block">
                Verification Confidence
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black font-mono text-[#1E6B42]">
                  96%
                </span>
                <span className="text-xs font-bold text-[#1E6B42]">Likely Match</span>
              </div>
            </div>
            <div className="text-right text-xs text-[#1E6B42]">
              <span className="font-bold block">8 metres away</span>
              <span className="text-[10px] text-[#1E6B42]/80">GPS Centroid Match</span>
            </div>
          </div>

          {/* Before & After Photo Comparison */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl overflow-hidden border border-[#E5E3DC] bg-[#F4F3EF]">
              <div className="px-2 py-1 bg-[#FAF9F5] border-b border-[#E5E3DC] text-[10px] font-bold text-[#C54E38]">
                BEFORE (Citizen)
              </div>
              <img
                src={assigned.beforeImageUrl}
                alt="Before repair"
                className="w-full h-28 object-cover"
              />
            </div>

            <div className="rounded-xl overflow-hidden border border-[#C8EAD4] bg-[#EBF7EF]">
              <div className="px-2 py-1 bg-[#EBF7EF] border-b border-[#C8EAD4] text-[10px] font-bold text-[#1E6B42]">
                AFTER (Officer Sen)
              </div>
              <img
                src={capturedPhoto || 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'}
                alt="After repair"
                className="w-full h-28 object-cover"
              />
            </div>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed italic bg-[#FAF9F5] p-3 rounded-lg border border-[#E5E3DC]">
            "Location and visual evidence suggest this is the reported incident. Kerb alignment, asphalt aggregate texture, and road camber match with 94% visual confidence."
          </p>

          {/* Operational Resolution Decisions */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleConfirmResolution}
              className="w-full py-3 rounded-xl bg-[#1E6B42] hover:bg-[#185333] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Resolved (Verified)</span>
            </button>

            <button
              onClick={handleFlagReview}
              className="w-full py-2.5 rounded-xl bg-[#FDF0ED] hover:bg-[#FCE3DD] text-[#C54E38] font-bold text-xs border border-[#F8D2CA] transition-colors"
            >
              Flag for Secondary Review
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: COMPLETED STATE */}
      {step === 'completed' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBF7EF] border border-[#C8EAD4] text-[#1E6B42] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-base font-bold text-[#191B1F]">
              Ticket #{assigned.ticketNumber} Updated
            </h3>
            <p className="text-xs text-[#565C68] mt-1 max-w-xs mx-auto">
              Smart Closure Match recorded with 96% confidence. Civic Memory timeline updated for Sector 17.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] text-xs text-[#7E8592] font-mono">
            Recorded by Officer V. Sen • {new Date().toLocaleTimeString()}
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2.5 rounded-xl bg-[#191B1F] text-white text-xs font-bold hover:bg-[#2C2F35] transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Simulate Another Dispatch</span>
          </button>
        </div>
      )}
    </div>
  );
};
