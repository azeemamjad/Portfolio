import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementsPageProps {
  achievements: Achievement[];
}

const AchievementsPage: React.FC<AchievementsPageProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <div className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary">Achievements</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4">No achievements available yet.</p>
          </div>
        </div>
      </div>
    );
  }

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
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary">Achievements & Certifications</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
              Recognition, certifications, and milestones in my career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="card p-8">
                  <div className="flex gap-6">
                    {/* Image or Icon */}
                    <div className="flex-shrink-0">
                      {achievement.image ? (
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-24 h-24 object-contain rounded-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                          <Award className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Type Badge */}
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${typeColors[achievement.type]}`}>
                        {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {achievement.title}
                      </h3>

                      {/* Issuer */}
                      {achievement.issuer && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          Issued by {achievement.issuer}
                        </p>
                      )}

                      {/* Description */}
                      {achievement.description && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                          {achievement.description}
                        </p>
                      )}

                      {/* Date */}
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(achievement.date_received)}
                          {achievement.expiry_date && (
                            <span className="ml-2">
                              • Expires {formatDate(achievement.expiry_date)}
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Credential Link */}
                      {achievement.credential_url && (
                        <a
                          href={achievement.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
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
        </div>
      </section>
    </div>
  );
};

export default AchievementsPage;
