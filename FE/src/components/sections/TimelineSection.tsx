import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { Achievement } from '../../types';
import SectionHeader from '../common/SectionHeader';
import Card from '../common/Card';

interface TimelineSectionProps {
  achievements: Achievement[];
}

type AchievementType = Achievement['type'];

const typeConfig: Record<
  AchievementType | 'other',
  { emoji: string; label: string; badge: string }
> = {
  award: {
    emoji: '🏆',
    label: 'Award',
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-300',
  },
  certification: {
    emoji: '📜',
    label: 'Certification',
    badge: 'bg-accent-50 text-accent-700 dark:bg-accent/20 dark:text-accent-300',
  },
  recognition: {
    emoji: '⭐',
    label: 'Recognition',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300',
  },
  publication: {
    emoji: '📝',
    label: 'Publication',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/35 dark:text-violet-300',
  },
  other: {
    emoji: '✨',
    label: 'Milestone',
    badge: 'bg-surface-muted text-content-muted',
  },
};

const CLAMP_THRESHOLD = 160;

function formatMonth(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const TimelineSection: React.FC<TimelineSectionProps> = ({ achievements }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const snapOffsetsRef = useRef<number[]>([]);
  const [sectionHeight, setSectionHeight] = useState<number | null>(null);
  const [activeSnap, setActiveSnap] = useState(0);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [useSimpleScroll, setUseSimpleScroll] = useState(false);

  const sorted = useMemo(
    () =>
      [...achievements].sort(
        (a, b) => new Date(a.date_received).getTime() - new Date(b.date_received).getTime(),
      ),
    [achievements],
  );

  const snapCount = sorted.length + 2;

  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const computeSnapOffsets = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    track.style.transform = 'translate3d(0, -50%, 0)';
    const snaps = track.querySelectorAll<HTMLElement>('[data-roadmap-snap]');
    const viewportCenter = window.innerWidth / 2;

    const offsets = Array.from(snaps).map((el) => {
      const rect = el.getBoundingClientRect();
      const childCenter = rect.left + rect.width / 2;
      return viewportCenter - childCenter;
    });

    snapOffsetsRef.current = offsets;
    const travel =
      offsets.length > 1 ? Math.abs(offsets[offsets.length - 1] - offsets[0]) : 0;
    setSectionHeight(window.innerHeight + travel);
  }, []);

  const applyTranslate = useCallback((translateX: number) => {
    const track = trackRef.current;
    if (!track) return;

    track.style.transform = `translate3d(${translateX}px, -50%, 0)`;

    const offsets = snapOffsetsRef.current;
    if (offsets.length === 0) return;

    let closest = 0;
    let minDist = Infinity;
    offsets.forEach((off, i) => {
      const dist = Math.abs(translateX - off);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveSnap(closest);
  }, []);

  const updateScroll = useCallback(() => {
    const section = sectionRef.current;
    if (!section || useSimpleScroll) return;

    const offsets = snapOffsetsRef.current;
    if (offsets.length === 0) return;

    const startT = offsets[0];
    const endT = offsets[offsets.length - 1];
    const scrollable = section.offsetHeight - window.innerHeight;

    if (scrollable <= 0) {
      applyTranslate(startT);
      return;
    }

    const rect = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -rect.top / scrollable));
    const translateX = startT + p * (endT - startT);
    applyTranslate(translateX);
  }, [useSimpleScroll, applyTranslate]);

  const measureSection = useCallback(() => {
    computeSnapOffsets();
    requestAnimationFrame(updateScroll);
  }, [computeSnapOffsets, updateScroll]);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const narrow = window.matchMedia('(max-width: 767px)').matches;
    setUseSimpleScroll(reduced || narrow);
  }, []);

  useLayoutEffect(() => {
    if (useSimpleScroll) return;
    measureSection();
  }, [sorted, useSimpleScroll, measureSection]);

  useEffect(() => {
    if (useSimpleScroll) return;

    const onScroll = () => updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureSection);

    const track = trackRef.current;
    const ro = track ? new ResizeObserver(measureSection) : null;
    if (track && ro) ro.observe(track);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureSection);
      ro?.disconnect();
    };
  }, [useSimpleScroll, updateScroll, measureSection]);

  if (achievements.length === 0) return null;

  const snapClass = (index: number) => {
    const base = 'roadmap-snap shrink-0';
    if (useSimpleScroll) return base;
    return `${base}${index === activeSnap ? ' roadmap-snap--active' : ' roadmap-snap--dim'}`;
  };

  const renderCard = (item: Achievement, snapIndex: number, showYear?: string) => {
    const cfg = typeConfig[item.type] || typeConfig.other;
    const isExpanded = expanded.has(item.id);
    const isLong = Boolean(item.description && item.description.length > CLAMP_THRESHOLD);

    return (
      <article
        key={item.id}
        data-roadmap-snap
        className={`${snapClass(snapIndex)} roadmap-card`}
      >
        <Card className="roadmap-card__inner h-full p-8 md:p-12" hover={false}>
          <div className="flex items-start justify-between gap-4 mb-6">
            <span className="text-4xl md:text-5xl" aria-hidden>
              {cfg.emoji}
            </span>
            <div className="text-right">
              {showYear && (
                <p className="text-sm font-bold text-accent mb-1">{showYear}</p>
              )}
              <time className="text-sm md:text-base font-semibold text-content-muted whitespace-nowrap">
                {formatMonth(item.date_received)}
              </time>
            </div>
          </div>

          <span
            className={`inline-block px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold uppercase tracking-wide mb-5 ${cfg.badge}`}
          >
            {cfg.label}
          </span>

          <h3 className="text-2xl md:text-3xl font-bold text-content leading-snug mb-3">
            {item.title}
          </h3>

          {item.issuer && (
            <p className="text-base md:text-lg font-medium text-accent mb-5">{item.issuer}</p>
          )}

          {item.description && (
            <>
              <p
                className={`text-lg md:text-xl text-content-muted leading-relaxed ${
                  !isExpanded && isLong ? 'line-clamp-5' : ''
                }`}
              >
                {item.description}
              </p>
              {isLong && (
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:opacity-80 transition-opacity"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              )}
            </>
          )}
        </Card>
      </article>
    );
  };

  let snapIndex = 0;

  const trackContent = (
    <>
      <article data-roadmap-snap className={`${snapClass(snapIndex++)} roadmap-slide`}>
        <Card className="roadmap-slide__inner h-full p-8 md:p-12 flex flex-col justify-center" hover={false}>
          <p className="text-sm font-bold uppercase tracking-widest text-accent mb-4">Start</p>
          <h3 className="text-2xl md:text-4xl font-bold text-content mb-4">The journey begins</h3>
          <p className="text-lg md:text-xl text-content-muted leading-relaxed">
            Scroll down to move through each milestone. Scroll back up anytime to revisit.
          </p>
          <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Scroll down <ArrowRight className="w-4 h-4 rotate-90" />
          </p>
        </Card>
      </article>

      {sorted.map((item, index) => {
        const year = new Date(item.date_received).getFullYear().toString();
        const prevYear =
          index > 0
            ? new Date(sorted[index - 1].date_received).getFullYear().toString()
            : null;
        const currentSnap = snapIndex++;
        return renderCard(item, currentSnap, year !== prevYear ? year : undefined);
      })}

      <article data-roadmap-snap className={`${snapClass(snapIndex)} roadmap-slide`}>
        <Card
          className="roadmap-slide__inner roadmap-slide__inner--end h-full p-8 md:p-12 flex flex-col justify-center"
          hover={false}
        >
          <p className="text-4xl mb-4" aria-hidden>
            🚀
          </p>
          <h3 className="text-2xl md:text-4xl font-bold text-content mb-4">Present day</h3>
          <p className="text-lg md:text-xl text-content-muted leading-relaxed">
            Still learning, building, and growing.
          </p>
          <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
            Keep scrolling <ArrowRight className="w-4 h-4 rotate-90" />
          </p>
        </Card>
      </article>
    </>
  );

  if (useSimpleScroll) {
    return (
      <section id="timeline" className="roadmap-section roadmap-section--simple py-20 md:py-24 bg-section-alt">
        <div className="container-custom mb-10 md:mb-12">
          <SectionHeader
            label="Journey"
            title="Road Map"
            description="Key milestones and achievements that shaped my professional journey."
          />
        </div>
        <div className="roadmap-simple-viewport overflow-x-auto pb-4 snap-x snap-mandatory">
          <div ref={trackRef} className="roadmap-track roadmap-track--simple">
            {trackContent}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="roadmap-section relative bg-section-alt overscroll-none"
      style={{ height: sectionHeight ?? `${snapCount * 100}vh` }}
    >
      <div className="roadmap-panel roadmap-panel--sticky bg-section-alt">
        <div className="container-custom pt-16 md:pt-20 pb-6 shrink-0">
          <SectionHeader
            className="!mb-6 md:!mb-8"
            label="Journey"
            title="Road Map"
            description="One milestone at a time — scroll down or back up to explore."
          />
          <div className="roadmap-progress" aria-hidden>
            <div
              className="roadmap-progress__bar"
              style={{
                width: `${snapCount > 1 ? (activeSnap / (snapCount - 1)) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        <div className="relative flex-1 min-h-0 overflow-hidden touch-pan-y">
          <div className="roadmap-rail" aria-hidden />
          <div ref={trackRef} className="roadmap-track roadmap-track--pinned">
            {trackContent}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
