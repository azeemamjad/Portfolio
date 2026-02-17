import React from 'react';
import { Award, ExternalLink } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements }) => {
  if (achievements.length === 0) return null;

  const typeColors = {
    award: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    certification: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    recognition: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    publication: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-800/50">
      <div className="container-custom">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="heading-secondary">Achievements & Certifications</h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mt-4 rounded-full"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Recognition and certifications that validate my expertise.
          </p>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-4">
                {/* Image or Icon */}
                <div className="flex-shrink-0">
                  {achievement.image ? (
                    <img
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-20 h-20 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 
                                  rounded-lg flex items-center justify-center">
                      <Award className="w-10 h-10 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Type Badge */}
                  <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-2
                                  ${typeColors[achievement.type]}`}>
                    {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {achievement.title}
                  </h3>

                  {/* Issuer */}
                  {achievement.issuer && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                      Issued by {achievement.issuer}
                    </p>
                  )}

                  {/* Description */}
                  {achievement.description && (
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {achievement.description}
                    </p>
                  )}

                  {/* Date */}
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                    {formatDate(achievement.date_received)}
                    {achievement.expiry_date && (
                      <span className="ml-2">
                        • Expires {formatDate(achievement.expiry_date)}
                      </span>
                    )}
                  </p>

                  {/* Credential Link */}
                  {achievement.credential_url && (
                    <a
                      href={achievement.credential_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium 
                               text-primary-600 hover:text-primary-700 
                               dark:text-primary-400 dark:hover:text-primary-300 
                               transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Credential
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
