import React, { useState } from 'react';
import { useCivic } from '../../context/CivicContext';
import { DemoBadge } from '../common/Badges';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
  FileCheck,
  Clock,
  History,
  AlertTriangle
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { incidents, showToast } = useCivic();

  const [selectedReportType, setSelectedReportType] = useState<string>('incident_summary');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('last_30_days');
  const totalReports = incidents.length;
  const waitingReports = incidents.filter((incident) => incident.waitingDays >= 30).length;
  const recurringSites = incidents.filter((incident) => incident.isRecurring).length;

  const handleExport = (format: 'pdf' | 'csv' | 'brief') => {
    showToast(
      `Generating ${format.toUpperCase()} Audit Report`,
      `Municipal compliance dossier compiled for ${selectedReportType.replace('_', ' ').toUpperCase()}. Download simulation initiated.`,
      'success'
    );
  };

  const reports = [
    {
      id: 'incident_summary',
      title: 'Citywide Incident Intake & Triage Summary',
      description: 'Backend-backed audit of civic reports, categorized by severity, risk score, and geographic sector.',
      icon: <FileText className="w-5 h-5 text-[#2C5E48]" />,
      stats: `${totalReports} records loaded`
    },
    {
      id: 'priority_aging',
      title: 'Priority Aging & SLA Breach Audit',
      description: 'Detailed analysis of incidents exceeding the configured waiting threshold, using backend timestamps and score records.',
      icon: <Clock className="w-5 h-5 text-[#C54E38]" />,
      stats: `${waitingReports} records over 30 days`
    },
    {
      id: 'civic_memory',
      title: 'Civic Memory: Recurring Infrastructure Hotspots',
      description: 'Structural failure register identifying repeat infrastructure defects and root-cause engineering recommendations.',
      icon: <History className="w-5 h-5 text-[#C88427]" />,
      stats: `${recurringSites} recurring sites`
    },
    {
      id: 'smart_closure',
      title: 'Field Verification & Smart Closure Compliance',
      description: 'Post-repair photographic evidence, GPS distance validation, and computer vision match confidence records.',
      icon: <FileCheck className="w-5 h-5 text-[#1E6B42]" />,
      stats: 'Match rate unavailable'
    }
  ];

  return (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5E3DC]">
        <div>
          <h1 className="text-2xl font-black text-[#191B1F] tracking-tight">
            Municipal Reports & Audits
          </h1>
          <p className="text-xs sm:text-sm text-[#565C68] mt-0.5">
            Export official summaries, SLA audit trails, and structural failure dossiers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge label="OFFICIAL EXPORT SUITE" />
        </div>
      </div>

      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r) => {
          const isSelected = selectedReportType === r.id;
          return (
            <div
              key={r.id}
              onClick={() => setSelectedReportType(r.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white text-left ${
                isSelected
                  ? 'border-[#191B1F] ring-1 ring-[#191B1F] shadow-sm bg-[#FAF9F5]'
                  : 'border-[#E5E3DC] hover:border-[#191B1F]/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#F4F3EF] shrink-0">{r.icon}</div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191B1F]">{r.title}</h3>
                    <span className="text-[11px] font-mono text-[#7E8592]">{r.stats}</span>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-[#2C5E48] shrink-0 mt-1" />
                )}
              </div>
              <p className="text-xs text-[#565C68] mt-2.5 leading-relaxed">
                {r.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Export Parameter Controls */}
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider pb-2 border-b border-[#E5E3DC]">
          Configure Report Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-[#7E8592] uppercase block mb-1">
              Departmental Filter
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[#E5E3DC] bg-[#FBFBF9] text-xs text-[#191B1F]"
            >
              <option value="all">All Departments (Consolidated)</option>
              <option value="pwd">Public Works Department (Roads)</option>
              <option value="water">Water Supply & Sewerage Board</option>
              <option value="sanitation">Sanitation & Solid Waste</option>
              <option value="electrical">Electricity Department</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#7E8592] uppercase block mb-1">
              Reporting Timeline
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-[#E5E3DC] bg-[#FBFBF9] text-xs text-[#191B1F]"
            >
              <option value="last_30_days">Current Cycle (Last 30 Days)</option>
              <option value="q3_2026">Q3 2026 (Monsoon Protocol)</option>
              <option value="ytd">Year to Date (2026)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-[#7E8592] uppercase block mb-1">
              Data Trust Attribution
            </label>
            <div className="px-3 py-1.5 rounded-lg border border-[#E5E3DC] bg-[#FAF9F5] text-xs font-mono text-[#565C68] truncate">
              Municipal Corporation Chandigarh • Verified
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F4F3EF]">
          <span className="text-[11px] text-[#7E8592] font-mono">
            Output Format: Standard A4 Governance Compliance
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="px-3 py-1.5 rounded-lg border border-[#E5E3DC] bg-[#F4F3EF] hover:bg-[#ECEAE3] text-xs font-bold text-[#191B1F] flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-1.5 rounded-lg bg-[#2C5E48] hover:bg-[#1E4333] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Generate PDF Dossier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
