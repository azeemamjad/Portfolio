import React from 'react';
import type { Skill } from '../../types';

interface SkillsPageProps {
  skills: Skill[];
}

const SkillsPage: React.FC<SkillsPageProps> = ({ skills }) => {
  if (skills.length === 0) {
    return (
      <div className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary">Skills</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">No skills available yet.</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary">Skills & Expertise</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Technologies, tools, and skills I've mastered throughout my career.
            </p>
          </div>
        </div>
      </section>

      {/* Skills by Category */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto space-y-12">
            {groupedSkills.map((group) => (
              <div key={group.key}>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                  {group.label}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.skills.map((skill, index) => (
                    <div key={index} className="card p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3 flex-1">
                          {skill.icon && (
                            <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/30 rounded-lg text-2xl">
                              {skill.icon}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                              {skill.name}
                            </h3>
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 text-white ${proficiencyColors[skill.proficiency]}`}>
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
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${proficiencyColors[skill.proficiency]}`}
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
    </div>
  );
};

export default SkillsPage;
