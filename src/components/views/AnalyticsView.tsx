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

  const domainData = React.useMemo(() => {
    const catTotals: Record<string, number> = {};
    for (const inc of incidents) {
      catTotals[inc.category] = (catTotals[inc.category] || 0) + 1;
    }
    const totalInc = incidents.length || 1;
    return [
      { id: 'pothole', categoryKey: 'pothole', name: 'Pothole & Surface Damage', count: catTotals['pothole'] || 0, pct: Math.round(((catTotals['pothole'] || 0) / totalInc) * 100), color: 'bg-[#C54E38]', barHex: '#C54E38' },
      { id: 'drainage', categoryKey: 'drainage', name: 'Drainage & Waterlogging', count: catTotals['drainage'] || 0, pct: Math.round(((catTotals['drainage'] || 0) / totalInc) * 100), color: 'bg-[#24638F]', barHex: '#24638F' },
      { id: 'waste', categoryKey: 'waste', name: 'Waste & Secondary Dumps', count: catTotals['waste'] || 0, pct: Math.round(((catTotals['waste'] || 0) / totalInc) * 100), color: 'bg-[#C88427]', barHex: '#C88427' },
      { id: 'streetlight', categoryKey: 'streetlight', name: 'Streetlighting & Electrical', count: catTotals['streetlight'] || 0, pct: Math.round(((catTotals['streetlight'] || 0) / totalInc) * 100), color: 'bg-[#8F6624]', barHex: '#8F6624' },
      { id: 'other', categoryKey: 'other', name: 'Other Civic Hazards', count: catTotals['other'] || 0, pct: Math.round(((catTotals['other'] || 0) / totalInc) * 100), color: 'bg-[#565C68]', barHex: '#565C68' },
    ];
  }, [incidents]);

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
          <DemoBadge label="DEMO TELEMETRY" />
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
              Sector 22 drainage overflows increased by 38%
            </p>
            <p className="text-[11px] text-[#565C68] mt-1 leading-snug">
              Correlated with unvented restaurant grease traps choking the 600mm internal market sewer line.
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
              8 arterial issues exceeded 30-day resolution threshold
            </p>
            <p className="text-[11px] text-[#565C68] mt-1 leading-snug">
              SANKET Priority Aging has raised risk scores by an average of +22 points across these coordinates.
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
              96% Smart Closure match rate achieved
            </p>
            <p className="text-[11px] text-[#565C68] mt-1 leading-snug">
              Spatial GPS validation and photographic computer vision prevent premature fraudulent ticket closures.
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
            14.2 <span className="text-xs font-medium text-[#7E8592]">Days</span>
          </div>
          <span className="text-[11px] text-[#1E6B42] font-medium flex items-center gap-0.5 mt-1">
            -2.4 days vs previous quarter
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
          <span className="text-xs text-[#7E8592] font-semibold uppercase tracking-wider block">
            Citizen Signal Intake
          </span>
          <div className="text-2xl font-black font-mono text-[#191B1F] mt-1">
            418 <span className="text-xs font-medium text-[#7E8592]">Monthly</span>
          </div>
          <span className="text-[11px] text-[#2C5E48] font-medium flex items-center gap-0.5 mt-1">
            92% verified via multi-source fusion
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
            46% of annual asphalt budget spent
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#E5E3DC] shadow-xs">
          <span className="text-xs text-[#7E8592] font-semibold uppercase tracking-wider block">
            High-Risk Resolution Rate
          </span>
          <div className="text-2xl font-black font-mono text-[#2C5E48] mt-1">
            81.4%
          </div>
          <span className="text-[11px] text-[#1E6B42] font-medium block mt-1">
            Critical priority SLA compliance
          </span>
        </div>
      </div>

      {/* Category Breakdown & Spatial Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Category Distribution (Upgraded Animated SANKET Intelligence Component) */}
        <IssueVolumeByDomain data={domainData} totalSampleLabel={`${total} Verified Incidents`} />


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
              <span className="text-[#2C5E48] font-bold font-mono">Cluster &gt;85%</span>
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
              <span className="text-[#1E6B42] font-bold font-mono">96% Visual Verification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
