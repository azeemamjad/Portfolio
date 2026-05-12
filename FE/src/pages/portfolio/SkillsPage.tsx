import React from 'react';
import type { Skill } from '../../types';

interface SkillsPageProps {
  skills: Skill[];
}

const proficiencyDot: Record<string, string> = {
  expert:       'bg-orange-500',
  advanced:     'bg-indigo-500',
  intermediate: 'bg-neutral-500',
  beginner:     'bg-neutral-400',
};

const SkillsPage: React.FC<SkillsPageProps> = ({ skills }) => {
  if (skills.length === 0) {
    return (
      <div className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-neutral-900">Skills</h1>
            <p className="text-neutral-500 mt-4">No skills available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const categories = [
    { key: 'programming', label: 'Programming Languages' },
    { key: 'framework',   label: 'Frameworks & Libraries' },
    { key: 'database',    label: 'Databases' },
    { key: 'tool',        label: 'Tools & Platforms' },
    { key: 'soft',        label: 'Soft Skills' },
    { key: 'other',       label: 'Other Skills' },
  ];

  const groupedSkills = categories
    .map(cat => ({ ...cat, skills: skills.filter(s => s.category === cat.key) }))
    .filter(g => g.skills.length > 0);

  return (
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-black/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="section-label">Expertise</span>
            <h1 className="heading-primary text-neutral-900">
              Skills &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                Technologies
              </span>
            </h1>
            <p className="text-neutral-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
              Technologies, tools, and skills I've built real products with.
            </p>
          </div>
        </div>
      </section>

      {/* Skills by Category */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto space-y-16">
            {groupedSkills.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-xl font-bold text-neutral-900">{group.label}</h2>
                  <div className="flex-1 h-px bg-neutral-200" />
                  <span className="text-sm text-neutral-400 font-medium tabular-nums">
                    {group.skills.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center gap-2.5
                                 px-4 py-2 bg-white/80 rounded-full
                                 text-sm font-medium text-neutral-700
                                 border border-neutral-200
                                 hover:border-orange-400 hover:text-orange-700
                                 transition-all duration-200 cursor-default"
                      title={`${skill.name} — ${skill.proficiency}`}
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${proficiencyDot[skill.proficiency] ?? 'bg-neutral-300'}`} />
                      {skill.icon && <span className="text-base leading-none">{skill.icon}</span>}
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-neutral-200">
            <div className="flex flex-wrap items-center gap-6 justify-center text-sm text-neutral-500">
              <span className="font-medium">Proficiency:</span>
              {[
                { label: 'Expert',       dot: 'bg-orange-500' },
                { label: 'Advanced',     dot: 'bg-indigo-500' },
                { label: 'Intermediate', dot: 'bg-neutral-500' },
                { label: 'Beginner',     dot: 'bg-neutral-400' },
              ].map(({ label, dot }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillsPage;
