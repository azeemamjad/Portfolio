import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import type { Achievement } from '../../types';
import SectionHeader from '../common/SectionHeader';

interface ExperienceSectionProps {
  records: Achievement[];
  username?: string;
  variant?: 'summary' | 'full';
  showHeader?: boolean;
  className?: string;
}

const typeConfig: Record<
  Achievement['type'],
  { label: string; badge: string }
> = {
  experience: {
    label: 'Experience',
    badge: 'bg-accent-50 text-accent-700 dark:bg-accent/20 dark:text-accent-300',
  },
  education: {
    label: 'Education',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300',
  },
  award: {
    label: 'Award',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-300',
  },
  certification: {
    label: 'Certification',
    badge: 'bg-accent-50 text-accent-700 dark:bg-accent/20 dark:text-accent-300',
  },
  recognition: {
    label: 'Recognition',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300',
  },
  publication: {
    label: 'Publication',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/35 dark:text-violet-300',
  },
  other: {
    label: 'Milestone',
    badge: 'bg-surface-muted text-content-muted',
  },
};

/** Month/year precision: day-level detail is not claimed for these records. */
function formatMonthYear(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  records,
  username,
  variant = 'full',
  showHeader = true,
  className = '',
}) => {
  // Most recent first.
  const sorted = useMemo(
    () =>
      [...records].sort(
        (a, b) => new Date(b.date_received).getTime() - new Date(a.date_received).getTime(),
      ),
    [records],
  );

  if (sorted.length === 0) return null;

  const hasCredentials = sorted.some((r) => r.credential_url);

  return (
    <section id="experience" className={`experience-section ${className}`.trim()}>
      <div className="container-custom">
        {showHeader && (
          <SectionHeader
            label="Career"
            title="Experience & Education"
            description={
              variant === 'summary'
                ? 'A short record of recent work and study.'
                : 'Work, education and recognitions, most recent first.'
            }
          />
        )}

        <ol className="experience-record-list">
          {sorted.map((record) => {
            const cfg = typeConfig[record.type] ?? typeConfig.other;
            return (
              <li key={record.id} className="experience-record">
                <div className="experience-record__timeline">
                  <time
                    className="experience-record__date"
                    dateTime={record.date_received}
                  >
                    {formatMonthYear(record.date_received)}
                  </time>
                </div>

                <div className="experience-record__body">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-1.5">
                    <h3 className="experience-record__title">{record.title}</h3>
                    <span className={`experience-record__type ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {record.issuer && (
                    <p className="experience-record__issuer">{record.issuer}</p>
                  )}

                  {record.description && (
                    <p
                      className={`experience-record__description ${
                        variant === 'summary' ? 'line-clamp-3' : ''
                      }`}
                    >
                      {record.description}
                    </p>
                  )}

                  {variant === 'full' && hasCredentials && record.credential_url && (
                    <a
                      href={record.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="experience-record__link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                      View credential
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {variant === 'summary' && username && (
          <div className="mt-8">
            <Link
              to={`/${username}/achievements`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded px-1 py-0.5"
            >
              View full experience &amp; education
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
