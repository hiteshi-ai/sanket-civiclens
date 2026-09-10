import React from 'react';

type LogoProps = {
  compact?: boolean;
  iconOnly?: boolean;
  dark?: boolean;
  className?: string;
};

/** A compact, vector-first CivicLens mark: aperture blades sit inside the C's counter. */
export const CivicLensLogo: React.FC<LogoProps> = ({ compact = false, iconOnly = false, dark = false, className = '' }) => {
  const ink = dark ? '#F5F2EC' : '#20262B';
  const slate = dark ? '#A8BECC' : '#405A73';
  const size = compact ? 30 : 36;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`} aria-label="CivicLens">
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" className="shrink-0">
        <path d="M39.5 13.4A19.6 19.6 0 1 0 39.5 34" stroke={ink} strokeWidth="6.8" strokeLinecap="butt" />
        <circle cx="24" cy="24" r="12.1" fill={dark ? '#283238' : '#E8E7E2'} stroke={slate} strokeWidth="1.6" />
        <g fill={slate} opacity=".98">
          <path d="m24 14.1 7.3 4.25-7.3 4.24z" /><path d="m32.57 19.05.05 8.45-7.3-4.24z" />
          <path d="m28.75 31.45-7.35 4.2.05-8.45z" /><path d="m19.25 31.45-3.8-7.37 7.35 4.2z" />
          <path d="m15.43 19.05 7.32-4.2-.05 8.45z" /><path d="m32.57 28.95-7.32 4.2.05-8.45z" />
        </g>
        <circle cx="24" cy="24" r="3.1" fill={dark ? '#F5F2EC' : '#F5F2EC'} />
        <path d="M9.2 12.8a17 17 0 0 0-1.4 5.2" stroke="#B86445" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M8.2 30.7a17 17 0 0 0 2.2 4.2" stroke="#6E8F89" strokeWidth="2.3" strokeLinecap="round" />
      </svg>
      {!iconOnly && (
        <span className={`font-extrabold tracking-[-0.055em] ${compact ? 'text-sm' : 'text-base'}`} style={{ color: ink }}>
          <span>Civic</span><span style={{ color: slate }}>Lens</span>
        </span>
      )}
    </div>
  );
};
