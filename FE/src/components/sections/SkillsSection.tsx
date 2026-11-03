import React, { useMemo } from 'react';
import {
  Code,
  Database,
  Layers,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Skill } from '../../types';
import SectionHeader from '../common/SectionHeader';
import SkillsMarquee from '../common/SkillsMarquee';

interface SkillsSectionProps {
  skills: Skill[];
  showHeader?: boolean;
}

const categories: {
  key: Skill['category'];
  label: string;
  eyebrow: string;
  icon: LucideIcon;
}[] = [
  { key: 'programming', label: 'Languages', eyebrow: 'Code', icon: Code },
  { key: 'framework', label: 'Frameworks & Libraries', eyebrow: 'Build', icon: Layers },
  { key: 'database', label: 'Databases', eyebrow: 'Data', icon: Database },
  { key: 'tool', label: 'Tools & Platforms', eyebrow: 'Ops', icon: Wrench },
  { key: 'soft', label: 'Working Practices', eyebrow: 'People', icon: Users },
  { key: 'other', label: 'Other', eyebrow: 'More', icon: Sparkles },
];

function SkillCard({ skill }: { skill: Skill }) {
  // Capability statement instead of a subjective rating (UX-09).
  const summary =
    skill.summary?.trim() || `Hands-on experience with ${skill.name} across real projects.`;

  return (
    <article className="skills-glass-card">
      <div className="skills-glass-card__shine" aria-hidden />
      <div className="skills-glass-card__top">
        {skill.icon ? (
          <div className="skills-glass-card__icon">{skill.icon}</div>
        ) : (
          <div className="skills-glass-card__icon skills-glass-card__icon--fallback">
            {skill.name.charAt(0)}
          </div>
        )}
        <div className="skills-glass-card__meta min-w-0 flex-1">
          <h4 className="skills-glass-card__name font-semibold">{skill.name}</h4>
        </div>
      </div>

      <p className="skills-glass-card__summary">{summary}</p>
    </article>
  );
}

/**
 * Capability-grouped skills (UX-09): no percentage bars, proficiency averages
 * or expert counters — plain capability statements only. Rating data stays in
 * the model for admin use; it is simply not presented publicly.
 */
const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, showHeader = true }) => {
  const sortedSkills = useMemo(
    () => [...skills].sort((a, b) => a.order - b.order),
    [skills],
  );

  if (skills.length === 0) return null;

  const grouped = categories
    .map((c) => ({
      ...c,
      skills: sortedSkills.filter((s) => s.category === c.key),
    }))
    .filter((g) => g.skills.length > 0);

  return (
    <section id="skills" className={`skills-section${showHeader ? ' section-padding' : ' page-content-section'}`}>
      <div className="container-custom skills-section__container">
        {showHeader && <SectionHeader label="Expertise" title="Skills & Technologies" />}

        {!showHeader && (
          <SkillsMarquee
            skills={sortedSkills}
            headline="Technologies I work with"
            className="skills-section__marquee"
          />
        )}

        <div className="skills-section__categories">
          {grouped.map((group, gi) => {
            const Icon = group.icon;
            return (
              <div
                key={group.key}
                className="skills-section__category animate-fade-in-up"
                style={{ animationDelay: `${gi * 0.08}s` }}
              >
                <header className="skills-section__category-head">
                  <div className="skills-section__category-icon">
                    <Icon className="w-4 h-4 text-accent" aria-hidden />
                  </div>
                  <div>
                    <p className="skills-section__category-eyebrow">{group.eyebrow}</p>
                    <h3 className="skills-section__category-title font-semibold">{group.label}</h3>
                  </div>
                </header>

                <div className="skills-section__grid">
                  {group.skills.map((skill) => (
                    <SkillCard key={skill.name} skill={skill} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
