import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Achievement } from '../../types';

interface TimelineSectionProps {
  achievements: Achievement[];
}

const typeConfig: Record<string, { emoji: string; label: string; color: string; accent: string }> = {
  award:         { emoji: '🏆', label: 'Award',         color: 'text-yellow-700', accent: 'border-l-yellow-400' },
  certification: { emoji: '📜', label: 'Certification', color: 'text-orange-700',   accent: 'border-l-orange-500' },
  recognition:   { emoji: '⭐', label: 'Recognition',   color: 'text-green-700',  accent: 'border-l-green-500' },
  publication:   { emoji: '📝', label: 'Publication',   color: 'text-purple-700', accent: 'border-l-purple-500' },
  other:         { emoji: '✨', label: 'Milestone',      color: 'text-orange-700', accent: 'border-l-orange-500' },
};

const CLAMP_THRESHOLD = 120;

const TimelineSection: React.FC<TimelineSectionProps> = ({ achievements }) => {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  if (achievements.length === 0) return null;

  const toggle = (id: number) =>
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const sorted = [...achievements].sort(
    (a, b) => new Date(a.date_received).getTime() - new Date(b.date_received).getTime()
  );

  const byYear: Record<string, Achievement[]> = {};
  sorted.forEach((a) => {
    const year = new Date(a.date_received).getFullYear().toString();
    if (!byYear[year]) byYear[year] = [];
    byYear[year].push(a);
  });

  const years = Object.keys(byYear).sort();

  return (
    <section id="timeline" className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Journey</span>
          <h2 className="heading-secondary text-neutral-900">Road Map</h2>
          <div className="section-underline" />
          <p className="text-neutral-500 mt-5 max-w-xl mx-auto text-base">
            Key milestones and achievements that shaped my professional journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {years.map((year, yi) => (
            <div key={year} className="relative">
              {/* Vertical connector line */}
              {yi < years.length && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-amber-400" />
              )}

              {/* Year badge row */}
              <div className="flex items-center gap-4 mb-5">
                <div className="relative z-10 w-10 h-10 rounded-full flex-shrink-0
                                bg-gradient-to-br from-orange-600 to-amber-600
                                flex items-center justify-center
                                shadow-md ring-4 ring-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-neutral-900 tracking-tight">
                    {year}
                  </span>
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
                    {byYear[year].length} milestone{byYear[year].length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Achievement cards */}
              <div className="ml-14 mb-8 space-y-3">
                {byYear[year].map((item) => {
                  const cfg = typeConfig[item.type] || typeConfig.other;
                  const isExpanded = expanded.has(item.id);
                  const isLong = item.description && item.description.length > CLAMP_THRESHOLD;

                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-2xl border border-neutral-200 border-l-4 p-5
                                  bg-white/90 ${cfg.accent}
                                  transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}
                    >
                      {/* Connector dot */}
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2
                                      w-2.5 h-2.5 rounded-full bg-orange-400
                                      ring-2 ring-white" />

                      <div className="flex items-start gap-3">
                        <span className="text-xl flex-shrink-0 mt-0.5">{cfg.emoji}</span>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-neutral-900 text-base leading-snug mb-1">
                            {item.title}
                          </h3>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            {item.issuer && (
                              <>
                                <span className="text-neutral-300 text-xs">·</span>
                                <span className="text-xs text-neutral-500">{item.issuer}</span>
                              </>
                            )}
                          </div>

                          {item.description && (
                            <>
                              <p className={`text-sm text-neutral-500 mt-1.5 leading-relaxed ${!isExpanded && isLong ? 'line-clamp-2' : ''}`}>
                                {item.description}
                              </p>
                              {isLong && (
                                <button
                                  onClick={() => toggle(item.id)}
                                  className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                  {isExpanded ? 'Show less' : 'Show more'}
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                  />
                                </button>
                              )}
                            </>
                          )}
                        </div>

                        <span className="text-xs text-neutral-400 flex-shrink-0 font-medium">
                          {new Date(item.date_received).toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* End cap */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full flex-shrink-0
                            bg-gradient-to-br from-green-400 to-emerald-500
                            flex items-center justify-center shadow-md ring-4 ring-white">
              <span className="text-white text-sm">🚀</span>
            </div>
            <span className="text-sm font-semibold text-neutral-500">
              Present — and still growing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
