import React from 'react';
import type { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

const proficiencyConfig = {
  beginner:     { color: 'from-yellow-400 to-yellow-500',  badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', width: '25%' },
  intermediate: { color: 'from-blue-400 to-blue-500',      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',         width: '50%' },
  advanced:     { color: 'from-green-400 to-emerald-500',  badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',       width: '75%' },
  expert:       { color: 'from-primary-500 to-purple-600', badge: 'bg-primary-100 text-primary-700 dark:bg-primary-950/60 dark:text-primary-400', width: '95%' },
};

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (skills.length === 0) return null;

  const categories = [
    { key: 'programming', label: 'Languages', emoji: '💻' },
    { key: 'framework',   label: 'Frameworks & Libraries', emoji: '🧩' },
    { key: 'database',    label: 'Databases', emoji: '🗄️' },
    { key: 'tool',        label: 'Tools & Platforms', emoji: '🔧' },
    { key: 'soft',        label: 'Soft Skills', emoji: '🤝' },
    { key: 'other',       label: 'Other', emoji: '✨' },
  ];

  const grouped = categories
    .map((c) => ({ ...c, skills: skills.filter((s) => s.category === c.key) }))
    .filter((g) => g.skills.length > 0);

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <div className="section-header">
          <span className="section-label">Expertise</span>
          <h2 className="heading-secondary text-gray-900 dark:text-white">Skills & Technologies</h2>
          <div className="section-underline" />
        </div>

        <div className="space-y-14">
          {grouped.map((group, gi) => (
            <div key={group.key} className="animate-fade-in-up" style={{ animationDelay: `${gi * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{group.emoji}</span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{group.label}</h3>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.skills.map((skill, si) => {
                  const cfg = proficiencyConfig[skill.proficiency] || proficiencyConfig.intermediate;
                  return (
                    <div key={si} className="card p-5 hover:-translate-y-1 transition-transform duration-200">
                      <div className="flex items-center gap-3 mb-4">
                        {skill.icon && (
                          <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700/80
                                          flex items-center justify-center text-xl flex-shrink-0">
                            {skill.icon}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{skill.name}</p>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium mt-1 ${cfg.badge}`}>
                            {skill.proficiency}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-400 dark:text-gray-500 flex-shrink-0">
                          {skill.proficiency_percentage}%
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${skill.proficiency_percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
