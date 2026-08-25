import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Skill } from '../../types';

interface SkillsMarqueeProps {
  skills: Skill[];
  headline?: string;
  className?: string;
}

const proficiencyBadge: Record<Skill['proficiency'], string> = {
  beginner: 'bg-surface-muted text-content-muted',
  intermediate: 'bg-surface-muted text-content-muted',
  advanced: 'bg-surface-muted text-content',
  expert: 'bg-surface-muted text-content',
};

interface SkillHoverCardProps {
  skill: Skill;
  anchor: DOMRect;
}

const SkillHoverCard: React.FC<SkillHoverCardProps> = ({ skill, anchor }) => {
  const left = anchor.left + anchor.width / 2;
  const top = anchor.bottom + 10;

  return createPortal(
    <div
      className="skills-marquee-card fixed z-[60] w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-line bg-surface shadow-2xl p-4 animate-fade-in pointer-events-none"
      style={{ left, top, transform: 'translateX(-50%)' }}
      role="tooltip"
    >
      <div className="flex items-start gap-3 mb-3">
        {skill.icon && (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-xl">
            {skill.icon}
          </span>
        )}
        <div className="min-w-0">
          <h4 className="font-bold text-content text-sm leading-tight">{skill.name}</h4>
          <span
            className={`inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide capitalize ${proficiencyBadge[skill.proficiency]}`}
          >
            {skill.proficiency}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[10px] text-content-muted mb-1">
          <span>Proficiency</span>
          <span className="font-semibold">{skill.proficiency_percentage}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-content"
            style={{ width: `${skill.proficiency_percentage}%` }}
          />
        </div>
      </div>

      {skill.summary ? (
        <p className="text-xs text-content-muted leading-relaxed">{skill.summary}</p>
      ) : (
        <p className="text-xs text-content-muted leading-relaxed italic">
          Experienced with {skill.name} in production projects.
        </p>
      )}
    </div>,
    document.body,
  );
};

const SkillsMarquee: React.FC<SkillsMarqueeProps> = ({
  skills,
  headline = 'Technologies I work with',
  className = '',
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [cardAnchor, setCardAnchor] = useState<DOMRect | null>(null);
  const [paused, setPaused] = useState(false);

  const items = useMemo(
    () => [...skills].sort((a, b) => a.order - b.order),
    [skills],
  );

  if (items.length === 0) return null;

  const loop = [...items, ...items];

  const handleEnter = (skill: Skill, el: HTMLElement) => {
    setHoveredSkill(skill);
    setCardAnchor(el.getBoundingClientRect());
    setPaused(true);
  };

  const handleLeave = () => {
    setHoveredSkill(null);
    setCardAnchor(null);
    setPaused(false);
  };

  return (
    <div className={`skills-marquee ${className}`}>
      <p className="skills-marquee__headline">{headline}</p>
      <div className="skills-marquee__viewport">
        <div className={`skills-marquee__track${paused ? ' skills-marquee__track--paused' : ''}`}>
          {loop.map((skill, i) => (
            <button
              key={`${skill.name}-${i}`}
              type="button"
              className={`skills-marquee__item${hoveredSkill?.name === skill.name ? ' skills-marquee__item--active' : ''}`}
              aria-hidden={i >= items.length}
              tabIndex={i >= items.length ? -1 : 0}
              onMouseEnter={(e) => handleEnter(skill, e.currentTarget)}
              onMouseLeave={handleLeave}
              onFocus={(e) => handleEnter(skill, e.currentTarget)}
              onBlur={handleLeave}
            >
              {skill.icon && <span className="skills-marquee__icon">{skill.icon}</span>}
              <span className="skills-marquee__name">{skill.name}</span>
            </button>
          ))}
        </div>
      </div>

      {hoveredSkill && cardAnchor && (
        <SkillHoverCard skill={hoveredSkill} anchor={cardAnchor} />
      )}
    </div>
  );
};

export default SkillsMarquee;
