import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge, CategoryBadge, StatusBadge } from '../common/Badges';
import {
  Camera,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  WifiOff,
  Send,
  Eye,
  ChevronRight,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { IssueCategory } from '../../types/civic';

export const CitizenView: React.FC = () => {
  const {
    incidents,
    submitCitizenReport,
    isOffline,
    offlineQueue,
    syncOfflineQueue,
    isSyncing
  } = useCivic();

  const [mode, setMode] = useState<'home' | 'camera' | 'ai_understand' | 'submitted' | 'recent'>('home');
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80');
  const [detectedCategory, setDetectedCategory] = useState<IssueCategory>('pothole');
  const [detectedLocation, setDetectedLocation] = useState('Sector 17, Chandigarh');
  const [detectedDescription, setDetectedDescription] = useState('Large pothole cluster causing vehicle swerving and water stagnation near bus lane.');
  const [submittedTicket, setSubmittedTicket] = useState<string>('');

  const handleCapturePhoto = () => {
    // Simulate camera capture
    setMode('ai_understand');
  };

  const handleConfirmSubmit = () => {
    const ticketId = `CHD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedTicket(ticketId);

    submitCitizenReport({
      category: detectedCategory,
      description: detectedDescription,
      sector: 'Sector 17',
      location: detectedLocation,
      imageDataUrl: photoUrl
    });

    setMode('submitted');
  };

  const handleReset = () => {
    setMode('home');
  };

  return (
    <div className="max-w-md mx-auto space-y-4 text-left animate-fade-in pb-12">
      {/* Offline Status Notice Banner */}
      {isOffline && (
        <div className="p-3.5 rounded-xl bg-[#FDF0ED] border border-[#F8D2CA] text-[#C54E38] flex items-center justify-between text-xs animate-pulse">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 shrink-0" />
            <div>
              <span className="font-bold block">Offline Mode Active</span>
              <span className="text-[11px] text-[#C54E38]/90">
                Reports will be cached locally on your device and auto-synced.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-[#F8D2CA]">
            SAVED OFFLINE
          </span>
        </div>
      )}

      {/* Offline Queue Sync Reminder */}
      {offlineQueue.length > 0 && !isOffline && (
        <div className="p-3.5 rounded-xl bg-[#EBF3EE] border border-[#C5DDD0] text-[#2C5E48] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold block">{offlineQueue.length} reports ready to sync</span>
            <span className="text-[11px]">Connection restored. Push local signals to SANKET.</span>
          </div>
          <button
            onClick={syncOfflineQueue}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-[#2C5E48] text-white font-bold text-xs hover:bg-[#1E4333] transition-colors"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </button>
        </div>
      )}

      {/* MODE 1: CITIZEN HOME */}
      {mode === 'home' && (
        <div className="space-y-6">
          {/* Friendly Hero Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E5E3DC] shadow-sm text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF3EE] text-[#2C5E48] border border-[#C5DDD0] flex items-center justify-center mx-auto shadow-xs">
              <Camera className="w-7 h-7" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#191B1F] tracking-tight leading-tight">
                Help your city get things fixed faster.
              </h1>
              <p className="text-xs sm:text-sm text-[#565C68] mt-2 max-w-xs mx-auto leading-relaxed">
                One photo is all it takes. SANKET AI auto-detects the problem, verifies the coordinate, and routes it to the right crew.
              </p>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                onClick={() => setMode('camera')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Report an Issue (Camera)</span>
              </button>

              <button
                onClick={() => setMode('recent')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F4F3EF] hover:bg-[#ECEAE3] text-[#191B1F] font-bold text-xs border border-[#E5E3DC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#565C68]" />
                <span>See Recent Neighborhood Issues</span>
              </button>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 bg-white rounded-xl border border-[#E5E3DC]">
              <span className="font-bold text-xs text-[#191B1F] block">1. Point</span>
              <span className="text-[11px] text-[#7E8592] mt-0.5 block">Take a photo</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5E3DC]">
              <span className="font-bold text-xs text-[#191B1F] block">2. Understand</span>
              <span className="text-[11px] text-[#7E8592] mt-0.5 block">AI auto-diagnoses</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-[#E5E3DC]">
              <span className="font-bold text-xs text-[#191B1F] block">3. Fix</span>
              <span className="text-[11px] text-[#7E8592] mt-0.5 block">Track resolution</span>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: CAMERA-FIRST CAPTURE */}
      {mode === 'camera' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md p-5 space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Step 1: Capture Defect
            </span>
            <span className="text-[11px] font-mono text-[#2C5E48] font-bold flex items-center gap-1">
              <MapPin className="w-3 h-3" /> GPS Detected
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-[#2C5E48] bg-black h-72 flex flex-col items-center justify-center text-white">
            {/* Camera Viewfinder reticle */}
            <div className="absolute inset-4 border border-white/30 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-6 h-6 border-t-2 border-l-2 border-emerald-400 absolute top-2 left-2"></div>
              <div className="w-6 h-6 border-t-2 border-r-2 border-emerald-400 absolute top-2 right-2"></div>
              <div className="w-6 h-6 border-b-2 border-l-2 border-emerald-400 absolute bottom-2 left-2"></div>
              <div className="w-6 h-6 border-b-2 border-r-2 border-emerald-400 absolute bottom-2 right-2"></div>
            </div>

            <img
              src={photoUrl}
              alt="Live Viewfinder"
              className="w-full h-full object-cover opacity-85"
            />

            <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-center text-xs">
              <span className="font-bold block">Point camera directly at the hazard</span>
              <span className="text-[10px] text-white/70 font-mono">
                Auto-GPS: Sector 17, Chandigarh (Accuracy: ±2.5m)
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={handleCapturePhoto}
              className="w-full py-3.5 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>Capture & Understand with AI</span>
            </button>

            <button
              onClick={() => setMode('home')}
              className="w-full py-2 text-center text-xs text-[#7E8592] hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: AI UNDERSTAND & CONFIRM */}
      {mode === 'ai_understand' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md p-5 space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2C5E48]" />
              <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
                Step 2: AI Diagnosis
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#1E6B42] bg-[#EBF7EF] px-2 py-0.5 rounded border border-[#C8EAD4] font-bold">
              92% CONFIDENCE
            </span>
          </div>

          {/* Captured photo thumbnail */}
          <div className="h-36 rounded-xl overflow-hidden border border-[#E5E3DC]">
            <img src={photoUrl} alt="Captured" className="w-full h-full object-cover" />
          </div>

          {/* AI Auto-Detected Details */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#7E8592] uppercase block">
                Detected Issue Category
              </label>
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                <span className="text-xs font-bold text-[#191B1F] flex items-center gap-2">
                  <CategoryBadge category={detectedCategory} />
                </span>
                <span className="text-[11px] text-[#1E6B42] font-semibold">92% Match</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#7E8592] uppercase block">
                Auto-Detected Location
              </label>
              <div className="mt-1 p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] text-xs font-semibold text-[#191B1F] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2C5E48] shrink-0" />
                <span>{detectedLocation}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#7E8592] uppercase block">
                Generated Description (You can edit)
              </label>
              <textarea
                value={detectedDescription}
                onChange={(e) => setDetectedDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full p-2.5 rounded-lg bg-white border border-[#E5E3DC] text-xs text-[#191B1F] focus:outline-none focus:border-[#2C5E48]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#F4F3EF]">
            <button
              onClick={handleConfirmSubmit}
              className="w-full py-3.5 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isOffline ? 'Save Report Offline' : 'Confirm & Submit to City'}</span>
            </button>

            <button
              onClick={() => setMode('camera')}
              className="w-full py-2 text-center text-xs text-[#7E8592] hover:underline"
            >
              Retake Photo
            </button>
          </div>
        </div>
      )}

      {/* MODE 4: SUBMITTED CONFIRMATION */}
      {mode === 'submitted' && (
        <div className="bg-white rounded-3xl border border-[#E5E3DC] shadow-md p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#EBF7EF] border border-[#C8EAD4] text-[#1E6B42] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#191B1F]">
              {isOffline ? 'Report Cached Offline' : 'Report Successfully Submitted!'}
            </h2>
            <p className="text-xs text-[#565C68] mt-1 max-w-xs mx-auto">
              {isOffline
                ? 'Your signal is safely stored on this device. It will automatically transmit to the city when you regain network coverage.'
                : 'Thank you for helping keep your city safe. Your report has been corroborated by SANKET and assigned to PWD.'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] text-xs">
            <span className="text-[#7E8592] block font-mono">Tracking Ticket Number:</span>
            <span className="font-mono font-bold text-sm text-[#191B1F] mt-0.5 block">
              {submittedTicket || 'CHD-2026-0817'}
            </span>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => setMode('recent')}
              className="w-full py-2.5 rounded-xl bg-[#F4F3EF] hover:bg-[#ECEAE3] text-[#191B1F] font-bold text-xs border border-[#E5E3DC] transition-colors"
            >
              View Neighborhood Status Feed
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-[#2C5E48] text-white font-bold text-xs hover:bg-[#1E4333] transition-colors"
            >
              Submit Another Report
            </button>
          </div>
        </div>
      )}

      {/* MODE 5: RECENT ISSUES COMMUNITY FEED */}
      {mode === 'recent' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <div>
              <h2 className="text-base font-bold text-[#191B1F]">
                Sector 17 & Nearby Reports
              </h2>
              <p className="text-xs text-[#565C68]">Recent reports verified by citizens like you</p>
            </div>
            <button
              onClick={() => setMode('home')}
              className="text-xs font-bold text-[#2C5E48] hover:underline"
            >
              Back
            </button>
          </div>

          <div className="space-y-2.5">
            {incidents.slice(0, 6).map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CategoryBadge category={inc.category} />
                    <h3 className="text-xs font-bold text-[#191B1F] mt-1">{inc.title}</h3>
                    <p className="text-[11px] text-[#565C68] mt-0.5">{inc.location}</p>
                  </div>
                  <StatusBadge status={inc.status} />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#7E8592] pt-2 border-t border-[#F4F3EF]">
                  <span>{inc.waitingDays} days ago</span>
                  <span className="text-[#1E6B42] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {inc.confidenceScore}% verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
