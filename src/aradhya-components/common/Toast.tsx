import React from 'react';
import { useCivic } from '../../context/CivicContext';
import { CheckCircle2, AlertTriangle, Info, Flame, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useCivic();

  if (!toast) return null;

  let icon = <Info className="w-5 h-5 text-[#2C5E48]" />;
  let border = 'border-[#C5DDD0]';
  let bg = 'bg-[#FFFFFF]';

  if (toast.type === 'success') {
    icon = <CheckCircle2 className="w-5 h-5 text-[#1E6B42]" />;
    border = 'border-[#C8EAD4]';
  } else if (toast.type === 'urgent') {
    icon = <Flame className="w-5 h-5 text-[#C54E38]" />;
    border = 'border-[#F8D2CA]';
  } else if (toast.type === 'warning') {
    icon = <AlertTriangle className="w-5 h-5 text-[#C88427]" />;
    border = 'border-[#F9E8CE]';
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div className={`p-4 rounded-xl shadow-xl border ${border} ${bg} flex items-start gap-3 text-left`}>
        <div className="mt-0.5 shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#191B1F] tracking-tight">{toast.title}</p>
          <p className="text-xs text-[#565C68] mt-0.5 leading-relaxed">{toast.message}</p>
        </div>
      </div>
    </div>
  );
};
