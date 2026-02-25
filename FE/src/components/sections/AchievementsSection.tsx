import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const typeConfig: Record<string, { badge: string; label: string }> = {
  award:         { badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Award' },
  certification: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',         label: 'Certification' },
  recognition:   { badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',     label: 'Recognition' },
  publication:   { badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', label: 'Publication' },
  other:         { badge: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',            label: 'Other' },
};

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  if (achievements.length === 0) return null;

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Recognition</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">Achievements & Certs</h2>
          <div className="section-underline" />
          <p className="text-gray-500 dark:text-gray-400 mt-5 max-w-xl mx-auto text-base">
            Milestones and certifications that reflect my continuous learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {achievements.map((item, i) => {
            const cfg = typeConfig[item.type] || typeConfig.other;
            return (
              <div
                key={item.id}
                className="card p-6 group hover:-translate-y-1 animate-fade-in-up flex gap-5"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Image / icon */}
                <div className="flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 object-contain rounded-xl border border-gray-100 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100
                                    dark:from-primary-950/50 dark:to-purple-950/50
                                    flex items-center justify-center">
                      <Award className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    {item.credential_url && (
                      <a
                        href={item.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-500 hover:text-primary-600 dark:text-primary-400 flex-shrink-0"
                        aria-label="View credential"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                    {item.title}
                  </h3>

                  {item.issuer && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{item.issuer}</p>
                  )}

                  {item.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{item.description}</p>
                  )}

                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{fmt(item.date_received)}</span>
                    {item.expiry_date && (
                      <span className="text-gray-300 dark:text-gray-600">· Expires {fmt(item.expiry_date)}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
