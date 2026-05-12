import React from 'react';
import { Award, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import type { Achievement } from '../../types';

interface AchievementsPageProps {
  achievements: Achievement[];
}

const typeBadge: Record<string, string> = {
  award:         'bg-yellow-200 text-yellow-800 border-yellow-300',
  certification: 'bg-orange-200 text-orange-800 border-orange-300',
  recognition:   'bg-green-200  text-green-800  border-green-300',
  publication:   'bg-indigo-200 text-indigo-800 border-indigo-300',
  other:         'bg-neutral-200 text-neutral-700 border-neutral-300',
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const AchievementsPage: React.FC<AchievementsPageProps> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <div className="section-padding pt-32">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-primary text-neutral-900">Achievements</h1>
            <p className="text-neutral-500 mt-4">No achievements available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="section-padding pt-32 bg-black/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <span className="section-label">Recognition</span>
            <h1 className="heading-primary text-neutral-900">
              Achievements &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500">
                Certifications
              </span>
            </h1>
            <p className="text-neutral-500 mt-4 max-w-2xl mx-auto text-lg leading-relaxed">
              Recognition, certifications, and milestones from my career journey.
            </p>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="group card p-8"
                >
                  <div className="flex gap-6">
                    {/* Icon / Image */}
                    <div className="flex-shrink-0">
                      {achievement.image ? (
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-20 h-20 object-contain rounded-xl"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
                          <Award className="w-10 h-10 text-orange-500" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 border ${typeBadge[achievement.type] ?? typeBadge.other}`}>
                        {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                      </span>

                      <h3 className="text-lg font-bold text-neutral-900 mb-1.5 group-hover:text-orange-600 transition-colors">
                        {achievement.title}
                      </h3>

                      {achievement.issuer && (
                        <p className="text-neutral-500 text-sm mb-3">{achievement.issuer}</p>
                      )}

                      {achievement.description && (
                        <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
                          {achievement.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-neutral-400 text-xs mb-4">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {formatDate(achievement.date_received)}
                          {achievement.expiry_date && (
                            <span className="ml-2">· Expires {formatDate(achievement.expiry_date)}</span>
                          )}
                        </span>
                      </div>

                      {achievement.credential_url && (
                        <a
                          href={achievement.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Credential
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
