import React from 'react';
import type { Achievement } from '../../types';

interface TimelineSectionProps {
  achievements: Achievement[];
}

const typeConfig: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  award:         { emoji: '🏆', label: 'Award',         color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/40' },
  certification: { emoji: '📜', label: 'Certification', color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40' },
  recognition:   { emoji: '⭐', label: 'Recognition',   color: 'text-green-600 dark:text-green-400',   bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/40' },
  publication:   { emoji: '📝', label: 'Publication',   color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40' },
  other:         { emoji: '✨', label: 'Milestone',      color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800/40' },
};

const TimelineSection: React.FC<TimelineSectionProps> = ({ achievements }) => {
  if (achievements.length === 0) return null;

  // Sort oldest → newest
  const sorted = [...achievements].sort(
    (a, b) => new Date(a.date_received).getTime() - new Date(b.date_received).getTime()
  );

  // Group by year
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
          <h2 className="heading-secondary text-gray-900 dark:text-white">Road Map</h2>
          <div className="section-underline" />
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-base">
            Key milestones and achievements that shaped my professional journey.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {years.map((year, yi) => (
            <div key={year} className="relative">
              {/* Vertical connector line */}
              {yi < years.length && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/60 to-purple-500/30" />
              )}

              {/* Year badge row */}
              <div className="flex items-center gap-4 mb-5 animate-fade-in-up" style={{ animationDelay: `${yi * 0.15}s` }}>
                {/* Year circle */}
                <div className="relative z-10 w-10 h-10 rounded-full flex-shrink-0
                                bg-gradient-to-br from-primary-600 to-purple-600
                                flex items-center justify-center
                                shadow-lg ring-4 ring-white dark:ring-gray-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-white" />
                </div>

                {/* Year label */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                    {year}
                  </span>
                  <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    {byYear[year].length} milestone{byYear[year].length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Achievement cards for this year */}
              <div className="ml-14 mb-8 space-y-3">
                {byYear[year].map((item, ii) => {
                  const cfg = typeConfig[item.type] || typeConfig.other;
                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-2xl border p-5 ${cfg.bg}
                                  animate-fade-in-up transition-all duration-200
                                  hover:-translate-y-0.5 hover:shadow-md`}
                      style={{ animationDelay: `${yi * 0.15 + ii * 0.08}s` }}
                    >
                      {/* Connector dot to the line */}
                      <div className="absolute -left-[22px] top-1/2 -translate-y-1/2
                                      w-2.5 h-2.5 rounded-full bg-primary-400 dark:bg-primary-500
                                      ring-2 ring-white dark:ring-gray-900" />

                      <div className="flex items-start gap-3">
                        {/* Emoji */}
                        <span className="text-xl flex-shrink-0 mt-0.5">{cfg.emoji}</span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-gray-900 dark:text-white text-base leading-snug">
                              {item.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
                              {cfg.label}
                            </span>
                            {item.issuer && (
                              <>
                                <span className="text-gray-300 dark:text-gray-600 text-xs">·</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.issuer}
                                </span>
                              </>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Month */}
                        <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0 font-medium">
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
          <div className="flex items-center gap-4 ml-0">
            <div className="w-10 h-10 rounded-full flex-shrink-0
                            bg-gradient-to-br from-green-400 to-emerald-500
                            flex items-center justify-center shadow-lg
                            ring-4 ring-white dark:ring-gray-900">
              <span className="text-white text-sm">🚀</span>
            </div>
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              Present — and still growing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
