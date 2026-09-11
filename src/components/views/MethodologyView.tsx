import React, { useState } from 'react';
import { DemoBadge } from '../common/Badges';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
  Clock,
  History,
  AlertTriangle,
  HardHat,
  Eye,
  Camera,
  MapPin,
  FileCheck,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Info,
  Scale,
  Users,
  Building2,
  Ban
} from 'lucide-react';

export const MethodologyView: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>('scoring');
  const [activePipelineStage, setActivePipelineStage] = useState<string | null>('stage-1');

  const scrollToStage = (stageId: string) => {
    setActivePipelineStage(stageId);
    const element = document.getElementById(stageId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const pipelineStages = [
    { id: 'stage-1', num: '01', title: 'Citizen Signal', subtitle: 'Photo, GPS, Text' },
    { id: 'stage-2', num: '02', title: 'AI Classification', subtitle: 'Computer Vision' },
    { id: 'stage-3', num: '03', title: 'Incident Fusion', subtitle: 'Spatial Clustering' },
    { id: 'stage-4', num: '04', title: 'Civic Confidence', subtitle: 'Evidence Corroboration' },
    { id: 'stage-5', num: '05', title: 'Civic Risk', subtitle: 'Urgency & Impact' },
    { id: 'stage-6', num: '06', title: 'Civic Memory', subtitle: 'Recurrence Analysis' },
    { id: 'stage-7', num: '07', title: 'Priority Aging', subtitle: 'Dynamic Escalation' },
    { id: 'stage-8', num: '08', title: 'Field Execution', subtitle: 'Officer Dispatch' },
    { id: 'stage-9', num: '09', title: 'Smart Closure', subtitle: 'Verification Match' },
    { id: 'stage-10', num: '10', title: 'Closed Loop', subtitle: 'Historical Storage' }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E3DC]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#191B1F] tracking-tight">
              SANKET Methodology
            </h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#EBF3EE] text-[#2C5E48] border border-[#C5DDD0]">
              Methodology v1.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#565C68] mt-0.5 leading-relaxed">
            How CivicLens transforms fragmented civic reports into evidence-backed operational decisions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DemoBadge label="DECISION-SUPPORT FRAMEWORK" />
        </div>
      </div>

      {/* ========================================================= */}
      {/* HERO SECTION — INTERACTIVE PIPELINE ARCHITECTURE         */}
      {/* ========================================================= */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E3DC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#E5E3DC]">
          <div>
            <span className="text-[10px] font-bold text-[#7E8592] uppercase tracking-wider block">
              Core Paradigm
            </span>
            <h2 className="text-base font-bold text-[#191B1F]">
              From Citizen Signal → Municipal Action
            </h2>
          </div>
          <span className="text-xs text-[#565C68] italic">
            "Every report is a signal. Together, they reveal the real problem."
          </span>
        </div>

        <p className="text-xs text-[#565C68] leading-relaxed">
          Municipalities are overwhelmed by individual, repeated, and noisy civic complaints. SANKET acts as the intelligence layer, fusing raw observations into corroborated incident clusters, calculating transparent urgency scores, and ensuring repairs are verified before closure.
        </p>

        {/* Interactive Clickable Pipeline Stages */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-[#7E8592] uppercase tracking-wider block mb-2">
            Click any stage to inspect operational methodology:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {pipelineStages.map((stage) => {
              const isActive = activePipelineStage === stage.id;
              return (
                <button
                  key={stage.id}
                  onClick={() => scrollToStage(stage.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#191B1F] text-white border-[#191B1F] shadow-sm'
                      : 'bg-[#FAF9F5] border-[#E5E3DC] text-[#191B1F] hover:border-[#191B1F]/30 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className={isActive ? 'text-emerald-300 font-bold' : 'text-[#7E8592]'}>
                      {stage.num}
                    </span>
                    <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                  </div>
                  <div className="text-xs font-bold leading-snug truncate">{stage.title}</div>
                  <div className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-white/70' : 'text-[#7E8592]'}`}>
                    {stage.subtitle}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 10 DETAILED OPERATIONAL METHODOLOGY STAGES                */}
      {/* ========================================================= */}
      <div className="space-y-4">
        {/* METHOD 01 */}
        <div id="stage-1" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Citizen Signal Intake
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4]">
              Evidence capture
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Citizens submit an on-site photo, optional voice/text description, device geolocation coordinates, and network timestamp. The system ingests and structures the raw data stream rather than storing it as an isolated grievance ticket.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
              <span className="text-[10px] font-bold uppercase text-[#7E8592] block mb-1">Input Telemetry</span>
              <ul className="space-y-0.5 text-[#191B1F] font-mono text-[11px]">
                <li>• Raw photographic raster image</li>
                <li>• Voice transcript / Citizen text</li>
                <li>• GNSS Latitude & Longitude (±3m)</li>
                <li>• ISO 8601 atomic timestamp</li>
              </ul>
            </div>
            <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
              <span className="text-[10px] font-bold uppercase text-[#7E8592] block mb-1">Structured Output</span>
              <p className="text-[#191B1F] leading-snug">
                Normalized spatial vector with sensory metadata ready for multi-signal fusion.
              </p>
            </div>
          </div>
        </div>

        {/* METHOD 02 */}
        <div id="stage-2" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                AI Issue Classification
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
              Assistive model
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Computer vision edge models and natural language parsing examine the photo and description to classify the defect into standardized municipal categories:
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            {['Pothole & Surface', 'Storm Drainage', 'Road Damage & Subbase', 'Streetlight & Electrical', 'Solid Waste & Sanitation'].map((cat) => (
              <span key={cat} className="px-2.5 py-1 rounded bg-[#FAF9F5] border border-[#E5E3DC] font-semibold text-[#191B1F]">
                {cat}
              </span>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-[#FDF6EC] border border-[#F9E8CE] text-xs text-[#8F5A17] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#C88427] shrink-0 mt-0.5" />
            <span>
              <b>Trust Principle:</b> "AI output is an assistive classification and should not be treated as ground truth without supervisory verification."
            </span>
          </div>
        </div>

        {/* METHOD 03 */}
        <div id="stage-3" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Incident Fusion & Spatial Clustering
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
              Spatial algorithm
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Multiple citizen reports frequently describe the same physical problem from different angles and times. SANKET groups signals by evaluating spatial proximity, temporal overlap, category match, and image embedding similarity.
          </p>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-around text-center text-xs">
            <div className="space-y-1">
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5E3DC] font-mono text-[10px] block">Citizen Report A</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5E3DC] font-mono text-[10px] block">Citizen Report B</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#E5E3DC] font-mono text-[10px] block">Citizen Report C</span>
            </div>

            <div className="flex items-center gap-1 text-[#2C5E48] font-bold text-sm">
              <span>→</span>
              <Layers className="w-4 h-4" />
              <span>→</span>
            </div>

            <div className="p-3 rounded-xl bg-[#EBF3EE] border border-[#C5DDD0] text-left">
              <span className="text-[10px] font-bold uppercase text-[#2C5E48] block">Fused Entity</span>
              <span className="font-bold text-[#191B1F] text-xs block">One Potential Incident Cluster</span>
              <span className="text-[10px] text-[#565C68] block mt-0.5">Evaluated against cluster threshold</span>
            </div>
          </div>
        </div>

        {/* METHOD 04 */}
        <div id="stage-4" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                4
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Civic Confidence Synthesis
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4] font-bold">
              Corroboration score
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Civic Confidence represents how strongly the available telemetry supports treating multiple incoming signals as the same real-world failure. It is derived from 5 verifiable dimensions rather than an arbitrary probability.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1 border-b border-[#E5E3DC]">
              <span className="font-bold text-[#191B1F]">Illustrative Prototype Example</span>
              <span className="font-mono font-black text-sm text-[#1E6B42]">Overall: 92% Confidence</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-white p-2 rounded border border-[#E5E3DC]">
                <span className="text-[#7E8592] block text-[10px]">Independent Reports</span>
                <span className="font-bold text-[#191B1F]">17 signals</span>
              </div>
              <div className="bg-white p-2 rounded border border-[#E5E3DC]">
                <span className="text-[#7E8592] block text-[10px]">Location Agreement</span>
                <span className="font-bold text-[#191B1F]">4.2m Radius</span>
              </div>
              <div className="bg-white p-2 rounded border border-[#E5E3DC]">
                <span className="text-[#7E8592] block text-[10px]">Visual Similarity</span>
                <span className="font-bold text-[#191B1F]">91% Match</span>
              </div>
              <div className="bg-white p-2 rounded border border-[#E5E3DC]">
                <span className="text-[#7E8592] block text-[10px]">Temporal Cluster</span>
                <span className="font-bold text-[#191B1F]">Strong</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#EBF7EF] border border-[#C8EAD4] text-xs text-[#1E6B42] font-bold text-center">
            "Confidence is evidence synthesis, not certainty."
          </div>
        </div>

        {/* METHOD 05 */}
        <div id="stage-5" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                5
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Civic Risk Score
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FDF0ED] text-[#C54E38] border border-[#F8D2CA] font-bold">
              Urgency model
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Civic Risk is an operational decision-support index (0–100) intended to help municipal teams compare the urgency and potential impact of incidents. It synthesizes physical severity, traffic/public exposure, sensitive zone proximity, and waiting time.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#191B1F] block">Sector 17 Commercial Corridor Pothole</span>
              <span className="text-[11px] text-[#565C68]">34,000 transit vehicles daily • 32 days waiting</span>
            </div>
            <div className="text-right">
              <span className="font-mono font-black text-xl text-[#C54E38]">87 / 100</span>
              <span className="block text-[10px] text-[#7E8592]">Illustrative prototype score</span>
            </div>
          </div>

          <p className="text-[11px] text-[#7E8592] italic">
            * The production model requires calibration against historical municipal outcomes and statutory engineering guidelines.
          </p>
        </div>

        {/* METHOD 06 */}
        <div id="stage-6" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                6
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Civic Memory (Infrastructure Recurrence)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FDF6EC] text-[#C88427] border border-[#F9E8CE] font-bold">
              Pattern engine
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Civic Memory shifts municipal governance from one-off complaint handling to systemic infrastructure pattern detection. When multiple incidents recur at the same coordinate, SANKET flags root structural causes.
          </p>

          {/* Sector 17 Timeline Example */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] font-bold text-[#7E8592] uppercase tracking-wider block mb-2">
              Chronological Sequence: Sector 17 Commercial Loop
            </span>
            <div className="flex items-center justify-between text-xs font-mono text-center">
              <div>
                <span className="text-[10px] text-[#7E8592] block">JANUARY</span>
                <span className="font-bold text-[#191B1F]">Pothole</span>
                <span className="text-[9px] text-[#7E8592] block">Cold Mix Patch</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#C88427]" />
              <div>
                <span className="text-[10px] text-[#7E8592] block">APRIL</span>
                <span className="font-bold text-[#191B1F]">Road Crack</span>
                <span className="text-[9px] text-[#7E8592] block">Slurry Seal</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#C88427]" />
              <div>
                <span className="text-[10px] text-[#C54E38] font-bold block">AUGUST</span>
                <span className="font-bold text-[#C54E38]">Twin Crater</span>
                <span className="text-[9px] text-[#C54E38] block">Subgrade Seepage</span>
              </div>
            </div>
          </div>
        </div>

        {/* METHOD 07 */}
        <div id="stage-7" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                7
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Priority Aging & Fairness Mechanism
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
              Fairness guardrail
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            A critical issue should receive immediate action, but lower-severity neighborhood problems should never languish indefinitely simply because new high-risk tickets arrive. Priority Aging dynamically raises attention weight over time.
          </p>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
              <span className="font-mono text-[10px] text-[#7E8592] block">Day 1</span>
              <span className="font-bold text-[#191B1F]">Low Factor</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
              <span className="font-mono text-[10px] text-[#7E8592] block">Day 15</span>
              <span className="font-bold text-[#191B1F]">Moderate (+10)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FDF6EC] border border-[#F9E8CE]">
              <span className="font-mono text-[10px] text-[#C88427] block">Day 30</span>
              <span className="font-bold text-[#C88427]">Elevated (+22)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FDF0ED] border border-[#F8D2CA]">
              <span className="font-mono text-[10px] text-[#C54E38] block">Day 45</span>
              <span className="font-bold text-[#C54E38]">Critical SLA (+35)</span>
            </div>
          </div>
        </div>

        {/* METHOD 08 */}
        <div id="stage-8" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                8
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Field Officer Execution
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
              Mobile workflow
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            Once an issue is triaged, it flows directly to a field crew mobile interface. Field officers receive the exact coordinates, turn-by-turn routing, citizen photos, and work instructions without wading through complex administrative dashboards.
          </p>

          <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between text-xs font-mono">
            <span>Priority Queue</span>
            <span>→</span>
            <span>Team Assignment</span>
            <span>→</span>
            <span>Field Visit</span>
            <span>→</span>
            <span>Repair & Evidence</span>
          </div>
        </div>

        {/* METHOD 09 */}
        <div id="stage-9" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                9
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Smart Closure Match
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4] font-bold">
              Verification engine
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            After-repair evidence submitted by the field crew is compared against the original intake report. SANKET checks spatial distance and visual feature alignment to ensure the repair was executed at the genuine failure location.
          </p>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E3DC] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-[#191B1F]">Closure Verification Match: 96%</span>
              <span className="text-[11px] text-[#565C68] block mt-0.5">8 metres from reported coordinate • High visual alignment</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-1 rounded bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4]">Eligible for Closure</span>
            </div>
          </div>
        </div>

        {/* METHOD 10 */}
        <div id="stage-10" className="p-5 rounded-xl bg-white border border-[#E5E3DC] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#EBF3EE] text-[#2C5E48] text-xs font-mono font-bold flex items-center justify-center">
                10
              </span>
              <h3 className="text-sm font-bold text-[#191B1F]">
                Closed-Loop Learning & Historical Storage
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FAF9F5] text-[#7E8592] border border-[#E5E3DC]">
              Civic record
            </span>
          </div>

          <p className="text-xs text-[#565C68] leading-relaxed">
            A resolved ticket is not discarded. Its before/after imagery, materials used, turnaround time, and spatial coordinates are permanently committed to the municipal Civic Memory ledger to support preventative maintenance planning.
          </p>

          <div className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC] text-[11px] font-mono text-[#565C68]">
            Reported → Clustered → Prioritized → Assigned → Repaired → Verified → Stored in Civic Memory
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* EXPANDABLE SECTION: HOW SANKET SCORES WORK                */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] shadow-xs overflow-hidden">
        <button
          onClick={() => setExpandedSection(expandedSection === 'scoring' ? null : 'scoring')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF9F5] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#2C5E48]" />
            <span className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              How SANKET Scores Work (Technical Synthesis)
            </span>
          </div>
          {expandedSection === 'scoring' ? (
            <ChevronUp className="w-4 h-4 text-[#7E8592]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#7E8592]" />
          )}
        </button>

        {expandedSection === 'scoring' && (
          <div className="p-5 border-t border-[#E5E3DC] bg-[#FAF9F5]/50 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-lg bg-white border border-[#E5E3DC] space-y-1">
                <span className="font-bold text-[#1E6B42] block">1. Civic Confidence (Evidence Synthesis)</span>
                <p className="text-[#565C68] leading-relaxed">
                  Evaluates independent citizen reports, GNSS spatial overlap within configured radius (e.g. 100m), temporal burst clustering, and computer vision feature matching.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E5E3DC] space-y-1">
                <span className="font-bold text-[#C54E38] block">2. Civic Risk (Decision Support)</span>
                <p className="text-[#565C68] leading-relaxed">
                  Weighted combination of physical hazard severity (crater depth, pipe rupture volume), transit exposure (arterial vehicles daily), sensitive zone proximity, and waiting penalty.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E5E3DC] space-y-1">
                <span className="font-bold text-[#C88427] block">3. Priority Aging (Fairness Guardrail)</span>
                <p className="text-[#565C68] leading-relaxed">
                  Calculates elapsed waiting days against statutory SLA boundaries, applying progressive multipliers so older tickets escalate upward through the queue.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-white border border-[#E5E3DC] space-y-1">
                <span className="font-bold text-[#2C5E48] block">4. Smart Closure (Verification Engine)</span>
                <p className="text-[#565C68] leading-relaxed">
                  Evaluates post-repair field photos against intake evidence and verifies physical device coordinates within an allowable spatial tolerance.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-[#7E8592] italic pt-2 border-t border-[#E5E3DC]">
              * Note: Production weights are configurable per municipality and require empirical calibration against historical outcomes.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* WHAT SANKET DOES NOT CLAIM (TRUST LAYER)                  */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2">
            <Ban className="w-4 h-4 text-[#C54E38]" />
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              What SANKET Does Not Claim
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#C54E38] font-bold">
            Ethical AI Boundaries
          </span>
        </div>

        <p className="text-xs text-[#565C68] leading-relaxed">
          To maintain transparency and governance trust, the platform explicitly defines its limitations:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {[
            {
              title: 'AI classification ≠ ground truth',
              desc: 'Computer vision predictions are assistive suggestions, not infallible physical measurements.'
            },
            {
              title: 'Confidence score ≠ statistical certainty',
              desc: 'Civic Confidence measures multi-signal agreement, not absolute mathematical proof.'
            },
            {
              title: 'Risk score ≠ validated risk prediction',
              desc: 'Civic Risk is a prioritization heuristic that must be calibrated by municipal engineers.'
            },
            {
              title: 'Prototype telemetry ≠ live municipal data',
              desc: 'Current demo scores use simulated Chandigarh scenarios for hackathon evaluation.'
            },
            {
              title: 'AI recommendation ≠ authority decision',
              desc: 'SANKET assists officers; statutory dispatch authority remains entirely with municipal supervisors.'
            },
            {
              title: 'Closure match ≠ proof without evidence',
              desc: 'Smart Closure requires inspectable photographic and spatial evidence at all times.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-3 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
              <span className="font-bold text-[#C54E38] block">{item.title}</span>
              <p className="text-[11px] text-[#565C68] mt-1 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* EVIDENCE FIRST TRACEABILITY MODEL                         */}
      {/* ========================================================= */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-[#2C5E48]" />
            <h2 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
              Evidence-First Traceability Model
            </h2>
          </div>
          <span className="text-[11px] font-mono text-[#7E8592]">
            Audit Standard
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Source</span>
            <span className="font-bold text-[#191B1F] text-[11px]">Where from?</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Timestamp</span>
            <span className="font-bold text-[#191B1F] text-[11px]">When logged?</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Location</span>
            <span className="font-bold text-[#191B1F] text-[11px]">Where at?</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Evidence</span>
            <span className="font-bold text-[#191B1F] text-[11px]">What signals?</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Confidence</span>
            <span className="font-bold text-[#191B1F] text-[11px]">How strong?</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#FAF9F5] border border-[#E5E3DC]">
            <span className="text-[10px] uppercase font-bold text-[#7E8592] block">Status</span>
            <span className="font-bold text-[#191B1F] text-[11px]">What stage?</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* FINAL STATEMENT: THE SANKET DECISION LOOP                 */}
      {/* ========================================================= */}
      <div className="p-6 rounded-2xl bg-[#FAF9F5] border border-[#E5E3DC] text-center space-y-3">
        <span className="text-[11px] font-bold text-[#2C5E48] uppercase tracking-wider block">
          The SANKET Decision Loop
        </span>
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono font-bold text-[#191B1F]">
          <span>Citizen Signal</span>
          <span className="text-[#7E8592]">→</span>
          <span>Understand</span>
          <span className="text-[#7E8592]">→</span>
          <span>Fuse</span>
          <span className="text-[#7E8592]">→</span>
          <span>Prioritize</span>
          <span className="text-[#7E8592]">→</span>
          <span>Execute</span>
          <span className="text-[#7E8592]">→</span>
          <span>Verify</span>
          <span className="text-[#7E8592]">→</span>
          <span>Remember</span>
          <span className="text-[#7E8592]">→</span>
          <span className="text-[#2C5E48]">Improve Future Decisions</span>
        </div>

        <p className="text-xs text-[#565C68] max-w-xl mx-auto leading-relaxed pt-2 border-t border-[#E5E3DC]">
          "SANKET is designed as a decision-support intelligence layer. It does not replace municipal authority; it helps teams make more informed, traceable, and timely decisions."
        </p>
      </div>
    </div>
  );
};
