import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useCivic } from '../../context/CivicContext';
import { ArrowRight, Filter, CheckCircle2, RotateCcw } from 'lucide-react';

export interface DomainItem {
  id: string;
  categoryKey: string;
  name: string;
  count: number;
  pct: number;
  color: string;
  barHex: string;
}

const DEFAULT_DOMAINS: DomainItem[] = [
  {
    id: 'pothole',
    categoryKey: 'pothole',
    name: 'Pothole & Surface',
    count: 8,
    pct: 27,
    color: 'bg-[#C54E38]',
    barHex: '#C54E38'
  },
  {
    id: 'drainage',
    categoryKey: 'drainage',
    name: 'Storm Drainage',
    count: 7,
    pct: 23,
    color: 'bg-[#24638f]',
    barHex: '#24638f'
  },
  {
    id: 'road_damage',
    categoryKey: 'road_damage',
    name: 'Road Damage & Subbase',
    count: 6,
    pct: 20,
    color: 'bg-[#8c503b]',
    barHex: '#8c503b'
  },
  {
    id: 'streetlight',
    categoryKey: 'streetlight',
    name: 'Streetlight & Electrical',
    count: 5,
    pct: 17,
    color: 'bg-[#C88427]',
    barHex: '#C88427'
  },
  {
    id: 'waste',
    categoryKey: 'waste',
    name: 'Solid Waste & Sanitation',
    count: 4,
    pct: 13,
    color: 'bg-[#6c584c]',
    barHex: '#6c584c'
  }
];

interface IssueVolumeByDomainProps {
  data?: DomainItem[];
  totalSampleLabel?: string;
}

