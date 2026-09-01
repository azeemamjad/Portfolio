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

const proficiencyConfig: Record<
  Skill['proficiency'],
  { badge: string; bar: string; label: string }
> = {
  beginner: {
    badge: 'bg-surface-muted text-content-muted',
    bar: 'bg-content-muted/50',
    label: 'Beginner',
  },
  intermediate: {
    badge: 'bg-surface-muted text-content-muted',
    bar: 'bg-content-muted/70',
    label: 'Intermediate',
  },
  advanced: {
    badge: 'bg-surface-muted text-content',
    bar: 'bg-accent/80',
    label: 'Advanced',
  },
  expert: {
    badge: 'bg-accent-50 text-accent-700 dark:bg-accent/20 dark:text-accent-300',
    bar: 'bg-accent',
    label: 'Expert',
  },
};

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
  { key: 'soft', label: 'Soft Skills', eyebrow: 'People', icon: Users },
  { key: 'other', label: 'Other', eyebrow: 'More', icon: Sparkles },
];

function SkillCard({ skill }: { skill: Skill }) {
  const cfg = proficiencyConfig[skill.proficiency] ?? proficiencyConfig.intermediate;
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
          <span className={`skills-glass-card__badge ${cfg.badge}`}>{cfg.label}</span>
        </div>
        <span className="skills-glass-card__pct font-semibold">{skill.proficiency_percentage}%</span>
      </div>

      <p className="skills-glass-card__summary">{summary}</p>

      <div className="skills-glass-card__bar-track" aria-hidden>
        <div
          className={`skills-glass-card__bar-fill ${cfg.bar}`}
          style={{ width: `${skill.proficiency_percentage}%` }}
        />
      </div>
    </article>
  );
}

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

  const expertCount = skills.filter((s) => s.proficiency === 'expert').length;
  const avgProficiency = Math.round(
    skills.reduce((sum, s) => sum + s.proficiency_percentage, 0) / skills.length,
  );

  const stats = [
    { label: 'Skills', value: skills.length },
    { label: 'Categories', value: grouped.length },
    { label: 'Expert level', value: expertCount },
    { label: 'Avg. proficiency', value: `${avgProficiency}%` },
  ];

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

        <div className="skills-section__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="skills-stat-card">
              <div className="skills-stat-card__shine" aria-hidden />
              <p className="skills-stat-card__value font-semibold">{stat.value}</p>
              <p className="skills-stat-card__label">{stat.label}</p>
            </div>
          ))}
        </div>

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
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="skills-section__category-eyebrow">{group.eyebrow}</p>
                    <h3 className="skills-section__category-title font-semibold">{group.label}</h3>
                  </div>
                  <span className="skills-section__category-count">
                    {group.skills.length} skill{group.skills.length === 1 ? '' : 's'}
                  </span>
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
