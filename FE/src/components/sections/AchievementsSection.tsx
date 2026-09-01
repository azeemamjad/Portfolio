import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  Medal,
  Shield,
  Sparkles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Achievement } from '../../types';
import SectionHeader from '../common/SectionHeader';

interface AchievementsSectionProps {
  achievements: Achievement[];
  showHeader?: boolean;
}

const typeConfig: Record<
  Achievement['type'],
  { badge: string; label: string; icon: LucideIcon; accent: string }
> = {
  award: {
    badge: 'bg-surface-muted text-content',
    label: 'Award',
    icon: Medal,
    accent: 'from-accent/8 to-transparent',
  },
  certification: {
    badge: 'bg-surface-muted text-content',
    label: 'Certification',
    icon: Shield,
    accent: 'from-accent/8 to-transparent',
  },
  recognition: {
    badge: 'bg-surface-muted text-content',
    label: 'Recognition',
    icon: Award,
    accent: 'from-accent/8 to-transparent',
  },
  publication: {
    badge: 'bg-surface-muted text-content',
    label: 'Publication',
    icon: BookOpen,
    accent: 'from-accent/8 to-transparent',
  },
  other: {
    badge: 'bg-surface-muted text-content-muted',
    label: 'Other',
    icon: Sparkles,
    accent: 'from-accent/8 to-transparent',
  },
};

const filterOptions: { key: 'all' | Achievement['type']; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'certification', label: 'Certifications' },
  { key: 'award', label: 'Awards' },
  { key: 'recognition', label: 'Recognition' },
  { key: 'publication', label: 'Publications' },
  { key: 'other', label: 'Other' },
];

function getAchievementImageSrc(item: Achievement): string {
  if (item.image) return item.image;
  const seed = encodeURIComponent(`${item.id}-${item.title}`);
  return `https://picsum.photos/seed/${seed}/960/640`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function isExpired(expiryDate: string | null) {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
}

function AchievementVisual({ item }: { item: Achievement }) {
  const cfg = typeConfig[item.type] ?? typeConfig.other;
  const Icon = cfg.icon;
  const [failed, setFailed] = useState(false);
  const src = getAchievementImageSrc(item);

  return (
    <div className={`achievement-glass-card__visual bg-gradient-to-br ${cfg.accent}`}>
      {!failed ? (
        <img
          src={src}
          alt={item.title}
          className="achievement-glass-card__image"
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="achievement-glass-card__placeholder">
          <Icon className="w-16 h-16 text-accent opacity-80" />
        </div>
      )}
      <span className={`achievement-glass-card__type ${cfg.badge}`}>{cfg.label}</span>
    </div>
  );
}

function AchievementCard({ item }: { item: Achievement }) {
  const expired = isExpired(item.expiry_date);

  return (
    <article className="achievement-glass-card">
      <div className="achievement-glass-card__shine" aria-hidden />

      <AchievementVisual item={item} />

      <div className="achievement-glass-card__body">
        <h3 className="achievement-glass-card__title font-semibold tracking-tight">{item.title}</h3>

        <p className="achievement-glass-card__issuer">
          <span className="achievement-glass-card__issuer-label">Issued by</span>
          {item.issuer || '—'}
        </p>

        <p className="achievement-glass-card__description">
          {item.description || 'No additional description provided.'}
        </p>

        <dl className="achievement-glass-card__meta">
          <div className="achievement-glass-card__meta-item">
            <dt>
              <Calendar className="w-3.5 h-3.5" />
              Date received
            </dt>
            <dd>{formatDate(item.date_received)}</dd>
          </div>

          <div className="achievement-glass-card__meta-item">
            <dt>
              <Clock className="w-3.5 h-3.5" />
              Expiry date
            </dt>
            <dd className={expired ? 'achievement-glass-card__expired' : undefined}>
              {item.expiry_date ? (
                <>
                  {formatDate(item.expiry_date)}
                  {expired && <span className="achievement-glass-card__expired-badge">Expired</span>}
                </>
              ) : (
                <span className="text-content-muted font-medium">No expiration</span>
              )}
            </dd>
          </div>
        </dl>

        {item.credential_url ? (
          <a
            href={item.credential_url}
            target="_blank"
            rel="noopener noreferrer"
            className="achievement-glass-card__link"
          >
            <ExternalLink className="w-4 h-4" />
            View credential
          </a>
        ) : (
          <p className="achievement-glass-card__no-link">No credential link provided</p>
        )}
      </div>
    </article>
  );
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  achievements,
  showHeader = true,
}) => {
  const [filter, setFilter] = useState<'all' | Achievement['type']>('all');

  const sorted = useMemo(
    () =>
      [...achievements].sort(
        (a, b) =>
          a.order - b.order ||
          new Date(b.date_received).getTime() - new Date(a.date_received).getTime(),
      ),
    [achievements],
  );

  if (achievements.length === 0) return null;

  const availableFilters = filterOptions.filter(
    (f) => f.key === 'all' || sorted.some((a) => a.type === f.key),
  );

  const filtered = filter === 'all' ? sorted : sorted.filter((a) => a.type === filter);

  const typeCounts = sorted.reduce(
    (acc, a) => {
      acc[a.type] = (acc[a.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const stats = [
    { label: 'Total', value: sorted.length },
    { label: 'Certifications', value: typeCounts.certification ?? 0 },
    { label: 'Awards', value: typeCounts.award ?? 0 },
    {
      label: 'With credential',
      value: sorted.filter((a) => a.credential_url).length,
    },
  ];

  return (
    <section
      className={`achievements-section${showHeader ? ' section-padding' : ' page-content-section'}`}
    >
      <div className="container-custom achievements-section__container">
        {showHeader && (
          <SectionHeader
            label="Recognition"
            title="Achievements & Certs"
            description="Milestones and certifications that reflect my continuous learning journey."
          />
        )}

        <div className="achievements-section__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="achievements-stat-card">
              <div className="achievements-stat-card__shine" aria-hidden />
              <p className="achievements-stat-card__value font-semibold">{stat.value}</p>
              <p className="achievements-stat-card__label">{stat.label}</p>
            </div>
          ))}
        </div>

        {availableFilters.length > 2 && (
          <div className="achievements-section__filters">
            {availableFilters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`achievements-section__filter${
                  filter === f.key ? ' achievements-section__filter--active' : ''
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="achievements-section__grid">
          {filtered.map((item, i) => (
            <div
              key={item.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <AchievementCard item={item} />
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-content-muted py-16">No achievements in this category.</p>
        )}
      </div>
    </section>
  );
};

export default AchievementsSection;
