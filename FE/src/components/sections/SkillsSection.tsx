import React from 'react';
import type { Skill } from '../../types';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  if (skills.length === 0) return null;

  const categories = [
    { key: 'programming', label: 'Programming Languages' },
    { key: 'framework', label: 'Frameworks & Libraries' },
    { key: 'database', label: 'Databases' },
    { key: 'tool', label: 'Tools & Platforms' },
    { key: 'soft', label: 'Soft Skills' },
    { key: 'other', label: 'Other Skills' },
  ];

  const groupedSkills = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category === category.key),
  })).filter(group => group.skills.length > 0);

  const proficiencyColors = {
    beginner: 'bg-yellow-500',
    intermediate: 'bg-blue-500',
    advanced: 'bg-green-500',
    expert: 'bg-purple-500',
  };

  return (
    <section id="skills" className="section-padding">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="heading-secondary">Skills & Expertise</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Skills Grid */}
        <div className="space-y-12">
          {groupedSkills.map((group, groupIndex) => (
            <div key={group.key} className="animate-slide-up" style={{ animationDelay: `${groupIndex * 0.1}s` }}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {group.label}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.skills.map((skill, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {skill.icon && (
                          <div className="w-10 h-10 flex items-center justify-center 
                                        bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <span className="text-2xl">{skill.icon}</span>
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {skill.name}
                          </h4>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1
                                         text-white ${proficiencyColors[skill.proficiency]}`}>
                            {skill.proficiency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Proficiency</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {skill.proficiency_percentage}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out
                                    ${proficiencyColors[skill.proficiency]}`}
                          style={{ width: `${skill.proficiency_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
