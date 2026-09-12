import React, { useEffect, useState } from 'react';
import { getIncidents, submitReport } from '../../api';
import type { Incident } from '../../types';
import { CategoryBadge, StatusBadge } from '../common/Badges';
import {
  Camera,
  MapPin,
  Sparkles,
  CheckCircle2,
  WifiOff,
  Send,
  Eye,
  ShieldCheck
} from 'lucide-react';

type Category =
  | 'POTHOLE_ROAD_DAMAGE'
  | 'GARBAGE_OVERFLOW'
  | 'BROKEN_STREETLIGHT'
  | 'DRAINAGE_WATERLOGGING'
  | 'OTHER';

type Location = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('The photo could not be read.'));
    reader.readAsDataURL(file);
  });
}

export const CitizenView: React.FC = () => {
  const [mode, setMode] = useState<'home' | 'camera' | 'ai_understand' | 'submitted' | 'recent'>('home');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>('POTHOLE_ROAD_DAMAGE');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submittedReportId, setSubmittedReportId] = useState<string | null>(null);
  const [submittedIncidentId, setSubmittedIncidentId] = useState<string | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);

  useEffect(() => {
    if (!photo) {
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location unavailable — this browser does not support GPS.');
      return;
    }
    setLocationLoading(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: Number.isFinite(coords.accuracy) ? coords.accuracy : null
        });
        setLocationLoading(false);
      },
      () => {
        setLocationError('Location unavailable — please enable location or retry.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const handleConfirmSubmit = async () => {
    if (!photo || !location) {
      setSubmissionError('Add a photo and capture your GPS location before submitting.');
      return;
    }
    setSubmitting(true);
    setSubmissionError(null);
    try {
      const response = await submitReport({
        idempotency_key: crypto.randomUUID(),
        category,
        photo_base64: await fileToDataUrl(photo),
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy_meters: location.accuracy ?? undefined,
        location_source: 'GPS',
        description: description.trim() || undefined,
        client_timestamp: new Date().toISOString()
      });
      setSubmittedReportId(response.report_id);
      setSubmittedIncidentId(response.incident_id ?? null);
      setMode('submitted');
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'The report could not be submitted.');
    } finally {
      setSubmitting(false);
    }
  };

  const loadRecent = async () => {
    setRecentLoading(true);
    try {
      setRecentIncidents(await getIncidents());
      setMode('recent');
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Recent incidents are unavailable.');
    } finally {
      setRecentLoading(false);
    }
  };

  const handleReset = () => {
    setMode('home');
    setPhoto(null);
    setLocation(null);
    setDescription('');
    setCategory('POTHOLE_ROAD_DAMAGE');
    setSubmissionError(null);
    setSubmittedReportId(null);
    setSubmittedIncidentId(null);
  };

  return (
    <div className="max-w-md mx-auto space-y-4 text-left animate-fade-in pb-12">
      {submissionError && (
        <div className="p-3.5 rounded-xl bg-[#FDF0ED] border border-[#F8D2CA] text-[#C54E38] text-xs">
          {submissionError}
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
                onClick={() => {
                  setSubmissionError(null);
                  setMode('camera');
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Camera className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Report an Issue (Camera)</span>
              </button>

              <button
                onClick={() => void loadRecent()}
                disabled={recentLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F4F3EF] hover:bg-[#ECEAE3] text-[#191B1F] font-bold text-xs border border-[#E5E3DC] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-[#565C68]" />
                <span>{recentLoading ? 'Loading incidents…' : 'See Recent Neighborhood Issues'}</span>
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
              <MapPin className="w-3 h-3" /> {location ? 'GPS captured' : 'GPS required'}
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

            {photoUrl ? <img src={photoUrl} alt="Selected civic issue" className="w-full h-full object-cover opacity-85" /> : (
              <label htmlFor="citizen-photo" className="flex flex-col items-center gap-2 text-xs text-white/80 cursor-pointer">
                <Camera className="w-8 h-8" />
                Choose or take a photo
              </label>
            )}

            <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-xs text-white p-2 rounded-xl text-center text-xs">
              <span className="font-bold block">Point camera directly at the hazard</span>
              <span className="text-[10px] text-white/70 font-mono">
                {location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}${location.accuracy != null ? ` (±${location.accuracy.toFixed(1)}m)` : ''}` : 'Capture GPS before submitting'}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                if (photo) {
                  setMode('ai_understand');
                } else {
                  document.getElementById('citizen-photo')?.click();
                }
              }}
              className="w-full py-3.5 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-300" />
              <span>{photo ? 'Use selected photo' : 'Choose or take a photo'}</span>
            </button>

            <input
              id="citizen-photo"
              className="hidden"
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
            />
            <button
              onClick={captureLocation}
              disabled={locationLoading}
              className="w-full py-3 rounded-xl border border-[#C5DDD0] text-[#2C5E48] font-bold text-xs flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              {locationLoading ? 'Getting location…' : location ? 'Refresh GPS' : 'Get my location'}
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

      {/* MODE 3: CONFIRM & SUBMIT */}
      {mode === 'ai_understand' && (
        <div className="bg-white rounded-2xl border border-[#E5E3DC] shadow-md p-5 space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#2C5E48]" />
              <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
                Step 2: Confirm report
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#7E8592] bg-[#F4F3EF] px-2 py-0.5 rounded border border-[#E5E3DC] font-bold">
              AI prediction is separate
            </span>
          </div>

          {/* Captured photo thumbnail */}
          <div className="h-36 rounded-xl overflow-hidden border border-[#E5E3DC]">
            {photoUrl ? <img src={photoUrl} alt="Captured" className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-xs text-[#7E8592]">No photo selected</div>}
          </div>

          {/* AI Auto-Detected Details */}
          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-bold text-[#7E8592] uppercase block">
                Citizen-selected category
              </label>
              <div className="mt-1 flex items-center justify-between p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
                <span className="text-xs font-bold text-[#191B1F] flex items-center gap-2">
                  <select value={category} onChange={(event) => setCategory(event.target.value as Category)} className="text-xs border border-[#E5E3DC] rounded p-1">
                    <option value="POTHOLE_ROAD_DAMAGE">Pothole / road damage</option>
                    <option value="GARBAGE_OVERFLOW">Garbage overflow</option>
                    <option value="BROKEN_STREETLIGHT">Broken streetlight</option>
                    <option value="DRAINAGE_WATERLOGGING">Drainage / waterlogging</option>
                    <option value="OTHER">Other</option>
                  </select>
                </span>
                <span className="text-[11px] text-[#7E8592] font-semibold">Submitted as selected</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#7E8592] uppercase block">
                GPS location
              </label>
              <div className="mt-1 p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] text-xs font-semibold text-[#191B1F] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2C5E48] shrink-0" />
                <span>{location ? `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : 'Location unavailable'}</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#7E8592] uppercase block">
                Generated Description (You can edit)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="mt-1 w-full p-2.5 rounded-lg bg-white border border-[#E5E3DC] text-xs text-[#191B1F] focus:outline-none focus:border-[#2C5E48]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-[#F4F3EF]">
            <button
              onClick={() => void handleConfirmSubmit()}
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-[#2C5E48] hover:bg-[#1E4333] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting to city…' : 'Confirm & Submit to City'}</span>
            </button>

            <button
              onClick={() => setMode('home')}
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
              Report Successfully Submitted!
            </h2>
            <p className="text-xs text-[#565C68] mt-1 max-w-xs mx-auto">
              'Your report was stored by the SANKET backend and is available to municipal users.'
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] text-xs">
            <span className="text-[#7E8592] block font-mono">Tracking Ticket Number:</span>
            <span className="font-mono font-bold text-sm text-[#191B1F] mt-0.5 block">
              {submittedReportId ?? 'Unavailable'}
            </span>
            {submittedIncidentId && <span className="text-[#7E8592] block mt-1">Incident: {submittedIncidentId}</span>}
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => void loadRecent()}
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
            {recentIncidents.length === 0 ? <div className="p-6 text-center text-xs text-[#7E8592]">No civic incidents available.</div> : recentIncidents.slice(0, 6).map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 bg-white rounded-xl border border-[#E5E3DC] shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#2C5E48]">{formatCategory(inc.category)}</span>
                    <h3 className="text-xs font-bold text-[#191B1F] mt-1">{inc.incident_number}</h3>
                    <p className="text-[11px] text-[#565C68] mt-0.5">{inc.sector_name ?? 'Location unavailable'}</p>
                  </div>
                  <span className="text-[10px] font-bold text-[#565C68]">{formatStatus(inc.status)}</span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#7E8592] pt-2 border-t border-[#F4F3EF]">
                  <span>{inc.waiting_days} days waiting</span>
                  <span className="text-[#1E6B42] font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {inc.confidence_score}% confidence
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

function formatCategory(category: string) {
  return category.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatStatus(status: string) {
  return status.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}
