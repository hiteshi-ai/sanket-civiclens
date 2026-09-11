import React from 'react';
import { RiskLevel, IssueCategory, IncidentStatus } from '../../types/civic';
import {
  AlertTriangle,
  Flame,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Wrench,
  HelpCircle,
  FileQuestion,
  Droplets,
  Lightbulb,
  Trash2,
  Car
} from 'lucide-react';

export const RiskBadge: React.FC<{
  score: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}> = ({ score, size = 'md', showLabel = true }) => {
  let bg = 'bg-[#F4F3EF]';
  let text = 'text-[#565C68]';
  let border = 'border-[#E5E3DC]';
  let label = 'LOW RISK';
  let icon = <ShieldCheck className="w-3.5 h-3.5 text-[#565C68]" />;

  if (score >= 80) {
    bg = 'bg-[#FDF0ED]';
    text = 'text-[#C54E38]';
    border = 'border-[#F8D2CA]';
    label = 'CRITICAL RISK';
    icon = <Flame className="w-3.5 h-3.5 text-[#C54E38]" />;
  } else if (score >= 70) {
    bg = 'bg-[#FDF3F0]';
    text = 'text-[#C54E38]';
    border = 'border-[#F8D8D2]';
    label = 'HIGH RISK';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-[#C54E38]" />;
  } else if (score >= 50) {
    bg = 'bg-[#FDF6EC]';
    text = 'text-[#C88427]';
    border = 'border-[#F9E8CE]';
    label = 'MEDIUM RISK';
    icon = <AlertTriangle className="w-3.5 h-3.5 text-[#C88427]" />;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${bg} ${text} ${border} ${padding}`}
      title={`Civic Risk Score: ${score}/100`}
    >
      {icon}
      <span className="font-bold font-mono">{score}</span>
      {showLabel && <span className="tracking-wide uppercase text-[10px] font-semibold">{label}</span>}
    </span>
  );
};

export const ConfidenceBadge: React.FC<{
  confidence: number;
  size?: 'sm' | 'md';
}> = ({ confidence, size = 'md' }) => {
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  const isHigh = confidence >= 85;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${
        isHigh
          ? 'bg-[#EBF7EF] text-[#1E6B42] border-[#C8EAD4]'
          : 'bg-[#F4F3EF] text-[#565C68] border-[#E5E3DC]'
      } ${padding}`}
      title={`Civic Confidence: ${confidence}%`}
    >
      <CheckCircle2 className={`w-3.5 h-3.5 ${isHigh ? 'text-[#1E6B42]' : 'text-[#7E8592]'}`} />
      <span className="font-bold font-mono">{confidence}%</span>
      <span className="text-[10px] tracking-wide uppercase font-semibold">
        {isHigh ? 'High Confidence' : 'Moderate'}
      </span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: IncidentStatus }> = ({ status }) => {
  switch (status) {
    case 'reported':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F4F3EF] text-[#565C68] border border-[#E5E3DC]">
          <Clock className="w-3 h-3 text-[#7E8592]" />
          Reported
        </span>
      );
    case 'assigned':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF3EE] text-[#2C5E48] border border-[#C5DDD0]">
          <Wrench className="w-3 h-3 text-[#2C5E48]" />
          Assigned
        </span>
      );
    case 'in_progress':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDF6EC] text-[#C88427] border border-[#F9E8CE]">
          <Clock className="w-3 h-3 text-[#C88427]" />
          In Progress
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#EBF7EF] text-[#1E6B42] border border-[#C8EAD4]">
          <CheckCircle2 className="w-3 h-3 text-[#1E6B42]" />
          Resolved
        </span>
      );
    case 'needs_review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FDF0ED] text-[#C54E38] border border-[#F8D2CA]">
          <HelpCircle className="w-3 h-3 text-[#C54E38]" />
          Needs Review
        </span>
      );
    default:
      return null;
  }
};

export const CategoryBadge: React.FC<{ category: IssueCategory }> = ({ category }) => {
  let icon = <FileQuestion className="w-3.5 h-3.5" />;
  let label = 'Civic Issue';
  let color = 'text-[#565C68] bg-[#F4F3EF] border-[#E5E3DC]';

  switch (category) {
    case 'pothole':
      icon = <AlertTriangle className="w-3.5 h-3.5 text-[#C54E38]" />;
      label = 'Pothole';
      color = 'text-[#C54E38] bg-[#FDF0ED] border-[#F8D2CA]';
      break;
    case 'drainage':
      icon = <Droplets className="w-3.5 h-3.5 text-[#24638f]" />;
      label = 'Drainage';
      color = 'text-[#24638f] bg-[#EEF5FA] border-[#D4E4F1]';
      break;
    case 'waste':
      icon = <Trash2 className="w-3.5 h-3.5 text-[#6c584c]" />;
      label = 'Solid Waste';
      color = 'text-[#6c584c] bg-[#F7F4F0] border-[#E8E2D9]';
      break;
    case 'streetlight':
      icon = <Lightbulb className="w-3.5 h-3.5 text-[#C88427]" />;
      label = 'Streetlight';
      color = 'text-[#C88427] bg-[#FDF6EC] border-[#F9E8CE]';
      break;
    case 'road_damage':
      icon = <Car className="w-3.5 h-3.5 text-[#8c503b]" />;
      label = 'Road Damage';
      color = 'text-[#8c503b] bg-[#FAF1EE] border-[#ECCDC5]';
      break;
    case 'water_leak':
      icon = <Droplets className="w-3.5 h-3.5 text-[#1e6074]" />;
      label = 'Water Main';
      color = 'text-[#1e6074] bg-[#EEF6F8] border-[#CFE8EE]';
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border ${color}`}>
      {icon}
      <span>{label}</span>
    </span>
  );
};

export const DemoBadge: React.FC<{ label?: string }> = ({ label = 'DEMO ENVIRONMENT' }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-[#EAE8E1] text-[#565C68] border border-[#DCDAD2]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#7E8592]"></span>
      {label}
    </span>
  );
};