export const IssueVolumeByDomain: React.FC<IssueVolumeByDomainProps> = ({
  data = DEFAULT_DOMAINS,
  totalSampleLabel = '30 Sample Incidents'
}) => {
  const { setCategoryFilter, setActiveTab, showToast } = useCivic();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationFinished, setAnimationFinished] = useState(false);

  // Dynamic max count for visual 100% bar reference
  const maxCount = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((d) => d.count), 1);
  }, [data]);

  // Animation values state for each row
  interface AnimatedRowState {
    count: number;
    pct: number;
    scaleX: number;
    isGrowing: boolean;
    isJustCompleted: boolean;
  }

  const [rowStates, setRowStates] = useState<AnimatedRowState[]>(() =>
    data.map((item) => ({
      count: 0,
      pct: 0,
      scaleX: 0,
      isGrowing: false,
      isJustCompleted: false
    }))
  );

  const completedSetRef = useRef<Set<number>>(new Set());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !data || data.length === 0) {
      setRowStates(
        data.map((item) => ({
          count: item.count,
          pct: item.pct,
          scaleX: item.count / maxCount,
          isGrowing: false,
          isJustCompleted: false
        }))
      );
      setAnimationFinished(true);
      return;
    }

    // Reset animation state on mount/route entry
    setAnimationFinished(false);
    completedSetRef.current.clear();

    const initialDelay = 220; // ms
    const itemDuration = 700; // ms per bar
    const stagger = 160; // ms between bars
    const totalAnimationTime = initialDelay + (data.length - 1) * stagger + itemDuration + 200;

    let startTimestamp: number | null = null;

    function easeOutCubic(t: number): number {
      return 1 - Math.pow(1 - t, 3);
    }

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;

      const nextStates: AnimatedRowState[] = data.map((item, idx) => {
        const itemStartTime = initialDelay + idx * stagger;
        const itemElapsed = elapsed - itemStartTime;

        if (itemElapsed <= 0) {
          return {
            count: 0,
            pct: 0,
            scaleX: 0,
            isGrowing: false,
            isJustCompleted: false
          };
        }

        const rawProgress = Math.min(1, itemElapsed / itemDuration);
        const eased = easeOutCubic(rawProgress);

        const currentCount = Math.min(item.count, Math.round(eased * item.count));
        const currentPct = Math.min(item.pct, Math.round(eased * item.pct));
        const targetScaleX = (item.count / maxCount) * eased;

        const isGrowing = rawProgress > 0 && rawProgress < 1;
        const justReached = rawProgress === 1 && !completedSetRef.current.has(idx);

        if (justReached) {
          completedSetRef.current.add(idx);
        }

        return {
          count: currentCount,
          pct: currentPct,
          scaleX: targetScaleX,
          isGrowing,
          isJustCompleted: justReached
        };
      });

      setRowStates(nextStates);

      if (elapsed < totalAnimationTime) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete: guarantee resting values match exactly
        setRowStates(
          data.map((item) => ({
            count: item.count,
            pct: item.pct,
            scaleX: item.count / maxCount,
            isGrowing: false,
            isJustCompleted: false
          }))
        );
        setAnimationFinished(true);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [data, maxCount]);

  // Click handler to select and connect to existing Incidents filter
  const handleSelectDomain = (item: DomainItem) => {
    if (selectedCategory === item.categoryKey) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(item.categoryKey);
    }
  };

  const handleNavigateToIncidents = (item: DomainItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setCategoryFilter(item.categoryKey);
    setActiveTab('incidents');
    showToast(
      'Filter Applied',
      `Incidents directory filtered to ${item.name} (${item.count} records).`,
      'info'
    );
  };

  // Safe empty state
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E3DC] p-6 shadow-xs text-center">
        <p className="text-xs font-bold text-[#191B1F]">No incident volume data available.</p>
        <p className="text-[11px] text-[#7E8592] mt-1">Telemetry stream awaiting municipal connection.</p>
      </div>
    );
  }

  const selectedItem = data.find((d) => d.categoryKey === selectedCategory);

  return (
    <div className="bg-white rounded-xl border border-[#E5E3DC] p-5 shadow-xs space-y-4 text-left transition-colors">
      {/* Header with Title & Live Metadata */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E3DC]">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold text-[#191B1F] uppercase tracking-wider">
            Issue Volume by Domain
          </h3>
          {selectedCategory && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#EBF3EE] text-[#2C5E48] font-bold border border-[#C5DDD0]">
              <Filter className="w-2.5 h-2.5" /> Filter active
            </span>
          )}
        </div>
        <span className="text-[11px] font-mono text-[#7E8592] tracking-tight">
          {totalSampleLabel}
        </span>
      </div>

      {/* Domain Rows */}
      <div className="space-y-3" role="region" aria-label="Issue Volume by Domain Chart">
        {data.map((item, idx) => {
          const state = rowStates[idx] || {
            count: item.count,
            pct: item.pct,
            scaleX: item.count / maxCount,
            isGrowing: false,
            isJustCompleted: false
          };

          const isHovered = hoveredIndex === idx;
          const isSelected = selectedCategory === item.categoryKey;
          const isDimmed = animationFinished && hoveredIndex !== null && !isHovered;

          // Relative bar width in reference to maxCount (8 = 100%, 7 = 87.5%, etc.)
          const finalRelativeWidthPercent = (item.count / maxCount) * 100;

          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`${item.name}: ${item.count} incidents, ${item.pct} percent of volume`}
              onMouseEnter={() => animationFinished && setHoveredIndex(idx)}
              onMouseLeave={() => animationFinished && setHoveredIndex(null)}
              onClick={() => handleSelectDomain(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelectDomain(item);
                }
              }}
              className={`p-1.5 -mx-1.5 rounded-lg transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#191B1F] ${
                isSelected
                  ? 'bg-[#FAF9F5] ring-1 ring-[#191B1F]/30 shadow-xs'
                  : isHovered
                  ? 'bg-[#FBFBF9]'
                  : ''
              } ${isDimmed ? 'opacity-70' : 'opacity-100'}`}
            >
              {/* Row Label & Dynamic Monospace Figures */}
              <div className="flex justify-between items-center text-xs mb-1">
                <span
                  className={`transition-colors duration-150 flex items-center gap-1.5 ${
                    isHovered || isSelected
                      ? 'font-bold text-[#191B1F]'
                      : 'font-semibold text-[#191B1F]'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.barHex }}
                  />
                  <span>{item.name}</span>
                </span>

                {/* Tabular monospace figure prevents width jumping during count-up */}
                <div className="flex items-center gap-1.5 font-mono text-xs tabular-nums">
                  <span
                    className={`font-bold transition-all duration-150 ${
                      state.isJustCompleted
                        ? 'text-[#C54E38] scale-105'
                        : isHovered
                        ? 'text-[#191B1F]'
                        : 'text-[#565C68]'
                    }`}
                  >
                    {state.count}
                  </span>
                  <span className="text-[#7E8592] text-[11px]">
                    ({state.pct}%)
                  </span>
                </div>
              </div>

              {/* Bar Track & Performant Transform Scale Bar */}
              <div className="w-full h-2.5 rounded-full bg-[#F4F3EF] overflow-hidden relative border border-transparent">
                {/* 
                  The base width is the final relative length (e.g. 100%, 87.5%, 75%).
                  We animate transform: scaleX(eased) with transformOrigin: left,
                  avoiding continuous width/layout recalculations.
                */}
                <div
                  className="h-full rounded-full relative overflow-hidden transition-[filter,opacity] duration-150"
                  style={{
                    width: `${finalRelativeWidthPercent}%`,
                    backgroundColor: item.barHex,
                    transform: `scaleX(${state.scaleX / (item.count / maxCount || 1)})`,
                    transformOrigin: 'left',
                    filter: state.isJustCompleted
                      ? 'brightness(1.18)'
                      : isHovered
                      ? 'brightness(1.08)'
                      : 'brightness(1)',
                    willChange: state.isGrowing ? 'transform' : 'auto'
                  }}
                >
                  {/* Subtle traveling highlight while growing */}
                  {state.isGrowing && (
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none"
                      style={{
                        transform: 'skewX(-20deg)',
                        animation: 'pulse 1.2s infinite'
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Compact Active Detail & Quick Filter Button */}
              {isSelected && animationFinished && (
                <div className="mt-2 pt-2 border-t border-[#E5E3DC]/60 flex items-center justify-between text-[11px] text-[#565C68] animate-fade-in">
                  <span className="flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-[#2C5E48]" />
                    <span><b>{item.count}</b> of 30 incidents ({item.pct}% volume)</span>
                  </span>
                  <button
                    onClick={(e) => handleNavigateToIncidents(item, e)}
                    className="px-2 py-0.5 rounded bg-[#191B1F] text-white font-bold text-[10px] hover:bg-[#2C2F35] flex items-center gap-1 transition-colors shadow-xs"
                    title={`Filter Incidents by ${item.name}`}
                  >
                    <span>Inspect Records</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Context Footer (Preserved Civic Insight) */}
      <div className="pt-2 border-t border-[#F4F3EF] flex items-center justify-between text-[11px] text-[#7E8592] leading-snug">
        <p>
          Road and stormwater drainage constitute 70% of total civic disruption in the Chandigarh metropolitan grid.
        </p>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-[10px] font-semibold text-[#2C5E48] hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            <RotateCcw className="w-2.5 h-2.5" /> Clear
          </button>
        )}
      </div>
    </div>
  );
};
